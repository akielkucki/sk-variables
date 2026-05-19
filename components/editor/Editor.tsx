"use client";

import { useEffect, useMemo, useRef } from "react";
import "./editor.css";
import { EditorProvider, useEditor } from "./EditorContext";
import { Loader } from "./components/Loader";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import { VarList } from "./components/VarList";
import { GridView } from "./components/GridView";
import { WarningsPanel } from "./components/WarningsPanel";
import { ModalRoot } from "./modals/ModalRoot";
import { buildTree } from "./lib/tree";
import { flatten } from "./lib/tree";
import { runLinter } from "./lib/linter";
import { usePlayerLookup } from "./hooks/usePlayerLookup";
import { useSessionLoader } from "./hooks/useSessionLoader";
import type { DiffChange, FlatLeaf, FlatRow } from "./lib/types";

type Props = { sessionId: string | null };

export function Editor({ sessionId }: Props) {
  return (
    <EditorProvider>
      <EditorShell sessionId={sessionId} />
    </EditorProvider>
  );
}

function EditorShell({ sessionId }: Props) {
  const { state, actions } = useEditor();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) actions.setSessionId(sessionId);
  }, [sessionId, actions]);

  const { loader, refresh } = useSessionLoader(sessionId);
  const { verifyName, nameStatus } = usePlayerLookup();

  // build tree + flatten
  const tree = useMemo(() => (state.allVars.length ? buildTree(state.allVars) : null), [state.allVars]);

  // auto-expand all sections on first build
  const lastTreeRef = useRef<typeof tree>(null);
  useEffect(() => {
    if (!tree || lastTreeRef.current) return;
    lastTreeRef.current = tree;
    const next = new Set<string>();
    const walk = (node: ReturnType<typeof buildTree>, path: string) => {
      for (const [seg, child] of node.children.entries()) {
        if (child.children.size > 0) {
          const p = path ? path + "::" + seg : seg;
          next.add(p);
          walk(child, p);
        }
      }
    };
    walk(tree, "");
    // expanded is a Set; we mutate via toggle which is one at a time, so use direct setState
    // through a workaround: emit a single bulk by adding each
    // (simpler: rebuild expanded via a one-shot effect)
    next.forEach((p) => actions.toggleExpanded(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);

  const isFiltering = !!(
    state.searchQ || state.filterType || state.filterChange || !state.showEphemeral
  );

  const { rows, leaves } = useMemo<{ rows: FlatRow[]; leaves: FlatLeaf[] }>(() => {
    if (!tree) return { rows: [], leaves: [] };

    let searchRx: RegExp | null = null;
    if (state.searchQ && state.searchRegex) {
      try { searchRx = new RegExp(state.searchQ, "i"); } catch { /* invalid regex */ }
    }

    const matches = (name: string): boolean => {
      if (state.searchQ) {
        const lower = name.toLowerCase();
        const hit = searchRx
          ? searchRx.test(name)
          : lower.includes(state.searchQ) || state.searchUUIDs.some((u) => lower.includes(u));
        if (!hit) return false;
      }
      return true;
    };

    if (state.viewMode === "grid") {
      const leaves: FlatLeaf[] = [];
      for (const v of state.allVars) {
        if (!state.showEphemeral && v.n.startsWith("-")) continue;
        if (!matches(v.n)) continue;
        if (state.filterType && (v.t || "").toLowerCase().trim() !== state.filterType) continue;
        const c = state.changes.get(v.n);
        if (state.filterChange === "modified" && c?.action !== "edit") continue;
        if (state.filterChange === "deleted" && c?.action !== "delete") continue;
        leaves.push({ kind: "leaf", v, depth: 0 });
      }
      return { rows: [], leaves };
    }

    if (isFiltering) {
      const filtered = state.allVars.filter((v) => {
        if (!state.showEphemeral && v.n.startsWith("-")) return false;
        if (!matches(v.n)) return false;
        if (state.filterType && (v.t || "").toLowerCase().trim() !== state.filterType) return false;
        const c = state.changes.get(v.n);
        if (state.filterChange === "modified" && c?.action !== "edit") return false;
        if (state.filterChange === "deleted" && c?.action !== "delete") return false;
        return true;
      });
      const filteredTree = buildTree(filtered);
      return {
        rows: flatten({
          tree: filteredTree,
          sortMode: state.sortMode,
          expanded: state.expanded,
          collapsed: state.collapsed,
          isFiltering: true,
          showEphemeral: state.showEphemeral,
        }),
        leaves: [],
      };
    }

    return {
      rows: flatten({
        tree,
        sortMode: state.sortMode,
        expanded: state.expanded,
        collapsed: state.collapsed,
        isFiltering: false,
        showEphemeral: state.showEphemeral,
      }),
      leaves: [],
    };
  }, [
    tree,
    state.allVars,
    state.searchQ,
    state.searchRegex,
    state.searchUUIDs,
    state.filterType,
    state.filterChange,
    state.showEphemeral,
    state.sortMode,
    state.expanded,
    state.collapsed,
    state.viewMode,
    state.changes,
    isFiltering,
  ]);

  const warnings = useMemo(
    () => runLinter(state.allVars, verifyName, nameStatus),
    [state.allVars, verifyName, nameStatus]
  );
  const visibleWarnings = warnings.filter((w) => !state.mutedLints.has(w.id));

  const onApply = async () => {
    if (!state.changes.size || !sessionId) return;
    const payload: { changes: DiffChange[] } = { changes: [] };
    for (const [name, c] of state.changes) {
      if (c.action === "delete") {
        payload.changes.push({ n: name, t: "null" });
      } else if (c.action === "rename") {
        payload.changes.push({ n: name, t: "null" });
        payload.changes.push({ n: c.newName, t: c.type, v: c.newV });
      } else {
        payload.changes.push({ n: name, t: c.type, v: c.newV });
      }
    }
    const r = await fetch(`/api/session/${sessionId}/diff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      alert("Failed to submit changes. Try again.");
      return;
    }
    const { code } = (await r.json()) as { code: string };
    actions.setModal({ kind: "apply", code });
  };

  const onDeleteSelected = () => {
    for (const name of state.selected) {
      const v = state.allVars.find((vv) => vv.n === name);
      if (v) actions.setChange(name, { action: "delete", type: v.t });
    }
    actions.clearSelected();
  };

  const onEditSelected = () => {
    if (state.selected.size > 0) actions.setModal({ kind: "batch" });
  };

  const showVars = state.activeTab === "vars";

  return (
    <div className="skv-editor">
      <Loader
        hidden={loader.hidden}
        message={loader.message}
        sub={loader.sub}
        progressPct={loader.progressPct}
      />
      <Topbar />
      <div id="main-layout">
        <Sidebar />
        <div id="content">
          <Toolbar
            pendingCount={state.changes.size}
            onApply={onApply}
            onRefresh={refresh}
            onDeleteSelected={onDeleteSelected}
            onEditSelected={onEditSelected}
          />
          <div id="tab-bar">
            <button
              className={"tab-btn" + (state.activeTab === "vars" ? " active" : "")}
              onClick={() => actions.setActiveTab("vars")}
            >
              Variables
            </button>
            <button
              className={
                "tab-btn warn-tab" +
                (state.activeTab === "warn" ? " active" : "") +
                (visibleWarnings.length > 0 ? " has-warns" : "")
              }
              onClick={() => actions.setActiveTab("warn")}
            >
              Warnings
              {visibleWarnings.length > 0 && (
                <span className="warn-badge">{visibleWarnings.length}</span>
              )}
            </button>
          </div>

          {showVars && state.viewMode === "list" && (
            <div id="thead">
              <span />
              <span>Name</span>
              <span>Type</span>
              <span>Value</span>
              <span style={{ textAlign: "right", paddingRight: 10 }}>Size</span>
              <span id="thead-actions">Actions</span>
            </div>
          )}

          {showVars && (
            <div id="scroller" ref={scrollRef}>
              {state.viewMode === "grid" ? (
                <GridView leaves={leaves} scrollRef={scrollRef} />
              ) : (
                <VarList
                  rows={rows}
                  tree={tree}
                  flatMode={false}
                  filtering={isFiltering}
                  scrollRef={scrollRef}
                />
              )}
              <div
                id="empty"
                className={
                  ((state.viewMode === "grid" ? leaves.length : rows.length) === 0 &&
                    state.allVars.length > 0)
                    ? "show"
                    : ""
                }
              >
                <div id="empty-icon">◌</div>
                <span>No variables match your filter.</span>
              </div>
            </div>
          )}

          {!showVars && <WarningsPanel warnings={warnings} />}
        </div>
      </div>
      <ModalRoot />
    </div>
  );
}
