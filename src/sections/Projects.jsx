import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiExternalLink, FiFigma } from "react-icons/fi";
import ImageCarousel from "../components/ImageCarousel";

export default function Projects() {
  const { projects } = portfolioData;

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary font-mono text-sm mb-2 text-center"
        >
          // projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-center mb-4"
        >
          What I've built<span className="text-accent">.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-textWhite/40 text-center mb-16 text-sm"
        >
          From code to design — explore my work 🚀
        </motion.p>

        <div className="space-y-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 md:p-10 rounded-3xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all duration-300 glow-box overflow-hidden"
            >
              {/* Top-right badges */}
              <div className="absolute top-6 right-6 flex gap-2 z-20">
                {project.isFigmaProject && (
                  <span className="text-xs font-mono text-pink-400 border border-pink-400/40 px-3 py-1 rounded-full bg-background/50 flex items-center gap-1">
                    <FiFigma size={12} /> Design
                  </span>
                )}
                {project.featured && (
                  <span className="text-xs font-mono text-accent border border-accent/40 px-3 py-1 rounded-full bg-background/50">
                    Featured
                  </span>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                {/* Left — Text */}
                <div>
                  <p className="text-accent font-mono text-xs mb-2">
                    {project.tagline}
                  </p>

                  <h3 className="text-3xl md:text-4xl font-black text-textWhite mb-4">
                    {project.title}
                  </h3>

                  <p className="text-textWhite/60 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                          project.isFigmaProject
                            ? "bg-pink-500/10 text-pink-400 border-pink-400/30"
                            : "bg-accent/10 text-accent border-accent/30"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-background font-bold text-sm hover:bg-primary/80 transition-all duration-200 glow-box"
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
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-textWhite font-bold text-sm hover:border-primary hover:text-primary transition-all duration-200"
                      >
                        <FiGithub size={16} /> View Code
                      </a>
                    )}
                  </div>
                </div>

                {/* Right — Carousel */}
                <div>
                  {project.images?.length > 0 && (
                    <ImageCarousel
                      images={project.images}
                      alt={project.title}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}