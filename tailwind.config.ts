import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0d10",
          raised: "#12161b",
          elevated: "#191e24",
        },
        line: {
          DEFAULT: "#242a31",
          soft: "#1a1f25",
        },
        ink: {
          DEFAULT: "#f2f5f7",
          dim: "#98a2ae",
          faint: "#5c6570",
        },
        ember: {
          DEFAULT: "#ff6a3d",
          soft: "#ff8a61",
          dim: "#4a2a1c",
        },
        signal: {
          DEFAULT: "#3db2ff",
          soft: "#6fc7ff",
          dim: "#1a3247",
        },
        mint: {
          DEFAULT: "#5ee6a8",
          dim: "#1c3d31",
        },
        warn: {
          DEFAULT: "#ffc857",
          dim: "#453210",
        },
        danger: {
          DEFAULT: "#ff5470",
          dim: "#3f1620",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(255,106,61,0.25), 0 0 24px -4px rgba(255,106,61,0.35)",
      },
      keyframes: {
        "trace-draw": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        trace: "trace-draw 1.8s ease-out forwards",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
