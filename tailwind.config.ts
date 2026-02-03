import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#111111',
                secondary: '#FFFFFF',
                accent: '#00E676',
                'input-bg': '#1a1a1a',
                'text-primary': '#FFFFFF',
                'text-secondary': '#a0a0a0',
            },
        },
    },
    plugins: [],
};
export default config;
