"use client";

import { useEffect, useMemo, useRef } from "react";
import { useEditor } from "../EditorContext";
import { fmtSize } from "../lib/decode";
import type { FilterChange, SortMode } from "../lib/types";

export function Sidebar() {
  const { state, actions } = useEditor();
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // resize handle drag
  useEffect(() => {
    const handle = handleRef.current;
    const sidebar = ref.current;
    if (!handle || !sidebar) return;
    const MIN = 160, MAX = 600;
    let dragging = false, startX = 0, startW = 0;
    const onDown = (e: MouseEvent) => {
      dragging = true; startX = e.clientX; startW = sidebar.offsetWidth;
      handle.classList.add("dragging");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const w = Math.min(MAX, Math.max(MIN, startW + (e.clientX - startX)));
      sidebar.style.width = w + "px";
      sidebar.style.transition = "none";
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove("dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      sidebar.style.transition = "";
    };
    handle.addEventListener("mousedown", onDown);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      handle.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const types = useMemo(() => {
    const seen = new Map<string, string>();
    for (const v of state.allVars) {
      const norm = (v.t || "").toLowerCase().trim();
      if (norm && !seen.has(norm)) seen.set(norm, v.t);
    }
    return [...seen].sort((a, b) => a[0].localeCompare(b[0]));
  }, [state.allVars]);

  const stats = useMemo(() => {
    const counts = new Map<string, number>();
    const maxSize = new Map<string, number>();
    for (const v of state.allVars) {
      const ns = v.n.includes("::") ? v.n.split("::")[0] : "(root)";
      counts.set(ns, (counts.get(ns) ?? 0) + 1);
      maxSize.set(ns, Math.max(maxSize.get(ns) ?? 0, v.byteSize ?? 0));
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const maxCount = sorted[0]?.[1] ?? 1;
    return { sorted, maxCount, maxSize };
  }, [state.allVars]);

  return (
    <>
      <div id="sidebar" ref={ref} className={state.sidebarOpen ? "" : "closed"}>
        <div className="sidebar-section">
          <div className="sidebar-label">Filters</div>
          <select
            value={state.filterType}
            onChange={(e) => actions.setFilterType(e.target.value)}
          >
            <option value="">All types</option>
            {types.map(([norm, display]) => (
              <option key={norm} value={norm}>{display}</option>
            ))}
          </select>
          <select
            value={state.filterChange}
            onChange={(e) => actions.setFilterChange(e.target.value as FilterChange)}
          >
            <option value="">All changes</option>
            <option value="modified">Modified</option>
            <option value="deleted">Deleted</option>
          </select>
          <select
            value={state.sortMode}
            onChange={(e) => actions.setSortMode(e.target.value as SortMode)}
          >
            <option value="default">Sort: Default</option>
            <option value="az">Name A → Z</option>
            <option value="za">Name Z → A</option>
            <option value="size-desc">Size: large first</option>
            <option value="size-asc">Size: small first</option>
            <option value="dirs-first">Directories first</option>
          </select>
          <div className="sidebar-toggle-row" style={{ marginTop: 8 }}>
            <button
              className={"btn-toggle" + (state.showEphemeral ? " active" : "")}
              title="Show/hide ephemeral variables ({-var})"
              onClick={() => actions.setShowEphemeral(!state.showEphemeral)}
            >
              -vars
            </button>
          </div>
        </div>
        <div className="sidebar-section sidebar-stats">
          <div className="sidebar-label">
            <span>Namespace Stats</span>
          </div>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Namespace</th>
                <th>Count</th>
                <th>Largest</th>
                <th>Dist.</th>
              </tr>
            </thead>
            <tbody>
              {stats.sorted.map(([ns, count]) => (
                <tr key={ns}>
                  <td className="stats-ns">{ns}</td>
                  <td className="stats-count">{count}</td>
                  <td className="stats-size">{fmtSize(stats.maxSize.get(ns) ?? 0)}</td>
                  <td>
                    <div className="stats-bar-wrap">
                      <div
                        className="stats-bar"
                        style={{ width: `${Math.round((count / stats.maxCount) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="sidebar-resize" ref={handleRef} />
    </>
  );
}
