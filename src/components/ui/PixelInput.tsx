import React from 'react';

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PixelInput({
  label,
  error,
  className = '',
  ...props
}: PixelInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="config-label">{label}</label>
      )}
      <input
        className={`pixel-input ${error ? 'border-[var(--color-accent-red)]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[8px] text-[var(--color-accent-red)]">{error}</span>
      )}
    </div>
  );
}
