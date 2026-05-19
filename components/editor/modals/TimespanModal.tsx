"use client";

import { useState } from "react";
import type { Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function TimespanModal({ v }: { v: Variable }) {
  const { state, actions } = useEditor();
  const ch = state.changes.get(v.n);
  const initial = ch?.action === "edit" ? ch.newV : v.v ?? "";
  const [value, setValue] = useState(initial);

  const save = () => {
    const trimmed = value.trim();
    if (trimmed) actions.setChange(v.n, { action: "edit", type: v.t, newV: trimmed });
    actions.setModal(null);
  };

  return (
    <Modal size="md" onClose={() => actions.setModal(null)}>
      <h2>Edit Timespan</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="item-field">
        <label>Duration <span className="item-hint">(e.g. &quot;2 hours 30 minutes&quot;)</span></label>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. 1 day 2 hours 30 minutes"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      </div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
