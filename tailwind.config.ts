import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        novaraBlack: '#080806',
        novaraGold: '#C8A24A',
        novaraCream: '#F6F1E7'
      }
    }
  },
  plugins: []
}
export default config
