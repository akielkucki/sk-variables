import {Marquee} from "@/components/ui/marquee";

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
        <Marquee pauseOnHover className="[--duration:60s]">
          {doubled.map((e, idx) => (
              <span key={idx} className="whitespace-nowrap">
                <span className="text-zinc-600">›</span> {e}
              </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
