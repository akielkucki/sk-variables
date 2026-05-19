"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { FlatLeaf, Variable } from "../lib/types";
import {
  EDITABLE,
  SKRIPT_COLOR_HEX,
  typeClass,
  valClass,
} from "../lib/decode";
import { useEditor } from "../EditorContext";
import { RowActions } from "./RowActions";
import { ValueEditor } from "./ValueEditor";

const GRID_PAD_X = 28;
const GRID_PAD_Y = 16;
const GRID_GAP = 10;
const GRID_MIN_COL = 210;
const GRID_CARD_H = 100;
const GRID_ROW_H = GRID_CARD_H + GRID_GAP;

type Props = {
  leaves: FlatLeaf[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export function GridView({ leaves, scrollRef }: Props) {
  const { state } = useEditor();
  const [cols, setCols] = useState(1);
  const [vis, setVis] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sc = scrollRef.current;
    const gc = containerRef.current;
    if (!sc || !gc) return;

    const compute = () => {
      const width = sc.clientWidth;
      const nextCols = Math.max(1, Math.floor((width - GRID_PAD_X * 2 + GRID_GAP) / (GRID_MIN_COL + GRID_GAP)));
      setCols(nextCols);
      const top = sc.scrollTop;
      const vh = sc.clientHeight;
      const rowCount = Math.ceil(leaves.length / nextCols);
      const ns = Math.max(0, Math.floor((top - GRID_PAD_Y) / GRID_ROW_H) - 2);
      const ne = Math.min(rowCount, Math.ceil((top + vh - GRID_PAD_Y) / GRID_ROW_H) + 3);
      setVis({ start: ns, end: ne });
    };
    compute();
    sc.addEventListener("scroll", compute, { passive: true });
    const ro = new ResizeObserver(compute);
    ro.observe(sc);
    return () => {
      sc.removeEventListener("scroll", compute);
      ro.disconnect();
    };
  }, [leaves.length, scrollRef]);

  const rowCount = Math.ceil(leaves.length / cols);
  const totalH = GRID_PAD_Y + rowCount * GRID_ROW_H + GRID_PAD_Y;
  const cardW = containerRef.current
    ? (containerRef.current.clientWidth - GRID_PAD_X * 2 - (cols - 1) * GRID_GAP) / cols
    : GRID_MIN_COL;

  const cards = [];
  for (let row = vis.start; row < vis.end; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      if (idx >= leaves.length) break;
      const leaf = leaves[idx];
      cards.push(
        <GridCard
          key={`${row}:${col}:${leaf.v.n}`}
          v={leaf.v}
          top={GRID_PAD_Y + row * GRID_ROW_H}
          left={GRID_PAD_X + col * (cardW + GRID_GAP)}
          width={cardW}
        />
      );
    }
  }

  return (
    <div
      id="grid-container"
      ref={containerRef}
      style={{ height: totalH, position: "relative" }}
    >
      {cards}
    </div>
  );
}

function GridCard({
  v,
  top,
  left,
  width,
}: {
  v: Variable;
  top: number;
  left: number;
  width: number;
}) {
  const { state, actions } = useEditor();
  const ch = state.changes.get(v.n);
  const tl = (v.t || "").toLowerCase();
  const isItem = tl === "item" || tl === "itemstack";
  const isStruct =
    v.s != null && !isItem && typeof (v.s as { t?: unknown }).t === "string"
    && Array.isArray((v.s as { f?: unknown }).f);
  const isNbt = v.s != null && !isItem && !isStruct;
  const editable = EDITABLE.has(tl);

  const edited = ch?.action === "edit";
  const renamed = ch?.action === "rename";
  const deleted = ch?.action === "delete";

  const isEditing = state.editingName === v.n;
  const decoded = v.d;
  const displayVal = isItem
    ? edited ? "(modified)" : (v.v || "item")
    : isStruct
      ? edited ? "(modified)" : (v.s as { t: string }).t + " struct"
      : isNbt
        ? edited
          ? "(modified)"
          : "compound (" + Object.keys(v.s as Record<string, unknown>).length + " keys)"
        : edited ? (ch as { newV: string }).newV : decoded;

  const colorHex = tl === "color" ? SKRIPT_COLOR_HEX[(displayVal || "").toLowerCase()] : null;

  const cls = [
    "grid-card",
    edited || renamed ? "gc-modified" : "",
    deleted ? "gc-deleted" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      style={{
        position: "absolute",
        top,
        left,
        width,
        boxSizing: "border-box",
      }}
    >
      <div className="gc-header">
        <span className={"type-badge gc-badge " + typeClass(v.t)}>{v.t}</span>
        <span className="gc-name" title={v.n}>{v.n}</span>
      </div>
      {isEditing ? (
        <div className="gc-edit-wrap">
          <ValueEditor
            v={v}
            displayVal={displayVal}
            onCommit={(newVal) => {
              if (newVal === v.d) actions.deleteChange(v.n);
              else actions.setChange(v.n, { action: "edit", type: v.t, newV: newVal });
              actions.setEditingName(null);
            }}
            onCancel={() => actions.setEditingName(null)}
          />
        </div>
      ) : colorHex ? (
        <div style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden" }}>
          <span
            style={{
              display: "inline-block",
              width: 11,
              height: 11,
              borderRadius: 2,
              background: colorHex,
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,.15)",
            }}
          />
          <span className="gc-value val-str" title={displayVal}>{displayVal}</span>
        </div>
      ) : (
        <div
          className={"gc-value " + (editable ? valClass(v.t, displayVal) : "val-complex")}
          title={isStruct || isNbt ? "" : displayVal}
        >
          {displayVal.length > 55 ? displayVal.slice(0, 55) + "…" : displayVal}
        </div>
      )}
      <div className="gc-actions">
        <RowActions
          v={v}
          ch={ch}
          isEditing={isEditing}
          inputValueRef={{ current: displayVal }}
          displayVal={displayVal}
        />
      </div>
    </div>
  );
}
