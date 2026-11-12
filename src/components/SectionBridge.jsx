import { useId, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { SPRING_SCROLL } from "../lib/motion";

// The trace is drawn in a 240 × 208 box and mirrored for the "right" variant.
const TRACE = "M120 0 V44 L72 92 V128 L120 176 V208";

// The connector between two sections: a circuit-board trace that draws
// itself as you scroll, with a signal travelling along it. When the signal
// reaches the end, the node lights up and hands over to the next section.
export default function SectionBridge({ variant = "left" }) {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const gradientId = useId();
  const reduceMotion = useReducedMotion();
  const [arrived, setArrived] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.66"],
  });
  const progress = useSpring(scrollYProgress, SPRING_SCROLL);

  useMotionValueEvent(progress, "change", (v) => setArrived(v > 0.965));

  // Position of the travelling signal along the trace.
  const pointAt = (v) => {
    const path = pathRef.current;
    if (!path) return { x: 120, y: 0 };
    return path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, v)));
  };
  const signalX = useTransform(progress, (v) => pointAt(v).x);
  const signalY = useTransform(progress, (v) => pointAt(v).y);
  const signalOpacity = useTransform(progress, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  // Side branches light up as the signal passes them.
  const branchA = useTransform(progress, [0.08, 0.2], [0.14, 0.9]);
  const branchB = useTransform(progress, [0.48, 0.6], [0.14, 0.9]);

  const lit = reduceMotion || arrived;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative z-10 flex flex-col items-center py-2"
    >
      <svg
        width="240"
        height="208"
        viewBox="0 0 240 208"
        fill="none"
        className="overflow-visible"
        style={variant === "right" ? { transform: "scaleX(-1)" } : undefined}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="208" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F59E0B" />
            <stop offset="0.35" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* start pad */}
        <circle cx="120" cy="0" r="3" fill="#0A0A0F" stroke="rgba(249,250,251,0.3)" strokeWidth="1.5" />

        {/* unlit copper */}
        <path d={TRACE} stroke="rgba(249,250,251,0.1)" strokeWidth="1.5" strokeLinejoin="round" />

        {/* side branches ending in vias */}
        <motion.g style={{ opacity: reduceMotion ? 0.9 : branchA }} stroke="#22D3EE" strokeWidth="1.5">
          <path d="M120 26 H150" />
          <circle cx="155" cy="26" r="3.5" fill="#0A0A0F" />
        </motion.g>
        <motion.g style={{ opacity: reduceMotion ? 0.9 : branchB }} stroke="#22D3EE" strokeWidth="1.5">
          <path d="M72 110 H40" />
          <circle cx="35" cy="110" r="3.5" fill="#0A0A0F" />
          <path d="M72 122 H52" />
          <circle cx="47" cy="122" r="3.5" fill="#0A0A0F" />
        </motion.g>

        {/* lit trace */}
        <motion.path
          ref={pathRef}
          d={TRACE}
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength: reduceMotion ? 1 : progress,
            filter: "drop-shadow(0 0 6px rgba(34,211,238,0.75))",
          }}
        />

        {/* the signal */}
        {!reduceMotion && (
          <motion.circle
            r="4"
            fill="#ECFEFF"
            cx={signalX}
            cy={signalY}
            style={{
              opacity: signalOpacity,
              filter: "drop-shadow(0 0 8px rgba(103,232,249,1))",
            }}
          />
        )}
      </svg>

      {/* arrival node */}
      <div className="relative mt-2 grid h-4 w-4 place-items-center">
        {arrived && !reduceMotion && (
          <span className="node-ping absolute h-3.5 w-3.5 rounded-full border border-cyan-300" />
        )}
        <span
          className={`h-3 w-3 rotate-45 rounded-[3px] border transition-all duration-300 ${
            lit
              ? "border-cyan-300 bg-primary shadow-[0_0_18px_2px_rgba(6,182,212,0.8)]"
              : "border-textWhite/25 bg-background"
          }`}
        />
      </div>
    </div>
  );
}
