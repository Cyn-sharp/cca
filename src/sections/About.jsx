import { FiArrowUpRight, FiGithub, FiMail } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import ModuleHeading from "../components/ModuleHeading";

const metaRows = [
  { label: "BASED IN", value: "Cebu City, Philippines", note: "ON-SITE + REMOTE" },
  { label: "STUDYING", value: "Computer Engineering", note: "IN PROGRESS — SHIPPING ANYWAY" },
  { label: "BUILDING", value: "Full stack web apps", note: "REACT · SUPABASE · PYTHON" },
  { label: "LEARNING", value: "Whatever's next", note: "CURRENTLY: DEEPER AI + SYSTEMS" },
];

export default function About() {
  const { email, github, aboutImages } = portfolioData;
  // The team photo from UConvertIT — proof the work is real
  const teamPhoto = aboutImages[2];

  return (
    <section id="about" className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ModuleHeading
          chapter="004"
          label="THE BUILDER"
          code="CCA://WHOAMI"
          title="WHOAMI"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — the pitch + datasheet */}
          <div className="lg:col-span-7">
            <p className="font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em] text-paper sm:text-3xl md:text-[2.4rem]">
              One person, the{" "}
              <span className="text-accent">whole build</span> — the interface,
              the API, the database, and the{" "}
              <span className="text-accent">AI on top of it</span>.
            </p>
            <p className="mt-6 max-w-xl leading-relaxed text-muted">
              Computer Engineering student from Cebu City, shipping real
              software in between exams. I pick the unglamorous parts too —
              Git, debugging, deploy day — because shipped beats perfect,
              every single time.
            </p>

            {/* Datasheet */}
            <dl className="mt-10">
              {metaRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-5 border-b border-paper/[0.08] py-4 sm:grid-cols-[8.5rem_1fr]"
                >
                  <dt className="font-mono text-[10px] tracking-[0.3em] text-accent/80">
                    {row.label}
                  </dt>
                  <dd>
                    <span className="block text-base font-semibold text-paper">{row.value}</span>
                    <span className="mt-0.5 block font-mono text-[8px] tracking-[0.2em] text-muted/70">
                      {row.note}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* Contacts */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 border border-paper/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <FiMail size={14} /> EMAIL <FiArrowUpRight size={12} />
              </a>
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-paper/20 px-5 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <FiGithub size={14} /> GITHUB <FiArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Right — proof it happened */}
          <figure className="lg:col-span-5">
            <div className="overflow-hidden border border-paper/10">
              <img
                src={teamPhoto.src}
                alt={teamPhoto.caption}
                width={teamPhoto.width}
                height={teamPhoto.height}
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover"
                style={{ aspectRatio: `${teamPhoto.width} / ${teamPhoto.height}` }}
              />
            </div>
            <figcaption className="mt-4 border-l-2 border-accent/50 pl-4 font-mono text-[9px] leading-relaxed tracking-[0.25em] text-muted">
              FIG. 02 — {teamPhoto.caption.toUpperCase()}
              <span className="mt-1 block text-paper/30">THE TEAM THAT SHIPPED UCONVERTIT</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
