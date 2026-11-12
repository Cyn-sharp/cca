import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiMail, FiArrowDown } from "react-icons/fi";
import { SiReact, SiJavascript, SiPython, SiFigma } from "react-icons/si";
import Typewriter from "../components/Typewriter";
import Magnetic from "../components/Magnetic";
import { useFinePointer } from "../hooks/useMediaQuery";
import { EASE_OUT, SPRING_POINTER } from "../lib/motion";

const roles = [
  "Aspiring Full Stack Developer",
  "Computer Engineering Student",
  "Hardworking",
  "Willing to Learn",
  "Problem Solver",
  "Coffee Powered",
];

// Small tech badges that orbit the photo
const orbitIcons = [
  { Icon: SiReact,      color: "#61DAFB", angle: 35  },
  { Icon: SiJavascript, color: "#F7DF1E", angle: 125 },
  { Icon: SiPython,     color: "#4B8BBE", angle: 215 },
  { Icon: SiFigma,      color: "#F24E1E", angle: 305 },
];

// A line of the headline that slides up from behind a mask on page load
function HeadlineLine({ children, delay }) {
  return (
    <span className="-my-[0.1em] block overflow-hidden py-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ onCoolHover }) {
  const { name, bio, github, email, photos } = portfolioData;
  const [hovered, setHovered] = useState(false);
  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const lastPointerType = useRef("mouse");
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  // ── Scroll-linked: the hero "lets go" as you scroll away from it ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY       = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduceMotion ? 1 : 0]);
  const photoY      = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 70]);
  const photoScale  = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.88]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 160]);
  const orbitCounter = useTransform(orbitRotate, (v) => -v);
  const cueOpacity  = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // ── Pointer-linked: the photo tilts towards the cursor ──
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-12, 12]), SPRING_POINTER);
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), SPRING_POINTER);

  const handlePointerMove = (e) => {
    if (!finePointer || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  // ── Cool mode ──
  const activateCoolMode = () => {
    setHovered(true);
    onCoolHover?.();

    // Play FAAHHH sound
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(`${import.meta.env.BASE_URL}fahhh.mp3`);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.log("Audio play prevented by browser:", err);
      });
    } catch (e) {
      console.log("Audio error", e);
    }
  };

  // Mouse: hover in / out. Touch + keyboard: tap / Enter toggles it.
  const handlePhotoClick = (e) => {
    const fromKeyboard = e.detail === 0;
    if (!fromKeyboard && lastPointerType.current === "mouse") return;
    if (hovered) setHovered(false);
    else activateCoolMode();
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className="relative z-10 flex min-h-screen items-center justify-center overflow-x-clip px-6 pb-28 pt-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-[auto,1fr] lg:gap-20 xl:gap-24">

          {/* LEFT — Photo with hover effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE_OUT }}
            className="order-2 flex justify-center lg:order-1 lg:pl-12"
          >
            <motion.div style={{ y: photoY, scale: photoScale }} className="relative">

              {/* Orbit ring — turns slowly on its own and faster as you scroll */}
              <div aria-hidden="true" className="orbit-spin pointer-events-none absolute -inset-9 sm:-inset-12">
                <motion.div
                  style={{ rotate: orbitRotate }}
                  className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-500 ${
                    hovered ? "border-accent/50" : "border-textWhite/15"
                  }`}
                >
                  {orbitIcons.map(({ Icon, color, angle }) => (
                    <div key={angle} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                      {/* counter-rotations keep each badge upright */}
                      <div
                        className="absolute left-1/2 top-0"
                        style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}
                      >
                        <motion.div style={{ rotate: orbitCounter }}>
                          <div className="orbit-spin-reverse grid h-9 w-9 place-items-center rounded-xl border border-textWhite/10 bg-surface shadow-lg shadow-black/40 sm:h-10 sm:w-10">
                            <Icon size={18} style={{ color }} />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
                className="relative"
              >
                <button
                  type="button"
                  aria-pressed={hovered}
                  aria-label="Toggle cool mode"
                  onPointerDown={(e) => { lastPointerType.current = e.pointerType; }}
                  onPointerEnter={(e) => {
                    lastPointerType.current = e.pointerType;
                    if (e.pointerType === "mouse") activateCoolMode();
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setHovered(false);
                  }}
                  onClick={handlePhotoClick}
                  className="group relative block cursor-pointer rounded-full"
                >
                  {/* Animated background halo */}
                  <span
                    className={`halo-spin absolute -inset-3 rounded-full blur-2xl transition-opacity duration-500 ${
                      hovered ? "opacity-80" : "opacity-40"
                    }`}
                    style={{
                      background:
                        "conic-gradient(from 0deg, #06B6D4, rgba(6,182,212,0.15), #F59E0B, rgba(245,158,11,0.15), #06B6D4)",
                    }}
                  />

                  {/* Photo container */}
                  <span
                    className={`relative block h-60 w-60 overflow-hidden rounded-full border-4 shadow-2xl transition-colors duration-500 sm:h-72 sm:w-72 lg:h-[22rem] lg:w-[22rem] ${
                      hovered ? "border-accent" : "border-primary/40"
                    }`}
                  >
                    {/* Normal photo */}
                    <motion.img
                      src={photos.normal}
                      alt={`${name} — portrait`}
                      width={800}
                      height={800}
                      animate={{
                        opacity: hovered ? 0 : 1,
                        scale:   hovered ? 0.95 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full object-cover bg-background"
                    />

                    {/* Cool photo (with shades) */}
                    <motion.img
                      src={photos.cool}
                      alt=""
                      width={800}
                      height={800}
                      initial={false}
                      animate={{
                        opacity: hovered ? 1 : 0,
                        scale:   hovered ? 1 : 1.1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full object-cover bg-background"
                    />
                  </span>

                  {/* Floating "hover me" hint */}
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: hovered ? 0 : 1,
                      y:       hovered ? 10 : 0,
                    }}
                    style={{ x: "-50%" }}
                    className="absolute -bottom-3 left-1/2 whitespace-nowrap px-4 py-2 rounded-full bg-background border border-primary/40 text-primary text-xs font-mono shadow-lg"
                  >
                    {finePointer ? "hover me" : "tap me"}
                  </motion.span>

                  {/* Cool mode badge */}
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: hovered ? 1 : 0,
                      y:       hovered ? 0 : 10,
                      rotate:  hovered ? [0, -5, 5, -5, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-2 -right-2 px-4 py-2 rounded-full bg-accent text-background text-xs font-black shadow-lg"
                  >
                    COOL MODE
                  </motion.span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* RIGHT — Text content */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="order-1 text-center lg:order-2 lg:text-left"
          >

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Open to opportunities
            </motion.div>

            {/* Name */}
            <h1 className="mb-6 font-display text-[clamp(3rem,8.5vw,5.75rem)] font-extrabold leading-[0.98] tracking-[-0.035em]">
              <HeadlineLine delay={0.2}>Hey, I'm</HeadlineLine>
              <HeadlineLine delay={0.32}>
                <span className="text-gradient">{name.split(" ")[0]}</span>
                <span className="text-accent">.</span>
              </HeadlineLine>
            </h1>

            {/* Typewriter Role */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE_OUT }}
              className="mb-6 flex min-h-[2.5rem] items-center justify-center text-lg font-bold text-textWhite/80 sm:text-xl md:text-2xl lg:justify-start lg:text-3xl"
            >
              <span className="mr-2 font-mono text-lg text-textWhite/40">{`{`}</span>
              <Typewriter
                words={roles}
                typingSpeed={90}
                deletingSpeed={50}
                pauseTime={1800}
                className="text-primary"
              />
              <span className="ml-2 font-mono text-lg text-textWhite/40">{`}`}</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: EASE_OUT }}
              className="mx-auto mb-9 max-w-xl text-base leading-relaxed text-textWhite/60 md:text-lg lg:mx-0"
            >
              {bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7, ease: EASE_OUT }}
              className="mb-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Magnetic>
                <a
                  href="#projects"
                  className="group flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-background transition-colors duration-200 hover:bg-cyan-300 glow-box"
                >
                  View My Work
                  <FiArrowDown className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-textWhite/20 bg-textWhite/[0.03] px-7 py-3.5 text-sm font-bold text-textWhite transition-colors duration-200 hover:border-primary hover:text-primary"
                >
                  <FiGithub /> GitHub
                </a>
              </Magnetic>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 font-mono text-xs text-textWhite/50 transition-colors hover:text-primary sm:text-sm"
              >
                <FiMail size={15} /> {email}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center"
      >
        <motion.div style={{ opacity: cueOpacity }} className="flex flex-col items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-textWhite/45">
            scroll
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-textWhite/15">
            <span className="cue-drop absolute left-0 top-0 block h-4 w-px bg-primary" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
