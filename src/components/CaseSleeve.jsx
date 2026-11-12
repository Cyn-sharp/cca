import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiFigma, FiGithub, FiX } from "react-icons/fi";
import ImageCarousel from "./ImageCarousel";
import { EASE_OUT } from "../lib/motion";

const pad = (n) => String(n).padStart(2, "0");
const windowTitle = (project) => {
  if (project.live) {
    try { return new URL(project.live).host; } catch { return project.title; }
  }
  return project.isFigmaProject ? `Figma — ${project.title}` : project.title;
};

// The "player" for a project — a full-screen case sleeve with two sides,
// like a record. SIDE A: the record (what it is, stack, links).
// SIDE B: the process (how it got made, step by step).
export default function CaseSleeve({
  project,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  triggerRef,
}) {
  const [side, setSide] = useState("A");
  const closeRef = useRef(null);

  // Focus the close button on open; hand focus back on close
  useEffect(() => {
    closeRef.current?.focus();
    const trigger = triggerRef?.current;
    return () => trigger?.focus?.();
  }, [triggerRef]);

  // New project loaded into the sleeve → reset to SIDE A
  const [lastProjectId, setLastProjectId] = useState(project.id);
  if (lastProjectId !== project.id) {
    setLastProjectId(project.id);
    setSide("A");
  }

  // Lock page scroll; Esc closes, Space flips sides, ←/→ switch project
  useEffect(() => {
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const tag = e.target?.tagName ?? "";
      const interactive = /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(tag) || e.target?.isContentEditable;
      if (interactive) return;
      if (e.key === " ") {
        e.preventDefault();
        setSide((s) => (s === "A" ? "B" : "A"));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext?.();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — case sleeve`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-void"
    >
      {/* Top strip */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-paper/10 bg-void px-4 sm:px-6">
        <p className="min-w-0 truncate font-mono text-[9px] tracking-[0.3em] text-muted sm:text-[10px]">
          <span className="text-accent">NOW SHOWING</span> — {project.title.toUpperCase()} · {index + 1}/{total}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-12 shrink-0 items-center gap-2 pl-4 font-mono text-[11px] font-bold tracking-[0.3em] text-paper transition-colors hover:text-accent"
        >
          CLOSE <FiX size={16} />
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-12">
        {/* Left — the cover */}
        <div>
          <div className="overflow-hidden border border-paper/10 bg-panel shadow-2xl shadow-black/60">
            <div className="flex items-center gap-2 border-b border-paper/10 px-4 py-2.5">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
              </span>
              <span className="min-w-0 flex-1 truncate text-center font-mono text-[10px] text-muted">
                {windowTitle(project)}
              </span>
              <span aria-hidden="true" className="w-10" />
            </div>
            <ImageCarousel images={project.images} alt={project.title} aspect="aspect-[16/10]" />
          </div>
          <p className="mt-4 font-mono text-[9px] tracking-[0.3em] text-muted/60">
            ARTWORK — {project.kind === "LIVE PROJECT" ? "PRODUCTION BUILD" : "INTERACTIVE PROTOTYPE"}
          </p>
        </div>

        {/* Right — the sleeve notes */}
        <div className="flex flex-col">
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-paper sm:text-6xl">
            {project.title}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-accent/90 sm:text-[11px]">
            {project.tagline.toUpperCase()}
          </p>

          {/* SIDE A / SIDE B */}
          <div className="mt-6 flex items-center gap-6 border-b border-paper/10 font-mono text-[11px] tracking-[0.3em]">
            {["A", "B"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                aria-pressed={side === s}
                className={`relative -mb-px border-b-2 pb-3 transition-colors duration-200 ${
                  side === s ? "border-accent text-accent" : "border-transparent text-muted hover:text-paper"
                }`}
              >
                SIDE {s}
              </button>
            ))}
            <span aria-hidden="true" className="ml-auto hidden pb-3 text-[9px] text-paper/30 sm:block">
              [SPACE] FLIPS THE SLEEVE
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {side === "A" ? (
              <motion.div
                key="side-a"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="pt-6"
              >
                <p className="font-mono text-[10px] tracking-[0.35em] text-muted">SIDE A — THE RECORD</p>
                <p className="mt-4 max-w-lg leading-relaxed text-paper/80">{project.description}</p>

                <dl className="mt-6">
                  {[
                    ["ROLE", project.role],
                    ["STACK", project.tech.join(" · ")],
                    ["KIND", project.kind],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-paper/[0.08] py-3 sm:grid-cols-[7rem_1fr]"
                    >
                      <dt className="font-mono text-[9px] leading-5 tracking-[0.3em] text-accent/80">{label}</dt>
                      <dd className="text-sm leading-5 text-paper/85">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer"
                       className="flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-void transition-colors hover:border-paper hover:bg-paper">
                      <FiExternalLink size={14} /> LIVE DEMO
                    </a>
                  )}
                  {project.figma && (
                    <a href={project.figma} target="_blank" rel="noreferrer"
                       className="flex items-center gap-2 border border-pink-400/60 bg-pink-500/90 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-white transition-colors hover:bg-pink-400">
                      <FiFigma size={14} /> OPEN IN FIGMA
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer"
                       className="flex items-center gap-2 border border-paper/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-paper transition-colors hover:border-accent hover:text-accent">
                      <FiGithub size={14} /> SOURCE
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="side-b"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="pt-6"
              >
                <p className="font-mono text-[10px] tracking-[0.35em] text-muted">SIDE B — THE PROCESS</p>
                <ol className="mt-5 max-w-lg">
                  {project.process.map((step, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-paper/[0.08] py-3.5"
                    >
                      <span className="font-mono text-xs leading-6 text-accent">{pad(i + 1)}</span>
                      <span className="text-sm leading-6 text-paper/85">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 font-mono text-[9px] tracking-[0.3em] text-muted/60">
                  MASTERED IN THE OPEN — {new Date().getFullYear()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prev / next project */}
          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.25em] text-muted transition-colors hover:text-accent"
            >
              <FiArrowLeft size={14} /> PREV
            </button>
            <span className="font-mono text-[10px] tabular-nums tracking-[0.35em] text-muted">
              {pad(index + 1)} / {pad(total)}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.25em] text-muted transition-colors hover:text-accent"
            >
              NEXT <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
