import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import { equipmentOptions } from '../../data/mission1-3';
import type { EquipmentOption } from '../../data/mission1-3';

interface GrowingPainsStoreProps {
  onComplete: () => void;
}

export function GrowingPainsStore({ onComplete }: GrowingPainsStoreProps) {
  const budget = useGameStore((state) => state.budget);
  const addDialogue = useGameStore((state) => state.addDialogue);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const [selectedOption, setSelectedOption] = useState<EquipmentOption | null>(null);
  const [showRejection, setShowRejection] = useState(false);
  const [rejectedOption, setRejectedOption] = useState<EquipmentOption | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (option: EquipmentOption) => {
    if (!option.canSelect) {
      // Show Bubba's rejection
      setRejectedOption(option);
      setShowRejection(true);
    } else {
      setSelectedOption(option);
    }
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    // Show Bubba's reaction then proceed
    if (selectedOption.bubbaReaction) {
      addDialogue(selectedOption.bubbaReaction);
    }
    setShowConfirm(true);
  };

  const handleDialogueComplete = () => {
    if (showConfirm) {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] p-3 border-b-4 border-[#5D3A1A]">
        <div className="flex items-center justify-between">
          <div className="text-white text-sm font-bold">
            Network Expansion Options
          </div>
          <div className="text-white text-xs">
            Budget: <span className="price-tag">${budget}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-bg-medium)]">
          <div className="max-w-2xl mx-auto">
            {/* Info Box */}
            <div className="info-box mb-6">
              <p className="font-bold text-[10px] mb-2 text-[var(--color-bg-dark)]">
                Current Network Status
              </p>
              <p className="text-[8px] text-[var(--color-bg-dark)]">
                8-port hub with 5 ports in use (4 PCs + router). 3 ports available.
                Need to connect: Scooter's PC and Wayne's PC.
              </p>
            </div>

            {/* Equipment Options */}
            <div className="space-y-4">
              {equipmentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border-4 cursor-pointer transition-all ${
                    selectedOption?.id === option.id
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/20'
                      : option.canSelect
                      ? 'border-[var(--color-border)] bg-[var(--color-bg-light)] hover:border-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-dark)] opacity-75'
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{option.name}</span>
                        {option.isRecommended && (
                          <span className="text-[8px] bg-[var(--color-accent-yellow)] text-black px-2 py-0.5">
                            RECOMMENDED
                          </span>
                        )}
                        {!option.canSelect && (
                          <span className="text-[8px] bg-[var(--color-accent-red)] text-white px-2 py-0.5">
                            OVER BUDGET
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-1">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="price-tag text-lg">${option.cost}</div>
                      {option.id === 'use-existing' && (
                        <div className="text-[8px] text-[var(--color-text-muted)]">
                          (2 cables)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Summary */}
            {selectedOption && (
              <div className="mt-6 p-4 border-4 border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">Selected: {selectedOption.name}</div>
                    <div className="text-[8px] text-[var(--color-text-secondary)]">
                      Remaining budget after purchase: ${budget - selectedOption.cost}
                    </div>
                  </div>
                  <PixelButton variant="primary" onClick={handleConfirm}>
                    Confirm Purchase
                  </PixelButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-56 p-4 border-l-4 border-[var(--color-border)] bg-[var(--color-bg-dark)]">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">NETWORK STATUS</h3>

          <div className="space-y-3 text-[8px]">
            <div className="flex items-center gap-2">
              <span className="status-dot status-connected" />
              <span>Router - Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-connected" />
              <span>Hub - 5/8 ports used</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-connected" />
              <span>Bubba's PC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-connected" />
              <span>Earl's PC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-connected" />
              <span>Darlene's PC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-connected" />
              <span>Accountant PC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-warning" />
              <span>Scooter's PC - Needs setup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-warning" />
              <span>Wayne's PC - Needs setup</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[var(--color-bg-medium)] text-[8px]">
            <div className="text-[var(--color-accent-yellow)] mb-2">Note:</div>
            <p className="text-[var(--color-text-secondary)]">
              The existing hub has enough ports for this expansion. Bubba prefers the cheapest option.
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejection && rejectedOption && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <PixelPanel title="Bubba Says..." className="max-w-md">
            {rejectedOption.bubbaReaction?.map((line) => (
              <p key={line.id} className="mb-3 text-sm">
                "{line.text}"
              </p>
            ))}
            <PixelButton onClick={() => setShowRejection(false)}>
              Okay, okay...
            </PixelButton>
          </PixelPanel>
        </div>
      )}

      {/* Dialogue overlay */}
      {dialogueQueue.length > 0 && (
        <DialogueManager onComplete={handleDialogueComplete} />
      )}
    </div>
  );
}
