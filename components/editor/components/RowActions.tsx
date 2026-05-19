"use client";

import { useState } from "react";
import type { Change, Variable } from "../lib/types";
import {
  BOUND_EDITABLE,
  DATE_EDITABLE,
  EDITABLE,
  LOC_EDITABLE,
  TIMESPAN_EDITABLE,
  VEC_EDITABLE,
} from "../lib/decode";
import { useEditor } from "../EditorContext";
import { OverflowMenu, type OverflowItem } from "./OverflowMenu";

type Props = {
  v: Variable;
  ch: Change | undefined;
  isEditing: boolean;
  inputValueRef: React.MutableRefObject<string>;
  displayVal: string;
};

export function RowActions({ v, ch, isEditing, inputValueRef, displayVal }: Props) {
  const { actions } = useEditor();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const tl = (v.t || "").toLowerCase();
  const isItem = tl === "item" || tl === "itemstack";
  const isStruct =
    v.s != null && !isItem && typeof (v.s as { t?: unknown }).t === "string"
    && Array.isArray((v.s as { f?: unknown }).f);
  const isNbt = v.s != null && !isItem && !isStruct;
  const editable = EDITABLE.has(tl);
  const locEditable = LOC_EDITABLE.has(tl);
  const vecEditable = VEC_EDITABLE.has(tl);
  const boundEditable = BOUND_EDITABLE.has(tl);
  const timespanEditable = TIMESPAN_EDITABLE.has(tl);
  const dateEditable = DATE_EDITABLE.has(tl);

  const deleted = ch?.action === "delete";
  const edited = ch?.action === "edit";
  const renamed = ch?.action === "rename";

  if (deleted) {
    return (
      <button
        className="btn-sm btn-undo"
        onClick={() => {
          actions.deleteChange(v.n);
          actions.setEditingName(null);
        }}
      >
        Undo
      </button>
    );
  }

  if (renamed) {
    const renameCh = ch as { newName: string };
    return (
      <>
        <span className="val-text val-complex" style={{ fontSize: 12 }}>
          → {renameCh.newName}
        </span>
        <button className="btn-sm btn-undo" onClick={() => actions.deleteChange(v.n)}>
          Undo
        </button>
      </>
    );
  }

  if (isEditing) {
    return (
      <>
        <button
          className="btn-sm btn-save"
          onClick={() => commitInline(v, inputValueRef.current ?? displayVal, actions)}
        >
          Save
        </button>
        <button
          className="btn-sm btn-cancel"
          onClick={() => actions.setEditingName(null)}
        >
          ✕
        </button>
      </>
    );
  }

  const editBtn = (label: string, fn: () => void) => (
    <button className="btn-sm btn-edit" onClick={fn}>{label}</button>
  );

  const overflowItems: OverflowItem[] = [
    { label: "Rename", onClick: () => actions.setModal({ kind: "rename", v, copy: false }) },
    { label: "Copy", onClick: () => actions.setModal({ kind: "rename", v, copy: true }) },
    {
      label: "Delete",
      cls: "overflow-del",
      onClick: () => {
        actions.setChange(v.n, { action: "delete", type: v.t });
        actions.setEditingName(null);
      },
    },
  ];

  return (
    <>
      {editable && editBtn("Edit", () => actions.setEditingName(v.n))}
      {!editable && locEditable && editBtn("Edit", () => actions.setModal({ kind: "loc", v }))}
      {!editable && vecEditable && editBtn("Edit", () => actions.setModal({ kind: "vec", v }))}
      {!editable && boundEditable && editBtn("Edit", () => actions.setModal({ kind: "bound", v }))}
      {!editable && timespanEditable && editBtn("Edit", () => actions.setModal({ kind: "ts", v }))}
      {!editable && dateEditable && editBtn("Edit", () => actions.setModal({ kind: "date", v }))}
      {!editable && !locEditable && !vecEditable && !boundEditable && !timespanEditable && !dateEditable && isNbt &&
        editBtn("Edit", () => actions.setModal({ kind: "nbt", v }))}
      {!editable && !locEditable && !vecEditable && !boundEditable && !timespanEditable && !dateEditable && !isNbt && isStruct &&
        editBtn("Edit", () => actions.setModal({ kind: "struct", v }))}
      {!editable && !locEditable && !vecEditable && !boundEditable && !timespanEditable && !dateEditable && !isNbt && !isStruct && isItem &&
        editBtn("Edit", () => actions.setModal({ kind: "item", v }))}
      {edited && (
        <button className="btn-sm btn-undo" onClick={() => actions.deleteChange(v.n)}>
          Undo
        </button>
      )}
      <button
        className="btn-overflow"
        title="More actions"
        onClick={(e) => {
          e.stopPropagation();
          const r = (e.target as HTMLElement).getBoundingClientRect();
          setMenu({ x: r.right, y: r.bottom });
        }}
      >
        ⋯
      </button>
      {menu && (
        <OverflowMenu
          anchor={menu}
          items={overflowItems}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  );
}

function commitInline(
  v: Variable,
  newVal: string,
  actions: ReturnType<typeof useEditor>["actions"]
) {
  if (newVal === v.d) actions.deleteChange(v.n);
  else actions.setChange(v.n, { action: "edit", type: v.t, newV: newVal });
  actions.setEditingName(null);
}
