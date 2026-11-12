import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiMail, FiCopy, FiCheck } from "react-icons/fi";
import SectionHeading from "../components/SectionHeading";
import Magnetic from "../components/Magnetic";
import Reveal from "../components/Reveal";
import { useFinePointer } from "../hooks/useMediaQuery";
import { SPRING_SCROLL } from "../lib/motion";
import { copyText } from "../lib/clipboard";

export default function Contact() {
  const { github, email } = portfolioData;
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const [copyState, setCopyState] = useState("idle"); // "idle" | "copied" | "failed"
  const copied = copyState === "copied";

  // The glow behind the section swells as you arrive
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const arrive = useSpring(scrollYProgress, SPRING_SCROLL);
  const glowScale   = useTransform(arrive, [0, 1], [reduceMotion ? 1 : 0.5, 1]);
  const glowOpacity = useTransform(arrive, [0, 1], [reduceMotion ? 1 : 0, 1]);

  const copyEmail = async () => {
    const ok = await copyText(email);
    setCopyState(ok ? "copied" : "failed");
    setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <section id="contact" ref={ref} className="relative z-10 overflow-x-clip px-6 pb-32 pt-8">
      <motion.div
        aria-hidden="true"
        style={{
          scale: glowScale,
          opacity: glowOpacity,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(closest-side, rgba(6,182,212,0.18), rgba(245,158,11,0.05) 60%, transparent)",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[min(900px,130vw)] rounded-full"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <SectionHeading index="04" label="contact" title="Let's connect">
          <span className="mx-auto block max-w-2xl text-base leading-relaxed text-textWhite/60 sm:text-lg">
            I'm always open to learning opportunities, collaborations, or just a
            good conversation about tech. Don't be shy — reach out!
          </span>
        </SectionHeading>

        {/* Email — click to copy */}
        <Reveal delay={0.1} className="mt-12">
          <button
            type="button"
            onClick={copyEmail}
            className="group inline-flex max-w-full items-center gap-3 rounded-2xl border border-textWhite/10 bg-surface/80 px-5 py-4 font-mono text-sm text-textWhite/85 backdrop-blur transition-colors duration-200 hover:border-primary/60 hover:text-textWhite sm:text-lg"
          >
            <span className="truncate">{email}</span>
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${
                copied ? "bg-emerald-400/15 text-emerald-300" : "bg-textWhite/5 text-primary group-hover:bg-primary/15"
              }`}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={15} />}
            </span>
          </button>
          <p aria-live="polite" className="mt-3 h-5 font-mono text-xs text-textWhite/45">
            {copyState === "copied" && "Copied to clipboard ✓"}
            {copyState === "failed" && "Couldn't copy here — use Send Email below"}
            {copyState === "idle" && (finePointer ? "Click to copy" : "Tap to copy")}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-background font-bold hover:bg-cyan-300 transition-colors duration-200 glow-box"
            >
              <FiMail /> Send Email
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-textWhite/20 bg-textWhite/[0.03] text-textWhite font-bold hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <FiGithub /> GitHub
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
