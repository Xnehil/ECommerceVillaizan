import React from 'react';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  variant?: 'link' | 'default';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, onClick, variant = 'default', children }) => {
  const baseStyles = 'px-4 py-2 rounded';
  const variantStyles = variant === 'link' ? 'bg-transparent text-blue-500 underline' : 'bg-blue-500 text-white';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;