import React from 'react';
import { Target, Lightbulb, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const BottomBar: React.FC = () => {
  const { currentMission, missions, openModal } = useGameStore();

  const mission = currentMission ? missions[currentMission] : null;
  const activeObjectives = mission?.objectives.filter((o) => !o.completed) || [];

  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700">
      {/* Left: Current mission objectives */}
      <div className="flex items-center gap-4">
        {mission ? (
          <>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">{mission.title}</span>
            </div>
            <div className="flex flex-col gap-1">
              {activeObjectives.slice(0, 2).map((obj) => (
                <div key={obj.id} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>{obj.description}</span>
                  {obj.required > 1 && (
                    <span className="text-gray-500">
                      ({obj.current}/{obj.required})
                    </span>
                  )}
                </div>
              ))}
              {activeObjectives.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{activeObjectives.length - 2} more objectives
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <Target className="w-4 h-4" />
            <span className="text-sm">No active mission</span>
            <button
              onClick={() => openModal('mission-briefing')}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              View missions
            </button>
          </div>
        )}
      </div>

      {/* Right: Hint and help buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => openModal('help')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Hint</span>
        </button>
        <button
          onClick={() => openModal('help')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
      </div>
    </footer>
  );
};
