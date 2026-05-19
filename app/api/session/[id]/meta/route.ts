import { jsonError, jsonOk } from "@/lib/api-utils";
import { getSession } from "@/lib/session-store";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const sess = getSession(id);
  if (!sess) return jsonError("Session not found", 404);
  return jsonOk({
    ready: sess.ready,
    total: sess.total,
    chunks: sess.chunkCount ?? 0,
  });
}
