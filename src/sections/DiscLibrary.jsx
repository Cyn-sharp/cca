import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiFigma, FiGithub, FiX } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import ImageCarousel from "../components/ImageCarousel";
import ModuleHeading from "../components/ModuleHeading";
import { useFinePointer } from "../hooks/useMediaQuery";
import { EASE_OUT } from "../lib/motion";

const MONO = "'JetBrains Mono Variable', ui-monospace, monospace";
const pad = (n) => String(n).padStart(2, "0");
const windowTitle = (project) => {
  if (project.live) {
    try { return new URL(project.live).host; } catch { return project.title; }
  }
  return project.isFigmaProject ? `Figma — ${project.title}` : project.title;
};

// ── The disc itself — layered CSS gradients + SVG label type ────────────────
function Disc({ project, index }) {
  const rim = `${project.title.toUpperCase()} — ${project.tagline.toUpperCase()} — `.repeat(4);
  return (
    <div className="relative aspect-square w-[min(76vw,280px)] select-none sm:w-[min(58vw,340px)] lg:w-[min(34vw,400px)]">
      {/* Base, sheen and grooves */}
      <div className="disc-base absolute inset-0 rounded-full" />
      <div className="disc-sheen absolute inset-0 rounded-full" />
      <div className="disc-grooves absolute inset-0 rounded-full" />

      {/* Rotating outer-rim label */}
      <svg viewBox="0 0 100 100" aria-hidden="true" className="disc-rim-text absolute inset-0 h-full w-full">
        <defs>
          <path id={`rim-${project.id}`} d="M 50,50 m 0,-40.2 a 40.2,40.2 0 1,1 -0.01,0" fill="none" />
        </defs>
        <text fontSize="4.9" letterSpacing="1.2" fill="rgba(237,237,242,0.66)" fontFamily={MONO} fontWeight="600">
          <textPath href={`#rim-${project.id}`} textLength="252" lengthAdjust="spacingAndGlyphs">
            {rim}
          </textPath>
        </text>
      </svg>

      {/* Static hub-ring label */}
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <defs>
          <path id={`hub-${project.id}`} d="M 50,50 m 0,-13.6 a 13.6,13.6 0 1,1 -0.01,0" fill="none" />
        </defs>
        <text fontSize="3.05" letterSpacing="0.4" fill="rgba(143,132,255,0.9)" fontFamily={MONO} fontWeight="700">
          <textPath href={`#hub-${project.id}`} textLength="85" lengthAdjust="spacingAndGlyphs">
            {"CCA RECORDS · SIDE A · ORIGINAL WORK · "}
          </textPath>
        </text>
      </svg>

      {/* Hub */}
      <div
        className="absolute rounded-full border border-paper/10"
        style={{
          inset: "31%",
          background: "radial-gradient(circle at 50% 38%, #1D1D29, #12121A 72%)",
        }}
      />
      {/* Center hole with the catalog number */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-full border border-accent/30"
        style={{
          inset: "41%",
          background: "#05050A",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.9)",
        }}
      >
        <span className="font-display text-2xl font-extrabold leading-none text-accent sm:text-3xl lg:text-4xl">
          {pad(index + 1)}
        </span>
      </div>
    </div>
  );
}

// Disc switch variants — slides and spins like one being swapped on a turntable
const discVariants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 220 : -220, rotate: dir >= 0 ? 55 : -55, scale: 0.82 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1 },
  exit:   (dir) => ({ opacity: 0, x: dir >= 0 ? -220 : 220, rotate: dir >= 0 ? -55 : 55, scale: 0.82 }),
};

