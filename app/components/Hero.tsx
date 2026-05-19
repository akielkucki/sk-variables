"use client";
import {CheckIcon, PlayIcon} from "./icons";
import {ViewerMock} from "./ViewerMock";
import {AnimatePresence, motion} from "motion/react";
import {useState} from "react";
import {PaperPlaneIcon} from "@phosphor-icons/react";

interface HeroProps {
    downloadUrl: string
}

type DemoState = "idle" | "input" | "sent";

const spring = { type: "spring" as const, stiffness: 420, damping: 40, mass: 0.9 };

export function Hero({downloadUrl}: HeroProps) {
    const [demoState, setDemoState] = useState<DemoState>("idle");
    const [email, setEmail] = useState<string>("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setDemoState("sent");
        setTimeout(() => {
            setDemoState("idle");
            setEmail("");
        }, 2800);
    };

    return (
        <section className="relative mx-auto w-full max-w-6xl px-4 pt-20 pb-14 sm:px-6 sm:pt-24 sm:pb-28">
            <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.05fr_1.25fr] lg:gap-16">
                <div className="relative">

                    <h1 className="text-balance text-[2rem] font-semibold leading-[1.08] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                        Finally see what&rsquo;s inside your{" "}
                        <span className="relative whitespace-nowrap">
              <span
                  className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                Skript variables
              </span>
              <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
              />
            </span>
                        .
                    </h1>

                    <p className="mt-4 max-w-md text-[14px] leading-relaxed text-zinc-400 sm:mt-5 sm:text-[15px]">
                        A real-time web dashboard for every variable on your server.
                        Browse nested lists, search 10M+ entries instantly, and edit values
                        without touching{" "}
                        <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[12.5px] text-zinc-300">
                            variables.csv
                        </code>
                        .
                    </p>

                    <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:gap-3">
                        <a
                            id="install"
                            href={downloadUrl}
                            className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 text-sm font-medium text-emerald-950 shadow-[0_0_0_1px_rgba(52,211,153,0.4),0_8px_30px_-4px_rgba(52,211,153,0.4)] transition hover:bg-emerald-300"
                        >
                            {demoState === "input" ? "Install now" : "Install for free"}
                            <span aria-hidden className="transition group-hover:translate-x-0.5">
                →
              </span>
                        </a>
                        <motion.div
                            layout
                            transition={spring}
                            className={[
                                "relative inline-flex h-11 items-center overflow-hidden rounded-lg border bg-white/[0.02]",
                                demoState === "input"
                                    ? "w-full sm:w-[320px]"
                                    : "w-auto",
                                demoState === "sent"
                                    ? "border-emerald-400/40 bg-emerald-400/10"
                                    : demoState === "input"
                                        ? "border-white/15 focus-within:border-white/30"
                                        : "border-white/10 hover:border-white/20",
                            ].join(" ")}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {demoState === "idle" && (
                                    <motion.button
                                        key="idle"
                                        type="button"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                                        onClick={() => setDemoState("input")}
                                        className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-5 text-sm text-zinc-300 transition-colors hover:text-white"
                                    >
                                        <PlayIcon />
                                        Request a paid demo
                                    </motion.button>
                                )}

                                {demoState === "input" && (
                                    <motion.form
                                        key="input"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                                        onSubmit={handleSend}
                                        className="flex h-full w-full items-center gap-1 pl-3 pr-1"
                                    >
                                        <input
                                            autoFocus
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape") setDemoState("idle");
                                            }}
                                            placeholder="you@server.gg"
                                            className="h-full flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none w-full"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!email.trim()}
                                            className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-emerald-400 px-3 text-xs font-medium text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Send
                                            <PaperPlaneIcon
                                                className="rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </button>
                                    </motion.form>
                                )}

                                {demoState === "sent" && (
                                    <motion.div
                                        key="sent"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                                        className="inline-flex h-full w-full items-center justify-center gap-2 whitespace-nowrap px-5 text-sm text-emerald-300"
                                    >
                                        <motion.span
                                            initial={{ x: -10, y: 10, opacity: 0, rotate: 45 }}
                                            animate={{ x: 0, y: 0, opacity: 1, rotate: 45 }}
                                            transition={{ ...spring, delay: 0.05 }}
                                            className="inline-flex"
                                        >
                                            <PaperPlaneIcon />
                                        </motion.span>
                                        Thanks — we&rsquo;ll be in touch
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-zinc-500 sm:mt-6 sm:gap-x-5 sm:text-[12px]">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon/> No DB required
            </span>
                        <span className="inline-flex items-center gap-1.5">
              <CheckIcon/> 30-second install
            </span>
                        <span className="inline-flex items-center gap-1.5">
              <CheckIcon/> Free up to 100k vars
            </span>
                    </div>
                </div>

                <div className="relative">
                    <div
                        aria-hidden
                        className="absolute -inset-8 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.18),transparent_60%)] blur-2xl"
                    />
                    <ViewerMock/>
                    <div
                        className="absolute -right-3 -top-3 hidden rotate-2 items-center gap-2 rounded-md border border-white/10 bg-[#0c0e10] px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 shadow-xl shadow-black/40 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot"/>
                        stream &middot; 142 evt/s
                    </div>
                </div>
            </div>
        </section>
    );
}
