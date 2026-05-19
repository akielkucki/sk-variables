"use client";

import { useState } from "react";
import type { Variable } from "../lib/types";
import { hydrate } from "../lib/decode";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function RenameModal({ v, copy }: { v: Variable; copy: boolean }) {
  const { state, actions } = useEditor();
  const [name, setName] = useState(copy ? v.n + "_copy" : v.n);
  const [error, setError] = useState("");

  const confirm = () => {
    const newName = name.trim();
    if (!newName) return setError("Name cannot be empty.");
    if (newName === v.n) return setError("Name is the same.");
    const existing = state.allVars.find((vv) => vv.n === newName);
    const existingCh = state.changes.get(newName);
    if (existing && existingCh?.action !== "delete") {
      return setError("A variable with that name already exists.");
    }

    if (copy) {
      const newVar: Variable = hydrate({ n: newName, t: v.t, v: v.v, s: v.s });
      newVar._isNew = true;
      actions.pushNewVariable(newVar);
      actions.setChange(newName, { action: "edit", type: v.t, newV: v.d });
    } else {
      actions.setChange(v.n, { action: "rename", type: v.t, newName, newV: v.d });
    }
    actions.setModal(null);
  };

  return (
    <Modal size="md" onClose={() => actions.setModal(null)}>
      <h2>{copy ? "Copy Variable" : "Rename Variable"}</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="loc-field">
        <label>New name</label>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirm();
            else if (e.key === "Escape") actions.setModal(null);
          }}
          autoFocus
        />
      </div>
      <div className="rename-error">{error}</div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={confirm}>Confirm</button>
      </div>
    </Modal>
  );
}