// ── The case sleeve overlay — a full-screen "now spinning" spread ────────────
function CaseSleeve({ project, index, total, onClose, triggerRef }) {
  const [side, setSide] = useState("A");
  const closeRef = useRef(null);

  // Focus the close button on open; give focus back to the trigger on close
  useEffect(() => {
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => trigger?.focus?.();
  }, [triggerRef]);

  // Lock page scroll; wire Space = flip side, Escape = close
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
      const interactive = /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(tag);
      if (e.key === " " && !interactive) {
        e.preventDefault();
        setSide((s) => (s === "A" ? "B" : "A"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      key="sleeve"
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
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-paper/10 bg-void/80 px-4 backdrop-blur sm:px-6">
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted">
          <span className="text-accent">NOW SPINNING</span> — {project.title.toUpperCase()}, {index + 1} OF {total}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-paper transition-colors hover:text-accent"
        >
          CLOSE <FiX size={16} />
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-12">
        {/* Left — the cover / screenshots in a window frame */}
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
          <h3 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-paper sm:text-6xl">
            {project.title}
            <span className="text-accent">.</span>
          </h3>
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-accent/90 sm:text-[11px]">
            {project.tagline.toUpperCase()}
          </p>

          {/* SIDE A / SIDE B toggle — the flip side of the record */}
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
              [SPACE] FLIPS THE DISC
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

                {/* Track listing — the links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer"
                       className="flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-void transition-colors hover:bg-paper hover:border-paper">
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
                  MASTERED BY CCA RECORDS — {new Date().getFullYear()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── The library shelf ─────────────────────────────────────────────────────────
export default function DiscLibrary() {
  const { projects } = portfolioData;
  const finePointer = useFinePointer();
  const total = projects.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sleeveOpen, setSleeveOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const openButtonRef = useRef(null);
  const swipeStart = useRef(null);
  const swipeLock = useRef(0);

  const project = projects[index];
  const go = useCallback(
    (dir) => {
      setDirection(dir);
      setIndex((i) => (i + dir + total) % total);
    },
    [total]
  );
  const openSleeve = useCallback(() => setSleeveOpen(true), []);
  const handleDiscPointerDown = useCallback((e) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  }, []);
  const handleDiscPointerUp = useCallback((e) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // a horizontal flick swaps discs instead of opening the sleeve
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipeLock.current = Date.now();
      go(dx < 0 ? 1 : -1);
    }
  }, [go]);
  const handleDiscClick = useCallback(() => {
    if (Date.now() - swipeLock.current < 350) return;
    setSleeveOpen(true);
  }, []);
  const closeSleeve = useCallback(() => setSleeveOpen(false), []);

  // Arrow keys browse when the library is on screen; Enter opens the sleeve
  useEffect(() => {
    const onKey = (e) => {
      if (sleeveOpen) return; // sleeve handles its own keys
      const tag = e.target?.tagName ?? "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || e.target?.isContentEditable) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      // Arrow keys browse the shelf even from a focused button — Enter doesn't,
      // since Enter already activates buttons/links.
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "Enter" && !/^(BUTTON|A)$/.test(tag)) { e.preventDefault(); setSleeveOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, sleeveOpen]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Selected work — the disc library"
      className="relative z-10 overflow-hidden px-4 py-14 sm:px-6 sm:py-16"
    >
      {/* Giant ghost catalog number behind everything */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-8 select-none font-display text-[9rem] font-extrabold leading-none text-paper/[0.04] sm:text-[13rem] lg:text-[16rem]"
      >
        {pad(index + 1)}
      </span>

      <div className="relative mx-auto max-w-6xl">
        <ModuleHeading
          chapter="004"
          label="SELECTED WORK"
          code="CCA://MOUNT /WORK"
          title="THE LIBRARY"
        >
          Every disc is a real build. Flip through the shelf —
          <span className="font-mono text-[10px] tracking-[0.25em] text-muted/80">
            {" "}{finePointer ? "[←] [→] BROWSE · [ENTER] OPEN" : "SWIPE THE DISC OR USE THE ARROWS"}{" "}
          </span>
        </ModuleHeading>

        <div className="mt-8 grid items-center gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-8">
          {/* Left — the track notes */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className="font-mono text-[10px] tracking-[0.35em] text-muted">
              <span className="text-accent">{project.title.toUpperCase()}</span>, {index + 1} OF {total}
            </p>

            <h3 className="mt-3 font-display text-6xl font-extrabold leading-[0.95] tracking-[-0.03em] text-paper sm:text-7xl">
              {project.title}
            </h3>
            <p className="mt-3 font-mono text-[10px] tracking-[0.22em] text-accent sm:text-[11px]">
              {project.tagline.toUpperCase()}
            </p>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">{project.description}</p>

            {/* Spec rows */}
            <dl className="mt-5 max-w-md">
              {[
                ["ROLE", project.role],
                ["STACK", project.tech.join(" · ")],
                ["KIND", project.kind],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-paper/[0.08] py-2.5 sm:grid-cols-[6.5rem_1fr]"
                >
                  <dt className="font-mono text-[9px] leading-5 tracking-[0.3em] text-accent/80">{label}</dt>
                  <dd className="text-[13px] leading-5 text-paper/85">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                ref={openButtonRef}
                type="button"
                onClick={openSleeve}
                className="border border-accent bg-accent px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.25em] text-void transition-colors duration-200 hover:border-paper hover:bg-paper"
              >
                OPEN DISC
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous disc"
                  className="grid h-12 w-12 place-items-center border border-paper/20 text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <FiArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next disc"
                  className="grid h-12 w-12 place-items-center border border-paper/20 text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right — the shelf */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleDiscClick}
                onPointerDown={handleDiscPointerDown}
                onPointerUp={handleDiscPointerUp}
                aria-label={`Open the ${project.title} disc`}
                className="group cursor-pointer touch-pan-y outline-offset-8"
              >
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={project.id}
                    custom={direction}
                    variants={reduceMotion ? undefined : discVariants}
                    initial={reduceMotion ? { opacity: 0 } : "enter"}
                    animate={reduceMotion ? { opacity: 1 } : "center"}
                    exit={reduceMotion ? { opacity: 0 } : "exit"}
                    transition={{ type: "spring", stiffness: 210, damping: 26 }}
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                  >
                    <Disc project={project} index={index} />
                  </motion.div>
                </AnimatePresence>
              </button>

              <p className="mt-6 font-mono text-[9px] tracking-[0.4em] text-muted">
                CCA RECORDS — SIDE A
              </p>

              {/* The next disc, being mastered */}
              <div
                aria-hidden="true"
                className="mt-6 flex items-center gap-4 border border-dashed border-paper/15 px-5 py-3 text-muted/70"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-paper/20 font-mono text-sm">+</span>
                <span className="font-mono text-[9px] leading-relaxed tracking-[0.22em]">
                  SIDE C — IN THE VAULT<br />
                  <span className="text-paper/30">THE NEXT DISC IS STILL MASTERING</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The case sleeve overlay — portaled to body so it clears the HUD */}
      {createPortal(
        <AnimatePresence>
          {sleeveOpen && (
            <CaseSleeve
              key="sleeve"
              project={project}
              index={index}
              total={total}
              onClose={closeSleeve}
              triggerRef={openButtonRef}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
