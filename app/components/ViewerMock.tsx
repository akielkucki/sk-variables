import { LockIcon, SearchIcon } from "./icons";

export function ViewerMock() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0d0f] shadow-2xl shadow-black/60 ring-1 ring-white/5">
      <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#0a0c0e] px-2.5 py-2 sm:gap-2 sm:px-3 sm:py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-500/70 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-yellow-500/70 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/70 sm:h-2.5 sm:w-2.5" />
        <div className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-400 sm:ml-3 sm:flex-none sm:px-2.5 sm:py-1 sm:text-[11px]">
          <LockIcon />
          <span className="truncate">
            <span className="hidden sm:inline">dashboard.skript-variables.com / </span>
            hypixel-dev
          </span>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
          live
        </div>
      </div>

      <div className="grid grid-cols-[96px_1fr] text-[11px] sm:grid-cols-[140px_1fr] sm:text-[12.5px]">
        <aside className="border-r border-white/5 bg-[#0a0c0e]/60 py-2.5 font-mono text-[10px] sm:py-3 sm:text-[11px]">
          <SidebarSection label="Namespaces" />
          <SidebarItem dot="bg-emerald-400" label="player" badge="8,412" active />
          <SidebarItem dot="bg-cyan-400" label="economy" badge="1,204" />
          <SidebarItem dot="bg-fuchsia-400" label="quests" badge="346" />
          <SidebarItem dot="bg-amber-400" label="guilds" badge="89" />
          <SidebarItem dot="bg-zinc-500" label="global" badge="27" />
          <SidebarSection label="Tools" mt />
          <SidebarItem label="search" />
          <SidebarItem label="diff" />
          <SidebarItem label="audit log" />
        </aside>

        <div className="min-w-0 bg-[#0b0d0f]">
          <div className="flex items-center gap-2 border-b border-white/5 px-2.5 py-2 sm:px-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-zinc-400 sm:px-2.5 sm:py-1.5 sm:text-[11px]">
              <SearchIcon />
              <span className="truncate text-zinc-500">{"{player::%uuid%::*}"}</span>
              <span className="caret -ml-1 text-emerald-300" />
            </div>
            <span className="hidden rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-zinc-400 sm:inline">
              ⌘K
            </span>
          </div>

          <div className="divide-y divide-white/5 font-mono text-[11px] sm:text-[12px]">
            <VarRow
              i={0}
              path="player::Noctis_::coins"
              type="number"
              valueA="14,288"
              valueB="14,310"
              valueC="14,322"
              trend="up"
            />
            <VarRow
              i={1}
              path="player::Noctis_::rank"
              type="text"
              valueA="“veteran”"
              valueB="“veteran”"
              valueC="“elite”"
              trend="flat"
            />
            <VarRow
              i={2}
              path="player::Noctis_::inventory"
              type="list[24]"
              valueA="diamond_sword ×1"
              valueB="diamond_sword ×1"
              valueC="netherite_sword ×1"
              trend="up"
            />
            <VarRow
              i={3}
              path="economy::market::bread"
              type="number"
              valueA="0.42"
              valueB="0.39"
              valueC="0.41"
              trend="down"
            />
            <VarRow
              i={4}
              path="quests::dragonslayer::progress"
              type="number"
              valueA="62%"
              valueB="71%"
              valueC="84%"
              trend="up"
            />
            <VarRow
              i={5}
              path="guilds::ironclad::members"
              type="list[42]"
              valueA="42 online"
              valueB="43 online"
              valueC="45 online"
              trend="up"
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/5 bg-[#0a0c0e]/60 px-2.5 py-2 font-mono text-[10px] text-zinc-500 sm:px-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span>9,978 vars</span>
              <span className="hidden text-zinc-700 sm:inline">·</span>
              <span className="hidden sm:inline">14ms query</span>
              <span className="text-zinc-700">·</span>
              <span className="text-emerald-300">+22 just now</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-400 pulse-dot" />
              connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ label, mt }: { label: string; mt?: boolean }) {
  return (
    <div
      className={`px-3 pb-1 text-[10px] uppercase tracking-wider text-zinc-600 ${
        mt ? "mt-3 pt-3 border-t border-white/5" : ""
      }`}
    >
      {label}
    </div>
  );
}

function SidebarItem({
  label,
  dot,
  badge,
  active,
}: {
  label: string;
  dot?: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 ${
        active ? "bg-white/[0.04] text-zinc-100" : "text-zinc-400"
      }`}
    >
      {dot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      ) : (
        <span className="h-1.5 w-1.5" />
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="text-[10px] text-zinc-500 tabular-nums">{badge}</span>
      )}
    </div>
  );
}

function VarRow({
  i,
  path,
  type,
  valueA,
  valueB,
  valueC,
  trend,
}: {
  i: number;
  path: string;
  type: string;
  valueA: string;
  valueB: string;
  valueC: string;
  trend: "up" | "down" | "flat";
}) {
  const trendColor =
    trend === "up"
      ? "text-emerald-300"
      : trend === "down"
      ? "text-rose-300"
      : "text-zinc-500";
  const trendGlyph = trend === "up" ? "▲" : trend === "down" ? "▼" : "·";

  return (
    <div
      className="row-in grid grid-cols-[1fr_96px_20px] items-center gap-2 px-2.5 py-1.5 hover:bg-white/[0.02] sm:grid-cols-[1fr_88px_140px_28px] sm:gap-3 sm:px-3 sm:py-2"
      style={{ animationDelay: `${0.08 * (i + 1)}s` }}
    >
      <div className="truncate text-zinc-300">
        <span className="text-zinc-600">
          {path.split("::").slice(0, -1).join("::")}::
        </span>
        <span className="text-zinc-100">{path.split("::").slice(-1)}</span>
      </div>
      <div className="hidden sm:block">
        <span className="rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-zinc-400">
          {type}
        </span>
      </div>
      <div className="relative h-4 overflow-hidden tabular-nums sm:h-5">
        <span className="cycle-a absolute inset-0 truncate text-zinc-200">{valueA}</span>
        <span className="cycle-b absolute inset-0 truncate text-zinc-200">{valueB}</span>
        <span className="cycle-c absolute inset-0 truncate text-emerald-200">
          {valueC}
        </span>
      </div>
      <div className={`text-right text-[10px] sm:text-[11px] ${trendColor}`}>{trendGlyph}</div>
    </div>
  );
}
