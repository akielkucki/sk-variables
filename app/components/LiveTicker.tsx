export function LiveTicker() {
  const events = [
    "SET  player::Steve::coins → 4,201",
    "ADD  guilds::ironclad::members += Ender_42",
    "DEL  quests::tutorial::active",
    "SET  economy::market::bread → 0.41",
    "INC  player::Noctis_::xp += 240",
    "SET  player::Alice::rank → “elite”",
    "ADD  global::events::queue += dragon_spawn",
    "INC  guilds::ironclad::kills += 1",
    "SET  quests::dragonslayer::progress → 84%",
    "DEL  player::guest_193::*",
  ];
  const doubled = [...events, ...events];
  return (
    <section className="relative z-10 border-y border-white/5 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 font-mono text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5 whitespace-nowrap text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
          live stream
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="marquee-track flex w-max gap-8">
            {doubled.map((e, idx) => (
              <span key={idx} className="whitespace-nowrap">
                <span className="text-zinc-600">›</span> {e}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
