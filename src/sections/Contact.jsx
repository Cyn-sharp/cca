import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiMail } from "react-icons/fi";

export default function Contact() {
  const { github, email } = portfolioData;

  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-primary font-mono text-sm mb-2"
        >
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black mb-6"
        >
          Let's connect<span className="text-accent">.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-textWhite/50 text-lg mb-12 leading-relaxed"
        >
          I'm always open to learning opportunities, collaborations, or just a
          good conversation about tech. Don't be shy — reach out!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-background font-bold hover:bg-primary/80 transition-all duration-200 glow-box"
          >
            <FiMail /> Send Email
          </a>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-primary/40 text-textWhite font-bold hover:border-primary hover:text-primary transition-all duration-200"
          >
            <FiGithub /> GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}