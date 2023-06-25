/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            height: {
                "100vh": "100vh",
                "100%": "100%",
                "90%": "90%",
                "80%": "80%",
                "70%": "70%",
                "60%": "60%",
                "50%": "50%",
            },
            width: {
                "100%": "100%",
                "90%": "90%",
                "80%": "80%",
                "70%": "70%",
                "60%": "60%",
                "50%": "50%",
            },
        },
    },
    plugins: [],
};
