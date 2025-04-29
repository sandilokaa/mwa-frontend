/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    './src/**/*.{js,ts,jsx,tsx}',
],
    theme: {
        extend: {},
},
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require('@tailwindcss/line-clamp')],
}