/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            gridTemplateColumns: {
                'custom-3-1': '3fr 1fr'
            }
        }
    },
    plugins: []
};
