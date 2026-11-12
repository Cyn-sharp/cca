import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "../hooks/useMediaQuery";

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 };

// Pulls its child slightly towards the cursor — used on the main buttons.
export default function Magnetic({ children, strength = 0.28, className = "" }) {
  const ref = useRef(null);
  const finePointer = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const handleMove = (e) => {
    if (!finePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
