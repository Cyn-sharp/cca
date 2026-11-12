import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiMaximize2 } from "react-icons/fi";
import { portfolioData } from "../data/portfolioData";
import Lightbox from "../components/Lightbox";
import ModuleHeading from "../components/ModuleHeading";
import ScrubText from "../components/ScrubText";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { EASE_OUT } from "../lib/motion";

// The datasheet rows — everything a company wants to know at a glance
const specRows = [
  { label: "ROLE",     value: "Full Stack Developer", note: "frontend × backend" },
  { label: "STATUS",   value: "Computer Engineering Student", note: "currently enrolled" },
  { label: "FOCUS",    value: "Real-world applications", note: "ship it, then learn" },
  { label: "BASE",     value: "Cebu City, Philippines", note: "remote-friendly" },
  { label: "LEARNING", value: "Always", note: "full stack is the playground" },
];

// How far (px) each gallery photo drifts while the gallery crosses the screen
const DRIFT = [46, -28, 64];

function GalleryPhoto({ image, index, progress, drift, onOpen }) {
  const y = useTransform(progress, [0, 1], [drift, -drift]);
  const imageY = useTransform(progress, [0, 1], ["-6%", "6%"]);
  const ratio = image.width && image.height ? image.width / image.height : 3 / 4;

  return (
    <motion.div style={{ y, "--ratio": ratio }} className="min-w-0 md:[flex:var(--ratio)_1_0%]">
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`View photo: ${image.caption}`}
        initial={{ opacity: 0, clipPath: "inset(14% 8% 14% 8%)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, delay: index * 0.12, ease: EASE_OUT }}
        style={{ aspectRatio: ratio }}
        className="group relative block w-full cursor-zoom-in overflow-hidden border border-paper/10 bg-panel text-left"
      >
        <motion.img
          src={image.src}
          alt={image.caption}
          loading="lazy"
          decoding="async"
          style={{ y: imageY, scale: 1.14 }}
          className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 group-hover:grayscale-0"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />
        <span className="absolute left-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full border border-accent/50 bg-void/70 text-accent opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <FiMaximize2 size={15} />
        </span>
        <span className="absolute bottom-0 left-0 right-0 block p-4">
          <span className="mb-1 block font-mono text-[10px] tracking-[0.3em] text-accent">
            FIELD_{String(index + 1).padStart(2, "0")}
          </span>
          <span className="block text-sm font-semibold leading-snug text-paper">
            {image.caption}
          </span>
        </span>
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
    <section id="about" className="relative z-10 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <ModuleHeading
          chapter="002"
          label="PROFILE"
          code="CCA://WHOAMI"
          title="WHOAMI"
        >
          A Computer Engineering student who treats shipping real projects as the best way to learn.
        </ModuleHeading>

        {/* Bio — lights up as you scroll through it */}
        <ScrubText
          text={bio}
          highlight={["Cyndrick", "Full", "Stack"]}
          className="mt-14 max-w-4xl font-display text-2xl font-semibold leading-[1.25] tracking-[-0.015em] sm:text-3xl md:text-[2.5rem] md:leading-[1.18]"
        />

        {/* Datasheet + note */}
        <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <dl>
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="row-hover group grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-paper/[0.08] py-4 sm:grid-cols-[7.5rem_1fr]"
                >
                  <dt className="font-mono text-[10px] tracking-[0.3em] text-accent/80">
                    {row.label}
                  </dt>
                  <dd>
                    <span className="block text-base font-semibold text-paper">{row.value}</span>
                    <span className="mt-0.5 block font-mono text-[9px] tracking-[0.18em] text-muted/70">
                      {row.note.toUpperCase()}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">
              I enjoy working on both sides of the stack — from designing UI in
              Figma to building APIs and connecting databases. Every project I
              build teaches me something new.
            </p>
            <p className="mt-6 border-l-2 border-accent/50 pl-4 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-paper/40">
              NOTE: THIS ENGINEER SHIPS FIRST,
              <br />ASKS QUESTIONS SECOND,
              <br />AND LEARNS EVERY TIME.
            </p>
          </div>
        </div>

        {/* Field photos */}
        <div className="mt-20 md:mt-24">
          <div className="flex items-baseline justify-between gap-4 border-t border-paper/10 pt-4 font-mono text-[10px] tracking-[0.3em] text-muted sm:text-[11px]">
            <p><span className="text-accent">FIELD_LOG</span> / BEHIND THE CODE</p>
            <p className="hidden text-paper/30 sm:block">{sideBySide ? "HOVER / CLICK TO ENLARGE" : "TAP TO ENLARGE"}</p>
          </div>
          <div
            ref={galleryRef}
            className="mt-8 flex flex-col gap-4 md:flex-row md:gap-5"
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
