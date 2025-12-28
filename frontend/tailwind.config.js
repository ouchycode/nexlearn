/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      // KITA HUBUNGKAN TAILWIND CLASS KE VARIABLE CSS
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
    },
  },
  plugins: [],
};
