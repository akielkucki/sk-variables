"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor } from "../EditorContext";
import { applyTheme, THEMES } from "../lib/themes";

export function Topbar() {
  const { state, actions } = useEditor();
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const themePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.querySelector(".skv-editor") as HTMLElement | null;
    if (root) applyTheme(root, state.themeId);
  }, [state.themeId]);

  useEffect(() => {
    if (!themePanelOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (themePanelRef.current?.contains(e.target as Node)) return;
      if (themeBtnRef.current?.contains(e.target as Node)) return;
      setThemePanelOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [themePanelOpen]);

  const activeTheme = THEMES.find((t) => t.id === state.themeId) ?? THEMES[0];

  return (
    <>
      <div id="topbar">
        <div className="topbar-left">
          <button
            id="btn-sidebar"
            className={state.sidebarOpen ? "active" : ""}
            title="Toggle sidebar"
            onClick={() => actions.setSidebarOpen(!state.sidebarOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button
            id="btn-theme"
            ref={themeBtnRef}
            className={themePanelOpen ? "panel-open" : ""}
            onClick={(e) => { e.stopPropagation(); setThemePanelOpen((o) => !o); }}
          >
            <span id="theme-dot" style={{ background: activeTheme.accent }} />
            Theme
          </button>
        </div>
        <span id="brand-name">{"{-sk::variables}."}</span>
        <span id="status">{state.status}</span>
      </div>
      {themePanelOpen && (
        <div id="theme-panel" ref={themePanelRef} onClick={(e) => e.stopPropagation()}>
          <div className="theme-panel-label">Theme</div>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <div
                key={t.id}
                className={"theme-card" + (t.id === state.themeId ? " active" : "")}
                onClick={() => actions.setThemeId(t.id)}
              >
                <div className="theme-swatch" style={{ background: t.bg }}>
                  <div className="swatch-surface" style={{ background: t.surface }} />
                  <div className="swatch-palette">
                    {t.palette.map((c, i) => (
                      <div key={i} className="swatch-palette-dot" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <span className="theme-name">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
