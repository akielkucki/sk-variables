"use client";

import { useState } from "react";
import type { Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function BoundModal({ v }: { v: Variable }) {
  const { actions } = useEditor();
  const parts = (v.v || "").split(",");
  const [id, setId] = useState(parts[0] ?? "");

  const world = parts[1] || "—";
  const lesser = parts[2] != null ? `${parts[2]}, ${parts[3]}, ${parts[4]}` : "—";
  const greater = parts[5] != null ? `${parts[5]}, ${parts[6]}, ${parts[7]}` : "—";

  const save = () => {
    const newId = id.trim();
    if (!newId) {
      actions.setModal(null);
      return;
    }
    actions.setChange(v.n, { action: "edit", type: v.t, newV: newId });
    actions.setModal(null);
  };

  return (
    <Modal size="md" onClose={() => actions.setModal(null)}>
      <h2>Edit Bound</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="item-field">
        <label>Bound ID</label>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoFocus
        />
      </div>
      <div className="item-field">
        <label>World <span className="item-hint">(read-only)</span></label>
        <div className="bound-readonly">{world}</div>
      </div>
      <div className="item-field">
        <label>Lesser corner <span className="item-hint">(read-only)</span></label>
        <div className="bound-readonly">{lesser}</div>
      </div>
      <div className="item-field">
        <label>Greater corner <span className="item-hint">(read-only)</span></label>
        <div className="bound-readonly">{greater}</div>
      </div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
