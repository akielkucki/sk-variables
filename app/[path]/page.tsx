import { Editor } from "@/components/editor/Editor";

type Props = {
  params: Promise<{ path: string }>;
  searchParams: Promise<{ s?: string | string[] }>;
};

export default async function EditorPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.s;
  const sessionId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : null;
  return <Editor sessionId={sessionId ?? null} />;
}
