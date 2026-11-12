import { useCallback, useEffect, useState } from "react";
import { MotionConfig, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Gate from "./components/Gate";
import Hud from "./components/Hud";
import CaseSleeve from "./components/CaseSleeve";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import WhatIBuild from "./sections/WhatIBuild";
import WorkGrid from "./sections/WorkGrid";
import About from "./sections/About";
import BuildLog from "./sections/BuildLog";
import Contact from "./sections/Contact";
import { portfolioData } from "./data/portfolioData";

function App() {
  // "Motion off" from the gate (or a past visit) hard-disables animation
  const [forceStill, setForceStill] = useState(() => {
    try {
      return window.sessionStorage.getItem("cca-motion") === "off";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.motion = forceStill ? "off" : "on";
  }, [forceStill]);

  // The sleeve overlay — opened from any section, rendered at the root
  const { projects } = portfolioData;
  const [sleeveId, setSleeveId] = useState(null);
  const sleeveIndex = projects.findIndex((p) => p.id === sleeveId);
  const sleeveOpen = sleeveIndex >= 0;

  const openSleeve = useCallback((id) => setSleeveId(id), []);
  const closeSleeve = useCallback(() => setSleeveId(null), []);
  const stepSleeve = useCallback(
    (dir) => {
      setSleeveId((current) => {
        const i = projects.findIndex((p) => p.id === current);
        if (i < 0) return current;
        return projects[(i + dir + projects.length) % projects.length].id;
      });
    },
    [projects]
  );

  return (
    // reducedMotion="always" when the visitor flipped MOTION OFF at the gate
    <MotionConfig reducedMotion={forceStill ? "always" : "user"}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-[95] focus:border focus:border-accent focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-accent"
      >
        Skip to content
      </a>

      {/* Blueprint grid behind everything */}
      <div aria-hidden="true" className="bg-blueprint pointer-events-none fixed inset-0 z-0" />

      <div className="relative">
        <Hud />
        <main id="main-content">
          <Hero />
          <WhatIBuild onOpenProject={openSleeve} />
          <WorkGrid onOpenProject={openSleeve} />
          <About />
          <BuildLog />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* Case sleeve — portaled to body so it clears the HUD */}
      {createPortal(
        <AnimatePresence>
          {sleeveOpen && (
            <CaseSleeve
              key="sleeve"
              project={projects[sleeveIndex]}
              index={sleeveIndex}
              total={projects.length}
              onClose={closeSleeve}
              onPrev={() => stepSleeve(-1)}
              onNext={() => stepSleeve(1)}
              triggerRef={null}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* The gate — sound + motion, once per tab */}
      <Gate onEnter={({ motion }) => setForceStill(motion === "off")} />
    </MotionConfig>
  );
}

export default App;
