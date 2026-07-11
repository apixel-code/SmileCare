import type { Config } from "tailwindcss";

/**
 * SmileCare design tokens — single source of truth (docs/design-system.md).
 * Custom tokens are prefixed/named (cta, ink-muted...) to avoid collisions
 * if shadcn or other internal utilities are added later.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E7C7B", // brand teal — headers, links, active states
          light: "#E8F4F8", // soft sky — section backgrounds
          dark: "#0A5F5E", // hover/pressed teal
        },
        cta: {
          DEFAULT: "#FF7A59", // coral — booking/payment CTAs ONLY
          dark: "#F26A48",
        },
        ink: {
          DEFAULT: "#1A2B3C", // headings/body
          muted: "#64748B", // secondary text
        },
        success: "#16A34A", // paid, confirmed
        warning: "#D97706", // partial, pending
        danger: "#DC2626", // due amounts, allergy badges, errors
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1FB358",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "sans-serif"],
      },
      fontSize: {
        // scale from design-system.md (size / line-height)
        h1: ["36px", { lineHeight: "44px", fontWeight: "800" }],
        "h1-mobile": ["28px", { lineHeight: "36px", fontWeight: "800" }],
        h2: ["28px", { lineHeight: "36px", fontWeight: "800" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        body: ["16px", { lineHeight: "26px" }],
        small: ["14px", { lineHeight: "22px" }],
      },
      borderRadius: {
        xl: "12px", // buttons/inputs
        "2xl": "16px", // cards
      },
      boxShadow: {
        soft: "0 4px 16px rgba(26,43,60,0.06)",
        "soft-md": "0 12px 30px rgba(14,124,123,0.14)",
        "soft-lg": "0 18px 40px rgba(14,124,123,0.18)",
        lift: "0 16px 40px rgba(26,43,60,0.14)",
      },
      maxWidth: {
        container: "1240px",
      },
      transitionTimingFunction: {
        // gentle "ease-out-expo" used everywhere for a calm, premium feel
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.6s ease-out both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
