import React from 'react';

interface PixelPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function PixelPanel({ title, children, className = '' }: PixelPanelProps) {
  return (
    <div className={`pixel-panel ${className}`}>
      {title && <div className="pixel-panel-header">{title}</div>}
      <div className="p-4">{children}</div>
    </div>
  );
}
