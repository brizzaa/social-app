import daisyui from 'daisyui';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04)',
            },
        },
    },
    plugins: [
        daisyui,
    ],
    daisyui: {
        themes: [
            {
                'social-light': {
                    "primary": "#4F46E5", // Indigo-600
                    "secondary": "#10B981", // Emerald-500
                    "accent": "#F43F5E", // Rose-500
                    "neutral": "#1F2937", // Gray-800
                    "base-100": "#ffffff",
                    "base-200": "#F3F4F6", // Gray-100 (Background)
                    "base-300": "#E5E7EB", // Gray-200 (Borders)

                    "--rounded-box": "1rem",
                    "--rounded-btn": "0.5rem",
                    "--rounded-badge": "1.9rem",
                    "--animation-btn": "0.25s",
                    "--animation-input": "0.2s",
                    "--btn-focus-scale": "0.95",
                    "--border-btn": "1px",
                    "--tab-border": "1px",
                    "--tab-radius": "0.5rem",
                },
                'social-dark': {
                    "primary": "#6366f1", // Indigo-500
                    "secondary": "#34d399", // Emerald-400
                    "accent": "#fb7185", // Rose-400
                    "neutral": "#F3F4F6", // Gray-100
                    "base-100": "#111827", // Gray-900
                    "base-200": "#1f2937", // Gray-800
                    "base-300": "#374151", // Gray-700

                    "--rounded-box": "1rem",
                    "--rounded-btn": "0.5rem",
                    "--rounded-badge": "1.9rem",
                    "--animation-btn": "0.25s",
                    "--animation-input": "0.2s",
                    "--btn-focus-scale": "0.95",
                    "--border-btn": "1px",
                    "--tab-border": "1px",
                    "--tab-radius": "0.5rem",
                }
            },
        ],
        darkTheme: 'social-dark',
        base: true,
        styled: true,
        utils: true,
        prefix: '',
        logs: false,
        themeRoot: ':root',
    },
}
