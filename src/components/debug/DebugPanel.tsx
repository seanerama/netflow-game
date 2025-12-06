import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { SubMission, GamePhase } from '../../types';

const missionTitles: Record<SubMission, string> = {
  '1.1': "Hook 'Em Up",
  '1.2': 'Lock the Door',
  '1.3': 'Growing Pains',
  '1.4': 'The Great Slowdown',
  '1.5': 'Switching Things Up',
  '1.6': 'Sharing is Caring',
  '1.7': 'Print Money',
  '1.8': "You're Hired!",
};

// Mission budgets and starting phases
const missionConfig: Record<SubMission, { budget: number; phase: GamePhase }> = {
  '1.1': { budget: 350, phase: 'store' },
  '1.2': { budget: 0, phase: 'firewall' },
  '1.3': { budget: 100, phase: 'growing-store' },
  '1.4': { budget: 0, phase: 'diagnostics' },
  '1.5': { budget: 150, phase: 'switch-store' },
  '1.6': { budget: 0, phase: 'file-share' },
  '1.7': { budget: 150, phase: 'printer-setup' },
  '1.8': { budget: 0, phase: 'hired' },
};

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const setSubMission = useGameStore((state) => state.setSubMission);
  const setPhase = useGameStore((state) => state.setPhase);
  const setBudget = useGameStore((state) => state.setBudget);
  const clearDialogue = useGameStore((state) => state.clearDialogue);

  // Toggle with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Jump directly to a mission's gameplay phase
  const handleJumpToMission = (mission: SubMission) => {
    const config = missionConfig[mission];
    clearDialogue();
    setSubMission(mission);
    setBudget(config.budget);
    setPhase(config.phase);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-2 right-2 text-[8px] text-[var(--color-text-muted)] opacity-50">
        Ctrl+Shift+D for debug
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-black/95 border-4 border-[var(--color-accent-yellow)] p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[var(--color-accent-yellow)] font-bold text-sm">
          JUMP TO MISSION
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[var(--color-accent-red)] hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="text-[8px] text-[var(--color-text-muted)] mb-3">
        Click a mission to jump directly to it
      </div>

      <div className="space-y-2">
        {(['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'] as SubMission[]).map((m) => (
          <button
            key={m}
            onClick={() => handleJumpToMission(m)}
            className="w-full p-2 text-[10px] border-2 border-[var(--color-border)] hover:border-[var(--color-accent-green)] hover:bg-[var(--color-accent-green)]/20 text-left transition-all"
          >
            <span className="text-[var(--color-accent-blue)]">{m}</span>
            <span className="ml-2">{missionTitles[m]}</span>
          </button>
        ))}
      </div>

      <div className="text-[8px] text-[var(--color-text-muted)] text-center mt-4">
        Press Ctrl+Shift+D to close
      </div>
    </div>
  );
}
