import { motion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";

// Fades + lifts its children into place the first time they scroll into view.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  amount = 0.35,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
