/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface-2)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        linestrong: 'var(--line-strong)',
        hover: 'var(--hover)',
        primary: {
          DEFAULT: 'var(--primary)',
          fg: 'var(--primary-fg)',
          soft: 'var(--primary-soft)',
        },
        accent: 'var(--accent)',
        success: 'var(--success)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
        codebg: 'var(--code-bg)',
        codefg: 'var(--code-fg)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl2: '14px' },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        fadeup: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        blink: { '0%,100%': { opacity: 0.25 }, '50%': { opacity: 1 } },
      },
      animation: {
        fadeup: 'fadeup .4s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
}
