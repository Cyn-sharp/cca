/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#0F1018",
        primary: "#06B6D4",
        accent: "#F59E0B",
        textWhite: "#F9FAFB",
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque Variable"', '"Inter Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      screens: {
        // Tall desktop viewports only — used for the stacked project cards.
        stack: { raw: "(min-width: 1024px) and (min-height: 780px)" },
      },
    },
  },
  plugins: [],
};
