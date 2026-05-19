import { jsonError, jsonOk, requireApiKey } from "@/lib/api-utils";
import { createSession } from "@/lib/session-store";

export async function POST(request: Request) {
  const auth = requireApiKey(request);
  if (!auth.ok) return auth.response;

  let body: { total?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const total = typeof body.total === "number" ? body.total : Number(body.total);
  if (!Number.isFinite(total) || total < 0 || total > 5_000_000) {
    return jsonError("Invalid total");
  }

  const sess = createSession(auth.registration.apiKey, total);
  return jsonOk({ id: sess.id });
}
