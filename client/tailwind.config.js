/** @type {import('tailwindcss').Config} */
import { themes } from 'daisyui/src/theming/themes';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
    },
  },
  daisyui: {
    themes: [
      {
        light: {
        ...themes['light'],
          primary: '#2563eb',
          secondary: '#059669',
          accent: '#0891b2',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6',
        },
      },
      'dark',
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
    themeRoot: ':root',
  },
}
