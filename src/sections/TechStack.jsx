import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import SectionHeading from "../components/SectionHeading";
import VelocityMarquee from "../components/VelocityMarquee";
import Reveal from "../components/Reveal";
import { useFinePointer } from "../hooks/useMediaQuery";
import { SPRING_SCROLL } from "../lib/motion";
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiSupabase,
  SiMysql,
  SiFigma,
} from "react-icons/si";

const stack = [
  { name: "React",      type: "icon", Icon: SiReact,      color: "#61DAFB" },
  { name: "JavaScript", type: "icon", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "C#",         type: "text", label: "C#",        color: "#9B59B6" },
  { name: "Python",     type: "icon", Icon: SiPython,     color: "#3776AB" },
  { name: "C",          type: "text", label: "C",         color: "#A8B9CC" },
  { name: "Supabase",   type: "icon", Icon: SiSupabase,   color: "#3ECF8E" },
  { name: "MySQL",      type: "icon", Icon: SiMysql,      color: "#4479A1" },
  { name: "Figma",      type: "icon", Icon: SiFigma,      color: "#F24E1E" },
];

// Single tech item for marquee
const TechItem = ({ tech }) => (
  <div className="flex items-center gap-3 px-6 py-5 whitespace-nowrap sm:px-8">
    {tech.type === "icon" ? (
      <>
        <tech.Icon size={32} style={{ color: tech.color }} aria-hidden="true" />
        <span className="font-display text-2xl font-bold text-textWhite/85 sm:text-3xl">
          {tech.name}
        </span>
      </>
    ) : (
      // C and C# have no logo icon — their name is the mark
      <span
        style={{ color: tech.color }}
        className="font-display text-2xl font-extrabold sm:text-3xl"
      >
        {tech.label}
      </span>
    )}
    <span aria-hidden="true" className="ml-8 h-1.5 w-1.5 rotate-45 bg-primary/50 sm:ml-12" />
  </div>
);

// Deterministic "random" number 0–1 for a pill, so the scatter is the same every render
const scatter = (index, salt) => {
  const n = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

// A pill that starts scattered and snaps into the grid as you scroll to it
function ExploredPill({ tech, index, progress, animated }) {
  const fromX      = (scatter(index, 1) - 0.5) * 260;
  const fromY      = 50 + scatter(index, 2) * 130;
  const fromRotate = (scatter(index, 3) - 0.5) * 60;

  const x       = useTransform(progress, [0, 1], [animated ? fromX : 0, 0]);
  const y       = useTransform(progress, [0, 1], [animated ? fromY : 0, 0]);
  const rotate  = useTransform(progress, [0, 1], [animated ? fromRotate : 0, 0]);
  const opacity = useTransform(progress, [0, 0.55], [animated ? 0 : 1, 1]);

  return (
    <motion.li style={{ x, y, rotate, opacity }}>
      <motion.span
        whileHover={{
          scale: 1.1,
          backgroundColor: "rgba(6, 182, 212, 0.15)",
          borderColor: "rgba(6, 182, 212, 0.6)",
        }}
        className="block px-4 py-2 rounded-full border border-textWhite/15 bg-surface text-textWhite/75 text-sm font-medium cursor-default"
      >
        {tech}
      </motion.span>
    </motion.li>
  );
}

export default function TechStack() {
  const { exploredTech } = portfolioData;
  const pillsRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();

  const { scrollYProgress } = useScroll({
    target: pillsRef,
    offset: ["start 0.95", "start 0.45"],
  });
  const assemble = useSpring(scrollYProgress, SPRING_SCROLL);

  return (
    <section id="stack" className="relative z-10 overflow-x-clip pb-24 pt-8">

      {/* ── TOP — Core Tech Stack ──────────────────── */}
      <div className="mx-auto mb-14 max-w-6xl px-6">
        <SectionHeading index="02" label="tech stack" title="What I work with">
          The tools I use to bring ideas to life ⚡
          <span className="mt-1 block font-mono text-xs text-primary/70">
            {finePointer
              ? "(scroll to speed it up · hover to pause)"
              : "(scroll to speed it up)"}
          </span>
        </SectionHeading>
      </div>

      {/* Marquee row — reacts to scroll speed, pauses on hover */}
      <Reveal y={0} amount={0.2}>
        <VelocityMarquee className="mask-fade-x border-y border-primary/20 bg-primary/5 py-1">
          {stack.map((tech) => (
            <TechItem key={tech.name} tech={tech} />
          ))}
        </VelocityMarquee>
      </Reveal>

      {/* ── BOTTOM — Also Explored ──────────────────── */}
      <div className="mx-auto mt-28 max-w-5xl px-6 md:mt-36">
        <SectionHeading
          as="h3"
          size="md"
          label="also explored"
          labelClass="text-accent"
          title="Tried & explored"
          markClass="text-primary"
        >
          <span className="mx-auto block max-w-xl">
            Not mastered (yet 😅) — but I've experimented with these and I'm
            always open to learning more.
          </span>
        </SectionHeading>

        {/* Pills grid */}
        <ul ref={pillsRef} className="mt-12 flex flex-wrap justify-center gap-3">
          {exploredTech.map((tech, i) => (
            <ExploredPill
              key={tech}
              tech={tech}
              index={i}
              progress={assemble}
              animated={!reduceMotion}
            />
          ))}
        </ul>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 text-textWhite/40 font-mono text-xs"
        >
          + always learning more 🚀
        </motion.p>
      </div>
    </section>
  );
}
