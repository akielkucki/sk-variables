import { SearchIcon } from "./icons";

export function FeatureGrid() {
  const items = [
    {
      kicker: "search",
      title: "Glob-aware search across millions of vars.",
      body: "Type {player::*::coins} and get every match in under 20ms. Indexed on write, so it never gets slower as your server grows.",
      visual: <SearchVisual />,
    },
    {
      kicker: "diff",
      title: "Diff the past against the present.",
      body: "Rewind any variable to any second. Catch the dupe glitch, the rollback, the exploit — before your players do.",
      visual: <DiffVisual />,
    },
    {
      kicker: "permissions",
      title: "Read-only seats for your staff.",
      body: "Give moderators a viewer-only login. Audit every edit. Revoke with one click.",
      visual: <PermsVisual />,
    },
    {
      kicker: "api",
      title: "A REST + WebSocket API your scripts can call.",
      body: "Pipe variables into Discord bots, web stores, or your stream overlay. We do the hard part.",
      visual: <ApiVisual />,
    },
  ];
  return (
    <section
      id="features"
      className="relative mx-auto w-full max-w-6xl px-6 py-24"
    >
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
            // built for serious servers
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Everything you wished Skript had,
            <br className="hidden sm:inline" /> behind one clean panel.
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.kicker}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.015] p-6 transition hover:border-white/20"
          >
            <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/70">
              // {it.kicker}
            </div>
            <h3 className="mt-2 text-xl font-medium text-zinc-100">{it.title}</h3>
            <p className="mt-2 max-w-md text-[14px] text-zinc-400">{it.body}</p>
            <div className="mt-5 rounded-lg border border-white/5 bg-black/30 p-4 font-mono text-[12px]">
              {it.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SearchVisual() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-zinc-400">
        <SearchIcon />
        <span className="text-zinc-300">{"{player::*::coins}"}</span>
        <span className="ml-auto text-[10px] text-zinc-600">
          2,841 matches · 14ms
        </span>
      </div>
      <div className="space-y-1 pt-1.5">
        {[
          ["Noctis_", "14,322"],
          ["Alice", "98,201"],
          ["Steve", "4,201"],
        ].map(([n, v]) => (
          <div key={n} className="flex items-center justify-between">
            <span className="text-zinc-500">
              player::<span className="text-zinc-300">{n}</span>::coins
            </span>
            <span className="text-emerald-300 tabular-nums">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffVisual() {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] text-zinc-500">
        <span>player::Noctis_::coins</span>
        <span>−12h ago → now</span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-rose-400/20 bg-rose-400/[0.05] px-2 py-1.5">
        <span className="text-rose-300">−</span>
        <span className="text-zinc-300 tabular-nums">14,288</span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/[0.05] px-2 py-1.5">
        <span className="text-emerald-300">+</span>
        <span className="text-zinc-100 tabular-nums">14,322</span>
        <span className="ml-auto text-[10px] text-emerald-300/70">+34</span>
      </div>
    </div>
  );
}

function PermsVisual() {
  const rows = [
    { who: "Noctis_", role: "owner", c: "bg-emerald-400/20 text-emerald-300" },
    { who: "Lyra", role: "editor", c: "bg-cyan-400/20 text-cyan-300" },
    { who: "Theo", role: "viewer", c: "bg-zinc-500/20 text-zinc-300" },
  ];
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div
          key={r.who}
          className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5"
        >
          <span className="text-zinc-300">{r.who}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] ${r.c}`}>
            {r.role}
          </span>
        </div>
      ))}
    </div>
  );
}

function ApiVisual() {
  return (
    <div className="space-y-1.5">
      <div>
        <span className="text-emerald-300">GET</span>{" "}
        <span className="text-zinc-300">
          /v1/vars/player::Noctis_::coins
        </span>
      </div>
      <div className="rounded-md border border-white/5 bg-black/40 px-2 py-1.5 text-zinc-400">
        <span className="text-zinc-600">{"{"}</span> &quot;value&quot;:{" "}
        <span className="text-emerald-300">14322</span>, &quot;ts&quot;:{" "}
        <span className="text-cyan-300">1715981023</span>{" "}
        <span className="text-zinc-600">{"}"}</span>
      </div>
      <div className="text-[10px] text-zinc-500">
        ↳ also WebSocket: wss://api.skript-variables.com
      </div>
    </div>
  );
}
