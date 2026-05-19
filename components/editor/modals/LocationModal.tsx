"use client";

import { useEffect, useState } from "react";
import type { Variable } from "../lib/types";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function LocationModal({ v }: { v: Variable }) {
  const { actions } = useEditor();
  const parts = (v.d || "").split(",");
  const [world, setWorld] = useState(parts[0] ?? "");
  const [x, setX] = useState(parts[1] ?? "");
  const [y, setY] = useState(parts[2] ?? "");
  const [z, setZ] = useState(parts[3] ?? "");
  const [yaw, setYaw] = useState(parts[4] ?? "0");
  const [pitch, setPitch] = useState(parts[5] ?? "0");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") actions.setModal(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [actions]);

  const save = () => {
    const newV = [world, x, y, z, yaw || "0", pitch || "0"].join(",");
    if (newV === v.d) actions.deleteChange(v.n);
    else actions.setChange(v.n, { action: "edit", type: v.t, newV });
    actions.setModal(null);
  };

  return (
    <Modal onClose={() => actions.setModal(null)}>
      <h2>Edit Location</h2>
      <div className="modal-subtitle">{v.n}</div>
      <div className="loc-grid">
        <div className="loc-field loc-world">
          <label>World</label>
          <input type="text" placeholder="world" value={world} onChange={(e) => setWorld(e.target.value)} autoFocus />
        </div>
        <div className="loc-field"><label>X</label><input type="number" step="any" value={x} onChange={(e) => setX(e.target.value)} /></div>
        <div className="loc-field"><label>Y</label><input type="number" step="any" value={y} onChange={(e) => setY(e.target.value)} /></div>
        <div className="loc-field"><label>Z</label><input type="number" step="any" value={z} onChange={(e) => setZ(e.target.value)} /></div>
        <div className="loc-field"><label>Yaw</label><input type="number" step="any" value={yaw} onChange={(e) => setYaw(e.target.value)} /></div>
        <div className="loc-field"><label>Pitch</label><input type="number" step="any" value={pitch} onChange={(e) => setPitch(e.target.value)} /></div>
      </div>
      <div className="modal-footer">
        <button className="btn-sm btn-cancel" onClick={() => actions.setModal(null)}>Cancel</button>
        <button className="btn-sm btn-save" onClick={save}>Save</button>
      </div>
    </Modal>
  );
}
