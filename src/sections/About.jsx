import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import Lightbox from "../components/Lightbox";
import SectionHeading from "../components/SectionHeading";
import ScrubText from "../components/ScrubText";
import Reveal from "../components/Reveal";
import Spotlight from "../components/Spotlight";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { EASE_OUT } from "../lib/motion";
import { FiMaximize2 } from "react-icons/fi";

const facts = [
  { label: "Role",     value: "Full Stack Developer" },
  { label: "Status",   value: "Computer Engineering Student"           },
  { label: "Focus",    value: "Building Real World Applications" },
  { label: "Learning", value: "Always 📚"             },
];

// How far (px) each gallery photo drifts while the gallery crosses the screen.
// Different amounts per photo = depth.
const DRIFT = [46, -28, 64];

function GalleryPhoto({ image, index, progress, drift, onOpen }) {
  const y = useTransform(progress, [0, 1], [drift, -drift]);
  const imageY = useTransform(progress, [0, 1], ["-6%", "6%"]);
  const ratio = image.width && image.height ? image.width / image.height : 3 / 4;

  return (
    <motion.div
      style={{ y, "--ratio": ratio }}
      className="min-w-0 md:[flex:var(--ratio)_1_0%]"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`View photo: ${image.caption}`}
        initial={{ opacity: 0, clipPath: "inset(14% 8% 14% 8% round 1rem)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, delay: index * 0.12, ease: EASE_OUT }}
        style={{ aspectRatio: ratio }}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-textWhite/10 bg-surface text-left"
      >
        {/* Image — drifts inside its frame as you scroll */}
        <motion.img
          src={image.src}
          alt={image.caption}
          loading="lazy"
          decoding="async"
          style={{ y: imageY, scale: 1.14 }}
          className="h-full w-full object-cover"
        />

        {/* Overlay */}
        <span className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Zoom icon — appears on hover */}
        <span className="absolute left-3 top-3 flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-primary/90 text-background opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <FiMaximize2 size={16} />
        </span>

        {/* Caption */}
        <span className="absolute bottom-0 left-0 right-0 block translate-y-1 p-5 transition-transform duration-300 group-hover:translate-y-0">
          <span className="mb-1 block font-mono text-xs text-accent">0{index + 1}</span>
          <span className="block text-sm font-semibold leading-snug text-textWhite line-clamp-2">
            {image.caption}
          </span>
        </span>

        {/* Corner accent */}
        <span className="absolute right-3 top-3 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-primary/40 transition-colors duration-300 group-hover:border-primary" />
      </motion.button>
    </motion.div>
  );
}

export default function About() {
  const { bio, aboutImages } = portfolioData;
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const galleryRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const sideBySide = useMediaQuery("(min-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  const openLightbox  = (i) => setLightboxIndex(i);
  const closeLightbox = ()  => setLightboxIndex(null);
  const nextImage     = ()  => setLightboxIndex((i) => (i + 1) % aboutImages.length);
  const prevImage     = ()  => setLightboxIndex((i) => (i - 1 + aboutImages.length) % aboutImages.length);

  return (
    <section id="about" className="relative z-10 overflow-x-clip px-6 pb-24 pt-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" label="about me" title="Who am I" mark="?" />

        {/* Bio — lights up word by word as you scroll */}
        <ScrubText
          text={bio}
          highlight={["Cyndrick", "Full", "Stack"]}
          className="mx-auto mt-14 max-w-4xl text-center font-display text-2xl font-semibold leading-[1.25] tracking-[-0.015em] sm:text-3xl md:mt-20 md:text-[2.6rem] md:leading-[1.18]"
        />

        {/* Text + Facts */}
        <div className="mt-16 grid items-center gap-10 md:mt-24 md:grid-cols-2 md:gap-14">
          <Reveal>
            <p className="text-base leading-relaxed text-textWhite/60 md:text-lg">
              I'm currently a student exploring the world of full stack development.
              I enjoy working on both the frontend and backend — from designing UI
              in Figma to building APIs and connecting databases. Every project I
              build teaches me something new.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE_OUT }}
              >
                <Spotlight className="card h-full rounded-2xl p-5">
                  <p className="mb-1.5 font-mono text-xs text-primary">{fact.label}</p>
                  <p className="text-sm font-bold text-textWhite">{fact.value}</p>
                </Spotlight>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mt-28 md:mt-36">
          <SectionHeading
            as="h3"
            size="md"
            label="life as a student"
            title="Behind the code"
          >
            Click any photo to view full-size 🔍
          </SectionHeading>

          <div
            ref={galleryRef}
            className="mt-12 flex flex-col gap-5 md:mt-20 md:flex-row md:gap-6"
          >
            {aboutImages.map((image, i) => (
              <GalleryPhoto
                key={i}
                image={image}
                index={i}
                progress={scrollYProgress}
                drift={sideBySide && !reduceMotion ? DRIFT[i % DRIFT.length] : 0}
                onOpen={() => openLightbox(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={aboutImages}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
}
