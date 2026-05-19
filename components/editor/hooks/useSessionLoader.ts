"use client";

import { useCallback, useEffect, useState } from "react";
import { hydrate } from "../lib/decode";
import type { RawVariable, Variable } from "../lib/types";
import { useEditor } from "../EditorContext";

type LoaderState = {
  hidden: boolean;
  message: string;
  sub: string;
  progressPct: number;
};

export function useSessionLoader(sessionId: string | null) {
  const { actions } = useEditor();
  const [loader, setLoader] = useState<LoaderState>({
    hidden: false,
    message: "Connecting…",
    sub: "",
    progressPct: 0,
  });

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      actions.setStatus("No session. Run /skv editor in-game.");
      setLoader((s) => ({ ...s, hidden: true }));
      return;
    }

    setLoader({ hidden: false, message: "Waiting for server…", sub: "", progressPct: 0 });

    let meta: { ready: boolean; total: number; chunks: number } | null = null;
    for (let i = 0; i < 60; i++) {
      try {
        const r = await fetch(`/api/session/${sessionId}/meta`);
        if (r.ok) {
          meta = await r.json();
          if (meta?.ready) break;
        }
      } catch { /* retry */ }
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!meta?.ready) {
      actions.setStatus("Session timed out. Run /skv editor again.");
      setLoader((s) => ({ ...s, hidden: true }));
      return;
    }

    setLoader({
      hidden: false,
      message: "Loading variables…",
      sub: `0 / ${meta.total.toLocaleString()}`,
      progressPct: 0,
    });

    const all: Variable[] = [];
    for (let i = 0; i < meta.chunks; i++) {
      let chunk: RawVariable[] = [];
      try {
        const r = await fetch(`/api/session/${sessionId}/chunk/${i}`);
        if (r.ok) chunk = (await r.json()) as RawVariable[];
      } catch { /* skip */ }
      for (const raw of chunk) all.push(hydrate(raw));
      setLoader({
        hidden: false,
        message: "Loading variables…",
        sub: `${all.length.toLocaleString()} / ${meta.total.toLocaleString()} variables`,
        progressPct: Math.round(((i + 1) / meta.chunks) * 100),
      });
    }

    actions.setAllVars(all);
    actions.setStatus(`${all.length.toLocaleString()} variables`);
    setLoader((s) => ({ ...s, hidden: true }));
  }, [sessionId, actions]);

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return { loader, refresh: fetchSession };
}
