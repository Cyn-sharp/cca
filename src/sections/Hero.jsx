import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiGithub, FiMail, FiArrowDown } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import { useFinePointer } from "../hooks/useMediaQuery";
import { EASE_OUT } from "../lib/motion";

// A line of the headline that rises into view on load
function HeadlineLine({ children, delay }) {
  return (
    <span className="-my-[0.08em] block overflow-hidden py-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "112%", rotate: 2 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ onCoolHover }) {
  const { name, bio, github, email, photos, base } = portfolioData;
  const [hovered, setHovered] = useState(false); // cool mode
  const audioRef = useRef(null);
  const lastPointerType = useRef("mouse");
  const sectionRef = useRef(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  // The hero lets go as you scroll into the console
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY       = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0]);
  const portraitY   = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const cueOpacity  = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const activateCoolMode = () => {
    setHovered(true);
    onCoolHover?.();
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(`${import.meta.env.BASE_URL}fahhh.mp3`);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      // no audio — cool mode still works visually
    }
  };

  const handlePortraitClick = (e) => {
    const fromKeyboard = e.detail === 0;
    if (!fromKeyboard && lastPointerType.current === "mouse") return;
    if (hovered) setHovered(false);
    else activateCoolMode();
  };

  const first = name.split(" ")[0].toUpperCase();
  const last  = name.split(" ").slice(1).join(" ").toUpperCase();

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-16 sm:pt-16"
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-20%] h-[34rem] w-[34rem] rounded-full opacity-25"
        style={{ background: "radial-gradient(closest-side, rgba(143,132,255,0.4), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-[-15%] h-[30rem] w-[30rem] rounded-full opacity-15"
        style={{ background: "radial-gradient(closest-side, rgba(255,176,32,0.35), transparent)" }}
      />

      {/* Spec strip */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 border-b border-paper/10 pb-4 font-mono text-[9px] tracking-[0.28em] text-muted sm:text-[10px]">
        <p className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" />
          OPEN TO OPPORTUNITIES
        </p>
        <p className="hidden sm:block">PORTFOLIO_V2 — REV 2026.11</p>
        <p className="text-paper/40">{base.toUpperCase()}</p>
      </div>

      {/* Main composition */}
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 py-6 sm:gap-8 sm:py-10 lg:grid-cols-12 lg:gap-6">
        {/* Name + CTAs */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="order-2 text-center lg:order-1 lg:col-span-8 lg:text-left"
        >
          <h1
            aria-label={name}
            className="font-display font-extrabold leading-[0.92] tracking-[-0.035em]"
          >
            <HeadlineLine delay={0.1}>
              <span className="text-[clamp(3.9rem,15.5vw,9.5rem)] text-paper">{first}</span>
            </HeadlineLine>
            <HeadlineLine delay={0.22}>
              <span aria-hidden="true" className="text-outline text-[clamp(3.9rem,15.5vw,9.5rem)]">
                {last}<span className="text-accent" style={{ WebkitTextStroke: "0px" }}>.</span>
              </span>
            </HeadlineLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE_OUT }}
            className="mt-6 font-mono text-[10px] tracking-[0.3em] text-accent sm:text-xs"
          >
            // COMPUTER ENGINEERING — ASPIRING FULL STACK DEVELOPER
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.6, ease: EASE_OUT }}
            className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted lg:mx-0"
          >
            {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64, duration: 0.6, ease: EASE_OUT }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 border border-accent bg-accent px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.22em] text-void transition-colors duration-200 hover:bg-paper hover:border-paper"
            >
              VIEW THE WORK
              <FiArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-paper/20 px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.22em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <FiGithub size={15} /> GITHUB
            </a>
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            href={`mailto:${email}`}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted transition-colors hover:text-accent sm:text-[11px]"
          >
            <FiMail size={13} /> {email}
          </motion.a>
        </motion.div>

        {/* Portrait — arch framed, tap for cool mode */}
        <motion.div style={{ y: portraitY }} className="order-1 flex justify-center lg:order-2 lg:col-span-4">
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: EASE_OUT }}
            className="relative"
          >
            <button
              type="button"
              onPointerDown={(e) => { lastPointerType.current = e.pointerType; }}
              onPointerEnter={(e) => {
                lastPointerType.current = e.pointerType;
                if (e.pointerType === "mouse") activateCoolMode();
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setHovered(false);
              }}
              onClick={handlePortraitClick}
              aria-pressed={hovered}
              aria-label="Toggle cool mode"
              className="group relative block cursor-pointer"
            >
              {/* Arch frame */}
              <div
                className={`relative w-40 overflow-hidden border transition-colors duration-500 sm:w-56 lg:w-64 xl:w-72 ${
                  hovered ? "border-signal/70" : "border-accent/40"
                }`}
                style={{ borderRadius: "999px 999px 0 0", aspectRatio: "0.72" }}
              >
                <img
                  src={photos.normal}
                  alt={`${name} — portrait`}
                  width={800}
                  height={800}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    hovered ? "scale-95 opacity-0" : "scale-100 opacity-100"
                  }`}
                />
                <img
                  src={photos.cool}
                  alt=""
                  width={800}
                  height={800}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                    hovered ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                />
                {/* Violet wash at the base of the arch */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,6,11,0.55) 100%)" }}
                />
              </div>

              {/* Caption plate */}
              <figcaption className="mt-4 text-center font-mono text-[9px] tracking-[0.3em] text-muted">
                FIG. 01 — THE ENGINEER
                <span className="mt-1 block text-[8px] text-paper/30">
                  {hovered ? "COOL MODE: ENGAGED" : finePointer ? "( HOVER THE PORTRAIT )" : "( TAP THE PORTRAIT )"}
                </span>
              </figcaption>

              {/* Cool mode stamp */}
              {hovered && (
                <span className="absolute -right-2 top-6 rotate-6 border border-signal bg-signal px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-void shadow-lg">
                  COOL MODE
                </span>
              )}
            </button>
          </motion.figure>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute bottom-14 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-muted">SCROLL</span>
        <span className="relative block h-9 w-px overflow-hidden bg-paper/10">
          <span className="cue-drop absolute left-0 top-0 block h-4 w-px bg-accent" />
        </span>
      </motion.div>
    </section>
  );
}
