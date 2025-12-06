import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { educationalSummary as mission11Summary } from '../../data/mission1-1';
import { educationalSummary as mission12Summary } from '../../data/mission1-2';
import { educationalSummary as mission13Summary } from '../../data/mission1-3';
import type { EducationalSection } from '../../types';

const missionSummaries: Record<string, EducationalSection[]> = {
  '1.1': mission11Summary,
  '1.2': mission12Summary,
  '1.3': mission13Summary,
};

const missionStats: Record<string, { devices: number; budget: string; next: { title: string; teaser: string } }> = {
  '1.1': {
    devices: 6,
    budget: '~$180',
    next: {
      title: 'Mission 1.2: "Lock the Door"',
      teaser: 'Darlene heard about those "internet worms" and wants you to secure the network...',
    },
  },
  '1.2': {
    devices: 6,
    budget: '$0',
    next: {
      title: 'Mission 1.3: "Growing Pains"',
      teaser: 'Business is booming! Bubba hired his nephew Scooter and his friend Wayne...',
    },
  },
  '1.3': {
    devices: 8,
    budget: '~$16',
    next: {
      title: 'Mission 1.4: "The Great Slowdown"',
      teaser: 'Everyone\'s complaining the internet is slow. Time to diagnose the problem...',
    },
  },
};

export function EducationalSummary() {
  const setPhase = useGameStore((state) => state.setPhase);
  const setSubMission = useGameStore((state) => state.setSubMission);
  const currentSubMission = useGameStore((state) => state.currentSubMission);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const summary = missionSummaries[currentSubMission] || mission11Summary;
  const stats = missionStats[currentSubMission] || missionStats['1.1'];

  const handleComplete = () => {
    // Advance to next sub-mission and go to mission select
    const currentNum = parseFloat(currentSubMission);
    const nextNum = (currentNum + 0.1).toFixed(1);
    if (nextNum === '1.2' || nextNum === '1.3' || nextNum === '1.4') {
      setSubMission(nextNum as '1.2' | '1.3' | '1.4');
    }
    setPhase('mission-select');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pixel-panel-header text-center">
        <h1 className="text-lg">Mission Complete! Here's What You Learned:</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {summary.map((section, index) => (
            <div key={index} className="edu-card mb-4">
              <div
                className="edu-card-header cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === index ? null : index)}
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="flex-1 text-sm">{section.title}</span>
                <span className="text-[var(--color-accent-blue)]">
                  {expandedSection === index ? '▼' : '▶'}
                </span>
              </div>

              {expandedSection === index && (
                <div className="edu-card-content">
                  <p className="mb-4">{section.content}</p>
                  {section.details && (
                    <div className="bg-[var(--color-bg-dark)] p-3 text-[9px] space-y-1">
                      {section.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className={detail.startsWith('•') ? 'pl-4' : ''}
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Mission Stats */}
          <PixelPanel title="Mission Statistics" className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-[10px]">
              <div>
                <span className="text-[var(--color-text-secondary)]">Devices Connected:</span>
                <span className="float-right text-[var(--color-accent-green)]">{stats.devices}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Budget Used:</span>
                <span className="float-right text-[var(--color-accent-green)]">{stats.budget}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Configuration Errors:</span>
                <span className="float-right text-[var(--color-accent-green)]">0</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Mission:</span>
                <span className="float-right text-[var(--color-accent-yellow)]">{currentSubMission}</span>
              </div>
            </div>
          </PixelPanel>

          {/* Next Mission Teaser */}
          <div className="warning-box mb-6 text-center">
            <p className="text-[10px] mb-2">
              <strong>Coming up: {stats.next.title}</strong>
            </p>
            <p className="text-[8px] text-[var(--color-text-secondary)]">
              {stats.next.teaser}
            </p>
          </div>

          <div className="text-center">
            <PixelButton variant="primary" onClick={handleComplete}>
              Continue
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
