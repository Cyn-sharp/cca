import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ImageCarousel({ images = [], alt = "Project image" }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const total = images.length;

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay, total]);

  const next = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const goTo = (idx) => {
    setAutoplay(false);
    setCurrent(idx);
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full group">
      {/* Image container */}
      <div className="relative overflow-hidden rounded-xl border border-primary/20 shadow-2xl aspect-video bg-background">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${alt} ${current + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1    }}
            exit={{    opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </AnimatePresence>

        {/* Gradient overlay (subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Buttons (only show if more than 1 image) */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-background transition-all duration-300"
            >
              <FiChevronLeft size={20} />
            </button>

            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-background transition-all duration-300"
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter */}
        {total > 1 && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/20 text-xs font-mono text-textWhite/70">
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to image ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx
                  ? "w-8 bg-primary glow-box"
                  : "w-2 bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}