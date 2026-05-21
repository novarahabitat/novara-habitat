import type { Config } from 'tailwindcss'
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { novara: { black: '#070706', charcoal: '#11100d', gold: '#c9a45c', soft: '#f4efe5' } } } }, plugins: [] }
export default config
