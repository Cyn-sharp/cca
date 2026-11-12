import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiSupabase,
  SiMysql,
  SiFigma,
} from "react-icons/si";
import { portfolioData } from "../data/portfolioData";
import ModuleHeading from "../components/ModuleHeading";
import VelocityMarquee from "../components/VelocityMarquee";
import { useFinePointer } from "../hooks/useMediaQuery";
import { SPRING_SCROLL } from "../lib/motion";

// Core stack — shown as a datasheet table, not cards
const stack = [
  { name: "React",      kind: "FRAMEWORK", type: "icon", Icon: SiReact,      color: "#61DAFB" },
  { name: "JavaScript", kind: "LANGUAGE",  type: "icon", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Python",     kind: "LANGUAGE",  type: "icon", Icon: SiPython,     color: "#3776AB" },
  { name: "C#",         kind: "LANGUAGE",  type: "text", label: "C#",        color: "#9B59B6" },
  { name: "C",          kind: "LANGUAGE",  type: "text", label: "C",         color: "#A8B9CC" },
  { name: "Supabase",   kind: "BACKEND",   type: "icon", Icon: SiSupabase,   color: "#3ECF8E" },
  { name: "MySQL",      kind: "DATABASE",  type: "icon", Icon: SiMysql,      color: "#4479A1" },
  { name: "Figma",      kind: "DESIGN",    type: "icon", Icon: SiFigma,      color: "#F24E1E" },
];

const TechItem = ({ tech }) => (
  <div className="flex items-center gap-3 px-7 py-4 whitespace-nowrap sm:px-9">
    {tech.type === "icon" ? (
      <tech.Icon size={26} style={{ color: tech.color }} aria-hidden="true" />
    ) : (
      <span style={{ color: tech.color }} className="font-display text-xl font-extrabold sm:text-2xl">
        {tech.label}
      </span>
    )}
    {tech.type !== "text" && (
      <span className="font-display text-xl font-bold text-paper/80 sm:text-2xl">{tech.name}</span>
    )}
    <span aria-hidden="true" className="ml-7 font-mono text-accent/60 sm:ml-9">+</span>
  </div>
);

// Deterministic pseudo-random 0–1 so the scatter is identical every render
const scatter = (index, salt) => {
  const n = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

// A pill that starts scattered and snaps into formation on scroll
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
      <span className="block border border-paper/15 bg-panel px-3 py-1.5 font-mono text-[11px] tracking-wide text-paper/70 transition-colors duration-200 hover:border-accent/60 hover:text-accent">
        {tech}
      </span>
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
    <section id="stack" className="relative z-10 overflow-x-clip py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ModuleHeading
          chapter="003"
          label="TOOLKIT"
          code="CCA://LS_TOOLKIT"
          title="THE TOOLKIT"
        >
          The daily drivers.
          <span className="mt-2 block font-mono text-[10px] tracking-[0.25em] text-accent/70">
            {finePointer ? "SCROLL TO SPEED THE TAPE UP — HOVER TO PAUSE" : "SCROLL TO SPEED THE TAPE UP"}
          </span>
        </ModuleHeading>
      </div>

      {/* Scroll-velocity tape */}
      <VelocityMarquee className="mask-fade-x mt-10 border-y border-paper/10 bg-accent/[0.04] py-1">
        {stack.map((tech) => (
          <TechItem key={tech.name} tech={tech} />
        ))}
      </VelocityMarquee>

      {/* Core stack — datasheet grid */}
      <div className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 border border-paper/10 sm:grid-cols-4">
          {stack.map((tech, i) => (
            <div
              key={tech.name}
              className="group border-b border-r border-paper/10 p-4 transition-colors duration-300 odd:border-l-0 hover:bg-accent/[0.05] sm:p-5 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0"
            >
              <p className="flex items-baseline justify-between font-mono text-[9px] tracking-[0.3em] text-muted/70">
                {String(i + 1).padStart(2, "0")}
                <span className="text-accent/60">{tech.kind}</span>
              </p>
              <p className="mt-4 flex items-center gap-2.5">
                {tech.type === "icon" ? (
                  <tech.Icon size={22} style={{ color: tech.color }} aria-hidden="true" />
                ) : (
                  <span style={{ color: tech.color }} className="font-display text-lg font-extrabold transition-colors duration-300 group-hover:text-paper sm:text-xl">
                    {tech.label}
                  </span>
                )}
                {tech.type !== "text" && (
                  <span className="font-display text-lg font-bold leading-tight text-paper transition-colors duration-300 group-hover:text-accent sm:text-xl">
                    {tech.name}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Also explored — scatter-assemble pills */}
      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 md:mt-20">
        <div className="flex items-baseline justify-between gap-4 border-t border-paper/10 pt-4 font-mono text-[10px] tracking-[0.3em] text-muted">
          <p><span className="text-signal/80">ALSO_EXPLORED</span> / NOT MASTERED YET</p>
          <p className="hidden text-paper/30 sm:block">{exploredTech.length} ENTRIES</p>
        </div>
        <ul ref={pillsRef} className="mt-8 flex flex-wrap justify-center gap-2.5">
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
        <p className="mt-10 text-center font-mono text-[10px] tracking-[0.35em] text-muted/60">
          + MORE LOADING CONTINUOUSLY
        </p>
      </div>
    </section>
  );
}
