export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto w-full max-w-6xl px-6 py-24">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-24">
          <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
            // how it works
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            From <code className="font-mono text-zinc-300">/sk reload</code> to
            a live dashboard in 30 seconds.
          </h2>
          <p className="mt-4 max-w-md text-zinc-400">
            Drop the .jar in your{" "}
            <code className="font-mono text-zinc-300">plugins/</code> folder,
            log in, and your variable tree is already streaming. No extra
            database. No exports. No restarts.
          </p>
          <a
            href="#install"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-medium text-emerald-950 hover:bg-emerald-300"
          >
            Start free →
          </a>
        </div>

        <div className="space-y-4">
          <TerminalBlock
            label="1 — install"
            lines={[
              { p: "$", c: "wget skript-variables.com/dl/latest.jar -P plugins/" },
              { p: "→", c: "downloading sk-variables-2.4.0.jar  3.1 MB", muted: true },
              { p: "→", c: "✓ saved to plugins/sk-variables-2.4.0.jar", ok: true },
            ]}
          />
          <TerminalBlock
            label="2 — link your server"
            lines={[
              { p: ">", c: "/skvariables link" },
              {
                p: "→",
                c: "open https://skript-variables.com/link/AX7-93K",
                muted: true,
              },
              { p: "→", c: "✓ linked as hypixel-dev (eu-1)", ok: true },
            ]}
          />
          <TerminalBlock
            label="3 — query anything, anywhere"
            lines={[
              { p: ">", c: "/skvariables list {player::%uuid of player%::*}" },
              { p: "→", c: "coins    = 14,322", muted: true },
              { p: "→", c: "rank     = elite", muted: true },
              { p: "→", c: "xp       = 91,204", muted: true },
              { p: "→", c: "🌐 also live at dashboard.skript-variables.com", ok: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function TerminalBlock({
  label,
  lines,
}: {
  label: string;
  lines: { p: string; c: string; muted?: boolean; ok?: boolean }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0d0f] shadow-lg shadow-black/30">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0a0c0e] px-4 py-2 font-mono text-[11px] text-zinc-500">
        <span>{label}</span>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-6">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={
                l.p === "$"
                  ? "text-emerald-300"
                  : l.p === ">"
                  ? "text-cyan-300"
                  : "text-zinc-600"
              }
            >
              {l.p}
            </span>
            <span
              className={
                l.ok
                  ? "text-emerald-300"
                  : l.muted
                  ? "text-zinc-500"
                  : "text-zinc-200"
              }
            >
              {l.c}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}
