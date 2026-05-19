import { jsonError, jsonOk, requireApiKey } from "@/lib/api-utils";
import { getSession } from "@/lib/session-store";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireApiKey(request);
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const sess = getSession(id);
  if (!sess) return jsonError("Session not found", 404);
  if (sess.apiKey !== auth.registration.apiKey) {
    return jsonError("Session does not belong to this API key", 403);
  }

  let body: { chunks?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const chunks = typeof body.chunks === "number" ? body.chunks : Number(body.chunks);
  if (!Number.isInteger(chunks) || chunks < 0) return jsonError("Invalid chunks");

  sess.chunkCount = chunks;
  sess.ready = true;
  return jsonOk({ ok: true });
}
