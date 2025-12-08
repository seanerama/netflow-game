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
        {/* Building exterior with celebration banner */}
        <div className="flex-1 relative bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]">
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
            {/* Ground/parking lot */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#4a4a4a]">
              <div className="absolute top-4 left-1/4 w-16 h-1 bg-[#f0f0f0]" />
              <div className="absolute top-4 left-1/2 w-16 h-1 bg-[#f0f0f0] -translate-x-1/2" />
              <div className="absolute top-4 right-1/4 w-16 h-1 bg-[#f0f0f0]" />
            </div>

            {/* Celebration banner */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[var(--color-accent-yellow)] px-8 py-3 border-4 border-[#8b6914] z-20">
              <span className="text-xl font-bold text-black">CONGRATULATIONS!</span>
            </div>

            {/* Building sprite */}
            <img
              src="/sprites/environment/bubba-office.png"
              alt="Bubba's Premium Property Management"
              className="relative z-10 w-96 h-auto mb-16"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Scene label */}
          <div className="absolute top-4 left-4 text-[10px] text-[var(--color-text-primary)] bg-black/30 px-2 py-1 rounded">
            Bubba's Premium Property Management
          </div>
          <div className="absolute top-4 right-4 text-[10px] text-[var(--color-text-primary)] bg-black/30 px-2 py-1 rounded">
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
        {/* Building exterior with welcome banner */}
        <div className="flex-1 relative bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]">
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
            {/* Ground/parking lot */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#4a4a4a]">
              <div className="absolute top-4 left-1/4 w-16 h-1 bg-[#f0f0f0]" />
              <div className="absolute top-4 left-1/2 w-16 h-1 bg-[#f0f0f0] -translate-x-1/2" />
              <div className="absolute top-4 right-1/4 w-16 h-1 bg-[#f0f0f0]" />
            </div>

            {/* Welcome banner */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[var(--color-accent-green)] px-8 py-3 border-4 border-[#1a5f1a] z-20">
              <span className="text-xl font-bold text-white animate-pulse">WELCOME TO THE TEAM!</span>
            </div>

            {/* Building sprite */}
            <img
              src="/sprites/environment/bubba-office.png"
              alt="Bubba's Premium Property Management"
              className="relative z-10 w-96 h-auto mb-16"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        {dialogueQueue.length > 0 && (
          <DialogueManager onComplete={handleResponseComplete} />
        )}
      </div>
    );
  }

  // Harlan setup phase - show car dealership
  if (phase === 'harlan') {
    return (
      <div className="h-full flex flex-col">
        {/* Car dealership exterior */}
        <div className="flex-1 relative bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]">
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
            {/* Ground/parking lot */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#4a4a4a]">
              <div className="absolute top-4 left-1/4 w-16 h-1 bg-[#f0f0f0]" />
              <div className="absolute top-4 left-1/2 w-16 h-1 bg-[#f0f0f0] -translate-x-1/2" />
              <div className="absolute top-4 right-1/4 w-16 h-1 bg-[#f0f0f0]" />
            </div>

            {/* Car dealership sprite */}
            <img
              src="/sprites/environment/harlan-dealership.png"
              alt="Harlan's House of Hondas"
              className="relative z-10 w-96 h-auto mb-16"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* Info badge */}
            <div className="absolute top-16 right-8 bg-white/90 px-4 py-2 border-4 border-gray-400 rounded z-20">
              <div className="text-xs text-gray-700 font-bold">Your Next Challenge:</div>
              <div className="text-[10px] text-gray-600">30 employees</div>
              <div className="text-[10px] text-gray-600">Outdated 1995 systems</div>
            </div>
          </div>

          {/* Scene label */}
          <div className="absolute top-4 left-4 text-[10px] text-[var(--color-text-primary)] bg-black/30 px-2 py-1 rounded">
            Harlan's House of Hondas
          </div>
          <div className="absolute top-4 right-4 text-[10px] text-[var(--color-text-primary)] bg-black/30 px-2 py-1 rounded">
            Coming Soon...
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
