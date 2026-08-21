import { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import Lightbox from "../components/Lightbox";
import { FiMaximize2 } from "react-icons/fi";

const facts = [
  { label: "Role",     value: "Full Stack Developer" },
  { label: "Status",   value: "Computer Engineering Student"           },
  { label: "Focus",    value: "Building Real World Applications" },
  { label: "Learning", value: "Always 📚"             },
];

export default function About() {
  const { bio, aboutImages } = portfolioData;
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox  = (i) => setLightboxIndex(i);
  const closeLightbox = ()  => setLightboxIndex(null);
  const nextImage     = ()  => setLightboxIndex((i) => (i + 1) % aboutImages.length);
  const prevImage     = ()  => setLightboxIndex((i) => (i - 1 + aboutImages.length) % aboutImages.length);

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary font-mono text-sm mb-2 text-center"
        >
          // about me
        </motion.p>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-center mb-16"
        >
          Who am I<span className="text-accent">?</span>
        </motion.h2>

        {/* Top — Text + Facts */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-textWhite/70 text-lg leading-relaxed mb-6">
              {bio}
            </p>
            <p className="text-textWhite/50 text-base leading-relaxed">
              I'm currently a student exploring the world of full stack development.
              I enjoy working on both the frontend and backend — from designing UI
              in Figma to building APIs and connecting databases. Every project I
              build teaches me something new.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-primary/20 bg-primary/5 glow-box hover:border-primary/40 transition-all duration-300"
              >
                <p className="text-primary text-xs font-mono mb-1">{fact.label}</p>
                <p className="text-textWhite font-bold text-sm">{fact.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom — Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <p className="text-primary font-mono text-xs mb-2">
              // life as a student
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-textWhite mb-3">
              Behind the code<span className="text-accent">.</span>
            </h3>
            <p className="text-textWhite/40 text-sm">
              Click any photo to view full-size 🔍
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutImages.map((image, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => openLightbox(i)}
                className={`relative overflow-hidden rounded-2xl border border-primary/20 group cursor-pointer ${
                  i === 1 ? "md:row-span-2 md:translate-y-6" : ""
                }`}
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden bg-background">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Zoom icon — appears on hover */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-primary/90 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  <FiMaximize2 size={16} />
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-accent font-mono text-xs mb-1">
                    0{i + 1}
                  </p>
                  <p className="text-textWhite font-semibold text-sm leading-snug line-clamp-2">
                    {image.caption}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors duration-300 rounded-tr-lg" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={aboutImages}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
}