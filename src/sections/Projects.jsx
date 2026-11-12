import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiExternalLink, FiFigma } from "react-icons/fi";
import ImageCarousel from "../components/ImageCarousel";
import SectionHeading from "../components/SectionHeading";
import Spotlight from "../components/Spotlight";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { EASE_OUT } from "../lib/motion";

// Same condition as the `stack:` screen in tailwind.config.js
const STACK_QUERY = "(min-width: 1024px) and (min-height: 780px)";

// What to show in the little "window" bar above the screenshots
const windowTitle = (project) => {
  if (project.live) {
    try {
      return new URL(project.live).host;
    } catch {
      return project.title;
    }
  }
  return project.isFigmaProject ? `Figma — ${project.title}` : project.title;
};

function ProjectCard({ project, index, total, progress, stacked }) {
  // While the next card slides over this one, it steps back: smaller + dimmer.
  const isLast = index === total - 1;
  const start = index / total;
  const shrink = stacked && !isLast;
  const scale = useTransform(progress, [start, 1], [1, shrink ? 1 - (total - 1 - index) * 0.05 : 1]);
  const dim   = useTransform(progress, [start, 1], [0, shrink ? 0.55 : 0]);

  return (
    <div
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
                <ul className="flex flex-wrap gap-2 mb-8">
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

              {/* Right — Screenshots in a window frame */}
              {project.images?.length > 0 && (
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
                    images={project.images}
                    alt={project.title}
                    aspect="aspect-[2/1]"
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

export default function Projects() {
  const { projects } = portfolioData;
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
      </div>
    </section>
  );
}
