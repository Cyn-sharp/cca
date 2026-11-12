import { useState } from "react";
import { FiCheck, FiCopy, FiGithub, FiMail, FiTerminal } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import ModuleHeading from "../components/ModuleHeading";
import { useFinePointer } from "../hooks/useMediaQuery";
import { copyText } from "../lib/clipboard";

export default function Contact() {
  const { github, email, name, base, role } = portfolioData;
  const finePointer = useFinePointer();
  const [copyState, setCopyState] = useState("idle"); // "idle" | "copied" | "failed"
  const copied = copyState === "copied";

  const copyEmail = async () => {
    const ok = await copyText(email);
    setCopyState(ok ? "copied" : "failed");
    setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <section id="contact" className="relative z-10 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ModuleHeading
          chapter="006"
          label="CONTACT"
          code="CCA://START_BUILD"
          title="START A BUILD"
        >
          Open to internships, collaborations, and good conversations about
          tech. My inbox doesn't bite — ping it.
        </ModuleHeading>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Terminal window */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden border border-paper/12 bg-panel shadow-[0_30px_80px_-30px_rgba(143,132,255,0.25)]">
              {/* Chrome */}
              <div className="flex items-center gap-3 border-b border-paper/10 bg-panel2 px-4 py-2.5">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-center gap-2 truncate font-mono text-[10px] text-muted">
                  <FiTerminal size={11} aria-hidden="true" />
                  cyndrick@cca: ~/contact
                </span>
                <span aria-hidden="true" className="w-8" />
              </div>

              {/* Session */}
              <div className="px-5 py-6 font-mono text-[12px] leading-relaxed sm:text-[13px]">
                <p className="text-muted"><span className="text-accent">$</span> whoami</p>
                <p className="mt-1 text-paper/90">{name.toLowerCase().replace(" ", ".")} — {role.toLowerCase()}, {base.toLowerCase()}</p>

                <p className="mt-4 text-muted"><span className="text-accent">$</span> contact --mail</p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group mt-1 flex max-w-full items-center gap-3 text-left"
                  aria-label={`Copy email address ${email}`}
                >
                  <span className="truncate text-signal/90 transition-colors group-hover:text-signal">{email}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded border border-paper/15 text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                    {copied ? <FiCheck size={12} /> : <FiCopy size={11} />}
                  </span>
                </button>

                <p className="mt-4 text-muted"><span className="text-accent">$</span> contact --github</p>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block w-fit text-paper/90 underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
                >
                  github.com/Cyn-sharp
                </a>

                <p className="mt-4 text-muted"><span className="text-accent">$</span> ping availability</p>
                <p className="mt-1 text-paper/90">
                  reply from 10.32.0.1: opportunities <span className="text-green-400">open</span> — 0% packet loss
                </p>

                <p className="mt-5 text-muted"><span className="text-accent">$</span> <span className="animate-pulse">▊</span></p>
              </div>
            </div>

            <p aria-live="polite" className="mt-3 h-5 pl-1 font-mono text-[10px] tracking-[0.2em] text-muted">
              {copyState === "copied" && <span className="text-green-400">COPIED TO CLIPBOARD ✓</span>}
              {copyState === "failed" && "COULDN'T COPY — USE THE SEND EMAIL BUTTON"}
              {copyState === "idle" && (finePointer ? "CLICK THE ADDRESS TO COPY" : "TAP THE ADDRESS TO COPY")}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col justify-center gap-4 lg:col-span-5">
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">
              Whether it's an internship, a school collab, or a project that
              needs building from zero — this is the fastest route to me.
            </p>
            <a
              href={`mailto:${email}`}
              className="flex w-fit items-center gap-3 border border-accent bg-accent px-7 py-4 font-mono text-[11px] font-bold tracking-[0.25em] text-void transition-colors duration-200 hover:border-paper hover:bg-paper"
            >
              <FiMail size={16} /> SEND EMAIL
            </a>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-3 border border-paper/20 px-7 py-4 font-mono text-[11px] font-bold tracking-[0.25em] text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <FiGithub size={16} /> GITHUB
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
