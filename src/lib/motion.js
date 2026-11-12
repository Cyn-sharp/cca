// Shared motion tokens so every animation on the site feels like one system.
export const EASE_OUT = [0.22, 1, 0.36, 1];

export const SPRING_SCROLL = { stiffness: 140, damping: 28, restDelta: 0.001 };
export const SPRING_POINTER = { stiffness: 180, damping: 20, mass: 0.5 };

// Keeps a value looping between min and max (used by the marquee).
export const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};
