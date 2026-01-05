import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'btn-sm px-3',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-error',
    ghost: 'btn-ghost',
  };

  return (
    <button
      className={`btn ${sizeClasses[size]} ${variantClasses[variant]} transition-all duration-200 active:scale-95 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="loading loading-spinner loading-sm"></span>
          Caricamento...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
