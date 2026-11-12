import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiGithub, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { portfolioData } from "../data/portfolioData";
import { useActiveSection } from "../hooks/useActiveSection";
import { EASE_OUT, SPRING_SCROLL } from "../lib/motion";
import { CHAPTERS } from "../lib/chapters";

// The fixed frame of the console: what chapter you're in, the time,
// and how far through the page you are.

const sectionIds = CHAPTERS.map((c) => c.id);

// Seconds-ticking clock, formatted like a terminal readout
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Hud() {
  const { github, email, base, coordinates } = portfolioData;
  const active = useActiveSection(sectionIds);
  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0];

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING_SCROLL);
  const scrollPct = useTransform(progress, (v) => `${String(Math.round(v * 100)).padStart(2, "0")}%`);

  const [menuOpen, setMenuOpen] = useState(false);
  const clock = useClock();

  // Escape closes the menu; body scroll is locked while it's open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <>
      {/* Reading progress — hairline at the very top */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-12 max-w-[100rem] items-center justify-between bg-background/75 px-4 font-mono text-[10px] tracking-[0.22em] text-muted backdrop-blur-md sm:px-6 sm:tracking-[0.28em]">
          {/* Left — wordmark */}
          <a
            href="#home"
            className="pointer-events-auto flex h-12 items-center gap-2 text-paper transition-colors hover:text-accent"
            aria-label="Cyndrick Abejo — back to top"
          >
            <span className="grid h-6 w-6 place-items-center border border-accent/60 text-[10px] font-bold text-accent">
              C/
            </span>
            <span className="hidden xs:inline font-bold">CYNDRICK_ABEJO</span>
          </a>

          {/* Center — chapter links (desktop) */}
          <nav aria-label="Chapters" className="pointer-events-auto hidden items-center gap-5 md:flex">
            {CHAPTERS.map((c) => {
              const isActive = active === c.id;
              return (
                <a
                  key={c.id}
                  href={c.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-muted hover:text-paper"
                  }`}
                >
                  <span className="mr-1 text-[9px] opacity-70">{c.page}</span>
                  {c.name}
                  {isActive && (
                    <motion.span
                      layoutId="hud-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right — clock + status, or menu button on mobile */}
          <div className="pointer-events-auto flex h-12 items-center gap-4">
            <span className="hidden items-center gap-2 sm:flex" aria-hidden="true">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="tabular-nums text-paper/70">{clock}</span>
            </span>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hidden h-12 items-center text-muted transition-colors hover:text-paper md:flex"
            >
              <FiGithub size={15} />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-12 items-center gap-2 text-paper md:hidden"
            >
              MENU
              <span aria-hidden="true" className="flex flex-col gap-1">
                <span className="h-px w-5 bg-paper" />
                <span className="h-px w-5 bg-paper" />
              </span>
            </button>
          </div>
        </div>
        {/* Hairline under the bar */}
        <div aria-hidden="true" className="h-px bg-paper/[0.07]" />
      </header>

      {/* ── BOTTOM BAR ────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
        <div aria-hidden="true" className="h-px bg-paper/[0.07]" />
        <div className="mx-auto flex h-11 max-w-[100rem] items-center justify-between bg-background/60 px-4 font-mono text-[9px] tracking-[0.28em] text-muted backdrop-blur-md sm:px-6 sm:text-[10px]">
          <p aria-live="polite" className="min-w-0 truncate">
            <span className="text-accent">PAGE {chapter.page}</span>
            <span className="mx-2 text-paper/25">/</span>
            {chapter.name}
          </p>
          <div className="pointer-events-auto flex items-center gap-3 sm:gap-5">
            <span className="hidden tabular-nums text-paper/60 xs:inline">
              SCROLL <motion.span>{scrollPct}</motion.span>
            </span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-paper/15 xs:block" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-11 items-center gap-1.5 text-paper/80 transition-colors hover:text-accent"
            >
              TOP <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SIDE RAILS (wide screens only) ────────────────────────── */}
      <p
        aria-hidden="true"
        className="pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 select-none font-mono text-[9px] tracking-[0.4em] text-muted/70 [writing-mode:vertical-rl] xl:block"
      >
        COMPUTER ENGINEERING × FULL STACK
      </p>
      <p
        aria-hidden="true"
        className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 rotate-180 select-none font-mono text-[9px] tracking-[0.4em] text-muted/70 [writing-mode:vertical-rl] xl:block"
      >
        {base.toUpperCase()} — {coordinates}
      </p>

      {/* Corner registration marks */}
      {["left-3 top-12", "right-3 top-12", "left-3 bottom-11", "right-3 bottom-11"].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none fixed z-40 hidden select-none font-mono text-sm text-accent/40 lg:block ${pos}`}
        >
          +
        </span>
      ))}

      {/* ── FULLSCREEN MENU (mobile / tablet) — portaled to body ────── */}
      {createPortal(
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[70] flex flex-col bg-void/95 backdrop-blur-xl"
          >
            <div className="flex h-12 items-center justify-between border-b border-paper/[0.07] px-4">
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted">CCA://MENU</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="grid h-11 w-11 place-items-center text-paper transition-colors hover:text-accent"
              >
                <FiX size={22} />
              </button>
            </div>
            <nav aria-label="Chapters" className="flex flex-1 flex-col justify-center px-6">
              {CHAPTERS.map((c, i) => (
                <motion.a
                  key={c.id}
                  href={c.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: EASE_OUT }}
                  className="group flex items-baseline gap-5 border-b border-paper/[0.07] py-4"
                >
                  <span className="font-mono text-xs text-accent">{c.page}</span>
                  <span className="font-display text-4xl font-extrabold tracking-tight text-paper transition-transform duration-300 group-active:translate-x-2">
                    {c.name}
                    <span className="text-accent">.</span>
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="flex items-center justify-between px-6 pb-6 font-mono text-[10px] tracking-[0.2em] text-muted">
              <a href={`mailto:${email}`} className="underline-offset-4 hover:text-paper">{email}</a>
              <a href={github} target="_blank" rel="noreferrer" className="hover:text-paper">GITHUB ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}
