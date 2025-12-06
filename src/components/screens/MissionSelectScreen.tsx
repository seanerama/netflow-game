import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { introDialogue as mission12Intro } from '../../data/mission1-2';
import { introDialogue as mission13Intro, MISSION_1_3_BUDGET } from '../../data/mission1-3';
import { introDialogue as mission14Intro, MISSION_1_4_BUDGET } from '../../data/mission1-4';
import { introDialogue as mission15Intro, MISSION_1_5_BUDGET } from '../../data/mission1-5';
import type { SubMission } from '../../types';

interface MissionInfo {
  id: string;
  title: string;
  description: string;
}

const missionData: MissionInfo[] = [
  {
    id: '1.1',
    title: 'Hook \'Em Up',
    description: 'Connect Bubba\'s office to the internet',
  },
  {
    id: '1.2',
    title: 'Lock the Door',
    description: 'Configure the firewall to protect the network',
  },
  {
    id: '1.3',
    title: 'Growing Pains',
    description: 'Add new employees to the network',
  },
  {
    id: '1.4',
    title: 'The Great Slowdown',
    description: 'Diagnose network performance issues',
  },
  {
    id: '1.5',
    title: 'Switching Things Up',
    description: 'Replace the hub with a proper switch',
  },
];

export function MissionSelectScreen() {
  const setPhase = useGameStore((state) => state.setPhase);
  const setSubMission = useGameStore((state) => state.setSubMission);
  const addDialogue = useGameStore((state) => state.addDialogue);
  const setBudget = useGameStore((state) => state.setBudget);
  const budget = useGameStore((state) => state.budget);
  const currentSubMission = useGameStore((state) => state.currentSubMission);

  // Determine mission status based on current progress
  const getMissionStatus = (missionId: string): 'complete' | 'available' | 'locked' => {
    const currentNum = parseFloat(currentSubMission);
    const missionNum = parseFloat(missionId);

    if (missionNum < currentNum) return 'complete';
    if (missionNum === currentNum) return 'available';
    if (missionNum === currentNum + 0.1) return 'available'; // Next mission is also available after completing current
    return 'locked';
  };

  const handleStartMission = (missionId: string) => {
    if (missionId === '1.2') {
      setSubMission('1.2');
      addDialogue(mission12Intro);
      setPhase('intro');
    } else if (missionId === '1.3') {
      setSubMission('1.3' as SubMission);
      setBudget(MISSION_1_3_BUDGET);
      addDialogue(mission13Intro);
      setPhase('intro');
    } else if (missionId === '1.4') {
      setSubMission('1.4' as SubMission);
      setBudget(MISSION_1_4_BUDGET);
      addDialogue(mission14Intro);
      setPhase('intro');
    } else if (missionId === '1.5') {
      setSubMission('1.5' as SubMission);
      setBudget(MISSION_1_5_BUDGET);
      addDialogue(mission15Intro);
      setPhase('intro');
    }
  };

  // Get dynamic employee count based on mission progress
  const getEmployeeCount = () => {
    const currentNum = parseFloat(currentSubMission);
    if (currentNum >= 1.3) return 6;
    return 4;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl text-[var(--color-accent-yellow)] mb-2">
            Mission Select
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Choose your next mission at Bubba's Premium Property Management
          </p>
          <p className="text-[var(--color-accent-green)] text-xs mt-2">
            Budget Available: ${budget}
          </p>
        </div>

        <div className="space-y-4">
          {missionData.map((mission) => {
            const status = getMissionStatus(mission.id);
            return (
              <div
                key={mission.id}
                className={`border-4 p-4 ${
                  status === 'complete'
                    ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                    : status === 'available'
                    ? 'border-[var(--color-accent-blue)] bg-[var(--color-bg-medium)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-dark)] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">
                        {status === 'complete' ? '✓' : status === 'locked' ? '🔒' : '▶'}
                      </span>
                      <div>
                        <h2 className="text-sm font-bold">
                          Mission {mission.id}: {mission.title}
                        </h2>
                        <p className="text-[8px] text-[var(--color-text-secondary)]">
                          {mission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {status === 'complete' && (
                      <span className="text-[var(--color-accent-green)] text-xs">
                        COMPLETE
                      </span>
                    )}
                    {status === 'available' && (
                      <PixelButton
                        variant="primary"
                        onClick={() => handleStartMission(mission.id)}
                      >
                        Start
                      </PixelButton>
                    )}
                    {status === 'locked' && (
                      <span className="text-[var(--color-text-muted)] text-xs">
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <PixelPanel title="Network Status" className="inline-block">
            <div className="grid grid-cols-2 gap-4 text-[8px]">
              <div>
                <span className="text-[var(--color-text-secondary)]">Devices:</span>
                <span className="ml-2">{getEmployeeCount() + 2} connected</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Security:</span>
                <span className="ml-2 text-[var(--color-accent-green)]">Firewall Active</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Bandwidth:</span>
                <span className="ml-2">T1 (1.544 Mbps)</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Employees:</span>
                <span className="ml-2">{getEmployeeCount()}</span>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>
    </div>
  );
}
