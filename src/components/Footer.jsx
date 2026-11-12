import { FiGithub, FiMail } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";

export default function Footer() {
  const { name, github, email } = portfolioData;
  const year = new Date().getFullYear();
  const first = name.split(" ")[0].toUpperCase();

  return (
    <footer className="relative z-10 overflow-hidden border-t border-paper/10 pb-11">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 font-mono text-[9px] tracking-[0.3em] text-muted sm:px-6 sm:text-[10px]">
        <p className="min-w-0 truncate">
          © {year} <span className="text-paper/80">{name.toUpperCase()}</span>
        </p>
        <p className="hidden md:block">BUILT WITH REACT + VITE</p>
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center text-muted transition-colors hover:text-accent"
          >
            <FiGithub size={17} />
          </a>
          <a
            href={`mailto:${email}`}
            aria-label="Email"
            className="grid h-10 w-10 place-items-center text-muted transition-colors hover:text-accent"
          >
            <FiMail size={17} />
          </a>
        </div>
        <p className="hidden sm:block text-paper/30">CCA://EOF</p>
      </div>

      {/* The wordmark, printed at the bottom of the manual */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.08em] select-none whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-[0.85] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(143,132,255,0.4)]"
      >
        {first}<span className="[-webkit-text-stroke:1px_rgba(255,176,32,0.6)]">.</span>
      </p>
    </footer>
  );
}
