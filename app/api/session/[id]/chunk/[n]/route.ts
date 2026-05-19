import { jsonError, jsonOk, requireApiKey } from "@/lib/api-utils";
import { getSession, type ChunkEntry } from "@/lib/session-store";

export async function PUT(request: Request, ctx: { params: Promise<{ id: string; n: string }> }) {
  const auth = requireApiKey(request);
  if (!auth.ok) return auth.response;

  const { id, n } = await ctx.params;
  const idx = Number(n);
  if (!Number.isInteger(idx) || idx < 0) return jsonError("Invalid chunk index");

  const sess = getSession(id);
  if (!sess) return jsonError("Session not found", 404);
  if (sess.apiKey !== auth.registration.apiKey) {
    return jsonError("Session does not belong to this API key", 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }
  if (!Array.isArray(body)) return jsonError("Body must be a JSON array");

  sess.chunks.set(idx, body as ChunkEntry[]);
  return jsonOk({ ok: true });
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await ctx.params;
  const idx = Number(n);
  if (!Number.isInteger(idx) || idx < 0) return jsonError("Invalid chunk index");

  const sess = getSession(id);
  if (!sess) return jsonError("Session not found", 404);
  if (!sess.ready) return jsonError("Session not ready", 409);

  const chunk = sess.chunks.get(idx) ?? [];
  return jsonOk(chunk);
}
