"use client";

import { useMemo, useState } from "react";
import type { Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

type NbtPrimitive = string | number;

type NbtEntry = {
  t: string;
  v: NbtPrimitive | NbtEntry[] | NbtCompound | NbtPrimitive[];
};

type NbtCompound = Record<string, NbtEntry>;

const NBT_TYPES = [
  "string", "int", "byte", "short", "long", "float", "double",
  "compound", "list:string", "list:int", "list:compound",
  "byte_array", "int_array", "long_array",
] as const;

function defaultNbtVal(t: string): unknown {
  if (t === "string") return "";
  if (t === "compound") return {};
  if (t.startsWith("list:") || t.endsWith("_array")) return [];
  return 0;
}

function deepClone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

export function NbtModal({ v }: { v: Variable }) {
  const { state, actions } = useEditor();
  const initial = useMemo<NbtCompound>(() => {
    const ch = state.changes.get(v.n);
    if (ch?.action === "edit") {
      try { return JSON.parse(ch.newV) as NbtCompound; } catch { /* ignore */ }
    }
    return deepClone((v.s as NbtCompound) ?? {});
  }, [v.n, v.s, state.changes]);

  const [data, setData] = useState<NbtCompound>(initial);
  // version counter forces re-render after in-place mutations
  const [, setVersion] = useState(0);
  const bump = () => setVersion((n) => n + 1);

  const save = () => {
    actions.setChange(v.n, { action: "edit", type: v.t, newV: JSON.stringify(data) });
    actions.setModal(null);
    actions.setEditingName(null);
  };

  return (
    <Modal size="lg" onClose={() => actions.setModal(null)}>
      <h2>Edit NBT Compound</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="nbt-tree">
        <NbtCompoundView compound={data} depth={0} onMutate={bump} />
      </div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}

function NbtCompoundView({
  compound,
  depth,
  onMutate,
}: {
  compound: NbtCompound;
  depth: number;
  onMutate: () => void;
}) {
  const [newKey, setNewKey] = useState("");
  const [newType, setNewType] = useState<string>(NBT_TYPES[0]);

  const addKey = () => {
    const k = newKey.trim();
    if (!k || compound[k] != null) return;
    compound[k] = { t: newType, v: defaultNbtVal(newType) as NbtEntry["v"] };
    setNewKey("");
    onMutate();
  };

  return (
    <>
      {Object.keys(compound).map((key) => (
        <NbtEntryRow
          key={key}
          k={key}
          parent={compound}
          depth={depth}
          onMutate={onMutate}
        />
      ))}
      <div className="nbt-add-row">
        {Array.from({ length: depth }, (_, i) => <span key={i} className="nbt-indent" />)}
        <input
          className="nbt-add-key-in"
          placeholder="key name"
          spellCheck={false}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <select
          className="nbt-add-type-sel"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          {NBT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="nbt-add-confirm-btn" onClick={addKey}>+ Add</button>
      </div>
    </>
  );
}

function NbtEntryRow({
  k,
  parent,
  depth,
  onMutate,
}: {
  k: string;
  parent: NbtCompound;
  depth: number;
  onMutate: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const entry = parent[k];
  const t = entry.t;
  const isCompound = t === "compound";
  const isList = t.startsWith("list:");
  const isArray = t.endsWith("_array");

  return (
    <>
      <div className="nbt-row">
        {Array.from({ length: depth }, (_, i) => <span key={i} className="nbt-indent" />)}
        <span
          className={"nbt-toggle" + (isCompound || isList ? " clickable" : "")}
          onClick={() => (isCompound || isList) && setCollapsed((c) => !c)}
        >
          {(isCompound || isList) ? (collapsed ? "▶" : "▼") : " "}
        </span>
        <span className="nbt-key">{k}:</span>
        <span className={"nbt-type-badge nbt-type-" + t.replace(/:/g, "_")}>{t}</span>
        {!isCompound && !isList && !isArray && (
          <input
            className="nbt-inline-input"
            type={t === "string" ? "text" : "number"}
            step={t === "float" || t === "double" ? "any" : 1}
            value={String(entry.v as NbtPrimitive)}
            onChange={(e) => {
              entry.v = t === "string" ? e.target.value : Number(e.target.value);
              onMutate();
            }}
          />
        )}
        {isArray && (
          <input
            className="nbt-array-input"
            placeholder="1, 2, 3"
            value={Array.isArray(entry.v) ? (entry.v as number[]).join(", ") : ""}
            onChange={(e) => {
              entry.v = e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "")
                .map(Number)
                .filter((n) => !isNaN(n));
              onMutate();
            }}
          />
        )}
        {(isCompound || isList) && (
          <span className="nbt-count">
            {isCompound
              ? Object.keys(entry.v as NbtCompound).length + " keys"
              : (entry.v as unknown[]).length + " items"}
          </span>
        )}
        <button
          className="nbt-del-btn"
          title="Delete key"
          onClick={() => { delete parent[k]; onMutate(); }}
        >
          ✕
        </button>
      </div>
      {(isCompound || isList) && !collapsed && (
        <div className="nbt-nested">
          {isCompound ? (
            <NbtCompoundView
              compound={entry.v as NbtCompound}
              depth={depth + 1}
              onMutate={onMutate}
            />
          ) : (
            <NbtListView
              listArr={entry.v as unknown[]}
              elemType={t.slice(5)}
              depth={depth + 1}
              onMutate={onMutate}
            />
          )}
        </div>
      )}
    </>
  );
}

function NbtListView({
  listArr,
  elemType,
  depth,
  onMutate,
}: {
  listArr: unknown[];
  elemType: string;
  depth: number;
  onMutate: () => void;
}) {
  const addItem = () => {
    if (elemType === "compound") listArr.push({});
    else if (elemType === "string") listArr.push("");
    else listArr.push(0);
    onMutate();
  };

  return (
    <>
      {listArr.map((item, i) => (
        <NbtListItem
          key={i}
          item={item}
          index={i}
          listArr={listArr}
          elemType={elemType}
          depth={depth}
          onMutate={onMutate}
        />
      ))}
      <div className="nbt-add-row">
        {Array.from({ length: depth }, (_, j) => <span key={j} className="nbt-indent" />)}
        <button className="nbt-add-confirm-btn" onClick={addItem}>+ Add item</button>
      </div>
    </>
  );
}

function NbtListItem({
  item,
  index,
  listArr,
  elemType,
  depth,
  onMutate,
}: {
  item: unknown;
  index: number;
  listArr: unknown[];
  elemType: string;
  depth: number;
  onMutate: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const isCompound = elemType === "compound";

  return (
    <>
      <div className="nbt-row">
        {Array.from({ length: depth }, (_, i) => <span key={i} className="nbt-indent" />)}
        <span
          className={"nbt-toggle" + (isCompound ? " clickable" : "")}
          onClick={() => isCompound && setCollapsed((c) => !c)}
        >
          {isCompound ? (collapsed ? "▶" : "▼") : " "}
        </span>
        <span className="nbt-key">[{index}]:</span>
        {isCompound ? (
          <span className="nbt-count">
            {Object.keys(item as NbtCompound).length + " keys"}
          </span>
        ) : (
          <>
            <span className={"nbt-type-badge nbt-type-" + elemType}>{elemType}</span>
            <input
              className="nbt-inline-input"
              type={elemType === "string" ? "text" : "number"}
              step={elemType === "float" || elemType === "double" ? "any" : 1}
              value={String(item)}
              onChange={(e) => {
                listArr[index] = elemType === "string" ? e.target.value : Number(e.target.value);
                onMutate();
              }}
            />
          </>
        )}
        <button
          className="nbt-del-btn"
          onClick={() => { listArr.splice(index, 1); onMutate(); }}
        >
          ✕
        </button>
      </div>
      {isCompound && !collapsed && (
        <div className="nbt-nested">
          <NbtCompoundView
            compound={item as NbtCompound}
            depth={depth + 1}
            onMutate={onMutate}
          />
        </div>
      )}
    </>
  );
}
