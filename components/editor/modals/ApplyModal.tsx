"use client";

import { useState } from "react";
import { useEditor } from "../EditorContext";
import { Modal } from "./Modal";

export function ApplyModal({ code }: { code: string }) {
  const { state, actions } = useEditor();
  const [hint, setHint] = useState("Click the command to copy");
  const command = `/skv apply ${state.sessionId ?? ""} ${code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setHint("Copied!");
      setTimeout(() => setHint("Click the command to copy"), 2000);
    } catch {
      /* clipboard might be unavailable */
    }
  };

  return (
    <Modal onClose={() => actions.setModal(null)}>
      <h2>Apply changes in-game</h2>
      <p className="modal-body">
        Run this command in your server console or as an operator to apply the pending changes.
      </p>
      <div id="apply-cmd" onClick={copy}>{command}</div>
      <div className="modal-footer modal-footer-spread" style={{ marginTop: 18 }}>
        <span className="modal-hint">{hint}</span>
        <button onClick={() => actions.setModal(null)}>Close</button>
      </div>
    </Modal>
  );
}
