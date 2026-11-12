import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";

// The console boots, shows a percentage and a path readout, then hands
// over to the site. Runs once per browser tab session.
const BOOT_LINES = [
  { at: 0,   text: "CCA://BOOT_SEQUENCE --verbose" },
  { at: 18,  text: "CCA://LOADING_MODULES identity profile toolkit" },
  { at: 42,  text: "CCA://MOUNTING /work --format=disc" },
  { at: 66,  text: "CCA://CHECKING vitals … OK" },
  { at: 85,  text: "CCA://RENDERING portfolio_v2 … OK" },
  { at: 100, text: "CCA://WELCOME — CYNDRICK ABEJO" },
];

const lineFor = (p) => {
  let current = BOOT_LINES[0].text;
  for (const line of BOOT_LINES) if (p >= line.at) current = line.text;
  return current;
};

export default function BootLoader() {
  const reduceMotion = useReducedMotion();
  const [alreadyBooted] = useState(() => {
    try {
      return window.sessionStorage.getItem("cca-booted") === "1";
    } catch {
      return false;
    }
  });
  const [progress, setProgress] = useState(reduceMotion ? 100 : 0);
  const [done, setDone] = useState(alreadyBooted);
  const progressRef = useRef(reduceMotion ? 100 : 0);

  // Drive the counter with a fake-but-convincing easing (fast, then slow crawl)
  useEffect(() => {
    if (alreadyBooted || reduceMotion) {
      const t = setTimeout(() => setDone(true), reduceMotion ? 0 : 350);
      return () => clearTimeout(t);
    }

    let raf;
    let start;
    const DURATION = 2100;
    const tick = (now) => {
      if (start === undefined) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      // easeOutExpo-ish curve with a little stutter so it feels like real I/O
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -9 * t);
      const jitter = t < 1 ? Math.sin(now / 90) * 0.6 : 0;
      const value = Math.max(0, Math.min(100, eased * 100 + jitter));
      progressRef.current = value;
      setProgress(value);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 420);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [alreadyBooted, reduceMotion]);

  useEffect(() => {
    if (!done) return;
    try {
      window.sessionStorage.setItem("cca-booted", "1");
    } catch {
      // private mode — boot again next time, no harm
    }
  }, [done]);

  // Lock page scroll while the boot screen is up
  useEffect(() => {
    if (done) return;
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = original;
    };
  }, [done]);

  const shown = Math.floor(progress);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          role="status"
          aria-label="Loading portfolio"
          exit={{ opacity: 0, y: -24, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          onClick={() => setDone(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") setDone(true);
          }}
          tabIndex={0}
          className="bg-blueprint fixed inset-0 z-[100] flex cursor-pointer flex-col justify-between bg-void px-5 py-5 outline-none sm:px-8 sm:py-6"
        >
          {/* Top strip */}
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-muted sm:text-[11px]">
            <span>CCA://SECURE_BOOT</span>
            <span className="hidden sm:inline">REV 2026.11</span>
            <span>MEM 640K OK</span>
          </div>

          {/* Center readout */}
          <div className="flex flex-col items-center">
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent">
              CYNDRICK ABEJO
            </p>
            <p
              aria-hidden="true"
              className="mt-2 font-display text-[clamp(4.5rem,22vw,10rem)] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-paper"
            >
              {shown}
              <span className="text-accent">%</span>
            </p>

            {/* Progress rail with a scanning highlight */}
            <div className="relative mt-6 h-px w-56 overflow-hidden bg-paper/15 sm:w-80">
              <div
                className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div className="boot-scan absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-paper/70 to-transparent" />
            </div>

            {/* Path readout */}
            <p className="mt-5 h-5 font-mono text-[10px] tracking-[0.18em] text-muted sm:text-xs">
              {lineFor(shown)}
              <span className="animate-pulse">_</span>
            </p>
          </div>

          {/* Bottom strip */}
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-muted sm:text-[11px]">
            <span>LOC — {portfolioData.base.toUpperCase()}</span>
            <span className="text-paper/50">CLICK TO SKIP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
