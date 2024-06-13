/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // 主题背景和字体颜色
        'v-fontcolor': '#363636',
        'v-background': '#f7f9fe',
        'v-fontcolor-dark': '#f7f7fa',
        'v-background-dark': '#242524'
      },
      boxShadow: {
        'light-shadow': '0 1px 30px -4px #e8e8e8',
        'light-shadow-hover': '0 1px 20px 10px #e8e8e8',
        'dark-shadow': '0 1px 35px -8px rgba(26,26,26,0.6)',
        'dark-shadow-hover': '0 1px 20px 0px rgb(99,102,241)'
      },
    },
  },
  plugins: [],
}

