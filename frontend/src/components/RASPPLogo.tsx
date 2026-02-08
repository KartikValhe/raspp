import React from 'react';

export const RASPPLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Circular background gradient */}
            <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Outer circle */}
            <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" stroke="#fff" strokeWidth="2" />

            {/* RASPP Text */}
            <text
                x="50"
                y="58"
                fontFamily="Arial, sans-serif"
                fontSize="28"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
            >
                RASPP
            </text>
        </svg>
    );
};
