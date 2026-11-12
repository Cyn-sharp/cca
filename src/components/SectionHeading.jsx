import { motion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const word = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.75, ease: EASE_OUT } },
};

// Wait until the heading is clear of the bottom quarter of the screen, so it
// appears right as the signal from the bridge above arrives.
const VIEWPORT = { once: true, margin: "0px 0px -24% 0px" };

const SIZES = {
  lg: "text-4xl sm:text-5xl md:text-6xl",
  md: "text-3xl sm:text-4xl md:text-5xl",
};

// Section title: a "// label" line, then a heading whose words rise into
// place one by one when it scrolls into view.
export default function SectionHeading({
  as: Tag = "h2",
  index,
  label,
  title,
  mark = ".",
  labelClass = "text-primary",
  markClass = "text-accent",
  size = "lg",
  children,
}) {
  const words = title.split(" ");

  return (
    <div className="mx-auto max-w-3xl text-center">
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className={`mb-3 font-mono text-sm ${labelClass}`}
        >
          {index && <span className="mr-2 text-textWhite/35">{index}</span>}
          {`// ${label}`}
        </motion.p>
      )}

      <Tag
        aria-label={`${title}${mark}`}
        className={`font-display font-extrabold leading-[1.02] tracking-[-0.025em] ${SIZES[size]}`}
      >
        <motion.span
          aria-hidden="true"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`}>
              {/* padding keeps descenders (g, y, p) from being clipped by the mask */}
              <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
                <motion.span variants={word} className="inline-block">
                  {w}
                  {i === words.length - 1 && <span className={markClass}>{mark}</span>}
                </motion.span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </motion.span>
      </Tag>

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT }}
          className="mt-5 text-sm text-textWhite/50 sm:text-base"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
