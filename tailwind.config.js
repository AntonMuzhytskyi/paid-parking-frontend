/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        samuraiRed: '#FF2400',
        deepBlack: '#000000',
        pureWhite: '#FFFFFF',
        goldAccent: '#FFA500',
        darkSlate: '#0F0F0F',
        bloodRed: '#8B0000',
      },
      fontFamily: {
        japan: ['"Noto Sans JP"', 'sans-serif'],
        title: ['"Zen Kurenaido"', 'serif'],
      },
    },
  },
  plugins: [],
}