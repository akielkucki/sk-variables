import type { RawVariable, Variable } from "./types";

export const EDITABLE = new Set([
  "string", "long", "integer", "int", "double", "float", "number",
  "boolean", "itemtype", "blockdata", "textcomponent", "text component",
  "color", "world", "entitytype", "entity type", "gamemode", "difficulty",
  "biome", "sound", "potioneffect", "potion effect", "potioneffecttype", "potion effect type",
]);

export const LOC_EDITABLE = new Set(["location"]);
export const VEC_EDITABLE = new Set(["vector"]);
export const BOUND_EDITABLE = new Set(["bound"]);
export const TIMESPAN_EDITABLE = new Set(["timespan"]);
export const DATE_EDITABLE = new Set(["date"]);

export const SKRIPT_COLOR_HEX: Record<string, string> = {
  black: "#1d1d1d", "dark grey": "#414141", "dark gray": "#414141",
  grey: "#808080", gray: "#808080",
  "light grey": "#c0c0c0", "light gray": "#c0c0c0",
  white: "#f9f9f9", brown: "#835432",
  red: "#cf0000", orange: "#ff8800", yellow: "#fffe00",
  lime: "#00cf00", green: "#006600",
  cyan: "#00cfcf", "light blue": "#aad4f5", blue: "#0000cf",
  purple: "#7f00cf", magenta: "#cf00cf", pink: "#ff80b4",
};

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function decodeValue(type: string, hex: string | undefined): string {
  if (!hex) return "";
  const t = (type || "").toLowerCase().trim();
  try {
    if (t === "location" || t === "vector")
      return hex.includes(",") ? hex : hex.length > 24 ? hex.slice(0, 24) + "…" : hex;

    if (t === "textcomponent" || t === "text component") return hex;
    if (t === "item" || t === "itemstack") return hex;

    if (t === "bound")
      return hex.includes(",") ? hex : hex.length > 32 ? hex.slice(0, 32) + "…" : hex;

    if (t === "timespan" || t === "color" || t === "world" ||
        t === "entitytype" || t === "entity type") return hex || "";

    if (t === "date") {
      const ts = Number(hex);
      if (!isNaN(ts) && ts > 0) return new Date(ts).toLocaleString();
      return hex;
    }

    if (t === "itemtype" || t === "blockdata")
      return /^[0-9a-f]+$/i.test(hex) ? (hex.length > 24 ? hex.slice(0, 24) + "…" : hex) : hex;

    if (t === "boolean") return hex.trim() === "01" ? "true" : "false";

    if (t === "string") {
      const bytes = hexToBytes(hex);
      if (bytes.length <= 2) return "";
      return new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(2));
    }

    if (t === "long" || t === "integer" || t === "int") {
      const bytes = hexToBytes(hex);
      const ZERO = BigInt(0);
      const EIGHT = BigInt(8);
      const ONE = BigInt(1);
      let val = ZERO;
      for (const b of bytes) val = (val << EIGHT) | BigInt(b);
      const bits = BigInt(bytes.length * 8);
      if (val >= ONE << (bits - ONE)) val -= ONE << bits;
      return val.toString();
    }

    if (t === "double" || t === "float" || t === "number") {
      const bytes = hexToBytes(hex);
      const view = new DataView(bytes.buffer);
      if (bytes.length >= 8) return String(view.getFloat64(0, false));
      if (bytes.length >= 4) return String(view.getFloat32(0, false));
    }
  } catch {
    /* fall through */
  }
  return hex.length > 24 ? hex.slice(0, 24) + "…" : hex;
}

export function sizeOf(v: RawVariable & { d?: string }): number {
  const t = (v.t || "").toLowerCase().trim();
  switch (t) {
    case "boolean": return 1;
    case "long": case "integer": case "int":
    case "double": case "float": case "number": return 8;
    case "string": return (v.d ? v.d.length : 0) * 2;
    case "location": return 56;
    case "vector": return 32;
    case "timespan": case "date": return 8;
    case "item": case "itemstack":
      return v.s ? 128 + JSON.stringify(v.s).length : 64;
    case "itemtype": return 48;
    case "blockdata": return 32;
    case "textcomponent": case "text component":
      return (v.d ? v.d.length : 0) * 2 + 32;
    default:
      if (v.s && typeof v.s === "object") return Math.max(64, JSON.stringify(v.s).length);
      return (v.d ? v.d.length : 0) * 2 || 0;
  }
}

export function fmtSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024).toFixed(1) + " KB";
}

export function typeClass(t: string): string {
  const tl = (t || "").toLowerCase();
  if (tl === "boolean") return "badge-bool";
  if (tl === "string") return "badge-string";
  if (["long", "integer", "int", "double", "float", "number"].includes(tl)) return "badge-num";
  return "badge-other";
}

export function valClass(t: string, decoded: string): string {
  const tl = (t || "").toLowerCase();
  if (tl === "boolean") return decoded === "true" ? "val-true" : "val-false";
  if (["long", "integer", "int", "double", "float", "number"].includes(tl)) return "val-num";
  if (tl === "string" || tl === "itemtype" || tl === "blockdata" ||
      tl === "textcomponent" || tl === "text component") return "val-str";
  return "val-complex";
}

export function hydrate(raw: RawVariable): Variable {
  const d = decodeValue(raw.t, raw.v);
  const byteSize = sizeOf({ ...raw, d });
  return { ...raw, d, byteSize };
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const UUID_PLAIN = /^[0-9a-f]{32}$/i;
export const USERNAME_RE = /^[a-z0-9_]{2,16}$/;

export function isUuid(s: string): boolean {
  return UUID_RE.test(s) || UUID_PLAIN.test(s);
}

export function normUuid(s: string): string {
  return s.toLowerCase().replace(/-/g, "");
}

export function hyphenUuid(s: string): string {
  const u = normUuid(s);
  if (u.length !== 32) return s;
  return `${u.slice(0, 8)}-${u.slice(8, 12)}-${u.slice(12, 16)}-${u.slice(16, 20)}-${u.slice(20)}`;
}

export function legacyToDisplay(s: string): string {
  if (!s) return "";
  return s.replace(/§x(§[0-9a-fA-F]){6}/gi, (match) => {
    const hex = match.replace(/§x/i, "").replace(/§/g, "");
    return "<#" + hex + ">";
  });
}

export function displayToLegacy(s: string): string {
  if (!s) return "";
  return s.replace(/<#([0-9a-fA-F]{6})>/gi, (_, hex: string) =>
    "§x" + hex.split("").map((c) => "§" + c).join("")
  );
}
