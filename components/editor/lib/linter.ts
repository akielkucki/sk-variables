import type { Variable } from "./types";

export type LintWarning = {
  id: string;
  severity: "warn" | "info";
  title: string;
  body: string;
  vars: string[];
};

export type NameVerifier = (name: string) => boolean | null; // true=mc account, false=not, null=pending

function lintNameIndex(vars: Variable[], verifyName: (name: string) => void, nameStatus: NameVerifier): Variable[] {
  const UUID_RE = /^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const NAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,15}$/;
  const PLAYER_CTX_RE = /player|user|uuid|member|account|ban|punish|warn|mute|perm|rank/i;

  const slots = new Map<string, Set<string>>();
  const slotVars = new Map<string, Set<string>>();

  for (const v of vars) {
    const parts = v.n.split("::");
    for (let i = 1; i < parts.length; i++) {
      const prefix = parts.slice(0, i).join("::");
      const suffix = parts.slice(i + 1).join("::");
      if (!suffix) continue;
      if (!PLAYER_CTX_RE.test(prefix)) continue;
      const slotKey = prefix + "\x00" + suffix;
      const seg = parts[i];
      if (!slots.has(slotKey)) slots.set(slotKey, new Set());
      slots.get(slotKey)!.add(seg);
      const varKey = slotKey + "\x00" + seg;
      if (!slotVars.has(varKey)) slotVars.set(varKey, new Set());
      slotVars.get(varKey)!.add(v.n);
    }
  }

  const flagged = new Set<string>();
  for (const [slotKey, segs] of slots) {
    if (segs.size < 2) continue;
    if (![...segs].some((s) => UUID_RE.test(s))) continue;
    for (const seg of segs) {
      if (UUID_RE.test(seg) || !NAME_RE.test(seg)) continue;
      const status = nameStatus(seg);
      if (status === null) {
        verifyName(seg);
      } else if (status === true) {
        for (const n of slotVars.get(slotKey + "\x00" + seg) ?? []) flagged.add(n);
      }
    }
  }
  return vars.filter((v) => flagged.has(v.n));
}

export function runLinter(
  vars: Variable[],
  verifyName: (name: string) => void,
  nameStatus: NameVerifier
): LintWarning[] {
  const out: LintWarning[] = [];
  const LOC_SEG_RE = /^[^:,]+:-?\d[\d.]*,-?\d[\d.]*,-?\d[\d.]*/;

  const dotVars = vars.filter(
    (v) =>
      !v.n.includes("::") &&
      v.n.split("::").some((seg) => !LOC_SEG_RE.test(seg) && /[a-zA-Z_]\.|\.([a-zA-Z_])/.test(seg))
  );
  if (dotVars.length) {
    out.push({
      id: "dot-delimiter",
      severity: "warn",
      title: "Dot used as delimiter",
      body: "Using <code>.</code> as a separator is unconventional. The standard Skript delimiter is <code>::</code>, e.g. <code>playerdata::uuid::kills</code>. Dots can cause confusion and make variables harder to read.",
      vars: dotVars.map((v) => v.n),
    });
  }

  const nameVars = lintNameIndex(vars, verifyName, nameStatus);
  if (nameVars.length) {
    out.push({
      id: "name-index",
      severity: "warn",
      title: "Player name used as index instead of UUID",
      body: "Using a player's display name as a variable key (e.g. <code>data::Steve::kills</code>) breaks when they rename. Store data under their UUID: <code>set {data::{uuid of player}::kills} to ...</code>.",
      vars: nameVars.map((v) => v.n),
    });
  }

  const falseVars = vars.filter((v) => v.t === "boolean" && parseInt(v.v || "0", 16) === 0);
  if (falseVars.length) {
    out.push({
      id: "false-boolean",
      severity: "info",
      title: "Variables explicitly set to false",
      body: "In Skript, unset variables are falsy by default, so you can skip storing <code>false</code> entirely. Delete the variable and check <code>if {var} is not set</code> instead. This saves storage and avoids stale state.",
      vars: falseVars.map((v) => v.n),
    });
  }

  return out;
}
