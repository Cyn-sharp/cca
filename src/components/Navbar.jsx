import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home",      href: "#home"      },
  { label: "About",     href: "#about"     },
  { label: "Stack",     href: "#stack"     },
  { label: "Projects",  href: "#projects"  },
  { label: "Contact",   href: "#contact"   },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-primary/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="text-xl font-black tracking-tight">
          <span className="text-primary">Cyn</span>
          <span className="text-textWhite">drick</span>
          <span className="text-accent">.</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-textWhite/70 hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href="https://github.com/Cyn-sharp"
          target="_blank"
          rel="noreferrer"
          className="hidden md:block px-4 py-2 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-background transition-all duration-200"
        >
          GitHub
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 group"
        >
          <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-primary transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1,  y: 0   }}
          className="md:hidden bg-background/95 backdrop-blur-md border-t border-primary/20 px-6 py-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-textWhite/70 hover:text-primary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}