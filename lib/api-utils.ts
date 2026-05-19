import { lookupRegistration, type Registration } from "./session-store";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function jsonOk<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return null;
  return match[1].trim();
}

export function requireApiKey(
  request: Request
): { ok: true; registration: Registration } | { ok: false; response: Response } {
  const token = extractBearerToken(request);
  if (!token) {
    return { ok: false, response: jsonError("Missing or malformed Authorization header", 401) };
  }
  const registration = lookupRegistration(token);
  if (!registration) {
    return { ok: false, response: jsonError("Invalid API key", 401) };
  }
  return { ok: true, registration };
}
