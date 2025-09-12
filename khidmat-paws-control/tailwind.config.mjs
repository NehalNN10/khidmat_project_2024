/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50:  '#faf4f2', // lightest beige, background
          100: '#f2e4dd',
          200: '#e4c8bb',
          300: '#d6a98e',
          400: '#c16652', // your lightbrown
          500: '#a8553f',
          600: '#874532',
          700: '#674d38', // your darkbrown
          800: '#4c3526',
          900: '#2f2016'  // almost black-brown
        },
        'darkgreen': '#007849',
        // 'darkbrown': '#674d38',
        // 'lightbrown': '#c16652'
      },
    },
  },
  plugins: [],
};
