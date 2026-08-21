import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiMail, FiArrowDown } from "react-icons/fi";
import Typewriter from "../components/Typewriter";

const roles = [
  "Aspiring Full Stack Developer",
  "Computer Engineering Student",
  "Hardworking",
  "Willing to Learn",
  "Problem Solver",
  "Coffee Powered",
];

export default function Hero({ onCoolHover }) {
  const { name, bio, github, email, photos } = portfolioData;
  const [hovered, setHovered] = useState(false);
  const audioRef = useRef(null);

  const handleMouseEnter = () => {
    setHovered(true);
    onCoolHover?.();

    // Play FAAHHH sound
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/fahhh.mp3");
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.log("Audio play prevented by browser:", err);
      });
    } catch (e) {
      console.log("Audio error", e);
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative px-6 py-24 overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Photo with hover effect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setHovered(false)}
              className="relative group cursor-pointer"
            >
              {/* Animated background ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary via-primary/50 to-accent opacity-30 blur-2xl group-hover:opacity-70 group-hover:blur-3xl transition-all duration-500" />

              {/* Photo container */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/40 group-hover:border-accent transition-all duration-500 shadow-2xl">

                {/* Normal photo */}
                <motion.img
                  src={photos.normal}
                  alt="Cyndrick — normal"
                  animate={{
                    opacity: hovered ? 0 : 1,
                    scale:   hovered ? 0.95 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover bg-background"
                />

                {/* Cool photo (with shades) */}
                <motion.img
                  src={photos.cool}
                  alt="Cyndrick — cool mode"
                  animate={{
                    opacity: hovered ? 1 : 0,
                    scale:   hovered ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover bg-background"
                />
              </div>

              {/* Floating "hover me" hint */}
              <motion.div
                animate={{
                  opacity: hovered ? 0 : 1,
                  y:       hovered ? 10 : 0,
                }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-full bg-background border border-primary/40 text-primary text-xs font-mono shadow-lg"
              >
               hover me
              </motion.div>

              {/* Cool mode badge */}
              <motion.div
                animate={{
                  opacity: hovered ? 1 : 0,
                  y:       hovered ? 0 : 10,
                  rotate:  hovered ? [0, -5, 5, -5, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
                className="absolute -top-2 -right-2 px-4 py-2 rounded-full bg-accent text-background text-xs font-black shadow-lg"
              >
               COOL MODE
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — Text content */}
          <div className="text-center lg:text-left order-1 lg:order-2">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Open to opportunities
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            >
              Hey, I'm{" "}
              <span className="text-primary glow">{name.split(" ")[0]}</span>
              <span className="text-accent">.</span>
            </motion.h1>

            {/* Typewriter Role */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold text-textWhite/80 mb-6 min-h-[2.5rem] flex items-center justify-center lg:justify-start"
            >
              <span className="text-textWhite/40 mr-2 font-mono text-lg">{`{`}</span>
              <Typewriter
                words={roles}
                typingSpeed={90}
                deletingSpeed={50}
                pauseTime={1800}
                className="text-primary"
              />
              <span className="text-textWhite/40 ml-2 font-mono text-lg">{`}`}</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-textWhite/60 text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              {bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <a
                href="#projects"
                className="px-7 py-3 rounded-full bg-primary text-background font-bold text-sm hover:bg-primary/80 transition-all duration-200 glow-box"
              >
                View My Work
              </a>
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 rounded-full border border-primary/40 text-textWhite font-bold text-sm hover:border-primary hover:text-primary transition-all duration-200 flex items-center gap-2"
              >
                <FiGithub /> GitHub
              </a>
            </motion.div>

            {/* Social row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center lg:justify-start gap-6 text-textWhite/40"
            >
              <a href={github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                <FiGithub size={20} />
              </a>
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                <FiMail size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary/50 animate-bounce"
      >
        <FiArrowDown size={24} />
      </motion.div>
    </section>
  );
}