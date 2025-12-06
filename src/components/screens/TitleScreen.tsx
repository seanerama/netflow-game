import { useGameStore } from '../../store/gameStore';
import { PixelButton } from '../ui';
import { introDialogue, MISSION_1_1_BUDGET } from '../../data/mission1-1';

export function TitleScreen() {
  const setPhase = useGameStore((state) => state.setPhase);
  const setBudget = useGameStore((state) => state.setBudget);
  const addDialogue = useGameStore((state) => state.addDialogue);

  const handleStartGame = () => {
    setBudget(MISSION_1_1_BUDGET);
    addDialogue(introDialogue);
    setPhase('intro');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[var(--color-bg-dark)] to-[#0a0a1e]">
      {/* Scanline overlay for retro effect */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Logo/Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl title-text text-[var(--color-accent-blue)] mb-4">
          NETQUEST
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          A Networking Adventure
        </p>
      </div>

      {/* Decorative network visual */}
      <div className="relative w-96 h-48 mb-12">
        {/* Simple network diagram with placeholders */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Connection lines */}
          <line x1="50" y1="100" x2="150" y2="100" className="connection-line connection-valid" />
          <line x1="150" y1="100" x2="250" y2="100" className="connection-line connection-valid" />
          <line x1="250" y1="100" x2="350" y2="50" className="connection-line connection-valid" />
          <line x1="250" y1="100" x2="350" y2="100" className="connection-line connection-valid" />
          <line x1="250" y1="100" x2="350" y2="150" className="connection-line connection-valid" />
        </svg>

        {/* Devices */}
        <div className="absolute device-placeholder device-demarc w-12 h-12" style={{ left: 25, top: 88 }}>
          <span className="text-white text-[8px]">T1</span>
        </div>
        <div className="absolute device-placeholder device-router w-12 h-12 blink-active" style={{ left: 125, top: 88 }}>
          <span className="text-white text-[8px]">RTR</span>
        </div>
        <div className="absolute device-placeholder device-hub w-12 h-12" style={{ left: 225, top: 88 }}>
          <span className="text-white text-[8px]">HUB</span>
        </div>
        <div className="absolute device-placeholder device-pc w-10 h-10" style={{ left: 330, top: 38 }}>
          <span className="text-white text-[6px]">PC</span>
        </div>
        <div className="absolute device-placeholder device-pc w-10 h-10" style={{ left: 330, top: 88 }}>
          <span className="text-white text-[6px]">PC</span>
        </div>
        <div className="absolute device-placeholder device-pc w-10 h-10" style={{ left: 330, top: 138 }}>
          <span className="text-white text-[6px]">PC</span>
        </div>
      </div>

      {/* Mission info */}
      <div className="text-center mb-8">
        <p className="text-sm text-[var(--color-text-primary)] mb-2">
          Mission 1: Getting Bubba's Properties Online
        </p>
        <p className="text-[10px] text-[var(--color-text-secondary)]">
          Year: 2001 | Location: Possum Holler, Rural USA
        </p>
      </div>

      {/* Start button */}
      <PixelButton variant="primary" onClick={handleStartGame}>
        Start Game
      </PixelButton>

      {/* Credits */}
      <div className="absolute bottom-4 text-center text-[8px] text-[var(--color-text-muted)]">
        <p>Learn networking through storytelling</p>
        <p className="mt-1">Press Start to Begin</p>
      </div>
    </div>
  );
}
