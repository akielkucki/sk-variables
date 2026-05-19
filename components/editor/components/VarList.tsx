"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FlatRow, TreeNode } from "../lib/types";
import { LeafRow } from "./LeafRow";
import { SectionRow } from "./SectionRow";
import { useEditor } from "../EditorContext";

const ROW_H = 52;
const BUFFER = 10;

type Props = {
  rows: FlatRow[];
  tree: TreeNode | null;
  flatMode: boolean;
  filtering: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export function VarList({ rows, tree, flatMode, filtering, scrollRef }: Props) {
  const { state } = useEditor();
  const [visStart, setVisStart] = useState(0);
  const [visEnd, setVisEnd] = useState(0);

  useLayoutEffect(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const compute = () => {
      const top = sc.scrollTop;
      const vh = sc.clientHeight;
      const ns = Math.max(0, Math.floor(top / ROW_H) - BUFFER);
      const ne = Math.min(rows.length, Math.ceil((top + vh) / ROW_H) + BUFFER);
      setVisStart(ns);
      setVisEnd(ne);
    };
    compute();
    sc.addEventListener("scroll", compute, { passive: true });
    const ro = new ResizeObserver(compute);
    ro.observe(sc);
    return () => {
      sc.removeEventListener("scroll", compute);
      ro.disconnect();
    };
  }, [rows.length, scrollRef]);

  return (
    <>
      <div id="spacer" style={{ height: rows.length * ROW_H }} />
      <div id="rows-container" style={{ top: visStart * ROW_H }}>
        {rows.slice(visStart, visEnd).map((row, i) => {
          const idx = visStart + i;
          if (row.kind === "section") {
            return (
              <SectionRow
                key={`s:${row.path}:${idx}`}
                section={row}
                tree={tree}
                filtering={filtering}
              />
            );
          }
          const ch = state.changes.get(row.v.n);
          return (
            <LeafRow
              key={`l:${row.v.n}:${idx}`}
              v={row.v}
              depth={row.depth}
              flatMode={flatMode}
              ch={ch}
              isEditing={state.editingName === row.v.n}
            />
          );
        })}
      </div>
    </>
  );
}
