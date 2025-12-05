import React from 'react';
import { Play, Pause, FastForward, DollarSign, Clock } from 'lucide-react';
import { useGameStore, useGameTime, useBusiness } from '../../store/gameStore';

export const TopBar: React.FC = () => {
  const { isPaused, gameSpeed, pauseGame, resumeGame, setGameSpeed } = useGameStore();
  const gameTime = useGameTime();
  const business = useBusiness();

  const formatTime = () => {
    const hour = gameTime.hour.toString().padStart(2, '0');
    const minute = gameTime.minute.toString().padStart(2, '0');
    return `Day ${gameTime.day} - ${hour}:${minute}`;
  };

  const handlePlayPause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const cycleSpeed = () => {
    const speeds: (1 | 2 | 4)[] = [1, 2, 4];
    const currentIndex = speeds.indexOf(gameSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setGameSpeed(speeds[nextIndex]);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      {/* Left: Game title and company */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-blue-400">NetFlow</h1>
        <span className="text-sm text-gray-400">{business.name}</span>
      </div>

      {/* Center: Time controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-green-400" />
          ) : (
            <Pause className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        <button
          onClick={cycleSpeed}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Change game speed"
        >
          <FastForward className="w-4 h-4" />
          <span className="text-sm font-medium">{gameSpeed}x</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono">{formatTime()}</span>
        </div>
      </div>

      {/* Right: Budget */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-sm font-mono">${business.cash.toLocaleString()}</span>
        </div>
        <div className="text-xs text-gray-400">
          Budget: ${business.itBudget.toLocaleString()}/mo
        </div>
      </div>
    </header>
  );
};
