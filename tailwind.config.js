/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#080A10',
        surface: '#151823',
        'surface-light': '#1E2230',
        'surface-glow': '#272C3D',
        secondary: '#F5C060',
        accent: '#BB8A30',
        'text-muted': '#A4AAC2',
        success: '#4FD3B0',
        danger: '#EC6B6B',
      },
    },
  },
  plugins: [],
}

