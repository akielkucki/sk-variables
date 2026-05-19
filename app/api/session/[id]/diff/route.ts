import { jsonError, jsonOk } from "@/lib/api-utils";
import { createDiffCode, getSession, type DiffChange } from "@/lib/session-store";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const sess = getSession(id);
  if (!sess) return jsonError("Session not found", 404);

  let body: { changes?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }
  if (!Array.isArray(body.changes)) return jsonError("Missing changes array");

  const changes: DiffChange[] = [];
  for (const raw of body.changes) {
    if (!raw || typeof raw !== "object") return jsonError("Invalid change entry");
    const c = raw as Record<string, unknown>;
    if (typeof c.n !== "string" || typeof c.t !== "string") {
      return jsonError("Each change requires n and t strings");
    }
    const change: DiffChange = { n: c.n, t: c.t };
    if (typeof c.v === "string") change.v = c.v;
    changes.push(change);
  }

  const code = createDiffCode(id, changes);
  return jsonOk({ code });
}
