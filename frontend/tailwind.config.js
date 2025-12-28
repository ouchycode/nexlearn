/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "bg-main": "var(--bg-main)",
        "bg-card": "var(--bg-card)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "border-color": "var(--border)",
      },
      boxShadow: {
        glow: "0 0 20px var(--accent-glow)",
      },
      // --- TAMBAHAN WAJIB AGAR ANIMASI DI HOME.JSX JALAN ---
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
