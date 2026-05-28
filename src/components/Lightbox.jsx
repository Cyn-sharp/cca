import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect } from "react";

export default function Lightbox({
  images = [],
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) {
  const isOpen = currentIndex !== null && currentIndex !== undefined;

  // Lock body scroll + keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft")  onPrev();
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  const image = images[currentIndex];
  const hasMultiple = images.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{    opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-background/80 border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 z-10"
        >
          <FiX size={24} />
        </button>

        {/* Counter */}
        {hasMultiple && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2 rounded-full bg-background/80 border border-primary/20 text-textWhite/80 text-sm font-mono z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Previous button */}
        {hasMultiple && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 z-10"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {/* Next button */}
        {hasMultiple && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 z-10"
          >
            <FiChevronRight size={24} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{    opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl max-h-[85vh] flex flex-col items-center cursor-default"
        >
          <img
            src={image.src}
            alt={image.caption}
            className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
          />

          {/* Caption */}
          {image.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-textWhite/80 text-center text-sm md:text-base font-medium px-4"
            >
              {image.caption}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}