export function SocialProof() {
  const quotes = [
    {
      q: "We used to grep variables.csv with 4M lines. sk-variables turned 20-minute debugs into 10 seconds.",
      who: "Noctis_",
      role: "Owner · Hypixel-style network",
      stat: "1,800 avg online",
    },
    {
      q: "Caught a dupe exploit on day one. The diff view paid for itself before we paid for it.",
      who: "Lyra",
      role: "Lead dev · IronClad SMP",
      stat: "12k registered",
    },
    {
      q: "Replaced three janky Skript admin scripts. My staff actually log in now.",
      who: "kelvin404",
      role: "Owner · CraftPvP",
      stat: "600 peak",
    },
  ];
  return (
    <section
      id="servers"
      className="relative mx-auto w-full max-w-6xl px-6 py-24"
    >
      <div className="mb-12">
        <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
          // server owners
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Trusted on networks that can&rsquo;t afford to guess.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <figure
            key={q.who}
            className="flex flex-col rounded-xl border border-white/10 bg-white/[0.015] p-6"
          >
            <blockquote className="text-[14.5px] leading-relaxed text-zinc-200">
              &ldquo;{q.q}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 font-mono text-[11px] text-emerald-200">
                {q.who.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 leading-tight">
                <div className="text-[13px] text-zinc-200">{q.who}</div>
                <div className="text-[11px] text-zinc-500">{q.role}</div>
              </div>
              <div className="font-mono text-[10px] text-zinc-500">{q.stat}</div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-14 border-y border-white/5 py-6">
        <div className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          running on
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[13px] text-zinc-500">
          {[
            "IronClad SMP",
            "CraftPvP",
            "DragonRealm",
            "NorthernLights",
            "VoidNet",
            "Sundown",
            "BeaconMC",
          ].map((n) => (
            <span key={n} className="tracking-tight">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
