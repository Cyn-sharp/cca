import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import { useActiveSection } from "../hooks/useActiveSection";
import { EASE_OUT, SPRING_SCROLL } from "../lib/motion";

const navLinks = [
  { id: "home",     label: "Home"     },
  { id: "about",    label: "About"    },
  { id: "stack",    label: "Stack"    },
  { id: "projects", label: "Projects" },
  { id: "contact",  label: "Contact"  },
];

const sectionIds = navLinks.map((link) => link.id);

export default function Navbar() {
  const { github } = portfolioData;
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING_SCROLL);
  const active = useActiveSection(sectionIds);

  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const [hidden, setHidden]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Shrink into a floating pill once the page moves; tuck away while
  // scrolling down and come back as soon as the user scrolls up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (y > previous + 4 && y > 480) setHidden(true);
    else if (y < previous - 4 || y <= 480) setHidden(false);
  });

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const tucked = hidden && !menuOpen;

  return (
    <>
      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary via-cyan-300 to-accent"
        style={{ scaleX: progress }}
      />

      <motion.header
        layoutRoot
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: tucked ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6"
      >
        <nav
          aria-label="Main"
          className={`relative mx-auto flex items-center justify-between rounded-full border transition-[max-width,margin,padding,background-color,border-color,box-shadow] duration-500 ease-out ${
            scrolled || menuOpen
              ? "mt-3 max-w-3xl border-textWhite/10 bg-background/75 py-2 pl-5 pr-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              : "mt-2 max-w-6xl border-transparent bg-transparent px-3 py-3"
          }`}
        >
          {/* Logo */}
          <a href="#home" className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-primary">Cyn</span>
            <span className="text-textWhite">drick</span>
            <span className="text-accent">.</span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-textWhite" : "text-textWhite/60 hover:text-textWhite"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-inset ring-primary/40"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-primary/60 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-background md:flex"
          >
            <FiGithub size={15} /> GitHub
          </a>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-full md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="mx-auto mt-2 flex max-w-3xl origin-top flex-col gap-1 rounded-3xl border border-textWhite/10 bg-background/90 p-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden"
            >
              {navLinks.map((link, i) => {
                const isActive = active === link.id;
                return (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease: EASE_OUT }}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 font-medium transition-colors ${
                      isActive ? "bg-primary/15 text-textWhite" : "text-textWhite/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <span className="font-mono text-xs text-textWhite/30">0{i + 1}</span>
                  </motion.a>
                );
              })}
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl border border-primary/50 px-4 py-3 font-semibold text-primary"
              >
                <FiGithub size={16} /> GitHub
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
