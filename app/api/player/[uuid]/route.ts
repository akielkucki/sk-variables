import { jsonError, jsonOk } from "@/lib/api-utils";
import { nameForUuid } from "@/lib/mojang";

export async function GET(_req: Request, ctx: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await ctx.params;
  const name = await nameForUuid(uuid);
  if (!name) return jsonError("Player not found", 404);
  return jsonOk({ name });
}
