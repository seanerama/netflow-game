import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  bubbaOfferDialogue,
  acceptDialogue,
  thinkDialogue,
  harlanSetupDialogue,
  accomplishments,
} from '../../data/mission1-8';

type Phase = 'offer' | 'choice' | 'response' | 'harlan' | 'summary' | 'complete';

interface Props {
  onComplete: () => void;
}

export function HiredScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('offer');

  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const addDialogue = useGameStore((state) => state.addDialogue);

  const handleOfferComplete = () => {
    setPhase('choice');
  };

  const handleChoice = (playerChoice: 'accept' | 'think') => {
    if (playerChoice === 'accept') {
      addDialogue(acceptDialogue);
    } else {
      addDialogue(thinkDialogue);
    }
    setPhase('response');
  };

  const handleResponseComplete = () => {
    addDialogue(harlanSetupDialogue);
    setPhase('harlan');
  };

  const handleHarlanComplete = () => {
    setPhase('summary');
  };

  const handleSummaryComplete = () => {
    setPhase('complete');
  };

  // Offer phase - Bubba's initial dialogue
  if (phase === 'offer') {
    if (dialogueQueue.length === 0) {
      addDialogue(bubbaOfferDialogue);
    }
    return (
      <div className="h-full flex flex-col">
        {/* Office scene with Bubba in a tie */}
        <div className="flex-1 relative bg-[var(--color-bg-medium)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[600px] h-[400px] bg-[#d4c4a8] border-8 border-[#8b7355]">
              {/* Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#a0522d] border-t-4 border-[#8b4513]" />

              {/* Bubba's desk */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#8b7355] border-4 border-[#6b5340]">
                {/* Papers on desk */}
                <div className="absolute -top-2 left-4 w-8 h-6 bg-white border border-gray-300" />
                <div className="absolute -top-1 left-8 w-8 h-6 bg-white border border-gray-300" />
              </div>

              {/* Bubba with tie */}
              <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#8B4513] border-4 border-[var(--color-border)] flex flex-col items-center justify-center">
                <span className="text-3xl text-white">B</span>
                {/* Tie */}
                <div className="absolute bottom-2 w-3 h-8 bg-red-600 transform rotate-3" />
              </div>

              {/* "Hired" banner behind */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[var(--color-accent-yellow)] px-6 py-2 border-4 border-[#8b6914]">
                <span className="text-lg font-bold text-black">CONGRATULATIONS!</span>
              </div>
            </div>
          </div>

          {/* Scene label */}
          <div className="absolute top-4 left-4 text-[10px] text-[var(--color-text-secondary)]">
            Bubba's Premium Property Management
          </div>
          <div className="absolute top-4 right-4 text-[10px] text-[var(--color-text-secondary)]">
            A Few Weeks Later...
          </div>
        </div>

        {dialogueQueue.length > 0 && (
          <DialogueManager onComplete={handleOfferComplete} />
        )}
      </div>
    );
  }

  // Choice phase - player makes a decision
  if (phase === 'choice') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 relative bg-[var(--color-bg-medium)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <PixelPanel title="What do you say?" className="w-96">
              <div className="space-y-4 p-4">
                <p className="text-sm text-center mb-6">
                  Bubba is offering you a full-time position as Network Administrator.
                </p>

                <PixelButton
                  variant="primary"
                  onClick={() => handleChoice('accept')}
                  className="w-full py-4 text-lg"
                >
                  "I'm in!"
                </PixelButton>

                <PixelButton
                  variant="default"
                  onClick={() => handleChoice('think')}
                  className="w-full py-4"
                >
                  "Let me think about it..."
                </PixelButton>
              </div>
            </PixelPanel>
          </div>
        </div>
      </div>
    );
  }

  // Response phase - show dialogue based on choice
  if (phase === 'response') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 relative bg-[var(--color-bg-medium)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[600px] h-[400px] bg-[#d4c4a8] border-8 border-[#8b7355]">
              {/* Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#a0522d] border-t-4 border-[#8b4513]" />

              {/* Characters celebrating */}
              <div className="absolute bottom-28 left-1/4 -translate-x-1/2 w-16 h-16 bg-[#8B4513] border-4 border-[var(--color-border)] flex items-center justify-center text-xl text-white">
                B
              </div>
              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#DAA520] border-4 border-[var(--color-border)] flex items-center justify-center text-xl text-white">
                D
              </div>
              <div className="absolute bottom-28 left-3/4 -translate-x-1/2 w-16 h-16 bg-[#228B22] border-4 border-[var(--color-border)] flex items-center justify-center text-xl text-white">
                E
              </div>

              {/* Celebration text */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl text-[var(--color-accent-yellow)] animate-pulse">
                  WELCOME TO THE TEAM!
                </div>
              </div>
            </div>
          </div>
        </div>

        {dialogueQueue.length > 0 && (
          <DialogueManager onComplete={handleResponseComplete} />
        )}
      </div>
    );
  }

  // Harlan setup phase
  if (phase === 'harlan') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 relative bg-[var(--color-bg-medium)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[600px] h-[400px] bg-[#d4c4a8] border-8 border-[#8b7355]">
              {/* Floor */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#a0522d] border-t-4 border-[#8b4513]" />

              {/* Bubba */}
              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#8B4513] border-4 border-[var(--color-border)] flex items-center justify-center text-2xl text-white">
                B
              </div>

              {/* Thought bubble with car dealership */}
              <div className="absolute top-12 right-12 w-48 h-32 bg-white border-4 border-gray-400 rounded-lg p-2">
                <div className="text-center text-xs text-gray-700 mb-2">
                  HARLAN'S HOUSE OF HONDAS
                </div>
                <div className="flex justify-center gap-2">
                  <div className="w-8 h-6 bg-red-500 border border-gray-600">🚗</div>
                  <div className="w-8 h-6 bg-blue-500 border border-gray-600">🚗</div>
                  <div className="w-8 h-6 bg-green-500 border border-gray-600">🚗</div>
                </div>
                <div className="text-center text-[8px] text-gray-500 mt-2">
                  30 employees, 1995 systems
                </div>
              </div>
            </div>
          </div>
        </div>

        {dialogueQueue.length > 0 && (
          <DialogueManager onComplete={handleHarlanComplete} />
        )}
      </div>
    );
  }

  // Summary phase - show accomplishments
  if (phase === 'summary') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="pixel-panel-header text-center">
          <h1 className="text-lg text-[var(--color-accent-yellow)]">
            Mission 1 Complete!
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Title earned */}
            <div className="text-center mb-8">
              <div className="inline-block bg-[var(--color-accent-yellow)] px-6 py-3 border-4 border-[#8b6914]">
                <div className="text-xs text-black mb-1">TITLE UNLOCKED</div>
                <div className="text-lg font-bold text-black">
                  Bubba's Network Administrator
                </div>
              </div>
            </div>

            {/* Accomplishments grid */}
            <PixelPanel title="Your Accomplishments" className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                {accomplishments.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[var(--color-bg-dark)] border border-[var(--color-border)]"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-[var(--color-accent-green)]">
                        {item.title}
                      </div>
                      <div className="text-[8px] text-[var(--color-text-secondary)]">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PixelPanel>

            <div className="text-center">
              <PixelButton variant="primary" onClick={handleSummaryComplete}>
                Continue
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete phase
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <PixelPanel title="Mission 1 Complete!" className="text-center p-8">
        <div className="text-4xl mb-4">🎉</div>
        <div className="text-lg mb-2">Congratulations!</div>
        <div className="text-sm text-[var(--color-text-secondary)] mb-6">
          You've completed all of Mission 1.
        </div>
        <PixelButton variant="primary" onClick={onComplete}>
          Return to Title Screen
        </PixelButton>
      </PixelPanel>
    </div>
  );
}
