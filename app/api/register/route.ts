import { jsonOk } from "@/lib/api-utils";
import { registerNew } from "@/lib/session-store";

export async function POST() {
  const reg = registerNew();
  return jsonOk({ apiKey: reg.apiKey, path: reg.path });
}
