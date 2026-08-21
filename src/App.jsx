import { useState } from "react";
import Navbar from "./components/Navbar";
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
    <div className={`bg-background min-h-screen ${isShaking ? "site-shake" : ""}`}>
      <Navbar />
      <main>
        <Hero onCoolHover={triggerShake} />
        <About />
        <TechStack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;