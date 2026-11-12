// Images in assets/optimized are resized WebP copies of the originals in
// assets/ (much smaller downloads, same look).
import uconvertit1 from "../assets/optimized/uconvertit-1.webp";
import uconvertit2 from "../assets/optimized/uconvertit-2.webp";
import about1 from "../assets/optimized/about-1.webp";
import about2 from "../assets/optimized/about-2.webp";
import about3 from "../assets/optimized/about-3.webp";
import about1Full from "../assets/optimized/about-1-full.webp";
import about2Full from "../assets/optimized/about-2-full.webp";
import about3Full from "../assets/optimized/about-3-full.webp";
import meNormal from "../assets/optimized/me-normal.webp";
import meCool from "../assets/optimized/me-cool.webp";
import garbo1 from "../assets/optimized/garbo-1.webp";
import garbo2 from "../assets/optimized/garbo-2.webp";
import garbo3 from "../assets/optimized/garbo-3.webp";

export const portfolioData = {
  name: "Cyndrick Abejo",
  role: "Full Stack Developer",
  status: "Student",
  bio: "Hey, I'm Cyndrick — a student who spends more time coding than sleeping. I build real projects to learn real skills. Full Stack is my playground.",
  github: "https://github.com/Cyn-sharp",
  email: "cyndrickabejo@gmail.com",
  facebook: "#",

  exploredTech: [
    "Node.js",
    "Express",
    "MongoDB",
    "Git",
    "GitHub",
    "Postman",
    "VS Code",
    "Bootstrap",
    "HTML5",
    "CSS3",
    "REST API",
    "JSON",
    "npm",
    "Netlify",
    "Photoshop",
    "Discord API",
    "Java",
    "PHP",
    "XAMPP",
    "Android Studio",
  ],


  techStack: [
    { name: "React",      color: "#61DAFB" },
    { name: "JavaScript", color: "#F7DF1E" },
    { name: "C#",         color: "#9B59B6" },
    { name: "Python",     color: "#3776AB" },
    { name: "C",          color: "#A8B9CC" },
    { name: "Supabase",   color: "#3ECF8E" },
    { name: "MySQL",      color: "#4479A1" },
    { name: "Figma",      color: "#F24E1E" },
  ],

  // src  = thumbnail shown in the gallery
  // full = larger version shown in the lightbox
  // width / height = the photo's shape (only the ratio matters), used to lay out the gallery
  aboutImages: [
    { src: about1, full: about1Full, width: 3, height: 4, caption: "GARBO presentation succeed!" },
    { src: about2, full: about2Full, width: 3, height: 4, caption: "UConvertIT" },
    { src: about3, full: about3Full, width: 4, height: 3, caption: "UConvertIT team picture" },
  ],

   photos: {
    normal: meNormal,
    cool: meCool,
  },
  
  projects: [
  {
    id: 1,
    title: "UConvertIT",
    tagline: "Your All-in-One Academic Power Tool",
    description:
      "An AI-powered academic productivity tool built for students. Features a Paraphraser, PDF Converter, Humanizer, Quiz Maker, and OCR — all in one platform.",
    tech: ["React", "Supabase", "Python"],
    github: "https://github.com/Cyn-sharp",
    live: "https://u-convertit-frontend.vercel.app/",
    figma: null,         // 👈 no figma for this one
    images: [uconvertit1, uconvertit2],
    featured: true,
  },
  {
    id: 2,
    title: "GARBO",
    tagline: "Smart Waste Collection App — UI/UX Design",
    description:
      "A mobile app design concept for modern waste management. Features dual-user experience — residents can track collection schedules, report issues, and view live trucks, while collectors get a dedicated dashboard to manage routes and report problems. Designed with clarity, accessibility, and real community impact in mind.",
    tech: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
    github: null,
    live: null,
    figma: "https://www.figma.com/design/MBzsadyU0hqHW6Ljm15jqg/SOFTWARE-APPLICATION-V2?node-id=0-1&t=VkCy0VUROClo3UMR-1",
    images: [garbo1, garbo2, garbo3],
    isFigmaProject: true,
    featured: false,
},
],
};

