import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { EASE_OUT } from "../lib/motion";

const SWIPE_DISTANCE = 60;

// Slides come in from the side you're moving towards.
const slide = {
  enter:  (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit:   (direction) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function ImageCarousel({
  images = [],
  alt = "Project image",
  aspect = "aspect-video",
}) {
  const [[current, direction], setSlide] = useState([0, 1]);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();

  const total = images.length;

  // Auto-slide every 4 seconds — only while it's on screen and not hovered
  useEffect(() => {
    if (!autoplay || hovered || !inView || reduceMotion || total <= 1) return;
    const interval = setInterval(() => {
      setSlide(([prev]) => [(prev + 1) % total, 1]);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay, hovered, inView, reduceMotion, total]);

  const step = (dir) => {
    setAutoplay(false);
    setSlide(([prev]) => [(prev + dir + total) % total, dir]);
  };

  const goTo = (idx) => {
    setAutoplay(false);
    setSlide(([prev]) => [idx, idx >= prev ? 1 : -1]);
  };

  if (total === 0) return null;

  return (
    <div
      ref={ref}
      className="relative w-full group"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className={`relative overflow-hidden bg-background ${aspect}`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={current}
            src={images[current]}
            alt={`${alt} ${current + 1}`}
            draggable={false}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE_OUT }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_DISTANCE) step(1);
              else if (info.offset.x > SWIPE_DISTANCE) step(-1);
            }}
            className={`absolute inset-0 w-full h-full object-cover object-top ${
              total > 1 ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          />
        </AnimatePresence>

        {/* Gradient overlay (subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Buttons (only show if more than 1 image).
            Always visible on touch screens, fade in on hover with a mouse. */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm border border-accent/30 text-accent flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-accent hover:text-background transition-all duration-300"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm border border-accent/30 text-accent flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-accent hover:text-background transition-all duration-300"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image counter */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-accent/20 text-xs font-mono text-paper/70 pointer-events-none">
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1 py-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={current === idx ? "true" : undefined}
              className="grid h-6 place-items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "w-8 bg-accent glow-box"
                    : "w-2 bg-accent/30 hover:bg-accent/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
