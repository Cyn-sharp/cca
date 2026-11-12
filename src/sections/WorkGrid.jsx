import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import ModuleHeading from "../components/ModuleHeading";

// Tile spans for the bento — wide, featured, then small squares.
const spans = [
  "col-span-2 row-span-2 lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

const tileMeta = (projects) => {
  // One tile per project screenshot, featured project first
  const tiles = [];
  const featured = projects.find((p) => p.featured) ?? projects[0];
  for (const p of [featured, ...projects.filter((p) => p !== featured)]) {
    p.images.forEach((src, i) => tiles.push({ src, project: p, i }));
  }
  return tiles;
};

// The archive — everything, even the half-finished bits. skhiladze's
// "All work" plate, translated into software inventory.
function Archive({ onClose, onOpenProject, triggerRef }) {
  const [tab, setTab] = useState("projects");
  const closeRef = useRef(null);
  const { projects, exploredTech } = portfolioData;

  useEffect(() => {
    closeRef.current?.focus();
    const trigger = triggerRef?.current;
    return () => trigger?.focus?.();
  }, [triggerRef]);

  useEffect(() => {
    const original = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="The archive — everything built or explored"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-void"
    >
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-paper/10 bg-void px-4 sm:px-6">
        <p className="font-mono text-[10px] tracking-[0.35em] text-muted">
          <span className="text-accent">THE ARCHIVE</span> — EVERYTHING, EVEN THE HALF-FINISHED BITS
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-12 items-center gap-2 pl-4 font-mono text-[11px] font-bold tracking-[0.3em] text-paper transition-colors hover:text-accent"
        >
          CLOSE <FiX size={16} />
        </button>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-paper/10 font-mono text-[11px] tracking-[0.3em]">
          {[
            ["projects", `PROJECTS (${projects.length})`],
            ["exploring", `EXPLORING (${exploredTech.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`relative -mb-px border-b-2 pb-3 transition-colors duration-200 ${
                tab === id ? "border-accent text-accent" : "border-transparent text-muted hover:text-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "projects" ? (
          <ul className="mt-6">
            {projects.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onOpenProject(p.id)}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-paper/[0.08] py-5 text-left transition-colors duration-200 hover:bg-accent/[0.05]"
                >
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl font-extrabold tracking-tight text-paper transition-colors duration-200 group-hover:text-accent sm:text-3xl">
                      {p.title}
                    </span>
                    <span className="mt-1 block font-mono text-[9px] tracking-[0.25em] text-muted">
                      {p.kind} — {p.tech.join(" · ").toUpperCase()}
                    </span>
                  </span>
                  <FiArrowUpRight size={20} className="text-muted transition-colors duration-200 group-hover:text-accent" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <p className="font-mono text-[10px] leading-relaxed tracking-[0.25em] text-muted">
              NOT MASTERED — JUST TOUCHED. THE FULL LIST, NO INFLATION:
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {exploredTech.map((tech) => (
                <li
                  key={tech}
                  className="border border-paper/12 px-3 py-1.5 font-mono text-[11px] text-paper/75"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 space-y-3 border-t border-paper/10 pt-6 font-mono text-[9px] leading-relaxed tracking-[0.22em] text-muted/70">
          <p>CONCEPT & SPEC WORK IS LABELLED — NOTHING HERE IS CLIENT-COMMISSIONED YET.</p>
          <p>ASK FOR THE PATTERN BEHIND ANYTHING NOT LISTED. EVERYTHING MOVES FAST.</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkGrid({ onOpenProject }) {
  const { projects } = portfolioData;
  const [archiveOpen, setArchiveOpen] = useState(false);
  const archiveTriggerRef = useRef(null);
  const openArchive = () => setArchiveOpen(true);
  const closeArchive = () => setArchiveOpen(false);

  const openFromArchive = (id) => {
    setArchiveOpen(false);
    onOpenProject(id);
  };

  const tiles = tileMeta(projects);

  return (
    <section id="work" aria-label="Selected work" className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ModuleHeading
          chapter="003"
          label="SELECTED WORK"
          code="CCA://LS_WORK"
          title="THE WORK"
        >
          Two builds in the open beta, both real. Tap a frame — it plays like a film.
        </ModuleHeading>

        {/* Bento grid — every tile opens the sleeve */}
        <div className="mt-12 grid auto-rows-[175px] grid-cols-2 gap-2 sm:auto-rows-[230px] sm:gap-3 lg:auto-rows-[240px] lg:grid-cols-6">
          {tiles.map(({ src, project, i }, tileIndex) => (
            <button
              key={`${project.id}-${i}`}
              type="button"
              onClick={() => onOpenProject(project.id)}
              aria-label={`Open ${project.title} — frame ${i + 1}`}
              className={`group relative overflow-hidden border border-paper/10 text-left outline-offset-[-2px] ${spans[tileIndex] ?? "lg:col-span-2"}`}
            >
              <img
                src={src}
                alt={`${project.title} — screenshot ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(6,6,11,0) 35%, rgba(6,6,11,0.62) 68%, rgba(6,6,11,0.92) 100%)" }}
              />
              {/* Frame tag */}
              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center border border-paper/25 bg-void/60 text-paper backdrop-blur-sm">
                <FiArrowUpRight size={15} />
              </span>
              <span className="absolute bottom-0 left-0 right-0 block p-4 sm:p-5">
                <span className="font-mono text-[9px] tracking-[0.3em] text-accent">
                  {String(tileIndex + 1).padStart(2, "0")} — {project.title.toUpperCase()}
                </span>
                <span className="mt-1 block font-mono text-[8px] tracking-[0.3em] text-paper/55">
                  {project.kind}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Stats + archive entry */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted">
            <span className="text-paper/70">{projects.length} BUILDS</span>
            <span className="mx-2 text-paper/25">·</span>8 CORE TOOLS
            <span className="mx-2 text-paper/25">·</span>{portfolioData.exploredTech.length} EXPLORED
          </p>
          <button
            ref={archiveTriggerRef}
            type="button"
            onClick={openArchive}
            className="border border-paper/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.25em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            OPEN THE FULL ARCHIVE ↗
          </button>
        </div>
      </div>

      {/* The archive overlay */}
      {createPortal(
        <AnimatePresence>
          {archiveOpen && (
            <Archive
              key="archive"
              onClose={closeArchive}
              onOpenProject={openFromArchive}
              triggerRef={archiveTriggerRef}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
