import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { novaraGold: "#c9a45c", novaraBlack: "#070707" } } },
  plugins: [],
};

export default config;
