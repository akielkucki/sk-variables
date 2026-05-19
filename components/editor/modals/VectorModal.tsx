"use client";

import { useMemo, useState } from "react";
import type { Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function VectorModal({ v }: { v: Variable }) {
  const { actions } = useEditor();
  const parts = (v.d || "").split(",");
  const [x, setX] = useState(parts[0] ?? "0");
  const [y, setY] = useState(parts[1] ?? "0");
  const [z, setZ] = useState(parts[2] ?? "0");

  const magnitude = useMemo(() => {
    const fx = parseFloat(x) || 0;
    const fy = parseFloat(y) || 0;
    const fz = parseFloat(z) || 0;
    return +Math.sqrt(fx * fx + fy * fy + fz * fz).toFixed(6);
  }, [x, y, z]);

  const normalize = () => {
    const fx = parseFloat(x) || 0;
    const fy = parseFloat(y) || 0;
    const fz = parseFloat(z) || 0;
    const mag = Math.sqrt(fx * fx + fy * fy + fz * fz);
    if (mag === 0) return;
    setX(String(+(fx / mag).toFixed(10)));
    setY(String(+(fy / mag).toFixed(10)));
    setZ(String(+(fz / mag).toFixed(10)));
  };

  const save = () => {
    const newV = [x, y, z].join(",");
    if (newV === v.d) actions.deleteChange(v.n);
    else actions.setChange(v.n, { action: "edit", type: v.t, newV });
    actions.setModal(null);
  };

  return (
    <Modal onClose={() => actions.setModal(null)}>
      <h2>Edit Vector</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="vec-grid">
        <div className="loc-field"><label>X</label><input type="number" step="any" value={x} onChange={(e) => setX(e.target.value)} autoFocus /></div>
        <div className="loc-field"><label>Y</label><input type="number" step="any" value={y} onChange={(e) => setY(e.target.value)} /></div>
        <div className="loc-field"><label>Z</label><input type="number" step="any" value={z} onChange={(e) => setZ(e.target.value)} /></div>
      </div>
      <div className="vec-magnitude">Magnitude: <span>{magnitude}</span></div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-undo" onClick={normalize}>Normalize</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
