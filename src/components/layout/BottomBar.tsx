import React, { useState } from 'react';
import { Target, Lightbulb, HelpCircle, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { getNextHintForMission } from '../../data/missions';
import ReactMarkdown from 'react-markdown';

export const BottomBar: React.FC = () => {
  const { currentMission, missions, setCurrentView } = useGameStore();
  const [showHint, setShowHint] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const mission = currentMission ? missions[currentMission] : null;
  const activeObjectives = mission?.objectives.filter((o) => !o.completed) || [];

  // Get current hint based on completed objectives
  const completedObjectiveIds = mission?.objectives
    .filter((o) => o.completed)
    .map((o) => o.id) || [];
  const currentHint = currentMission
    ? getNextHintForMission(currentMission, completedObjectiveIds)
    : null;

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
              onClick={() => setCurrentView('missions')}
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
          onClick={() => setShowHint(true)}
          disabled={!currentHint}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            currentHint
              ? 'text-yellow-400 hover:bg-gray-700 hover:text-yellow-300'
              : 'text-gray-600 cursor-not-allowed'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Hint</span>
        </button>
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
      </div>

      {/* Hint Modal */}
      {showHint && currentHint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold">Hint</h3>
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{currentHint.content}</ReactMarkdown>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowHint(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Help</h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] prose prose-invert prose-sm max-w-none">
              <h4>Getting Started</h4>
              <p>Welcome to NetFlow! You're the IT administrator for a small company, and your job is to build and manage their network.</p>

              <h4>Network View</h4>
              <ul>
                <li><strong>Click</strong> on a device to select it</li>
                <li><strong>Double-click</strong> to open device configuration</li>
                <li><strong>Right-click</strong> to start connecting devices with cables</li>
                <li><strong>Drag</strong> devices to reposition them</li>
              </ul>

              <h4>Shop</h4>
              <p>Visit the Shop to purchase network equipment like routers, switches, and cables.</p>

              <h4>Missions</h4>
              <p>Complete missions to earn money and XP. Each mission teaches you something new about networking!</p>

              <h4>Key Concepts</h4>
              <ul>
                <li><strong>Router:</strong> Connects your network to the internet (like a valve junction)</li>
                <li><strong>Hub/Switch:</strong> Connects multiple devices together (like a pipe splitter)</li>
                <li><strong>IP Address:</strong> A unique address for each device (like a house number)</li>
                <li><strong>Gateway:</strong> The router's IP - where traffic goes to leave the network</li>
                <li><strong>NAT:</strong> Translates private IPs to public IPs for internet access</li>
              </ul>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
