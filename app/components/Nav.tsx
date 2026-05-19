"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import {fetchDownloadUrl} from "@/lib/server-actions";

const spring = { type: "spring" as const, stiffness: 400, damping: 40, mass: 1 };

export function Nav({downloadUrl}: {downloadUrl: string}) {
  const navItems = ["How it works", "Features", "Docs", "Servers"];
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const island = scrolled;
  const expanded = !island || hovered;

  const scrollToHref = (id: string) => {
      window.scrollTo({
          top: document.getElementById(id)?.offsetTop || 0,
          behavior: 'smooth'
      })
    }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.header
        layout
        transition={spring}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className={[
          "pointer-events-auto backdrop-blur-xl",
          island
            ? "mt-3 rounded-full border border-white/10 bg-black/55 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]"
            : "mt-0 w-full rounded-none border-b border-white/5 bg-[#070809]/60",
        ].join(" ")}
      >
        <motion.div
          layout
          transition={spring}
          className={[
            "mx-auto flex items-center",
            island
              ? "h-12 gap-3 px-4"
              : "h-14 w-full max-w-6xl justify-between gap-6 px-6",
          ].join(" ")}
        >
          <div className="flex shrink-0 items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="font-mono text-sm tracking-tight text-zinc-200">
                sk-variables
              </span>
            </Link>
            <motion.span
              animate={{
                maxWidth: expanded ? 80 : 0,
                opacity: expanded ? 1 : 0,
                marginLeft: expanded ? 4 : 0,
                paddingLeft: expanded ? 8 : 0,
                paddingRight: expanded ? 8 : 0,
              }}
              transition={spring}
              className="overflow-hidden whitespace-nowrap rounded-full border border-emerald-400/20 bg-emerald-400/5 py-0.5 font-mono text-[10px] text-emerald-300/80"
            >
              v1.0-alpha
            </motion.span>
          </div>

          <motion.nav
            aria-label="Primary"
            animate={{
              maxWidth: expanded ? 640 : 0,
              opacity: expanded ? 1 : 0,
              marginLeft: expanded ? 8 : 0,
              marginRight: expanded ? 8 : 0,
            }}
            transition={spring}
            className="hidden items-center gap-7 overflow-hidden text-sm sm:flex"
          >
            {navItems.map((item) => (
              <button
                // href={`#${item.toLowerCase().replaceAll(/\s+/g, "-")}`}
                key={item}
                className="whitespace-nowrap text-white transition-colors duration-300 hover:text-[#25BB8c] cursor-pointer"
                onClick={()=>scrollToHref(item.toLowerCase().replaceAll(/\s+/g, "-"))}
              >
                {item}
              </button>
            ))}
          </motion.nav>

          <div className="flex shrink-0 items-center gap-2">
            <motion.a
              href={downloadUrl}
              animate={{
                maxWidth: expanded ? 120 : 0,
                opacity: expanded ? 1 : 0,
                paddingLeft: expanded ? 12 : 0,
                paddingRight: expanded ? 12 : 0,
                borderWidth: expanded ? 1 : 0,
              }}
              transition={spring}
              className="hidden h-8 items-center overflow-hidden whitespace-nowrap rounded-md border-white/10 text-xs text-zinc-300 hover:border-white/20 hover:text-white sm:inline-flex"
              style={{ borderStyle: "solid" }}
            >
              Sign in
            </motion.a>
            <a
              href={downloadUrl}
              className="group inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-400 px-3 text-xs font-medium text-emerald-950 transition-colors hover:bg-emerald-300"
            >
              Install free
              <span aria-hidden className="transition group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
}
