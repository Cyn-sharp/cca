import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { FiGithub, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";
import { portfolioData } from "../data/portfolioData";
import { useActiveSection } from "../hooks/useActiveSection";
import { EASE_OUT, SPRING_SCROLL } from "../lib/motion";
import { CHAPTERS } from "../lib/chapters";

const sectionIds = CHAPTERS.map((c) => c.id);

// Seconds-ticking terminal clock
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// A single slim bar. No bottom dock — the page is the interface.
export default function Hud() {
  const { github, email } = portfolioData;
  const active = useActiveSection(sectionIds);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING_SCROLL);

  const [menuOpen, setMenuOpen] = useState(false);
  const clock = useClock();

  // Escape closes the menu; page scroll locks while it's open
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
      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="flex h-14 items-center justify-between border-b border-paper/[0.07] bg-background/75 px-4 backdrop-blur-md sm:px-6">
          {/* Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.22em] text-paper transition-colors hover:text-accent"
            aria-label="Cyndrick Abejo — back to the intro"
          >
            CYNDRICK.ABEJO
            <sup className="text-[8px] font-normal text-accent">v0.9</sup>
          </a>

          {/* Chapter nav */}
          <nav aria-label="Chapters" className="hidden items-center gap-4 lg:flex xl:gap-6">
            {CHAPTERS.map((c) => {
              const isActive = active === c.id;
              return (
                <a
                  key={c.id}
                  href={c.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-1 font-mono text-[10px] tracking-[0.25em] transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-muted hover:text-paper"
                  }`}
                >
                  <span className="mr-1 text-[8px] opacity-60">{c.page}</span>
                  {c.name}
                  {isActive && (
                    <motion.span
                      layoutId="hud-active"
                      className="absolute -bottom-[1px] left-0 right-0 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Clock + status + menu */}
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted md:flex" aria-hidden="true">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="tabular-nums text-paper/70">{clock}</span>
            </span>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hidden text-muted transition-colors hover:text-paper md:block"
            >
              <FiGithub size={16} />
            </a>
            {/* Skip to the work — straight to the goods */}
            <a
              href="#work"
              className="hidden border border-paper/20 px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.25em] text-paper transition-colors hover:border-accent hover:text-accent sm:block"
            >
              SKIP TO THE WORK
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-paper lg:hidden"
            >
              MENU
              <span aria-hidden="true" className="flex flex-col gap-1">
                <span className="h-px w-5 bg-paper" />
                <span className="h-px w-5 bg-paper" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen menu (mobile / tablet) — portaled so it clears everything */}
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
              className="fixed inset-0 z-[70] flex flex-col bg-void"
            >
              <div className="flex h-14 items-center justify-between border-b border-paper/[0.07] px-4">
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted">V0.9 — MENU</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  autoFocus
                  className="grid h-12 w-12 place-items-center text-paper transition-colors hover:text-accent"
                >
                  <FiX size={22} />
                </button>
              </div>
              <nav aria-label="Chapters" className="flex flex-1 flex-col justify-center overflow-y-auto px-6">
                {CHAPTERS.map((c, i) => (
                  <motion.a
                    key={c.id}
                    href={c.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: EASE_OUT }}
                    className="flex items-baseline gap-5 border-b border-paper/[0.07] py-4"
                  >
                    <span className="font-mono text-xs text-accent">{c.page}</span>
                    <span className="font-display text-4xl font-extrabold tracking-tight text-paper">
                      {c.name}
                      <span className="text-accent">.</span>
                    </span>
                  </motion.a>
                ))}
              </nav>
              <div className="flex items-center justify-between gap-4 px-6 pb-6 font-mono text-[9px] tracking-[0.2em] text-muted">
                <a href={`mailto:${email}`} className="min-w-0 truncate hover:text-paper">{email}</a>
                <a href={github} target="_blank" rel="noreferrer" className="shrink-0 hover:text-paper">GITHUB ↗</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
