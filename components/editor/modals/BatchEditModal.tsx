"use client";

import { useState } from "react";
import { EDITABLE } from "../lib/decode";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function BatchEditModal() {
  const { state, actions } = useEditor();
  const names = [...state.selected];
  const firstVar = state.allVars.find((v) => v.n === names[0]);
  const [value, setValue] = useState(firstVar?.d ?? "");

  const confirm = () => {
    for (const name of names) {
      const v = state.allVars.find((vv) => vv.n === name);
      if (!v || !EDITABLE.has((v.t || "").toLowerCase())) continue;
      if (value === v.d) actions.deleteChange(name);
      else actions.setChange(name, { action: "edit", type: v.t, newV: value });
    }
    actions.setModal(null);
  };

  return (
    <Modal size="md" onClose={() => actions.setModal(null)}>
      <h2>Batch Edit</h2>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
        Set a new value for {names.length} selected variable{names.length > 1 ? "s" : ""}.
      </p>
      <div className="loc-field">
        <label>New value</label>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirm();
            else if (e.key === "Escape") actions.setModal(null);
          }}
          autoFocus
        />
      </div>
      <div className="modal-footer" style={{ marginTop: 16 }}>
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={confirm}>Apply to all</button>
      </div>
    </Modal>
  );
}
