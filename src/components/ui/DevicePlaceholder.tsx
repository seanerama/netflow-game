import { useState } from 'react';
import type { DeviceType } from '../../types';

interface DevicePlaceholderProps {
  type: DeviceType;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showPorts?: boolean;
  portCount?: number;
  className?: string;
  onClick?: () => void;
}

const deviceLabels: Record<DeviceType, string> = {
  router: 'RTR',
  hub: 'HUB',
  switch: 'SW',
  pc: 'PC',
  't1-demarc': 'T1',
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
};

// Map device types to sprite filenames
const deviceSprites: Record<DeviceType, string> = {
  router: 'router',
  hub: 'hub',
  switch: 'switch',
  pc: 'pc',
  't1-demarc': 't1-demarc',
};

export function DevicePlaceholder({
  type,
  name,
  size = 'md',
  showPorts = false,
  portCount = 0,
  className = '',
  onClick,
}: DevicePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const deviceClass = `device-${type === 't1-demarc' ? 'demarc' : type}`;
  const spriteFile = deviceSprites[type];

  // Try to use sprite image
  if (spriteFile && !imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} ${
          onClick ? 'cursor-pointer hover:opacity-80' : ''
        } flex items-center justify-center`}
        onClick={onClick}
        title={name}
      >
        <img
          src={`/sprites/equipment/${spriteFile}.png`}
          alt={name}
          className="max-w-full max-h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback to colored placeholder
  return (
    <div
      className={`device-placeholder ${deviceClass} ${sizeClasses[size]} ${className} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      }`}
      onClick={onClick}
      title={name}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-white font-bold">{deviceLabels[type]}</div>
        {showPorts && portCount > 0 && (
          <div className="text-[6px] text-white/80 mt-1">{portCount}P</div>
        )}
      </div>
    </div>
  );
}
