import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { wrap } from "../lib/motion";

const COPIES = 4; // enough repeats to fill ultra-wide screens

// An endless row that drifts on its own, then speeds up, leans and changes
// direction with your scrolling. Hovering pauses it.
export default function VelocityMarquee({ children, baseVelocity = -1.4, className = "" }) {
  const ref = useRef(null);
  const paused = useRef(false);
  const direction = useRef(1);
  const inView = useInView(ref, { margin: "100px 0px" });
  const reduceMotion = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2500, 2500], [7, -7]);

  // Each copy is 1/COPIES of the track, so looping over one copy is seamless.
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || paused.current) return;

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    // delta is capped so the row doesn't jump after the tab was in the background
    let moveBy = direction.current * baseVelocity * (Math.min(delta, 64) / 1000);
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  // With "reduce motion" on, show a normal wrapped list instead.
  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        <div className="flex flex-wrap items-center justify-center">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      <motion.div className="flex w-max will-change-transform" style={{ x, skewX }}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
