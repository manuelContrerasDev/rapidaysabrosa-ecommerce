import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary';
  disabled?: boolean;
  className?: string;
}

// Props para botón normal
type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: never };

// Props para Link
type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, 'children'> & { to: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

// Clases Tailwind por variante
const variants = {
  primary: 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg',
  accent: 'bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 shadow-lg',
  secondary: 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg',
};

const baseClasses =
  'px-6 py-3 rounded-lg font-bold text-center transition-all duration-200 transform hover:scale-105';

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', disabled, className = '', ...props }) => {
  // Si es Link
  if ('to' in props) {
    const { to, onClick, ...rest } = props as ButtonAsLink;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={`${variants[variant]} ${baseClasses} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  // Botón normal
  const buttonProps = props as ButtonAsButton;

  return (
    <button
      className={`${variants[variant]} ${baseClasses} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
