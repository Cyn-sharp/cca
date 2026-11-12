import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { EASE_OUT } from "../lib/motion";

// skhiladze.com-style entry gate, reimagined for an engineer:
// the portfolio as a product in open beta. Sound is one fahhh — his call,
// kept loud and proud. Motion can be switched off here, or obeys the
// system's reduced-motion setting by default.
export default function Gate({ onEnter }) {
  const [motionPref, setMotionPref] = useState(() => {
    try {
      return window.sessionStorage.getItem("cca-motion") ?? "on";
    } catch {
      return "on";
    }
  });
  const [visible, setVisible] = useState(() => {
    try {
      return window.sessionStorage.getItem("cca-gate-v1") !== "1";
    } catch {
      return true;
    }
  });

  // Lock page scroll while the gate is up
  useEffect(() => {
    if (!visible) return;
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = original;
    };
  }, [visible]);

  const toggleMotion = useCallback(() => {
    setMotionPref((prev) => {
      const next = prev === "on" ? "off" : "on";
      try {
        window.sessionStorage.setItem("cca-motion", next);
      } catch {
        // private mode — fine, it just won't persist
      }
      document.documentElement.dataset.motion = next;
      return next;
    });
  }, []);

  const enter = useCallback(
    (withSound) => {
      if (withSound) {
        try {
          const audio = new Audio(`${import.meta.env.BASE_URL}fahhh.mp3`);
          audio.volume = 0.85;
          audio.play().catch(() => {});
        } catch {
          // autoplay restrictions — the site still works silently
        }
      }
      try {
        window.sessionStorage.setItem("cca-gate-v1", "1");
      } catch {
        // see above
      }
      setVisible(false);
      onEnter?.({ sound: withSound, motion: motionPref });
    },
    [motionPref, onEnter]
  );

  // Escape slips in quietly
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "Escape") enter(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, enter]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gate"
          role="dialog"
          aria-modal="true"
          aria-label="Enter the portfolio"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE_OUT } }}
          className="bg-blueprint fixed inset-0 z-[100] flex flex-col justify-between bg-void px-5 py-5 sm:px-8 sm:py-6"
        >
          {/* Top strip */}
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-muted sm:text-[11px]">
            <span>CYNDRICK.ABEJO</span>
            <span className="hidden sm:inline">OPEN_BETA.EXE</span>
            <span className="text-accent">V0.9</span>
          </div>

          {/* Center */}
          <div className="flex flex-col items-center px-2 text-center">
            <p className="font-mono text-[10px] tracking-[0.4em] text-muted sm:text-[11px]">
              YOU ARE ENTERING
            </p>
            <h1 className="mt-3 font-display text-[clamp(3.75rem,17vw,10rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-paper">
              OPEN<br />
              BETA<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Cyndrick Abejo — an aspiring full stack developer, currently in
              Computer Engineering. Real projects, real bugs, fixed.
            </p>

            {/* The two doors in */}
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => enter(true)}
                autoFocus
                className="border border-accent bg-accent px-6 py-4 font-mono text-[11px] font-bold tracking-[0.25em] text-void transition-colors duration-200 hover:border-paper hover:bg-paper"
              >
                ENTER WITH SOUND
              </button>
              <button
                type="button"
                onClick={() => enter(false)}
                className="border border-paper/25 px-6 py-4 font-mono text-[11px] font-bold tracking-[0.25em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                WITHOUT SOUND
              </button>
            </div>

            {/* Motion preference */}
            <div className="mt-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-muted">
              <span>MOTION</span>
              <button
                type="button"
                onClick={toggleMotion}
                aria-pressed={motionPref === "on"}
                className="flex items-center gap-2 border border-paper/15 px-3 py-2 text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${motionPref === "on" ? "bg-green-400" : "bg-paper/30"}`}
                />
                {motionPref === "on" ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.3em] text-muted sm:text-[10px]">
            <span>{portfolioData.base.toUpperCase()}</span>
            <span className="hidden text-paper/30 md:inline">ONE SOUND, THAT'S THE WHOLE DEAL</span>
            <span>ESC = SLIP IN QUIETLY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
