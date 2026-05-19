"use client";

import { useEffect, useRef } from "react";
import {
  EDITABLE,
  SKRIPT_COLOR_HEX,
  isUuid,
  typeClass,
  valClass,
  fmtSize,
} from "../lib/decode";
import type { Change, Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { usePlayerLookup } from "../hooks/usePlayerLookup";
import { PlayerHead } from "./PlayerHead";
import { RowActions } from "./RowActions";
import { ValueEditor } from "./ValueEditor";

const INDENT = 18;

type Props = {
  v: Variable;
  depth: number;
  flatMode: boolean;
  ch: Change | undefined;
  isEditing: boolean;
};

export function LeafRow({ v, depth, flatMode, ch, isEditing }: Props) {
  const { state, actions } = useEditor();
  const { ensurePlayerName, playerName } = usePlayerLookup();
  const inputValueRef = useRef<string>("");

  const tl = (v.t || "").toLowerCase();
  const isItem = tl === "item" || tl === "itemstack";
  const isStruct =
    v.s != null && !isItem && typeof (v.s as { t?: unknown }).t === "string"
    && Array.isArray((v.s as { f?: unknown }).f);
  const isNbt = v.s != null && !isItem && !isStruct;
  const editable = EDITABLE.has(tl);

  const deleted = ch?.action === "delete";
  const edited = ch?.action === "edit";
  const renamed = ch?.action === "rename";

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

  const displayName = flatMode ? v.n : v.n.split("::").pop() ?? v.n;

  useEffect(() => {
    if (isUuid(displayName)) ensurePlayerName(displayName);
    if (isUuid(displayVal)) ensurePlayerName(displayVal);
  }, [displayName, displayVal, ensurePlayerName]);

  inputValueRef.current = displayVal;

  const valSwatch = (() => {
    if (tl !== "color") return null;
    const hex = SKRIPT_COLOR_HEX[(displayVal || "").toLowerCase()];
    if (!hex) return null;
    return (
      <span
        style={{
          display: "inline-block",
          width: 11,
          height: 11,
          borderRadius: 2,
          background: hex,
          flexShrink: 0,
          border: "1px solid rgba(255,255,255,.15)",
        }}
      />
    );
  })();

  const valPlayerName = isUuid(displayVal) ? playerName(displayVal) : null;
  const namePlayer = isUuid(displayName) ? playerName(displayName) : null;

  const rowClasses = [
    "row", "row-leaf",
    edited || renamed ? "modified" : "",
    deleted ? "deleted" : "",
    v._isNew ? "row-new" : "",
    state.selected.has(v.n) ? "row-selected" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={rowClasses}>
      <div className="cell-check">
        <input
          type="checkbox"
          checked={state.selected.has(v.n)}
          onChange={() => actions.toggleSelected(v.n)}
        />
      </div>

      <div className="cell-name">
        <span
          className="name-indent"
          style={{ width: depth * INDENT, display: "inline-block", flexShrink: 0 }}
        />
        {v._isNew && <span className="new-badge">NEW</span>}
        {namePlayer && <PlayerHead raw={displayName} />}
        <span className="name-text" title={v.n}>
          {namePlayer ? `${displayName} (${namePlayer})` : displayName}
        </span>
      </div>

      <div className="cell-type">
        <span className={"type-badge " + typeClass(v.t)}>{v.t}</span>
      </div>

      <div className="cell-value">
        {isEditing ? (
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
        ) : valPlayerName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0, overflow: "hidden" }}>
            <PlayerHead raw={displayVal} />
            <span className="val-text val-str" title={displayVal}>
              {displayVal} ({valPlayerName})
            </span>
          </div>
        ) : valSwatch ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }}>
            {valSwatch}
            <span className="val-text val-str" title={displayVal}>{displayVal}</span>
          </div>
        ) : (
          <span
            className={"val-text " + (editable ? valClass(v.t, displayVal) : "val-complex")}
            title={isStruct || isNbt ? "" : displayVal}
          >
            {displayVal.length > 80 ? displayVal.slice(0, 80) + "…" : displayVal}
          </span>
        )}
      </div>

      <div className="cell-size">
        <span className="size-badge">{fmtSize(v.byteSize ?? 0)}</span>
      </div>

      <div className="cell-actions">
        <RowActions
          v={v}
          ch={ch}
          isEditing={isEditing}
          inputValueRef={inputValueRef}
          displayVal={displayVal}
        />
      </div>
    </div>
  );
}
