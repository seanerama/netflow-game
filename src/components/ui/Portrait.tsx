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

  // Narrator has no portrait
  if (characterId === 'narrator') {
    return null;
  }

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

// For adding pixel art character sprites later:
// 1. Create portrait sprites: src/assets/portraits/
// 2. Add PNG images for each character (bubba.png, darlene.png, etc.)
// 3. Replace the colored square with the sprite:
//    <img
//      src={`/portraits/${characterId}.png`}
//      alt={character.name}
//      className={`${sizeClasses[size]} pixel-border`}
//      style={{ imageRendering: 'pixelated' }}
//    />
