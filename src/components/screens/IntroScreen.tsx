import { useGameStore } from '../../store/gameStore';
import { DialogueManager } from '../dialogue/DialogueManager';
import { storeIntroDialogue } from '../../data/mission1-1';
import { threatExplanation, configIntroDialogue } from '../../data/mission1-2';
import { equipmentDialogue, bubbaStipulation } from '../../data/mission1-3';
import { diagnosticsIntro } from '../../data/mission1-4';
import { storeIntroDialogue as mission15StoreIntro } from '../../data/mission1-5';
import { fileShareIntro } from '../../data/mission1-6';
import { printerStoreIntro } from '../../data/mission1-7';
import { introDialogue as mission18Intro } from '../../data/mission1-8';

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
    } else if (currentSubMission === '1.6') {
      // For mission 1.6, go to file share setup
      addDialogue(fileShareIntro);
      setPhase('file-share');
    } else if (currentSubMission === '1.7') {
      // For mission 1.7, go to printer setup
      addDialogue(printerStoreIntro);
      setPhase('printer-setup');
    } else if (currentSubMission === '1.8') {
      // For mission 1.8, go to hired screen
      addDialogue(mission18Intro);
      setPhase('hired');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Building exterior background */}
      <div className="flex-1 relative bg-gradient-to-b from-[#87CEEB] to-[#B0E0E6]">
        {/* Sky and ground scene */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          {/* Ground/parking lot */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#4a4a4a]">
            {/* Parking lines */}
            <div className="absolute top-4 left-1/4 w-16 h-1 bg-[#f0f0f0]" />
            <div className="absolute top-4 left-1/2 w-16 h-1 bg-[#f0f0f0] -translate-x-1/2" />
            <div className="absolute top-4 right-1/4 w-16 h-1 bg-[#f0f0f0]" />
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
