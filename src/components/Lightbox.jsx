import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SWIPE_DISTANCE = 80;

export default function Lightbox({
  images = [],
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) {
  const isOpen = currentIndex !== null && currentIndex !== undefined;
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  // Always call the latest handlers without re-running the effect below.
  const handlers = useRef({ onClose, onNext, onPrev });
  useEffect(() => {
    handlers.current = { onClose, onNext, onPrev };
  });

  // Lock body scroll + keyboard navigation + keep focus inside the viewer
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === "Escape")     handlers.current.onClose();
      if (e.key === "ArrowRight") handlers.current.onNext();
      if (e.key === "ArrowLeft")  handlers.current.onPrev();

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll("button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const inside = dialogRef.current.contains(document.activeElement);
        if (e.shiftKey && (!inside || document.activeElement === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  const image = isOpen ? images[currentIndex] : null;
  const hasMultiple = images.length > 1;

  // Rendered straight into <body> so it always covers the whole screen.
  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
        >
          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
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
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              aria-label="Previous photo"
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 z-10"
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          {/* Next button */}
          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              aria-label="Next photo"
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 border border-primary/30 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 z-10"
            >
              <FiChevronRight size={24} />
            </button>
          )}

          {/* Image — swipe left / right on touch screens */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              drag={hasMultiple ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_DISTANCE) onNext();
                else if (info.offset.x > SWIPE_DISTANCE) onPrev();
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center cursor-default"
            >
              <img
                src={image.full ?? image.src}
                alt={image.caption}
                draggable={false}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />

              {/* Caption */}
              {image.caption && (
                <motion.figcaption
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4 text-textWhite/80 text-center text-sm md:text-base font-medium px-4"
                >
                  {image.caption}
                </motion.figcaption>
              )}
            </motion.figure>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
