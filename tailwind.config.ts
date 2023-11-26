import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar1: "#ffffff",
        container1: "#292D3E",
        border1: "#e5e5e5",
        container1Hover: "#353A4F",
        mainAction: "#AD1FEA",
        mainActionHover: "#C75AF6",
        cancelAction: "#3A4374",
        cancelActionHover: "#656EA3",
        link1: "#4661E6",
        link1Hover: "#7c91f9",
        background: "#f7f8fd",
        text1: "#647196",
        error1: "#D73737",
        headingText1: "#3A4374",
      },
      screens: {
        "1xl": "1440px",
        sm: "450px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontSize: {
        heading1: "24px",
        heading2: "20px",
        heading3: "18px",
        heading4: "14px",
        body1: "16px",
        body2: "15px",
        body3: "13px",
      },
      lineHeight: {
        headingXL: "30px",
        headingL: "23px",
        headingM: "19px",
        headingS: "15px",
        bodyL: "23px",
        bodyM: "12px",
      },
      letterSpacing: {
        headingS: "2.4px",
      },
      fontFamily: {
        jost: ["Jost", "sans-serif"],
      },
    },
  },

  plugins: [],
} satisfies Config;
