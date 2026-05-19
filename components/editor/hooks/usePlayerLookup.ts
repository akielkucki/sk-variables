"use client";

import { useCallback } from "react";
import { useEditor } from "../EditorContext";
import { hyphenUuid, normUuid } from "../lib/decode";

export function usePlayerLookup() {
  const { state, actions } = useEditor();

  const ensurePlayerName = useCallback(
    (raw: string) => {
      const key = normUuid(raw);
      if (state.playerNames.has(key)) return;
      actions.setPlayerName(key, null);
      fetch(`/api/player/${hyphenUuid(raw)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && typeof d.name === "string") actions.setPlayerName(key, d.name);
        })
        .catch(() => {});
    },
    [state.playerNames, actions]
  );

  const playerName = useCallback(
    (raw: string) => state.playerNames.get(normUuid(raw)) ?? null,
    [state.playerNames]
  );

  const verifyName = useCallback(
    (username: string) => {
      const key = username.toLowerCase();
      if (state.nameVerify.has(key)) return;
      actions.setNameVerify(key, null);
      fetch(`/api/player/name/${encodeURIComponent(username)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => actions.setNameVerify(key, !!(d && d.uuid)))
        .catch(() => actions.setNameVerify(key, false));
    },
    [state.nameVerify, actions]
  );

  const nameStatus = useCallback(
    (name: string) => state.nameVerify.get(name.toLowerCase()) ?? null,
    [state.nameVerify]
  );

  return { ensurePlayerName, playerName, verifyName, nameStatus };
}
