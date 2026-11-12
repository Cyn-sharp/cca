/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "The Console" — near-black with a violet cast, paper text, one violet accent
        background: "#0A0A0F",
        void: "#06060B",
        panel: "#11111A",
        panel2: "#15151F",
        paper: "#EDEDF2",
        muted: "#84849B",
        accent: "#8F84FF",
        signal: "#FFB020",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque Variable"', '"Inter Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
