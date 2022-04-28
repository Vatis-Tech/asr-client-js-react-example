const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,json}", "./public/index.html"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      backgroundPosition: {
        50: "50%",
      },
      maxWidth: {
        6: "1.5rem",
        unset: "unset",
        46: "11.5rem",
      },
      minWidth: {
        60: "15rem",
        40: "10rem",
        30: "7.5rem",
      },
      inset: {
        unset: "unset",
        90: "22.5rem",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: [".70rem", "1.5rem"],
      },
      width: {
        unset: "unset",
        "full--64": "calc(100% - 16rem)",
        15: "3.75rem",
        120: "30rem",
      },
      textAlign: {
        unset: "unset",
      },
      minHeight: {
        "screen--5.5": "calc(100vh - 5.5rem)",
        "screen--3.75": "calc(100vh - 3.75rem)",
        "screen--13": "calc(100vh - 13rem)",
        "600px": "600px",
      },
      height: {
        22: "5.5rem",
        "14-i": "3.5rem!important",
        "screen--9.75": "calc(100vh - 9.75rem)",
        "screen--13.375": "calc(100vh - 13.375rem)",
        "screen--16.25": "calc(100vh - 16.25rem)",
        "screen--18.75": "calc(100vh - 18.75rem)",
      },
      zIndex: {
        1: "1",
        2: "2",
        6: "6",
        9999: "9999",
      },
      margin: {
        "6/12": "25%",
        "0-i": "0!important",
      },
      rotate: {
        "-18": "-18deg",
      },
    },
    colors: {
      ...colors,
      transparent: "transparent",
      current: "current",
    },
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      padding: ["focus"],
      translate: ["group-hover"],
      zIndex: ["hover"],
      margin: ["last"],
      rotate: ["group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
