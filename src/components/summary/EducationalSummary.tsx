import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { educationalSummary } from '../../data/mission1-1';

export function EducationalSummary() {
  const setPhase = useGameStore((state) => state.setPhase);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleComplete = () => {
    setPhase('complete');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pixel-panel-header text-center">
        <h1 className="text-lg">Mission Complete! Here's What You Learned:</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {educationalSummary.map((section, index) => (
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
                <span className="float-right text-[var(--color-accent-green)]">6</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Budget Used:</span>
                <span className="float-right text-[var(--color-accent-green)]">~$180</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Configuration Errors:</span>
                <span className="float-right text-[var(--color-accent-green)]">0</span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Bonus Earned:</span>
                <span className="float-right text-[var(--color-accent-yellow)]">$50</span>
              </div>
            </div>
          </PixelPanel>

          {/* Next Mission Teaser */}
          <div className="warning-box mb-6 text-center">
            <p className="text-[10px] mb-2">
              <strong>Coming up in Mission 1.2: "Lock the Door"</strong>
            </p>
            <p className="text-[8px] text-[var(--color-text-secondary)]">
              Darlene heard about those "internet worms" and wants you to secure the network...
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
