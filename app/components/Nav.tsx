import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="relative z-20 border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-mono text-sm tracking-tight text-zinc-200">
            sk-variables
          </span>
          <span className="ml-1 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 font-mono text-[10px] text-emerald-300/80">
            v1.0-alpha
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-zinc-400 sm:flex">
          <a className="hover:text-zinc-100" href="#how">
            How it works
          </a>
          <a className="hover:text-zinc-100" href="#features">
            Features
          </a>
          <a className="hover:text-zinc-100" href="#docs">
            Docs
          </a>
          <a className="hover:text-zinc-100" href="#proof">
            Servers
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#install"
            className="hidden h-8 items-center rounded-md border border-white/10 px-3 text-xs text-zinc-300 transition hover:border-white/20 hover:text-white sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href="#install"
            className="group inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-400 px-3 text-xs font-medium text-emerald-950 transition hover:bg-emerald-300"
          >
            Install free
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
