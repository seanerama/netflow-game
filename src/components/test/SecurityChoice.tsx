import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { safetyChoices, educationalSummary as mission12Summary } from '../../data/mission1-2';

interface SecurityChoiceProps {
  onComplete: () => void;
}

export function SecurityChoice({ onComplete }: SecurityChoiceProps) {
  const addDialogue = useGameStore((state) => state.addDialogue);
  const [choiceMade, setChoiceMade] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const handleChoice = (optionId: string) => {
    const option = safetyChoices.options.find(o => o.id === optionId);
    if (!option) return;

    setChoiceMade(true);
    setWasCorrect(option.correct);

    // Queue the response dialogue
    addDialogue(option.response);
  };

  const handleDialogueComplete = () => {
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <div className="flex flex-col h-full">
        <div className="pixel-panel-header text-center">
          <h1 className="text-lg">Mission Complete! Here's What You Learned:</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {mission12Summary.map((section, index) => (
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

            {/* Result Box */}
            <PixelPanel
              title={wasCorrect ? "Good Advice!" : "Learning Opportunity"}
              className="mb-6"
            >
              <div className="text-[10px]">
                {wasCorrect ? (
                  <p className="text-[var(--color-accent-green)]">
                    You gave Darlene good security advice! A firewall is just one layer of protection.
                    User awareness is just as important.
                  </p>
                ) : (
                  <p className="text-[var(--color-accent-yellow)]">
                    Oops! Being overconfident about security can lead to problems.
                    Remember: No security measure is 100% effective, especially against social engineering.
                  </p>
                )}
              </div>
            </PixelPanel>

            <div className="text-center">
              <PixelButton variant="primary" onClick={onComplete}>
                Continue to Next Mission
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (choiceMade) {
    // Show a simple "Click to continue" while dialogue plays
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Click the dialogue box to continue...
          </p>
          <PixelButton onClick={handleDialogueComplete}>
            Skip to Summary
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="pixel-panel-header text-center">
        <h1 className="text-lg">Security Check</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg">
          <PixelPanel title="Darlene asks...">
            <div className="mb-6">
              <p className="text-sm italic text-center">
                "{safetyChoices.question.replace('How do you respond to Darlene?', 'So we\'re safe now?')}"
              </p>
            </div>

            <div className="space-y-3">
              {safetyChoices.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  className="w-full p-4 text-left border-4 border-[var(--color-border)] bg-[var(--color-bg-medium)] hover:bg-[var(--color-accent-blue)] hover:border-[var(--color-accent-blue)] hover:text-white transition-colors"
                >
                  <span className="text-sm">{option.text}</span>
                </button>
              ))}
            </div>
          </PixelPanel>
        </div>
      </div>
    </div>
  );
}
