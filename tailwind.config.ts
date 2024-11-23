import { type Config } from "tailwindcss";

const colors = {
  racingGreen: {
    "racing-green-950": "hsl(160, 14%, 2%)",
    "racing-green-900": "hsl(160, 14%, 10%)",
    "racing-green-800": " hsl(160, 14%, 18%)",
    "racing-green-700": " hsl(160, 14%, 26%)",
    "racing-green-600": " hsl(160, 14%, 34%)",
    "racing-green-500": " hsl(160, 14%, 41%)",
    "racing-green-400": " hsl(160, 14%, 49%)",
    "racing-green-300": " hsl(160, 14%, 57%)",
    "racing-green-200": " hsl(160, 14%, 65%)",
    "racing-green-100": " hsl(160, 14%, 73%)",
    "racing-green-50": " hsl(160, 14%, 81%)",
    DEFAULT: " hsl(160, 14%, 41%)",
  },
  mustardYellow: {
    "mustard-yellow-950": "hsl(40, 81%, 45%)",
    "mustard-yellow-900": "hsl(40, 81%, 50%)",
    "mustard-yellow-800": "hsl(40, 81%, 55%)",
    "mustard-yellow-700": "hsl(40, 81%, 60%)",
    "mustard-yellow-600": "hsl(40, 81%, 65%)",
    "mustard-yellow-500": "hsl(40, 81%, 70%)",
    "mustard-yellow-400": "hsl(40, 81%, 75%)",
    "mustard-yellow-300": "hsl(40, 81%, 80%)",
    "mustard-yellow-200": "hsl(40, 81%, 85%)",
    "mustard-yellow-100": "hsl(40, 81%, 90%)",
    "mustard-yellow-50": "hsl(40, 81%, 95%)",
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
    },
  },
} satisfies Config;
