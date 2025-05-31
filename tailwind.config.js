/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          foreground: '#F9FAFB',
        },
        secondary: {
          light: '#E5E7EB',
          dark: '#1F2937',
          DEFAULT: 'var(--secondary)',
        },
        accent: {
          DEFAULT: '#F97316',
          foreground: '#111827',
        },
        text: {
          light: '#111827',
          dark: '#F9FAFB',
          secondary: {
            light: '#6B7280',
            dark: '#9CA3AF',
          },
        },
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
      },
      spacing: {
        'card-width': '18rem',
        'card-height': '28rem',
        'button-width': '10rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          lg: "3rem",
        },
        screens: {
          "2xl": "1440px",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/animate'),
    function ({ addComponents, addUtilities }) {
      addComponents({
        '.btn-white': {
          '@apply text-[14px] font-medium bg-white text-primary ring-1 ring-white px-7 py-2.5 rounded-full': {},
        },
        '.btn-dark': {
          '@apply text-[14px] font-medium bg-primary text-white ring-1 ring-primary px-7 py-2.5 rounded-full': {},
        },
        '.btn-light': {
          '@apply text-[14px] font-medium bg-secondary-light dark:bg-secondary-dark text-primary ring-1 ring-secondary-light dark:ring-secondary-dark px-7 py-2.5 rounded-full transition-all duration-300': {},
        },
        '.btn-outline': {
          '@apply text-[14px] font-medium bg-white dark:bg-transparent text-primary ring-1 ring-primary px-7 py-2.5 rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300': {},
        },
        '.btn-secondary': {
          '@apply text-[14px] font-medium bg-accent text-white ring-1 ring-accent px-7 py-2.5 rounded-full': {},
        },
        '.active-link': {
          '@apply px-3 py-2 rounded-full bg-primary text-white': {},
        },
      });
      addUtilities({
        '.flexCenter': {
          '@apply flex items-center justify-center': {},
        },
        '.flexBetween': {
          '@apply flex items-center justify-between': {},
        },
        '.flexStart': {
          '@apply flex items-center justify-start': {},
        },
        '.flexEnd': {
          '@apply flex items-center justify-end': {},
        },
      });
    },
  ],
}