import { jsonError, jsonOk, requireApiKey } from "@/lib/api-utils";
import { consumeDiff, getSession } from "@/lib/session-store";

export async function GET(request: Request, ctx: { params: Promise<{ id: string; code: string }> }) {
  const auth = requireApiKey(request);
  if (!auth.ok) return auth.response;

  const { id, code } = await ctx.params;
  const sess = getSession(id);
  if (!sess || sess.apiKey !== auth.registration.apiKey) {
    return jsonError("Diff not found or expired", 404);
  }

  const diff = consumeDiff(code);
  if (!diff || diff.sessionId !== id) return jsonError("Diff not found or expired", 404);

  return jsonOk({ changes: diff.changes });
}
