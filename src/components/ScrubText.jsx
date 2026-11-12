import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function Word({ children, progress, range, className }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={className}>
      {children}
    </motion.span>
  );
}

// A paragraph that "lights up" word by word as you scroll through it,
// and dims again if you scroll back up.
export default function ScrubText({ text, className = "", highlight = [] }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");
  const isHighlighted = (w) => highlight.includes(w.replace(/[^\p{L}\p{N}']/gu, ""));

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const cls = isHighlighted(w) ? "text-accent" : undefined;
        if (reduceMotion) {
          return (
            <span key={i} className={cls}>
              {w}{" "}
            </span>
          );
        }
        const start = i / words.length;
        const end = Math.min(1, start + 2.5 / words.length);
        return (
          <span key={i}>
            <Word progress={scrollYProgress} range={[start, end]} className={cls}>
              {w}
            </Word>{" "}
          </span>
        );
      })}
    </p>
  );
}
