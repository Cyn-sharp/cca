import { useState } from "react";
import { MotionConfig } from "framer-motion";
import BootLoader from "./components/BootLoader";
import Hud from "./components/Hud";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import TechStack from "./sections/TechStack";
import DiscLibrary from "./sections/DiscLibrary";
import Contact from "./sections/Contact";

function App() {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    // restart the animation even if it's already running
    setIsShaking(false);
    requestAnimationFrame(() => setIsShaking(true));
    setTimeout(() => setIsShaking(false), 550);
  };

  return (
    // reducedMotion="user": visitors who turned on "reduce motion" in their
    // system settings get fades instead of movement.
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-14 focus:z-[95] focus:border focus:border-accent focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-accent"
      >
        Skip to content
      </a>

      {/* Blueprint grid behind everything */}
      <div aria-hidden="true" className="bg-blueprint pointer-events-none fixed inset-0 z-0" />

      <div className={`relative ${isShaking ? "site-shake" : ""}`}>
        <Hud />
        <main id="main-content">
          <Hero onCoolHover={triggerShake} />
          <About />
          <TechStack />
          <DiscLibrary />
          <Contact />
        </main>
        <Footer />
      </div>

      {/* The console boot sequence — plays once per tab */}
      <BootLoader />
    </MotionConfig>
  );
}

export default App;
