import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiVideo,
} from "react-icons/fi";
import { EASE_OUT } from "../lib/motion";

const SWIPE_DISTANCE = 60;
const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

// Turn YouTube / Google Drive share links into embeddable iframe URLs
function getEmbedUrl(url) {
  if (typeof url !== "string") return null;

  // YouTube: watch?v=, youtu.be/, shorts/, embed/
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    const id = ytMatch[1];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }

  // Google Drive: /file/d/<id>/view -> /file/d/<id>/preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  return null;
}

function normalizeSlide(item) {
  if (!item) return null;
  if (typeof item === "object" && item.src) {
    const embed = getEmbedUrl(item.src);
    return {
      type: item.type ?? (embed ? "embed" : VIDEO_EXT_RE.test(item.src) ? "video" : "image"),
      src: embed ?? item.src,
      poster: item.poster,
    };
  }
  if (typeof item === "string") {
    const embed = getEmbedUrl(item);
    if (embed) return { type: "embed", src: embed };
    if (VIDEO_EXT_RE.test(item)) return { type: "video", src: item };
    return { type: "image", src: item };
  }
  return null;
}

// Slides come in from the side you're moving towards.
const slide = {
  enter:  (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit:   (direction) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

function VideoSlide({ src, poster, active, inView, title }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [missing, setMissing] = useState(false);

  // Play when visible on screen & active slide; pause otherwise to save CPU
  useEffect(() => {
    const el = videoRef.current;
    if (!el || missing) return;
    if (active && inView) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active, inView, missing]);

  const handleFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  // Resolve relative public paths cleanly with Vite's BASE_URL (works on Vercel, GitHub Pages, etc.)
  const resolvedSrc =
    src.startsWith("/") && !src.startsWith("//")
      ? `${import.meta.env.BASE_URL}${src.slice(1)}`
      : src;

  if (missing) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/90 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary glow-box">
          <FiVideo size={22} />
        </div>
        <p className="font-display text-base font-bold text-textWhite">
          Demo Video Ready Slot
        </p>
        <p className="max-w-sm font-mono text-xs text-textWhite/55">
          Drop your video file at{" "}
          <code className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">
            public{src.startsWith("/") ? src : `/${src}`}
          </code>{" "}
          or paste a YouTube / Drive link in <code className="text-accent">portfolioData.js</code>
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      <video
        ref={videoRef}
        src={resolvedSrc}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={`${title} demo video`}
        onError={() => setMissing(true)}
        className="h-full w-full object-cover"
      />

      {/* Top-left live demo badge */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/75 px-2.5 py-1 font-mono text-[11px] text-primary backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        Demo
      </div>

      {/* Bottom-left quick controls: mute/unmute + fullscreen */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-background/75 text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-background"
        >
          {muted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </button>
        <button
          type="button"
          onClick={handleFullscreen}
          aria-label="Fullscreen video"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-background/75 text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-background"
        >
          <FiMaximize size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ImageCarousel({
  images = [],
  video = null,
  poster = null,
  alt = "Project image",
  aspect = "aspect-video",
}) {
  const media = [
    ...(video ? [normalizeSlide({ src: video, poster })] : []),
    ...images.map(normalizeSlide),
  ].filter(Boolean);

  const [[current, direction], setSlide] = useState([0, 1]);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();

  const total = media.length;
  const activeItem = media[current];
  const isVideoActive = activeItem?.type === "video" || activeItem?.type === "embed";

  // Auto-slide every 4 seconds — pause while a video slide is playing
  useEffect(() => {
    if (!autoplay || hovered || !inView || reduceMotion || total <= 1 || isVideoActive) {
      return;
    }
    const interval = setInterval(() => {
      setSlide(([prev]) => [(prev + 1) % total, 1]);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoplay, hovered, inView, reduceMotion, total, isVideoActive]);

  const step = (dir) => {
    setAutoplay(false);
    setSlide(([prev]) => [(prev + dir + total) % total, dir]);
  };

  const goTo = (idx) => {
    setAutoplay(false);
    setSlide(([prev]) => [idx, idx >= prev ? 1 : -1]);
  };

  if (total === 0) return null;

  return (
    <div
      ref={ref}
      className="relative w-full group"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Media container */}
      <div className={`relative overflow-hidden bg-background ${aspect}`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE_OUT }}
            drag={total > 1 && activeItem.type === "image" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_DISTANCE) step(1);
              else if (info.offset.x > SWIPE_DISTANCE) step(-1);
            }}
            className="absolute inset-0 h-full w-full"
          >
            {activeItem.type === "video" ? (
              <VideoSlide
                src={activeItem.src}
                poster={activeItem.poster}
                active
                inView={inView}
                title={alt}
              />
            ) : activeItem.type === "embed" ? (
              <iframe
                src={activeItem.src}
                title={`${alt} demo video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <img
                src={activeItem.src}
                alt={`${alt} ${current + 1}`}
                draggable={false}
                className={`h-full w-full object-cover object-top ${
                  total > 1 ? "cursor-grab active:cursor-grabbing" : ""
                }`}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay (subtle, skip over embedded iframes so clicks pass through) */}
        {activeItem.type !== "embed" && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Navigation Buttons (only show if more than 1 slide).
            Always visible on touch screens, fade in on hover with a mouse. */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30 text-primary flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-primary hover:text-background transition-all duration-300"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next slide"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30 text-primary flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-primary hover:text-background transition-all duration-300"
            >
              <FiChevronRight size={18} />
            </button>
          </>
        )}

        {/* Slide counter */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-primary/20 text-xs font-mono text-textWhite/70 pointer-events-none">
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1 py-2">
          {media.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={current === idx ? "true" : undefined}
              className="grid h-6 place-items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "w-8 bg-primary glow-box"
                    : "w-2 bg-primary/30 hover:bg-primary/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
