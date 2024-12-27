import { type Config } from "tailwindcss";

const colors = {
  racingGreen: {
    "950": "hsl(160, 14%, 2%)",
    "900": "hsl(160, 14%, 10%)",
    "800": " hsl(160, 14%, 18%)",
    "700": " hsl(160, 14%, 26%)",
    "600": " hsl(160, 14%, 34%)",
    "500": " hsl(160, 14%, 41%)",
    "400": " hsl(160, 14%, 49%)",
    "300": " hsl(160, 14%, 57%)",
    "200": " hsl(160, 14%, 65%)",
    "100": " hsl(160, 14%, 73%)",
    "50": " hsl(160, 14%, 81%)",
    DEFAULT: " hsl(160, 14%, 41%)",
  },
  mustardYellow: {
    "950": "hsl(40, 81%, 45%)",
    "900": "hsl(40, 81%, 50%)",
    "800": "hsl(40, 81%, 55%)",
    "700": "hsl(40, 81%, 60%)",
    "600": "hsl(40, 81%, 65%)",
    "500": "hsl(40, 81%, 70%)",
    "400": "hsl(40, 81%, 75%)",
    "300": "hsl(40, 81%, 80%)",
    "200": "hsl(40, 81%, 85%)",
    "100": "hsl(40, 81%, 90%)",
    "50": "hsl(40, 81%, 95%)",
    DEFAULT: "hsl(40, 81%, 70%)",
  },
  foreground: {
    DEFAULT: "hsl(0, 0%, 7%)",
  },
  background: {
    DEFAULT: "hsl(51, 88%, 97%)",
  },
};

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "racing-green": colors.racingGreen,
        "mustard-yellow": colors.mustardYellow,
        foreground: colors.foreground,
        background: colors.background,
      },
      textColor: {
        "racing-green": colors.racingGreen,
        "mustard-yellow": colors.mustardYellow,
        foreground: colors.foreground,
        background: colors.background,
      },
      fontFamily: {
        anaheim: ["Anaheim"],
      },
    },
  },
} satisfies Config;
