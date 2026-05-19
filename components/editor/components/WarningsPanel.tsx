"use client";

import type { LintWarning } from "../lib/linter";
import { useEditor } from "../EditorContext";

export function WarningsPanel({ warnings }: { warnings: LintWarning[] }) {
  const { state, actions } = useEditor();
  const visible = warnings.filter((w) => !state.mutedLints.has(w.id));
  const muted = warnings.filter((w) => state.mutedLints.has(w.id));

  if (!warnings.length) {
    return (
      <div id="warnings-panel">
        <div id="lint-empty">No issues detected.</div>
      </div>
    );
  }

  if (!visible.length) {
    return (
      <div id="warnings-panel">
        {muted.length > 0 && (
          <div className="lint-reset-bar">
            {muted.length} warning{muted.length > 1 ? "s" : ""} hidden.
            <button className="lint-reset-btn" onClick={() => actions.resetMutedLints()}>
              Show all
            </button>
          </div>
        )}
        <div id="lint-empty">All warnings are hidden.</div>
      </div>
    );
  }

  const MAX = 8;
  return (
    <div id="warnings-panel">
      {muted.length > 0 && (
        <div className="lint-reset-bar">
          {muted.length} warning{muted.length > 1 ? "s" : ""} hidden.
          <button className="lint-reset-btn" onClick={() => actions.resetMutedLints()}>
            Show all
          </button>
        </div>
      )}
      {visible.map((w) => {
        const isInfo = w.severity === "info";
        const shown = w.vars.slice(0, MAX);
        const extra = w.vars.length - shown.length;
        return (
          <div key={w.id} className={"lint-card" + (isInfo ? " lint-info" : "")}>
            <div className="lint-card-header">
              <span className={"lint-severity " + (isInfo ? "sev-info" : "sev-warn")}>
                {isInfo ? "Info" : "Warning"}
              </span>
              <span className="lint-title">{w.title}</span>
              <button className="lint-mute-btn" title="Hide this warning"
                onClick={() => actions.muteLint(w.id)}>
                Hide
              </button>
            </div>
            <div className="lint-body" dangerouslySetInnerHTML={{ __html: w.body }} />
            <div className="lint-affected-label">Affected ({w.vars.length})</div>
            <div className="lint-chips">
              {shown.map((n) => (
                <span
                  key={n}
                  className={"lint-chip" + (isInfo ? " info-chip" : "")}
                  title={n}
                >
                  {n}
                </span>
              ))}
              {extra > 0 && <span className="lint-chip more">+{extra} more</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
