import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useFinePointer } from "../hooks/useMediaQuery";
import { SPRING_POINTER } from "../lib/motion";

const GRID = 32; // must match background-size of .bg-dots

// Fixed backdrop behind the whole site:
//  • a dot grid that drifts slower than the page (parallax)
//  • two colour glows that travel as you scroll
//  • a soft light that follows the cursor (mouse devices only)
export default function Background() {
  const { scrollY, scrollYProgress } = useScroll();
  const finePointer = useFinePointer();

  // Grid moves at 12% of scroll speed and loops every cell, so it never runs out.
  const gridY = useTransform(scrollY, (v) => -((v * 0.12) % GRID));

  const cyanX = useTransform(scrollYProgress, [0, 1], ["-10%", "55%"]);
  const cyanY = useTransform(scrollYProgress, [0, 1], ["-5%", "45%"]);
  const amberX = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);
  const amberY = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);

  const pointerX = useMotionValue(-1000);
  const pointerY = useMotionValue(-1000);
  const lightX = useSpring(pointerX, SPRING_POINTER);
  const lightY = useSpring(pointerY, SPRING_POINTER);

  useEffect(() => {
    if (!finePointer) return;
    const onMove = (e) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, pointerX, pointerY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="bg-dots-mask absolute inset-0">
        <motion.div
          className="bg-dots absolute inset-x-0 -bottom-8 -top-8"
          style={{ y: gridY }}
        />
      </div>

      <motion.div
        className="absolute left-0 top-0 h-[70vmax] w-[70vmax] rounded-full"
        style={{
          x: cyanX,
          y: cyanY,
          background:
            "radial-gradient(closest-side, rgba(6,182,212,0.13), transparent)",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-[60vmax] w-[60vmax] rounded-full"
        style={{
          x: amberX,
          y: amberY,
          background:
            "radial-gradient(closest-side, rgba(245,158,11,0.09), transparent)",
        }}
      />

      {finePointer && (
        <motion.div
          className="absolute left-0 top-0 -ml-[320px] -mt-[320px] h-[640px] w-[640px] rounded-full"
          style={{
            x: lightX,
            y: lightY,
            background:
              "radial-gradient(closest-side, rgba(103,232,249,0.07), transparent)",
          }}
        />
      )}
    </div>
  );
}
