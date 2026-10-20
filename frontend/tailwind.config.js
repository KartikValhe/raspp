/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        // ─── STANDARDIZED FONT FAMILY ────────────────────────────────────
        fontFamily: {
            sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        },

        // ─── STANDARDIZED FONT SIZE SCALE ───────────────────────────────
        fontSize: {
            'xs': ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],  // tags, labels
            'sm': ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],  // captions, helper text
            'base': ['13px', { lineHeight: '20px', letterSpacing: '0em' }],  // body text
            'md': ['14px', { lineHeight: '22px', letterSpacing: '-0.005em' }],  // default UI text
            'lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],  // sub-headings
            'xl': ['18px', { lineHeight: '28px', letterSpacing: '-0.02em' }],  // card titles
            '2xl': ['22px', { lineHeight: '32px', letterSpacing: '-0.025em' }],  // page headings
            '3xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.03em' }],  // section headers
            '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.03em' }],  // hero subheaders
            '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.035em' }],  // large titles
            '6xl': ['60px', { lineHeight: '68px', letterSpacing: '-0.04em' }],  // massive display
            '7xl': ['72px', { lineHeight: '80px', letterSpacing: '-0.04em' }],  // hero displays
        },

        extend: {
            // ─── BRAND COLORS ─────────────────────────────────────────────
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                accent: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                },
                success: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                danger: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                // App surface backgrounds
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#070c18',
                },
            },

            // ─── BORDER RADIUS ────────────────────────────────────────────
            borderRadius: {
                'sm': '6px',
                DEFAULT: '8px',
                'md': '10px',
                'lg': '12px',
                'xl': '14px',
                '2xl': '16px',
                '3xl': '20px',
                'full': '9999px',
            },

            // ─── LIGHTWEIGHT SHADOWS ──────────────────────────────────────
            boxShadow: {
                'xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
                'sm': '0 2px 4px 0 rgb(0 0 0 / 0.06)',
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
                'card-md': '0 4px 12px -2px rgb(0 0 0 / 0.08)',
                'primary': '0 4px 14px -2px rgb(99 102 241 / 0.30)',
                'glow': '0 0 16px rgb(99 102 241 / 0.12)',
                'glass': '0 4px 24px -4px rgb(0 0 0 / 0.08), inset 0 1px 0 rgb(255 255 255 / 0.10)',
                'none': 'none',
            },

            // ─── SPACING EXTRAS ───────────────────────────────────────────
            spacing: {
                '4.5': '18px',
                '18': '72px',
            },

            // ─── TRANSITIONS ──────────────────────────────────────────────
            transitionDuration: {
                DEFAULT: '150ms',
                '200': '200ms',
                '300': '300ms',
            },

            // ─── LIGHTWEIGHT ANIMATIONS ───────────────────────────────────
            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
            animation: {
                'fade-up': 'fadeUp 0.25s ease-out both',
                'fade-in': 'fadeIn 0.2s ease-out both',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
