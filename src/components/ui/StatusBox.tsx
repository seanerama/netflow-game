import React from 'react';

interface StatusBoxProps {
  type: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  children: React.ReactNode;
}

export function StatusBox({ type, title, children }: StatusBoxProps) {
  const boxClass = {
    error: 'error-box',
    warning: 'warning-box',
    success: 'success-box',
    info: 'info-box',
  }[type];

  return (
    <div className={boxClass}>
      {title && <div className="font-bold mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}
