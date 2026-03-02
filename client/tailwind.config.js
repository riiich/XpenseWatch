/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        mono: ['"DM Mono"', "monospace"],
      },
      animation: {
        "fade-in":   "fadeIn 0.35s ease both",
        "pulse-dot": "pulseDot 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)"   },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%":      { opacity: "1",   transform: "scale(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
