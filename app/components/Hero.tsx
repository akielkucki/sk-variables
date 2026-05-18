import { CheckIcon, PlayIcon } from "./icons";
import { ViewerMock } from "./ViewerMock";

export function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1.25fr] lg:gap-16">
        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-zinc-400">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            Live inspector for Skript &middot; works on 1.16 – 1.21
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Finally see what&rsquo;s inside your{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                Skript variables
              </span>
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
              />
            </span>
            .
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400">
            A real-time web dashboard for every variable on your server.
            Browse nested lists, search 10M+ entries instantly, and edit values
            without touching{" "}
            <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[12.5px] text-zinc-300">
              variables.csv
            </code>
            .
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              id="install"
              href="#install"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-sm font-medium text-emerald-950 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_8px_30px_-4px_rgba(52,211,153,0.4)] transition hover:bg-emerald-300"
            >
              Install for free
              <span aria-hidden className="transition group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#how"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-5 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              <PlayIcon />
              See it live
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> No DB required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> 30-second install
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> Free up to 100k vars
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.18),transparent_60%)] blur-2xl"
          />
          <ViewerMock />
          <div className="absolute -right-3 -top-3 hidden rotate-2 items-center gap-2 rounded-md border border-white/10 bg-[#0c0e10] px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 shadow-xl shadow-black/40 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            stream &middot; 142 evt/s
          </div>
        </div>
      </div>
    </section>
  );
}
