import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

// Floating button whose ring fills up as you read down the page.
export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setVisible(v > 0.12));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-background/80 text-textWhite/80 backdrop-blur-md transition-colors hover:text-primary sm:bottom-7 sm:right-7"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(249,250,251,0.12)" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <FiArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
