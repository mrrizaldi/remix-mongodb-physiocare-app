import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          "50": "hsl(215, 100%, 97%)",
          "100": "hsl(215, 100%, 95%)",
          "200": "hsl(215, 100%, 90%)",
          "300": "hsl(215, 100%, 80%)",
          "400": "hsl(215, 100%, 70%)",
          "500": "hsl(215, 100%, 50%)",
          "600": "hsl(215, 100%, 45%)",
          "700": "hsl(215, 100%, 40%)",
          "800": "hsl(215, 100%, 35%)",
          "900": "hsl(215, 100%, 30%)",
          DEFAULT: "hsl(215, 100%, 50%)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(215, 30%, 95%)",
          foreground: "hsl(215, 30%, 20%)",
        },
        muted: {
          DEFAULT: "hsl(215, 20%, 95%)",
          foreground: "hsl(215, 20%, 45%)",
        },
        accent: {
          DEFAULT: "hsl(195, 90%, 50%)",
          foreground: "hsl(195, 90%, 10%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 100%, 45%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        border: "hsl(215, 20%, 85%)",
        input: "hsl(215, 20%, 90%)",
        ring: "hsl(215, 100%, 50%)",
        chart: {
          "1": "hsl(215, 100%, 50%)",
          "2": "hsl(195, 90%, 50%)",
          "3": "hsl(235, 90%, 60%)",
          "4": "hsl(180, 80%, 45%)",
          "5": "hsl(205, 85%, 55%)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
