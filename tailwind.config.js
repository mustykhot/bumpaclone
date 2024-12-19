/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#009444",
        "grey-01": "#5C636D",
        "grey-02": "#848D99",
        "grey-03": "#9BA2AC",
        "black-02": "#222D37",
        error: "#D90429",
        white: "#ffffff",
        "text-grey": "#585563",
        "grey-00": "#EFF1F3",
        "state-error": "#D90429",
      },
      backgroundColor: {
        "grey-00": "#EFF1F3",
        "grey-05": "#EFF2F6",
        "grey-table-hover": "#F9FAFB",
        light: "#FAFAFA",
        white: "#ffffff",
        "pastel-red": "#FBE6EA",
        "pastel-green": "#EBF6F0",
        "light-grey": "#F8F8F8",
      },
      borderColor: (theme) => ({
        primary: "#009444",
        "grey-03": "#9BA2AC",
      }),
      animation: {
        slide: "slide 0.6s ease-in-out",
      },
      boxShadow: {
        card: "0px 0px 40px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(150vw)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      screens: {
        sm: { max: "767px" },
        md: { max: "1023px" },
      },
    },
  },
  plugins: [],
};
