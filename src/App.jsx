import { useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import SectionBridge from "./components/SectionBridge";
import BackToTop from "./components/BackToTop";
import Hero from "./sections/Hero";
import About from "./sections/About";
import TechStack from "./sections/TechStack";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";

function App() {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    // restart animation even if already shaking
    setIsShaking(false);
    requestAnimationFrame(() => setIsShaking(true));
    // remove class after animation ends
    setTimeout(() => setIsShaking(false), 550);
  };

  return (
    // reducedMotion="user": visitors who turned on "reduce motion" in their
    // system settings get fades instead of movement.
    <MotionConfig reducedMotion="user">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-background"
      >
        Skip to content
      </a>

      <Background />
      <Navbar />

      <div className={`relative min-h-screen ${isShaking ? "site-shake" : ""}`}>
        <main>
          <Hero onCoolHover={triggerShake} />
          <SectionBridge variant="left" />
          <About />
          <SectionBridge variant="right" />
          <TechStack />
          <SectionBridge variant="left" />
          <Projects />
          <SectionBridge variant="right" />
          <Contact />
        </main>
        <Footer />
      </div>

      <BackToTop />
    </MotionConfig>
  );
}

export default App;
