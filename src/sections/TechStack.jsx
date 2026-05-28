import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiSupabase,
  SiMysql,
  SiFigma,
} from "react-icons/si";

// Simple text icon for C and C#
const TextIcon = ({ label, color }) => (
  <span style={{ color }} className="text-2xl font-black">
    {label}
  </span>
);

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
  <div className="flex items-center gap-3 px-8 py-4 mx-2 whitespace-nowrap">
    {tech.type === "icon" ? (
      <tech.Icon size={32} style={{ color: tech.color }} />
    ) : (
      <TextIcon label={tech.label} color={tech.color} />
    )}
    <span className="text-textWhite/80 text-xl font-bold">
      {tech.name}
    </span>
    <span className="text-primary/40 text-2xl font-light ml-6">•</span>
  </div>
);

export default function TechStack() {
  const { exploredTech } = portfolioData;
  const items = [...stack, ...stack];

  return (
    <section id="stack" className="py-32 relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── TOP — Core Tech Stack ──────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary font-mono text-sm mb-2 text-center"
        >
          // tech stack
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-center mb-4"
        >
          What I work with<span className="text-accent">.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-textWhite/40 text-center text-sm"
        >
          The tools I use to bring ideas to life ⚡
          <span className="block mt-1 text-xs text-primary/60 font-mono">
            (hover to pause)
          </span>
        </motion.p>
      </div>

      {/* Single Marquee row with pause on hover */}
      <div className="relative group mb-32">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden py-4 border-y border-primary/20 bg-primary/5">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            {items.map((tech, i) => (
              <TechItem key={`row-${i}`} tech={tech} />
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM — Also Explored ──────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-accent font-mono text-sm mb-2 text-center"
        >
          // also explored
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-black text-center mb-3"
        >
          Tried & explored<span className="text-primary">.</span>
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-textWhite/40 text-center text-sm mb-12 max-w-xl mx-auto"
        >
          Not mastered (yet 😅) — but I've experimented with these and I'm
          always open to learning more.
        </motion.p>

        {/* Pills grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {exploredTech.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(6, 182, 212, 0.15)",
                borderColor: "rgba(6, 182, 212, 0.6)",
              }}
              className="px-4 py-2 rounded-full border border-textWhite/15 bg-textWhite/5 text-textWhite/70 text-sm font-medium cursor-default transition-colors duration-200"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-textWhite/30 font-mono text-xs"
        >
          + always learning more 🚀
        </motion.p>
      </div>
    </section>
  );
}