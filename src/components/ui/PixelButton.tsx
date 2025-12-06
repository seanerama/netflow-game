import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger';
  children: React.ReactNode;
}

export function PixelButton({
  variant = 'default',
  children,
  className = '',
  disabled,
  ...props
}: PixelButtonProps) {
  const variantClass = {
    default: '',
    primary: 'pixel-button-primary',
    danger: 'pixel-button-danger',
  }[variant];

  return (
    <button
      className={`pixel-button ${variantClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
