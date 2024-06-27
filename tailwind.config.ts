import type { Config } from "tailwindcss";
import {fontFamily} from "tailwindcss/defaultTheme";


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(var(--primary), <alpha-value>)',
        secondary: 'rgba(var(--secondary), <alpha-value>)',
        skyblue: 'rgba(var(--skyblue), <alpha-value>)',
        seafoam: 'rgba(var(--seafoam), <alpha-value>)',
        dark: 'rgba(var(--dark), <alpha-value>)',
        mid: 'rgba(var(--mid), <alpha-value>)',
        light: 'rgba(var(--light), <alpha-value>)',
      },
      fontFamily: {
        source: ['var(--source)', ...fontFamily.sans]
      },
    },
  },
  plugins: [],
};
export default config;
