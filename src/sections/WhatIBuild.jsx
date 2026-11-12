import { FiArrowUpRight } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import ModuleHeading from "../components/ModuleHeading";

// The "What I make" index, rewired for a computer engineer: six numbered
// build areas, each with a featured project you can open like a sleeve.
const rows = [
  {
    n: "01",
    name: "INTERFACES",
    desc: "React frontends that ship — from Figma frame to deployed website without losing the design in translation.",
    featuredId: "uconvertit",
    also: ["REACT", "VITE", "TAILWIND"],
  },
  {
    n: "02",
    name: "BACKENDS & APIS",
    desc: "REST APIs, auth and data plumbing that hold up — Supabase when it's fast, MySQL when it needs to be formal.",
    featuredId: "uconvertit",
    also: ["EXPRESS", "SUPABASE", "MYSQL"],
  },
  {
    n: "03",
    name: "AI, WIRED IN",
    desc: "Python services that hand school tools superpowers — paraphraser, humanizer, OCR and a quiz maker.",
    featuredId: "uconvertit",
    also: ["PYTHON", "OCR", "AI APIS"],
  },
  {
    n: "04",
    name: "DESIGN & PROTOTYPES",
    desc: "Figma concepts with two users in mind at once — clarity first, polish second, presentation always.",
    featuredId: "garbo",
    also: ["FIGMA", "PROTOTYPING", "UI/UX"],
  },
  {
    n: "05",
    name: "THE UNGLAMOROUS STUFF",
    desc: "Git hygiene, real error messages, deploy day, docs — the boring 20% that keeps the 80% alive.",
    featuredId: null,
    also: ["GIT", "POSTMAN", "VERCEL", "XAMPP"],
  },
  {
    n: "06",
    name: "WHATEVER IT TAKES",
    desc: "Coursework, experiments and 2 AM fixes — the archive is full of things that broke beautifully.",
    featuredId: null,
    also: ["NODE.JS", "JAVA", "PHP", "MONGODB"],
  },
];

const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "");

export default function WhatIBuild({ onOpenProject }) {
  const { projects } = portfolioData;
  const bySlug = Object.fromEntries(projects.map((p) => [slug(p.title), p]));

  return (
    <section id="build" aria-label="What I build" className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ModuleHeading
          chapter="002"
          label="WHAT I BUILD"
          code="CCA://BUILD_LOG"
          title="WHAT I BUILD"
        >
          Six areas, one promise: it ships. Featured rows open the project; the rest is the honest plumbing.
        </ModuleHeading>

        <div className="mt-12">
          {rows.map((row) => {
            const featured = row.featuredId ? bySlug[row.featuredId] : null;
            return (
              <div
                key={row.n}
                className="grid grid-cols-12 items-center gap-x-4 gap-y-4 border-t border-paper/10 py-5 last:border-b sm:py-6"
              >
                {/* Index */}
                <span className="col-span-2 font-mono text-sm text-accent/80 sm:col-span-1">
                  {row.n}
                </span>

                {/* Name */}
                <h3 className="col-span-10 font-display text-xl font-extrabold tracking-tight text-paper sm:col-span-3 sm:text-2xl">
                  {row.name}
                </h3>

                {/* Description */}
                <p className="col-span-12 text-sm leading-relaxed text-muted sm:col-span-5">
                  {row.desc}
                </p>

                {/* Featured / tags */}
                <div className="col-span-12 flex items-center justify-between gap-4 sm:col-span-3 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                  {featured ? (
                    <button
                      type="button"
                      onClick={() => onOpenProject(featured.id)}
                      aria-label={`Open ${featured.title}`}
                      className="flex items-center gap-3 border border-paper/12 px-2.5 py-2 text-left transition-colors duration-200 hover:border-accent/60"
                    >
                      <img
                        src={featured.images[0]}
                        alt=""
                        loading="lazy"
                        className="h-12 w-16 border border-paper/10 object-cover object-top"
                      />
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] font-bold tracking-[0.18em] text-paper">
                          {featured.title.toUpperCase()}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 font-mono text-[8px] tracking-[0.25em] text-accent">
                          OPEN <FiArrowUpRight size={10} />
                        </span>
                      </span>
                    </button>
                  ) : (
                    <span className="font-mono text-[9px] tracking-[0.3em] text-muted/60">
                      NO SPOTLIGHT — JUST WORK
                    </span>
                  )}
                  <p className="font-mono text-[9px] tracking-[0.18em] text-muted/60">
                    {row.also.join(" · ")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tools line — the honest inventory */}
        <p className="mt-8 border-t border-paper/10 pt-6 font-mono text-[10px] leading-loose tracking-[0.18em] text-muted/80">
          <span className="text-accent">TOOLS — </span>
          REACT · JAVASCRIPT · C# · PYTHON · C · SUPABASE · MYSQL · FIGMA · VS CODE · GIT · VERCEL · POSTMAN
        </p>
      </div>
    </section>
  );
}
