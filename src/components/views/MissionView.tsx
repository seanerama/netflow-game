import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Circle,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Trophy,
  Lock,
  Play,
  HelpCircle,
  X,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { ALL_MISSIONS, getNextHintForMission } from '../../data/missions';
import { onMissionStart, onMissionComplete } from '../../data/missions/missionEvents';
import type { Mission, Objective, Hint, Reward } from '../../types';
import ReactMarkdown from 'react-markdown';

// Mission card for the list
const MissionCard: React.FC<{
  mission: Mission;
  isActive: boolean;
  onStart: () => void;
  onView: () => void;
}> = ({ mission, isActive, onStart, onView }) => {
  const isLocked = mission.status === 'locked';
  const isCompleted = mission.status === 'completed';
  const isAvailable = mission.status === 'available';

  return (
    <motion.div
      className={`
        p-4 rounded-lg border transition-all
        ${isActive ? 'bg-blue-900/30 border-blue-500' : ''}
        ${isLocked ? 'bg-gray-800/50 border-gray-700 opacity-60' : ''}
        ${isCompleted ? 'bg-green-900/20 border-green-700' : ''}
        ${isAvailable && !isActive ? 'bg-gray-800 border-gray-600 hover:border-blue-500 cursor-pointer' : ''}
      `}
      whileHover={isLocked ? {} : { scale: 1.01 }}
      onClick={isActive || isCompleted ? onView : isAvailable ? onStart : undefined}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${isLocked ? 'bg-gray-700' : ''}
            ${isCompleted ? 'bg-green-600' : ''}
            ${isActive ? 'bg-blue-600' : ''}
            ${isAvailable && !isActive ? 'bg-gray-700' : ''}
          `}
        >
          {isLocked && <Lock className="w-5 h-5 text-gray-500" />}
          {isCompleted && <CheckCircle2 className="w-5 h-5 text-white" />}
          {(isActive || isAvailable) && !isCompleted && (
            <Target className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{mission.title}</h3>
            {isActive && (
              <span className="px-2 py-0.5 bg-blue-600 text-xs rounded">Active</span>
            )}
            {isCompleted && (
              <span className="px-2 py-0.5 bg-green-600 text-xs rounded">Completed</span>
            )}
          </div>

          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {mission.briefing.split('\n')[0]}
          </p>

          {/* Objective progress */}
          {isActive && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>
                  {mission.objectives.filter((o) => o.completed).length} / {mission.objectives.length} objectives
                </span>
              </div>
              <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${(mission.objectives.filter((o) => o.completed).length / mission.objectives.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Start button for available missions */}
          {isAvailable && !isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Mission
            </button>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>
    </motion.div>
  );
};

// Objective item display
const ObjectiveItem: React.FC<{ objective: Objective }> = ({ objective }) => {
  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg
        ${objective.completed ? 'bg-green-900/20' : 'bg-gray-800'}
      `}
    >
      {objective.completed ? (
        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={objective.completed ? 'text-green-300' : 'text-gray-300'}>
          {objective.description}
        </p>
        {objective.required > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            Progress: {objective.current} / {objective.required}
          </p>
        )}
      </div>
      {objective.optional && (
        <span className="text-xs text-yellow-500 bg-yellow-500/20 px-2 py-0.5 rounded">
          Optional
        </span>
      )}
    </div>
  );
};

