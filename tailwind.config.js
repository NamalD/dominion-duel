/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#011627',
                accent: '#ff0022',
                secondary: '#41EAD4',
                main: '#FDFFFC',
                highlight: '#B91372',
            },
        },
    },
    plugins: [],
}
