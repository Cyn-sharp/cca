import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
  const { name, github, email } = portfolioData;
  const year = new Date().getFullYear();
  const ref = useRef(null);

  // The big wordmark rises into view as you reach the very bottom.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["55%", "0%"]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden border-t border-textWhite/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <p className="font-mono text-sm text-textWhite/40">
          © {year} <span className="text-primary">{name}</span> — Built with React
        </p>

        <div className="flex items-center gap-2 text-textWhite/50">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-textWhite/5 hover:text-primary"
          >
            <FiGithub size={18} />
          </a>
          <a
            href={`mailto:${email}`}
            aria-label="Email"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-textWhite/5 hover:text-primary"
          >
            <FiMail size={18} />
          </a>
        </div>
      </div>

      <motion.p
        aria-hidden="true"
        style={{ y: wordmarkY, opacity: wordmarkOpacity }}
        className="pointer-events-none -mb-[0.06em] select-none whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-[1] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(6,182,212,0.35)]"
      >
        {name.split(" ")[0]}
        <span className="[-webkit-text-stroke:1px_rgba(245,158,11,0.55)]">.</span>
      </motion.p>
    </footer>
  );
}
