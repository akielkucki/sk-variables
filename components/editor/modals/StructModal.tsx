"use client";

import { useState } from "react";
import type { StructValue, Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function StructModal({ v }: { v: Variable }) {
  const { state, actions } = useEditor();
  const struct = v.s as StructValue;

  const ch = state.changes.get(v.n);
  let initialFields: Record<string, string> = {};
  if (ch?.action === "edit") {
    try {
      const parsed = JSON.parse(ch.newV) as { f?: Record<string, string> };
      initialFields = parsed.f ?? {};
    } catch { /* ignore */ }
  }

  const [fields, setFields] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const f of struct.f) {
      out[f.n] = initialFields[f.n] ?? f.v;
    }
    return out;
  });

  const save = () => {
    const newV = JSON.stringify({ t: struct.t, f: fields });
    actions.setChange(v.n, { action: "edit", type: v.t, newV });
    actions.setModal(null);
    actions.setEditingName(null);
  };

  return (
    <Modal onClose={() => actions.setModal(null)}>
      <h2>Edit Struct</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div style={{ fontSize: 12, color: "var(--purple)", marginBottom: 18 }}>{struct.t}</div>
      <div className="struct-fields">
        {struct.f.map((field) => (
          <div key={field.n} className="struct-field">
            <div className="struct-field-name">{field.n}</div>
            <div className="struct-field-type" title={field.kt}>{field.kt}</div>
            <div className="struct-field-val">
              {field.ro ? (
                <div className="struct-field-ro">{field.v || "(read-only)"}</div>
              ) : (
                <input
                  type="text"
                  value={fields[field.n] ?? ""}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, [field.n]: e.target.value }))
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
