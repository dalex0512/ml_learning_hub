/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBF6EC",
        panel: "#FFFDF8",
        sticky: "#FFF6DC",
        "text-main": "#2E2A22",
        "text-muted": "#57503F",
        "text-sub": "#8A8172",
        "paper-border": "#E7D9A8",
        "paper-dashed": "#DED2AE",
        "paper-dashed-dark": "#C9BC97",
        "accent-red": "#D64545",
        "accent-dark": "#2E2A22",
        "accent-sticky-yellow": "#F3D34A",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "'Be Vietnam Pro'", "sans-serif"],
        hand: ["var(--font-hand)", "'Patrick Hand'", "'Pangolin'", "cursive"],
        mono: ["var(--font-jetbrains-mono)", "'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        paper: "3px 4px 0 rgba(0, 0, 0, 0.04)",
        "paper-md": "4px 6px 0 rgba(0, 0, 0, 0.06)",
        "sticky-note": "2px 3px 6px rgba(46, 42, 34, 0.08), 1px 2px 0 rgba(0,0,0,0.03)",
        "sticky-hover": "4px 6px 12px rgba(46, 42, 34, 0.12), 2px 3px 0 rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

