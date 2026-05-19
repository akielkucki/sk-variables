export type ChunkEntry = {
  n: string;
  t: string;
  v?: string;
  s?: unknown;
};

export type DiffChange = { n: string; t: string; v?: string };

export type Session = {
  id: string;
  apiKey: string;
  total: number;
  chunkCount: number | null;
  ready: boolean;
  chunks: Map<number, ChunkEntry[]>;
  createdAt: number;
};

export type DiffRecord = {
  sessionId: string;
  changes: DiffChange[];
  expiresAt: number;
};

export type Registration = {
  apiKey: string;
  path: string;
};

type SkvStore = {
  sessions: Map<string, Session>;
  registrations: Map<string, Registration>; // apiKey -> registration
  pathOwners: Map<string, string>; // path -> apiKey
  diffsByCode: Map<string, DiffRecord>;
};

const g = globalThis as unknown as { __skvStore?: SkvStore };

if (!g.__skvStore) {
  g.__skvStore = {
    sessions: new Map(),
    registrations: new Map(),
    pathOwners: new Map(),
    diffsByCode: new Map(),
  };
}

export const store: SkvStore = g.__skvStore;

const SESSION_TTL_MS = 1000 * 60 * 30; // 30 minutes
const DIFF_TTL_MS = 1000 * 60 * 10; // 10 minutes

const SLUG_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/o/1/i/l for legibility
const HEX = "0123456789abcdef";

function randomFrom(alphabet: string, len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return s;
}

export function randomSlug(): string {
  for (let i = 0; i < 8; i++) {
    const candidate = randomFrom(SLUG_ALPHABET, 8);
    if (!store.pathOwners.has(candidate)) return candidate;
  }
  return randomFrom(SLUG_ALPHABET, 12);
}

export function randomHex(len = 12): string {
  return randomFrom(HEX, len);
}

export function pruneExpired(): void {
  const now = Date.now();
  for (const [id, sess] of store.sessions) {
    if (now - sess.createdAt > SESSION_TTL_MS) store.sessions.delete(id);
  }
  for (const [code, diff] of store.diffsByCode) {
    if (now > diff.expiresAt) store.diffsByCode.delete(code);
  }
}

export function createSession(apiKey: string, total: number): Session {
  pruneExpired();
  let id = randomHex(12);
  while (store.sessions.has(id)) id = randomHex(12);
  const sess: Session = {
    id,
    apiKey,
    total,
    chunkCount: null,
    ready: false,
    chunks: new Map(),
    createdAt: Date.now(),
  };
  store.sessions.set(id, sess);
  return sess;
}

export function getSession(id: string): Session | null {
  pruneExpired();
  return store.sessions.get(id) ?? null;
}

export function createDiffCode(sessionId: string, changes: DiffChange[]): string {
  pruneExpired();
  let code = randomHex(6);
  while (store.diffsByCode.has(code)) code = randomHex(6);
  store.diffsByCode.set(code, {
    sessionId,
    changes,
    expiresAt: Date.now() + DIFF_TTL_MS,
  });
  return code;
}

export function consumeDiff(code: string): DiffRecord | null {
  pruneExpired();
  const diff = store.diffsByCode.get(code);
  if (!diff) return null;
  return diff;
}

export function registerNew(): Registration {
  let apiKey = randomHex(32);
  while (store.registrations.has(apiKey)) apiKey = randomHex(32);
  const path = randomSlug();
  const reg: Registration = { apiKey, path };
  store.registrations.set(apiKey, reg);
  store.pathOwners.set(path, apiKey);
  return reg;
}

export function lookupRegistration(apiKey: string): Registration | null {
  return store.registrations.get(apiKey) ?? null;
}

export function claimPath(apiKey: string, slug: string):
  | { ok: true; path: string }
  | { ok: false; reason: "conflict" } {
  const reg = store.registrations.get(apiKey);
  if (!reg) return { ok: false, reason: "conflict" };
  const normalized = slug.toLowerCase().trim();
  const owner = store.pathOwners.get(normalized);
  if (owner && owner !== apiKey) return { ok: false, reason: "conflict" };
  if (reg.path !== normalized) {
    store.pathOwners.delete(reg.path);
    reg.path = normalized;
    store.pathOwners.set(normalized, apiKey);
  }
  return { ok: true, path: normalized };
}

export function pathExists(slug: string): boolean {
  return store.pathOwners.has(slug.toLowerCase());
}
