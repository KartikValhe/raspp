import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
        danger: 'bg-red-500 hover:bg-red-700 text-white',
    };

    return (
        <button
            className={cn(
                'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};
