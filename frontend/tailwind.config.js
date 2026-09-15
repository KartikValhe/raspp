/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        // ─── GLOBAL FONT FAMILY ───────────────────────────────────────────
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        },

        // ─── FONT SIZE SCALE (Standardized) ───────────────────────────────
        fontSize: {
            'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
            'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
            'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
            'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
            'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.015em' }],
            '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
            '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
            '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
            '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        },

        extend: {
            // ─── BRAND COLOR PALETTE ─────────────────────────────────────────
            colors: {
                // Primary — Deep Indigo/Blue (main brand)
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',  // Base primary
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                // Accent — Cyan/Teal for highlights
                accent: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                },
                // Success
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                // Warning
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                // Danger
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                // Surface — app backgrounds, cards
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#080d18',
                },
            },

            // ─── BORDER RADIUS ───────────────────────────────────────────────
            borderRadius: {
                'sm': '0.375rem',
                'DEFAULT': '0.5rem',
                'md': '0.625rem',
                'lg': '0.75rem',
                'xl': '0.875rem',
                '2xl': '1rem',
                '3xl': '1.25rem',
                '4xl': '1.5rem',
                'full': '9999px',
            },

            // ─── BOX SHADOWS ─────────────────────────────────────────────────
            boxShadow: {
                'xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
                'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
                'md': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
                'lg': '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
                'xl': '0 25px 50px -12px rgb(0 0 0 / 0.12)',
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
                'card-hover': '0 10px 30px -4px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
                'primary': '0 8px 24px -4px rgb(99 102 241 / 0.35)',
                'primary-sm': '0 4px 12px -2px rgb(99 102 241 / 0.25)',
                'glow': '0 0 20px rgb(99 102 241 / 0.15)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                'none': 'none',
            },

            // ─── SPACING ─────────────────────────────────────────────────────
            spacing: {
                '4.5': '1.125rem',
                '13': '3.25rem',
                '15': '3.75rem',
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
            },

            // ─── TRANSITIONS ─────────────────────────────────────────────────
            transitionDuration: {
                DEFAULT: '200ms',
                '150': '150ms',
                '250': '250ms',
                '400': '400ms',
            },

            // ─── ANIMATIONS ──────────────────────────────────────────────────
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-16px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulse_soft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.35s ease-out',
                'fade-in': 'fadeIn 0.25s ease-out',
                'slide-in-left': 'slideInLeft 0.3s ease-out',
                'pulse-soft': 'pulse_soft 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
