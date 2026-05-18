export function FinalCta() {
  return (
    <section id="docs" className="relative mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.06] via-transparent to-cyan-400/[0.04] p-10 sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Stop guessing what your server is storing.
            </h2>
            <p className="mt-3 max-w-md text-zinc-400">
              Free tier covers up to 100k variables and unlimited live viewers.
              Paid plans start at $9/mo when you outgrow it.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#install"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-sm font-medium text-emerald-950 hover:bg-emerald-300"
              >
                Create free account →
              </a>
              <a
                href="#docs"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-5 text-sm text-zinc-200 hover:border-white/20"
              >
                Read the docs
              </a>
            </div>
            <div className="mt-4 font-mono text-[11px] text-zinc-500">
              no credit card · cancel any time · works offline
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0b0d0f]/80 p-5 font-mono text-[12.5px] backdrop-blur">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500">
              <span>install in your terminal</span>
              <span className="rounded border border-white/5 px-1.5 py-0.5">
                copy
              </span>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="text-emerald-300">$ </span>
                <span className="text-zinc-200">
                  curl -fsSL skript-variables.com/install.sh | sh
                </span>
              </div>
              <div className="text-zinc-600">
                ↳ verifies signature · pins to plugins/ · no sudo
              </div>
              <div className="pt-2 text-zinc-500">
                or download the .jar manually →{" "}
                <span className="text-cyan-300">/downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
