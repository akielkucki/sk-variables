import { jsonError, jsonOk, requireApiKey } from "@/lib/api-utils";
import { claimPath } from "@/lib/session-store";

const SLUG_RE = /^[a-z0-9-]{3,32}$/i;

export async function POST(request: Request) {
  const auth = requireApiKey(request);
  if (!auth.ok) return auth.response;

  let body: { slug?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const slug = typeof body.slug === "string" ? body.slug : null;
  if (!slug || !SLUG_RE.test(slug)) {
    return jsonError("Slug must be 3-32 chars (a-z, 0-9, -)");
  }

  const result = claimPath(auth.registration.apiKey, slug);
  if (!result.ok) return jsonError("Slug already claimed", 409);
  return jsonOk({ path: result.path });
}
