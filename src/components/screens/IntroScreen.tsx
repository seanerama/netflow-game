import { useGameStore } from '../../store/gameStore';
import { DialogueManager } from '../dialogue/DialogueManager';
import { storeIntroDialogue } from '../../data/mission1-1';
import { threatExplanation, configIntroDialogue } from '../../data/mission1-2';
import { equipmentDialogue, bubbaStipulation } from '../../data/mission1-3';
import { diagnosticsIntro } from '../../data/mission1-4';
import { storeIntroDialogue as mission15StoreIntro } from '../../data/mission1-5';

export function IntroScreen() {
  const setPhase = useGameStore((state) => state.setPhase);
  const addDialogue = useGameStore((state) => state.addDialogue);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const currentSubMission = useGameStore((state) => state.currentSubMission);

  const handleDialogueComplete = () => {
    if (currentSubMission === '1.1') {
      // After intro dialogue, add store intro and move to store
      addDialogue(storeIntroDialogue);
      setPhase('store');
    } else if (currentSubMission === '1.2') {
      // For mission 1.2, show threat explanation then go to firewall config
      addDialogue([...threatExplanation, ...configIntroDialogue]);
      setPhase('firewall');
    } else if (currentSubMission === '1.3') {
      // For mission 1.3, show equipment dialogue then go to equipment decision
      addDialogue([...equipmentDialogue, ...bubbaStipulation]);
      setPhase('growing-store');
    } else if (currentSubMission === '1.4') {
      // For mission 1.4, go straight to diagnostics
      addDialogue(diagnosticsIntro);
      setPhase('diagnostics');
    } else if (currentSubMission === '1.5') {
      // For mission 1.5, go to switch store
      addDialogue(mission15StoreIntro);
      setPhase('switch-store');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Office scene background */}
      <div className="flex-1 relative bg-[var(--color-bg-medium)]">
        {/* Simple office scene representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[600px] h-[400px] bg-[#d4c4a8] border-8 border-[#8b7355]">
            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#a0522d] border-t-4 border-[#8b4513]" />

            {/* Wall decorations */}
            <div className="absolute top-8 right-8 w-24 h-16 bg-[#333] border-4 border-[#666] flex items-center justify-center">
              <div className="w-4 h-4 bg-[var(--color-accent-green)] blink-active rounded-full" />
              <span className="text-[8px] text-white ml-2">T1</span>
            </div>

            {/* Desk (Bubba's) */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#8b7355] border-4 border-[#6b5340]">
              <div className="absolute -top-4 right-4 w-8 h-8 bg-[var(--color-pc)] border-2 border-[#758586]" />
            </div>

            {/* Character placeholder - Bubba */}
            <div
              className="absolute bottom-36 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#8B4513] border-4 border-[var(--color-border)] flex items-center justify-center text-3xl text-white"
            >
              B
            </div>

            {/* Other PCs around the room */}
            <div className="absolute bottom-24 left-8 w-8 h-8 bg-[var(--color-pc)] border-2 border-[#758586]" />
            <div className="absolute bottom-24 left-20 w-8 h-8 bg-[var(--color-pc)] border-2 border-[#758586]" />
            <div className="absolute bottom-24 right-8 w-8 h-8 bg-[var(--color-pc)] border-2 border-[#758586]" />
            <div className="absolute bottom-24 right-20 w-8 h-8 bg-[var(--color-pc)] border-2 border-[#758586]" />
          </div>
        </div>

        {/* Scene label */}
        <div className="absolute top-4 left-4 text-[10px] text-[var(--color-text-secondary)]">
          Bubba's Premium Property Management
        </div>
        <div className="absolute top-4 right-4 text-[10px] text-[var(--color-text-secondary)]">
          Possum Holler, 2001
        </div>
      </div>

      {/* Dialogue box at bottom */}
      {dialogueQueue.length > 0 && (
        <DialogueManager onComplete={handleDialogueComplete} />
      )}
    </div>
  );
}
