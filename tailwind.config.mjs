// Tailwind CSS設定 — DCトレンド研究

/** @type {import('tailwindcss').Config} */
export default {
  // ダークモード: クラスベース（<html class="dark"> で切り替え）
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // サイトのブランドカラー（ダークブルー系）
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
        // 日本語フォント優先設定
        sans: [
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          'Meiryo',
          'sans-serif',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            // 日本語本文の行間を広めに
            lineHeight: '1.9',
          },
        },
      },
    },
  },
  plugins: [],
};
