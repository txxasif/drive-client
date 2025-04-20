/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

const config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-in-out',
            },
            backgroundColor: {
                'dark-surface': '#121212',
                'dark-surface-light': '#1e1e1e',
                'dark-surface-elevated': '#272727',
            },
            textColor: {
                'dark-primary': '#ffffff',
                'dark-secondary': '#a0a0a0',
                'dark-tertiary': '#6c6c6c',
            },
            borderColor: {
                'dark-border': '#383838',
                'dark-border-light': '#484848',
            },
        },
    },
    plugins: [forms],
};

export default config; 