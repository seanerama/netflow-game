import { useState } from 'react';
import { getCharacter, getInitial } from '../../data/characters';

interface PortraitProps {
  characterId: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-20 h-20 text-2xl',
  lg: 'w-24 h-24 text-3xl',
};

export function Portrait({ characterId, size = 'md' }: PortraitProps) {
  const character = getCharacter(characterId);
  const initial = getInitial(character.name);
  const [imageError, setImageError] = useState(false);

  // Narrator has no portrait
  if (characterId === 'narrator') {
    return null;
  }

  // Characters with sprites
  const hasSprite = ['bubba', 'darlene', 'earl', 'scooter', 'wayne', 'player', 'narrator'].includes(characterId);

  if (hasSprite && !imageError) {
    return (
      <img
        src={`/sprites/characters/${characterId}.png`}
        alt={character.name}
        title={character.name}
        className={`${sizeClasses[size]} pixel-border`}
        style={{ imageRendering: 'pixelated' }}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to colored placeholder
  return (
    <div
      className={`portrait-placeholder ${sizeClasses[size]}`}
      style={{ backgroundColor: character.portraitColor }}
      title={character.name}
    >
      <span className="text-white font-bold drop-shadow-md">{initial}</span>
    </div>
  );
}
