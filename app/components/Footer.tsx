import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-[12px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-mono text-zinc-400">sk-variables</span>
          <span className="text-zinc-700">·</span>
          <span>built for the Skript community</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a className="hover:text-zinc-200" href="#docs">
            Docs
          </a>
          <a className="hover:text-zinc-200" href="#">
            Changelog
          </a>
          <a className="hover:text-zinc-200" href="#">
            Status
          </a>
          <a className="hover:text-zinc-200" href="#">
            GitHub
          </a>
          <a className="hover:text-zinc-200" href="#">
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
