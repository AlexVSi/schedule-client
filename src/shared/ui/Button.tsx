import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'selected' | 'unselected';
    size?: 'vsm' | 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-100 focus-visible:ring-gray-500',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        selected: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105',
        unselected: 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-102 shadow-md',
    };

    const sizes = {
        vsm: 'h-6 px-3 text-sm',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
    };
    return (
        <button
            // ref={ref}
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
