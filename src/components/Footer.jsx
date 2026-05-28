import { portfolioData } from "../data/portfolioData";
import { FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
  const { github, email } = portfolioData;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-textWhite/30 text-sm font-mono">
          © {year} <span className="text-primary">Cyndrick Abejo</span> — Built with React
        </p>

        <div className="flex items-center gap-4 text-textWhite/30">
          <a href={github} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
            <FiGithub size={18} />
          </a>
          <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
            <FiMail size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
}