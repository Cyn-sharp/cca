import ModuleHeading from "../components/ModuleHeading";

// The career so far, as an engineer's log — levels, not faked dates.
const LEVELS = [
  {
    lvl: "01",
    title: "hello, world",
    desc: "Wrote my first program in C. Broke it. Fixed it. Felt like I'd unlocked something.",
  },
  {
    lvl: "02",
    title: "the web clicked",
    desc: "HTML → CSS → JavaScript — then the lights went on. The browser wasn't a page, it was a canvas.",
  },
  {
    lvl: "03",
    title: "went full stack",
    desc: "React up front, Supabase and MySQL behind it, Python in the middle when the math got serious.",
  },
  {
    lvl: "04",
    title: "shipped as a team",
    desc: "UConvertIT went live — five AI study tools in one platform, real users, real deadlines.",
  },
  {
    lvl: "05",
    title: "designed it too",
    desc: "GARBO: a dual-dashboard app for smarter waste collection. Presented to the class. It landed.",
  },
  {
    lvl: "06",
    title: "current quest",
    desc: "2026 — finishing Computer Engineering, and looking for the first team that'll let me build things that matter.",
    current: true,
  },
];

export default function BuildLog() {
  return (
    <section id="log" aria-label="The build log — how it happened" className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <ModuleHeading
          chapter="005"
          label="THE LOG"
          code="CCA://CAT_LOG"
          title="THE LOG"
        >
          An error, a fix, a feature, a product. No faked dates — just the save points.
        </ModuleHeading>

        <ol className="relative mt-14 border-l border-paper/10 pl-8 sm:pl-14">
          {LEVELS.map((level) => (
            <li
              key={level.lvl}
              className="relative grid gap-1 border-b border-paper/[0.06] py-6 last:border-b-0 sm:grid-cols-[5rem_1fr] sm:gap-8"
            >
              {/* Save point node */}
              <span
                aria-hidden="true"
                className={`absolute -left-[calc(2rem+5px)] top-8 h-2.5 w-2.5 rounded-full sm:-left-[calc(3.5rem+5px)] ${
                  level.current ? "bg-signal" : "bg-accent/70"
                }`}
              />
              <span className="font-mono text-xs leading-6 tracking-[0.3em] text-accent/80">
                LVL {level.lvl}
                {level.current && (
                  <span className="ml-2 inline-block border border-signal/50 bg-signal/10 px-2 py-0.5 text-[8px] tracking-[0.25em] text-signal">
                    YOU ARE HERE
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-extrabold tracking-tight text-paper sm:text-2xl">
                  {level.title}
                </span>
                <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
                  {level.desc}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
