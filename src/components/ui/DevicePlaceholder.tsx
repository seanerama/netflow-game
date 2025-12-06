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

export function DevicePlaceholder({
  type,
  name,
  size = 'md',
  showPorts = false,
  portCount = 0,
  className = '',
  onClick,
}: DevicePlaceholderProps) {
  const deviceClass = `device-${type === 't1-demarc' ? 'demarc' : type}`;

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

// For instructions on adding pixel art sprites later:
// 1. Create a sprites folder: src/assets/sprites/
// 2. Add PNG images for each device type (router.png, hub.png, etc.)
// 3. Replace the colored square background with the sprite:
//    - Use CSS background-image or an <img> tag
//    - Ensure image-rendering: pixelated for crisp edges
// 4. Example modification:
//    <div
//      className={`device-placeholder ${sizeClasses[size]}`}
//      style={{
//        backgroundImage: `url(/sprites/${type}.png)`,
//        backgroundSize: 'contain',
//        backgroundRepeat: 'no-repeat'
//      }}
//    />
