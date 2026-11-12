import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowDown, FiArrowUpRight, FiMail } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import { EASE_OUT } from "../lib/motion";
import { useRef } from "react";

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

export default function Hero() {
  const { name, bio, email, photos, base } = portfolioData;
  const demoUrl = portfolioData.projects.find((p) => p.live)?.live;
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // The intro lets go as you scroll into the build
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY       = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0]);
  const portraitY   = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 70]);
  const cueOpacity  = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const first = name.split(" ")[0].toUpperCase();
  const last  = name.split(" ").slice(1).join(" ").toUpperCase();

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-16"
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
        style={{ background: "radial-gradient(closest-side, rgba(255,176,32,0.3), transparent)" }}
      />

      {/* Release strip */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 border-b border-paper/10 pb-3 font-mono text-[9px] tracking-[0.3em] text-muted sm:text-[10px]">
        <p className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-400" />
          OPEN TO OPPORTUNITIES
        </p>
        <p className="hidden sm:block">V0.9 — OPEN BETA</p>
        <p className="text-paper/40">{base.toUpperCase()}</p>
      </div>

      {/* Main composition */}
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 py-6 sm:gap-8 sm:py-8 lg:grid-cols-12 lg:gap-6">
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
            className="mt-5 font-mono text-[10px] tracking-[0.3em] text-accent sm:text-[11px]"
          >
            // AN ASPIRING FULL STACK DEVELOPER
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
            className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#work"
              className="group flex items-center gap-2 border border-accent bg-accent px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.22em] text-void transition-colors duration-200 hover:border-paper hover:bg-paper"
            >
              SEE THE WORK
              <FiArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-paper/25 px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.22em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                TRY UCONVERTIT
                <FiArrowUpRight size={14} />
              </a>
            )}
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            href={`mailto:${email}`}
            className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted transition-colors hover:text-accent sm:text-[11px]"
          >
            <FiMail size={13} /> {email}
          </motion.a>
        </motion.div>

        {/* Portrait — deliberately still: no hover tricks, just a builder */}
        <motion.div style={{ y: portraitY }} className="order-1 flex justify-center lg:order-2 lg:col-span-4">
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT }}
            className="relative"
          >
            {/* Soft glow behind the arch — ambience, not interactivity */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[115%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35"
              style={{ background: "radial-gradient(closest-side, rgba(143,132,255,0.35), transparent)" }}
            />
            <div
              className="relative w-40 overflow-hidden border border-accent/40 sm:w-52 lg:w-60 xl:w-64"
              style={{ borderRadius: "999px 999px 0 0", aspectRatio: "0.72" }}
            >
              <img
                src={photos.normal}
                alt={`${name} — portrait`}
                width={800}
                height={800}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,6,11,0.55) 100%)" }}
              />
            </div>
            <figcaption className="relative mt-4 text-center font-mono text-[9px] tracking-[0.35em] text-muted">
              FIG. 01 — THE BUILDER
            </figcaption>
          </motion.figure>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-muted">SCROLL</span>
        <span className="relative block h-9 w-px overflow-hidden bg-paper/10">
          <span className="cue-drop absolute left-0 top-0 block h-4 w-px bg-accent" />
        </span>
      </motion.div>
    </section>
  );
}
