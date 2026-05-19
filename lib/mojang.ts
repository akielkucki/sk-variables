type CachedName = { name: string | null; expiresAt: number };
type CachedUuid = { uuid: string | null; name: string | null; expiresAt: number };

const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const g = globalThis as unknown as {
  __mojangCache?: { byUuid: Map<string, CachedName>; byName: Map<string, CachedUuid> };
};

if (!g.__mojangCache) {
  g.__mojangCache = { byUuid: new Map(), byName: new Map() };
}
const cache = g.__mojangCache;

function dashUuid(undashed: string): string {
  const u = undashed.toLowerCase();
  return `${u.slice(0, 8)}-${u.slice(8, 12)}-${u.slice(12, 16)}-${u.slice(16, 20)}-${u.slice(20)}`;
}

function stripUuid(uuid: string): string {
  return uuid.toLowerCase().replace(/-/g, "");
}

export async function nameForUuid(uuid: string): Promise<string | null> {
  const key = stripUuid(uuid);
  if (key.length !== 32) return null;
  const hit = cache.byUuid.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.name;
  try {
    const r = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${key}`, {
      cache: "no-store",
    });
    if (!r.ok) {
      cache.byUuid.set(key, { name: null, expiresAt: Date.now() + TTL_MS });
      return null;
    }
    const data = (await r.json()) as { name?: string };
    const name = typeof data.name === "string" ? data.name : null;
    cache.byUuid.set(key, { name, expiresAt: Date.now() + TTL_MS });
    return name;
  } catch {
    return null;
  }
}

export async function uuidForName(
  name: string
): Promise<{ uuid: string; uuidDashed: string; name: string } | null> {
  const key = name.toLowerCase();
  const hit = cache.byName.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    if (!hit.uuid || !hit.name) return null;
    return { uuid: hit.uuid, uuidDashed: dashUuid(hit.uuid), name: hit.name };
  }
  try {
    const r = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(name)}`,
      { cache: "no-store" }
    );
    if (!r.ok) {
      cache.byName.set(key, { uuid: null, name: null, expiresAt: Date.now() + TTL_MS });
      return null;
    }
    const data = (await r.json()) as { id?: string; name?: string };
    const uuid = typeof data.id === "string" ? data.id.toLowerCase() : null;
    const display = typeof data.name === "string" ? data.name : null;
    cache.byName.set(key, { uuid, name: display, expiresAt: Date.now() + TTL_MS });
    if (!uuid || !display) return null;
    return { uuid, uuidDashed: dashUuid(uuid), name: display };
  } catch {
    return null;
  }
}
