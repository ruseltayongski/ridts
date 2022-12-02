/* eslint-env node */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './node_modules/tw-elements/dist/js/**/*.js',

    // './src/assets/login/assets/js/main.js'
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    asideScrollbars: {
      light: "light",
      gray: "gray",
    },

    screens: {
      'sm': '540px',
      // => @media (min-width: 640px) { ... }

      'md': '720px',
      // => @media (min-width: 768px) { ... }

      'lg': '960px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1140px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1320px',
      // => @media (min-width: 1536px) { ... }
    },

    // container: {
    //   center: true,
    // },

    // spacing: {
    //   '0': '0px',
    //   '1': '4px',
    //   '2': '8px',
    //   '3': '12px',
    //   '4': '16px',
    //   '5': '20px',
    //   '6': '24px',
    //   '7': '28px',
    //   '8': '32px',
    //   '9': '36px',
    //   '10': '40px',
    //   '11': '44px',
    //   '12': '48px',
    //   '13': '52px',
    //   '14': '56px',
    //   '15': '60px',
    //   '16': '64px',
    //   '17': '68px',
    //   '18': '72px',
    //   '19': '76px',
    //   '20': '80px',
    //   '21': '84px',
    //   '22': '88px',
    //   '23': '92px',
    //   '24': '96px',
    //   '25': '100px',
    //   '110': '110px',
    //   '120': '120px',
    //   '130': '130px',
    //   '140': '140px',
    //   '150': '150px',
    //   '160': '160px',
    //   '170': '170px',
    //   '180': '180px',
    //   '190': '190px',
    //   '200': '200px',
    //   '260': '260px',
    // },

    extend: {
      zIndex: {
        "-1": "-1",
      },
      flexGrow: {
        5: "5",
      },
      maxHeight: {
        "screen-menu": "calc(100vh - 3.5rem)",
        modal: "calc(100vh - 160px)",
      },
      transitionProperty: {
        position: "right, left, top, bottom, margin, padding",
        textColor: "color",
      },
      keyframes: {
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        "fade-out": "fade-out 250ms ease-in-out",
        "fade-in": "fade-in 250ms ease-in-out",
      },

      // colors: {
      //   "white": "#ffffff",
      //   "black": "#38424D",
      //   "gray": "#FBFBFF",
      //   "yellow": "#FDD446",
      //   "theme-color": "#F94F4F",
      //   "border-color": "#E8E8E8",
      //   "body-color": "#747E88",
      //   "heading-color": "#162447",
      //   "shadow": "#9D6A6A",
      // },

      // zIndex: {
      //   '-10': '-10',
      //   '-20': '-20',
      //   '-30': '-30',
      //   '-40': '-40',
      // },

      // transitionDelay: {
      //   '400': '400ms',
      //   '600': '600ms',
      //  }

    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "aside-scrollbars": (value) => {
            const track = value === "light" ? "100" : "900";
            const thumb = value === "light" ? "300" : "600";
            const color = value === "light" ? "gray" : value;

            return {
              scrollbarWidth: "thin",
              scrollbarColor: `${theme(`colors.${color}.${thumb}`)} ${theme(
                `colors.${color}.${track}`
              )}`,
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: theme(`colors.${color}.${track}`),
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "0.25rem",
                backgroundColor: theme(`colors.${color}.${thumb}`),
              },
            };
          },
        },
        { values: theme("asideScrollbars") }
      );
    }),
    require("@tailwindcss/line-clamp"),
    require('tw-elements/dist/plugin')
  ],
};
