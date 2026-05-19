"use client";

import { useEditor } from "../EditorContext";
import { USERNAME_RE, isUuid } from "../lib/decode";
import { usePlayerLookup } from "../hooks/usePlayerLookup";

type Props = {
  pendingCount: number;
  onApply: () => void;
  onRefresh: () => void;
  onDeleteSelected: () => void;
  onEditSelected: () => void;
};

export function Toolbar({
  pendingCount,
  onApply,
  onRefresh,
  onDeleteSelected,
  onEditSelected,
}: Props) {
  const { state, actions } = useEditor();
  const { verifyName, nameStatus } = usePlayerLookup();

  const onSearchChange = (raw: string) => {
    const q = raw.toLowerCase().trim();
    actions.setSearchQ(q);
    if (q && USERNAME_RE.test(q) && !isUuid(q)) {
      const status = nameStatus(q);
      if (status === null) verifyName(q);
      // search uuids are resolved separately when API response arrives — keep simple:
      fetch(`/api/player/name/${encodeURIComponent(q)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d || !d.uuid) {
            actions.setSearchUUIDs([]);
            return;
          }
          actions.setSearchUUIDs([d.uuid.toLowerCase(), d.uuidDashed.toLowerCase()]);
        })
        .catch(() => actions.setSearchUUIDs([]));
    } else {
      actions.setSearchUUIDs([]);
    }
  };

  const selectionSize = state.selected.size;

  return (
    <div id="toolbar">
      <div className="search-wrap">
        <input
          id="search"
          type="search"
          placeholder="Search variables…"
          value={state.searchQ}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          id="btn-regex"
          className={state.searchRegex ? "active" : ""}
          title="Toggle regex search"
          onClick={() => actions.setSearchRegex(!state.searchRegex)}
        >
          .*
        </button>
      </div>
      <button
        id="btn-refresh"
        className="btn-toggle"
        title="Re-fetch session data"
        onClick={onRefresh}
      >
        ↺
      </button>
      {pendingCount > 0 && <span id="pending-badge">{pendingCount} pending</span>}
      {selectionSize > 0 && (
        <>
          <button
            id="btn-delete-selected"
            className="btn-sm btn-delete"
            onClick={onDeleteSelected}
          >
            Delete {selectionSize}
          </button>
          <button
            id="btn-edit-selected"
            className="btn-sm"
            onClick={onEditSelected}
          >
            Edit {selectionSize}
          </button>
        </>
      )}
      <div className="view-toggle">
        <button
          className={"view-btn" + (state.viewMode === "list" ? " active" : "")}
          title="List view"
          onClick={() => actions.setViewMode("list")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
        <button
          className={"view-btn" + (state.viewMode === "grid" ? " active" : "")}
          title="Grid view"
          onClick={() => actions.setViewMode("grid")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
      </div>
      <button className="primary" disabled={pendingCount === 0} onClick={onApply}>
        Apply changes
      </button>
    </div>
  );
}