// Hint dialog
const HintDialog: React.FC<{
  hint: Hint;
  onClose: () => void;
}> = ({ hint, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 text-yellow-400">
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold">Hint</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                strong: ({ children }) => (
                  <strong className="text-yellow-300 font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-blue-300">{children}</em>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 mb-4">{children}</p>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 text-gray-300 mb-4">{children}</ol>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300">{children}</li>
                ),
              }}
            >
              {hint.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Reward display
const RewardItem: React.FC<{ reward: Reward }> = ({ reward }) => {
  const icons: Record<string, React.ReactNode> = {
    cash: <span className="text-green-400">$</span>,
    xp: <Trophy className="w-4 h-4 text-yellow-400" />,
    'unlock-hardware': <span className="text-purple-400">+</span>,
    'unlock-feature': <span className="text-blue-400">+</span>,
    achievement: <Trophy className="w-4 h-4 text-amber-400" />,
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded">
      {icons[reward.type]}
      <span className="text-sm text-gray-300">{reward.description}</span>
    </div>
  );
};

// Main Mission View
export const MissionView: React.FC = () => {
  const {
    missions,
    currentMission,
    startMission,
    loadMission,
    completeMission,
  } = useGameStore();

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showHint, setShowHint] = useState<Hint | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Load all missions if not already loaded
  useEffect(() => {
    Object.values(ALL_MISSIONS).forEach((mission) => {
      if (!missions[mission.id]) {
        loadMission(mission);
      }
    });
  }, [missions, loadMission]);

  // Get the active mission
  const activeMission = currentMission ? missions[currentMission] : null;

  // Get current hint based on progress
  const completedObjectiveIds = activeMission
    ? activeMission.objectives.filter((o) => o.completed).map((o) => o.id)
    : [];
  const currentHint = activeMission
    ? getNextHintForMission(activeMission.id, completedObjectiveIds)
    : null;

  // Handle mission start
  const handleStartMission = (missionId: string) => {
    startMission(missionId);
    // Trigger mission start events (spawn devices, etc.)
    onMissionStart(missionId);

    const mission = missions[missionId];
    if (mission) {
      setSelectedMission(mission);
      setViewMode('detail');
    }
  };

  // Handle viewing a mission
  const handleViewMission = (mission: Mission) => {
    setSelectedMission(mission);
    setViewMode('detail');
  };

  // Check if all objectives are complete
  const allObjectivesComplete = activeMission
    ? activeMission.objectives.filter((o) => !o.optional).every((o) => o.completed)
    : false;

  // Handle mission completion
  const handleCompleteMission = () => {
    if (activeMission && allObjectivesComplete) {
      // Trigger mission completion events (grant rewards, etc.)
      onMissionComplete(activeMission.id);
      completeMission(activeMission.id);
      setViewMode('list');
      setSelectedMission(null);
    }
  };

  // All missions for display
  const allMissions = Object.values(missions);

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Missions</h1>
          </div>

          {viewMode === 'detail' && (
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Back to List
            </button>
          )}
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {/* Active Mission Banner */}
            {activeMission && (
              <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400">Active Mission</p>
                    <h2 className="text-lg font-semibold">{activeMission.title}</h2>
                  </div>
                  <button
                    onClick={() => handleViewMission(activeMission)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
                  >
                    View Details
                  </button>
                </div>
                {/* Quick progress */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span>
                      {activeMission.objectives.filter((o) => o.completed).length} /{' '}
                      {activeMission.objectives.length} objectives complete
                    </span>
                    {currentHint && (
                      <button
                        onClick={() => setShowHint(currentHint)}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300"
                      >
                        <HelpCircle className="w-3 h-3" />
                        Need help?
                      </button>
                    )}
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${(activeMission.objectives.filter((o) => o.completed).length / activeMission.objectives.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mission List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-300">Phase 1: Getting Started</h2>
              {allMissions.length === 0 ? (
                <p className="text-gray-500">Loading missions...</p>
              ) : (
                allMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    isActive={currentMission === mission.id}
                    onStart={() => handleStartMission(mission.id)}
                    onView={() => handleViewMission(mission)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Detail View */}
        {viewMode === 'detail' && selectedMission && (
          <div className="space-y-6">
            {/* Mission Header */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedMission.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Phase {selectedMission.phase} - Mission {selectedMission.order}
                  </p>
                </div>
              </div>
            </div>

            {/* Briefing */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Mission Briefing</h3>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => (
                      <strong className="text-blue-300 font-semibold">{children}</strong>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-300 mb-3">{children}</p>
                    ),
                  }}
                >
                  {selectedMission.briefing}
                </ReactMarkdown>
              </div>
            </div>

            {/* Objectives */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold">Objectives</h3>
                </div>
                {currentHint && currentMission === selectedMission.id && (
                  <button
                    onClick={() => setShowHint(currentHint)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 rounded-lg text-sm transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Show Hint
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {selectedMission.objectives.map((objective) => (
                  <ObjectiveItem key={objective.id} objective={objective} />
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold">Rewards</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMission.rewards.map((reward, index) => (
                  <RewardItem key={index} reward={reward} />
                ))}
              </div>
            </div>

            {/* Complete Mission Button */}
            {currentMission === selectedMission.id && allObjectivesComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/30 border border-green-600 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 font-semibold">All Objectives Complete!</p>
                    <p className="text-sm text-gray-400">
                      Click to claim your rewards and finish the mission.
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteMission}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
                  >
                    Complete Mission
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Hint Dialog */}
        <AnimatePresence>
          {showHint && <HintDialog hint={showHint} onClose={() => setShowHint(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};
