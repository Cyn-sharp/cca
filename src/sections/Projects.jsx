import { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import {
  FiGithub,
  FiExternalLink,
  FiFigma,
  FiPlayCircle,
  FiArrowUpRight,
  FiCompass,
  FiBox,
  FiZap,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import ImageCarousel from "../components/ImageCarousel";
import SectionHeading from "../components/SectionHeading";
import Spotlight from "../components/Spotlight";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { EASE_OUT } from "../lib/motion";

// Same condition as the `stack:` screen in tailwind.config.js
const STACK_QUERY = "(min-width: 1024px) and (min-height: 780px)";

// What to show in the little "window" bar above the screenshots / video
const windowTitle = (project) => {
  if (project.live) {
    try {
      return new URL(project.live).host;
    } catch {
      return project.title;
    }
  }
  if (project.isFigmaProject) return `Figma — ${project.title}`;
  if (project.github) {
    try {
      return new URL(project.github).pathname.replace(/^\//, "");
    } catch {
      return project.title;
    }
  }
  return project.title;
};

function ProjectCard({ project, index, total, progress, stacked }) {
  const [highlightsOpen, setHighlightsOpen] = useState(false);

  // While the next card slides over this one, it steps back: smaller + dimmer.
  const isLast = index === total - 1;
  const start = index / total;
  const shrink = stacked && !isLast;
  const scale = useTransform(progress, [start, 1], [1, shrink ? 1 - (total - 1 - index) * 0.05 : 1]);
  const dim   = useTransform(progress, [start, 1], [0, shrink ? 0.55 : 0]);

  return (
    <div
      id={project.slug || `project-${project.id}`}
      className="relative stack:sticky"
      // each card sticks a little lower than the one before, so the stack stays visible
      style={{ top: `calc(6.5rem + ${index * 1.5}rem)`, zIndex: index + 1 }}
    >
      <motion.div style={{ scale }} className="origin-top">
        <motion.article
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <Spotlight className="card rounded-3xl p-6 shadow-[0_-12px_60px_-20px_rgba(0,0,0,0.9)] md:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr,1.1fr] lg:gap-12">
              {/* Left — Text */}
              <div>
                {/* Number + badges */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="mr-2 font-mono text-sm text-textWhite/40">
                    {String(index + 1).padStart(2, "0")}
                    <span className="text-textWhite/20"> / {String(total).padStart(2, "0")}</span>
                  </span>
                  {project.featured && (
                    <span className="text-xs font-mono text-accent border border-accent/40 px-3 py-1 rounded-full bg-accent/10">
                      Featured
                    </span>
                  )}
                  {project.isFigmaProject && (
                    <span className="text-xs font-mono text-pink-400 border border-pink-400/40 px-3 py-1 rounded-full bg-pink-500/10 flex items-center gap-1">
                      <FiFigma size={12} /> Design
                    </span>
                  )}
                  {project.video && (
                    <span className="text-xs font-mono text-primary border border-primary/40 px-3 py-1 rounded-full bg-primary/10 flex items-center gap-1">
                      <FiPlayCircle size={12} /> Video Demo
                    </span>
                  )}
                </div>

                <p className="text-accent font-mono text-xs mb-2">
                  {project.tagline}
                </p>

                <h3 className="mb-4 font-display text-4xl font-extrabold tracking-[-0.02em] text-textWhite md:text-5xl">
                  {project.title}
                </h3>

                <p className="text-textWhite/60 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech badges */}
                <ul className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                        project.isFigmaProject
                          ? "bg-pink-500/10 text-pink-400 border-pink-400/30"
                          : "bg-accent/10 text-accent border-accent/30"
                      }`}
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                {/* Engineering Highlights Accordion Toggle */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="mb-7">
                    <button
                      type="button"
                      onClick={() => setHighlightsOpen((prev) => !prev)}
                      aria-expanded={highlightsOpen}
                      className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-1.5 font-mono text-xs font-semibold text-primary transition-all duration-200 hover:border-primary/60 hover:bg-primary/10"
                    >
                      <FiZap className="text-accent transition-transform duration-200 group-hover:scale-110" />
                      <span>{highlightsOpen ? "Hide Engineering Highlights" : "Engineering Highlights & Architecture"}</span>
                      {highlightsOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    </button>

                    <AnimatePresence initial={false}>
                      {highlightsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 rounded-2xl border border-primary/20 bg-background/90 p-4 sm:p-5 shadow-inner backdrop-blur-md">
                            {project.metrics && (
                              <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-textWhite/10 pb-2.5">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                                  Specs / Metrics:
                                </span>
                                <span className="font-mono text-xs text-textWhite/80">
                                  {project.metrics}
                                </span>
                              </div>
                            )}

                            <div className="space-y-3">
                              {project.highlights.map((item, hIdx) => (
                                <div key={hIdx} className="text-left">
                                  <div className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <div>
                                      <p className="font-mono text-xs font-bold text-textWhite">
                                        {item.title}
                                      </p>
                                      <p className="mt-0.5 text-xs leading-relaxed text-textWhite/65">
                                        {item.desc}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-background font-bold text-sm hover:bg-cyan-300 transition-all duration-200 glow-box"
                    >
                      <FiExternalLink size={16} /> Live Demo
                    </a>
                  )}

                  {project.figma && (
                    <a
                      href={project.figma}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-all duration-200"
                      style={{ boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)" }}
                    >
                      <FiFigma size={16} /> View in Figma
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-textWhite/20 text-textWhite font-bold text-sm hover:border-primary hover:text-primary transition-all duration-200"
                    >
                      <FiGithub size={16} /> View Code
                    </a>
                  )}
                </div>
              </div>

              {/* Right — Screenshots / Demo video in a window frame */}
              {(project.video || project.images?.length > 0) && (
                <div className="overflow-hidden rounded-xl border border-textWhite/10 bg-background shadow-2xl shadow-black/60">
                  <div className="flex items-center gap-3 border-b border-textWhite/10 px-4 py-2.5">
                    <span aria-hidden="true" className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-textWhite/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-textWhite/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-textWhite/15" />
                    </span>
                    <span className="min-w-0 flex-1 truncate rounded-md bg-textWhite/5 px-3 py-1 text-center font-mono text-[11px] text-textWhite/45">
                      {windowTitle(project)}
                    </span>
                    <span aria-hidden="true" className="w-[42px]" />
                  </div>
                  <ImageCarousel
                    video={project.video}
                    poster={project.poster}
                    images={project.images}
                    alt={project.title}
                    aspect={project.video ? "aspect-video" : "aspect-[2/1]"}
                  />
                </div>
              )}
            </div>

            {/* Dim layer while the card sits behind the next one */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: dim }}
              className="pointer-events-none absolute inset-0 rounded-3xl bg-background"
            />
          </Spotlight>
        </motion.article>
      </motion.div>
    </div>
  );
}

function ActiveBuildCard({ build, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE_OUT }}
      className="h-full"
    >
      <Spotlight className="card group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 border border-textWhite/10 bg-surface/70 hover:border-amber-400/40 transition-colors duration-300 md:p-8">
        <div>
          {/* Top row: Status Badge & Icon */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[11px] font-semibold text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                {build.badge}
              </span>
              <span className="rounded-full border border-textWhite/10 bg-textWhite/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-textWhite/50">
                {build.phase}
              </span>
            </div>

            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-textWhite/10 bg-background/80 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/40">
              {build.id === "questgo" ? <FiCompass size={18} /> : <FiBox size={18} />}
            </div>
          </div>

          {/* Title & Tagline */}
          <p className="mt-5 font-mono text-xs text-accent">
            {build.tagline}
          </p>

          <h4 className="mt-1 font-display text-2xl font-bold tracking-tight text-textWhite transition-colors duration-200 group-hover:text-primary sm:text-3xl">
            {build.title}
          </h4>

          <p className="mt-3 text-sm leading-relaxed text-textWhite/65">
            {build.description}
          </p>

          {/* Highlights box */}
          <div className="mt-5 rounded-2xl border border-textWhite/5 bg-background/50 p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-textWhite/40">
              Engineering Focus
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-textWhite/80">
              {build.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {/* Tech pills */}
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {build.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-textWhite/10 bg-textWhite/[0.03] px-2.5 py-1 font-mono text-[11px] text-textWhite/70"
              >
                {t}
              </li>
            ))}
          </ul>

          {/* Bottom Link */}
          <div className="mt-6 flex items-center justify-between border-t border-textWhite/10 pt-4">
            <a
              href={build.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-xs font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-background"
            >
              <FiGithub size={14} /> View Architecture & Code
              <FiArrowUpRight size={14} />
            </a>
            <span className="hidden sm:inline font-mono text-[11px] text-textWhite/40">
              Active Commits ⚡
            </span>
          </div>
        </div>
      </Spotlight>
    </motion.article>
  );
}

export default function Projects() {
  const { projects, activeBuilds } = portfolioData;
  const listRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const tallDesktop = useMediaQuery(STACK_QUERY);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="projects" className="relative z-10 px-6 pb-24 pt-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="03" label="projects" title="What I've built">
          From code to design — explore my work 🚀
        </SectionHeading>

        {/* On tall desktop screens the cards stack: each one sticks, and the
            next slides over it. Everywhere else they're a normal list. */}
        <div ref={listRef} className="mt-16 space-y-12 stack:space-y-24">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacked={tallDesktop && !reduceMotion}
            />
          ))}
        </div>

        {/* In the Lab / Active Builds */}
        {activeBuilds && activeBuilds.length > 0 && (
          <div className="mt-28 md:mt-36">
            <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                  </span>
                  <span>In the Lab · Active Builds</span>
                </div>
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-textWhite sm:text-3xl">
                  Work in Progress <span className="text-accent">.</span>
                </h3>
              </div>
              <p className="max-w-md font-mono text-xs text-textWhite/50 sm:text-right">
                Currently architecting & building — exploring campus marketplaces and real-world small business tooling.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {activeBuilds.map((build, i) => (
                <ActiveBuildCard key={build.id} build={build} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
