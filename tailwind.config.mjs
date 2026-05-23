// tailwind.config.mjs — DCトレンド研究
// CHANGES from main: add fontFamily.serif (Noto Serif JP) and fontFamily.mono (JetBrains Mono)

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          'Meiryo',
          'sans-serif',
        ],
        // NEW — editorial headlines + hero
        serif: [
          '"Noto Serif JP"',
          '"Yu Mincho"',
          '"Hiragino Mincho ProN"',
          '"Hiragino Mincho Pro"',
          'serif',
        ],
        // NEW — code / tabular numerics
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: '1.9',
          },
        },
      },
    },
  },
  plugins: [],
};
