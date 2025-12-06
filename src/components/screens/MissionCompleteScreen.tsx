import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';

export function MissionCompleteScreen() {
  const budget = useGameStore((state) => state.budget);
  const resetGame = useGameStore((state) => state.resetGame);

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[var(--color-bg-dark)] to-[#0a1a0a]">
      {/* Celebration effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simple particle effect with CSS */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[var(--color-accent-yellow)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pixel-blink ${0.5 + Math.random() * 1}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center relative z-10">
        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-3xl title-text text-[var(--color-accent-green)] mb-4">
          MISSION COMPLETE!
        </h1>

        <p className="text-lg text-[var(--color-text-primary)] mb-2">
          "Hook 'Em Up"
        </p>

        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          You've successfully connected Bubba's office to the internet!
        </p>

        <PixelPanel className="mb-8 inline-block">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="text-right text-[var(--color-text-secondary)]">Final Budget:</div>
            <div className="text-left text-[var(--color-accent-green)]">${budget}</div>

            <div className="text-right text-[var(--color-text-secondary)]">Devices Online:</div>
            <div className="text-left text-[var(--color-accent-green)]">4 PCs</div>

            <div className="text-right text-[var(--color-text-secondary)]">Internet Status:</div>
            <div className="text-left text-[var(--color-accent-green)]">Connected</div>

            <div className="text-right text-[var(--color-text-secondary)]">Rating:</div>
            <div className="text-left text-[var(--color-accent-yellow)]">⭐⭐⭐</div>
          </div>
        </PixelPanel>

        {/* Bubba's quote */}
        <div className="pixel-panel max-w-md mx-auto mb-8 p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#8B4513] border-4 border-[var(--color-border)] flex items-center justify-center text-2xl">
              B
            </div>
            <div className="flex-1 text-left">
              <div className="text-[var(--color-accent-blue)] text-xs mb-1">Bubba</div>
              <p className="text-sm italic">
                "Well hot diggity dog! You done good, computer person. Real good.
                How about you come work for Bubba's full-time?"
              </p>
            </div>
          </div>
        </div>

        {/* Unlock notification */}
        <div className="success-box max-w-md mx-auto mb-8">
          <p className="text-sm text-[var(--color-accent-green)]">
            🔓 UNLOCKED: Network Administrator Title
          </p>
          <p className="text-[8px] text-[var(--color-text-secondary)] mt-1">
            Mission 1.2 "Lock the Door" is now available!
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <PixelButton onClick={handlePlayAgain}>
            Play Again
          </PixelButton>
          <PixelButton variant="primary" disabled>
            Next Mission →
          </PixelButton>
        </div>

        <p className="text-[8px] text-[var(--color-text-muted)] mt-4">
          Mission 1.2 coming soon...
        </p>
      </div>
    </div>
  );
}
