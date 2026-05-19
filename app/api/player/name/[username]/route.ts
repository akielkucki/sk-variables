import { jsonError, jsonOk } from "@/lib/api-utils";
import { uuidForName } from "@/lib/mojang";

export async function GET(_req: Request, ctx: { params: Promise<{ username: string }> }) {
  const { username } = await ctx.params;
  if (!/^[A-Za-z0-9_]{2,16}$/.test(username)) return jsonError("Invalid username");
  const profile = await uuidForName(username);
  if (!profile) return jsonError("Player not found", 404);
  return jsonOk(profile);
}
