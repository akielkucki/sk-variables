"use client";

import { useEffect, useMemo } from "react";
import type { FlatSection, TreeNode } from "../lib/types";
import { isUuid } from "../lib/decode";
import { useEditor } from "../EditorContext";
import { usePlayerLookup } from "../hooks/usePlayerLookup";
import { PlayerHead } from "./PlayerHead";
import { collectVarNames, getNodeAtPath } from "../lib/tree";

const INDENT = 18;

type Props = {
  section: FlatSection;
  tree: TreeNode | null;
  filtering: boolean;
};

export function SectionRow({ section, tree, filtering }: Props) {
  const { state, actions } = useEditor();
  const { ensurePlayerName, playerName } = usePlayerLookup();

  useEffect(() => {
    if (isUuid(section.label)) ensurePlayerName(section.label);
  }, [section.label, ensurePlayerName]);

  const sectionNames = useMemo(() => {
    if (!tree) return [];
    const node = getNodeAtPath(tree, section.path);
    if (!node) return [];
    const out: string[] = [];
    collectVarNames(node, out);
    return out;
  }, [tree, section.path]);

  const allSectionSelected =
    sectionNames.length > 0 && sectionNames.every((n) => state.selected.has(n));

  const onSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(state.selected);
    if (allSectionSelected) sectionNames.forEach((n) => next.delete(n));
    else sectionNames.forEach((n) => next.add(n));
    actions.setSelected(next);
  };

  const onDeleteAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    for (const name of sectionNames) {
      const va = state.allVars.find((v) => v.n === name);
      if (va) actions.setChange(name, { action: "delete", type: va.t });
    }
  };

  const pn = isUuid(section.label) ? playerName(section.label) : null;

  return (
    <div
      className="row row-section"
      style={{ paddingLeft: 28 + section.depth * INDENT }}
      onClick={() => {
        if (filtering) actions.toggleCollapsed(section.path);
        else actions.toggleExpanded(section.path);
      }}
    >
      <span className={"sect-chevron" + (section.isExpanded ? " open" : "")}>›</span>
      {pn && <PlayerHead raw={section.label} />}
      <span className="sect-label" title={section.path}>
        {pn ? `${section.label} (${pn})` : section.label}
      </span>
      <span className="sect-count">{section.count}</span>
      <button className="btn-select-sect" onClick={onSelectAll}>
        {allSectionSelected ? "Deselect all" : "Select all"}
      </button>
      <button className="btn-delete-sect" onClick={onDeleteAll}>Delete all</button>
    </div>
  );
}
