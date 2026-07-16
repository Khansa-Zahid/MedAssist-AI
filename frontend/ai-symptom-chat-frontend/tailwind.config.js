/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Named palette — a quiet garden/tea-room feel rather than
        // clinical hospital blue or a generic AI cream+terracotta look.
        sage: {
          50: "#F3F6F1",
          100: "#E3EBDE",
          200: "#C6D8BD",
          300: "#A3C097",
          400: "#87A97A",
          500: "#6B8F61", // primary — calm, self-care
          600: "#57764E",
          700: "#455D3E",
          800: "#33452F",
          900: "#232F20",
        },
        dusk: {
          50: "#F2F5F7",
          100: "#E1E9EE",
          200: "#C3D2DC",
          300: "#9FB4C3",
          400: "#7C93A8", // AI voice, trust
          500: "#5F7A91",
          600: "#4A6274",
          700: "#394C5B",
          800: "#293742",
          900: "#1C262E",
        },
        mist: {
          50: "#FBFCFA",
          100: "#EFF2ED", // app background — cool, pale sage-grey
          200: "#E1E6DD",
          300: "#CDD6C7",
        },
        ink: {
          400: "#565F51",
          600: "#3B4237",
          900: "#23291F", // primary text
        },
        amber: {
          100: "#F7E9C9",
          300: "#E3BE73",
          500: "#C99A44", // see-a-doctor-soon
          700: "#8F6C2C",
        },
        clay: {
          100: "#F3DDD7",
          300: "#D69C8D",
          500: "#B85C4A", // urgent / emergency — used sparingly, stays meaningful
          700: "#833F32",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Noto Sans Arabic", "Inter", "system-ui", "sans-serif"],
        urdu: ["Noto Nastaliq Urdu", "Noto Sans Arabic", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 16px -4px rgba(35, 41, 32, 0.10)",
        softer: "0 1px 8px -2px rgba(35, 41, 32, 0.08)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe: "breathe 3.2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
