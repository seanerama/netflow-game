import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { introDialogue as mission12Intro } from '../../data/mission1-2';

const missions = [
  {
    id: '1.1',
    title: 'Hook \'Em Up',
    description: 'Connect Bubba\'s office to the internet',
    status: 'complete',
  },
  {
    id: '1.2',
    title: 'Lock the Door',
    description: 'Configure the firewall to protect the network',
    status: 'available',
  },
  {
    id: '1.3',
    title: 'Growing Pains',
    description: 'Add new employees to the network',
    status: 'locked',
  },
  {
    id: '1.4',
    title: 'The Great Slowdown',
    description: 'Diagnose network performance issues',
    status: 'locked',
  },
];

export function MissionSelectScreen() {
  const setPhase = useGameStore((state) => state.setPhase);
  const setSubMission = useGameStore((state) => state.setSubMission);
  const addDialogue = useGameStore((state) => state.addDialogue);
  const budget = useGameStore((state) => state.budget);

  const handleStartMission = (missionId: string) => {
    if (missionId === '1.2') {
      setSubMission('1.2');
      addDialogue(mission12Intro);
      setPhase('intro');
    }
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
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`border-4 p-4 ${
                mission.status === 'complete'
                  ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                  : mission.status === 'available'
                  ? 'border-[var(--color-accent-blue)] bg-[var(--color-bg-medium)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-dark)] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">
                      {mission.status === 'complete' ? '✓' : mission.status === 'locked' ? '🔒' : '▶'}
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
                  {mission.status === 'complete' && (
                    <span className="text-[var(--color-accent-green)] text-xs">
                      COMPLETE
                    </span>
                  )}
                  {mission.status === 'available' && (
                    <PixelButton
                      variant="primary"
                      onClick={() => handleStartMission(mission.id)}
                    >
                      Start
                    </PixelButton>
                  )}
                  {mission.status === 'locked' && (
                    <span className="text-[var(--color-text-muted)] text-xs">
                      LOCKED
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <PixelPanel title="Network Status" className="inline-block">
            <div className="grid grid-cols-2 gap-4 text-[8px]">
              <div>
                <span className="text-[var(--color-text-secondary)]">Devices:</span>
                <span className="ml-2">6 connected</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Security:</span>
                <span className="ml-2 text-[var(--color-accent-yellow)]">Basic</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Bandwidth:</span>
                <span className="ml-2">T1 (1.544 Mbps)</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Employees:</span>
                <span className="ml-2">4</span>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>
    </div>
  );
}
