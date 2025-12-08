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
      {/* Office scene background */}
      <div className="flex-1 relative bg-[var(--color-bg-medium)]">
        {/* Simple office scene representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[600px] h-[400px] bg-[#d4c4a8] border-8 border-[#8b7355]">
            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#a0522d] border-t-4 border-[#8b4513]" />

            {/* Wall decorations - T1 Demarc */}
            <div className="absolute top-8 right-8">
              <img
                src="/sprites/equipment/t1-demarc.png"
                alt="T1 Demarc"
                className="w-12 h-12"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Bubba at desk */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
              <img
                src="/sprites/environment/bubba-desk.png"
                alt="Bubba at desk"
                className="w-24 h-24"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Darlene at reception - left side */}
            <div className="absolute bottom-20 left-8">
              <img
                src="/sprites/environment/darlene-desk.png"
                alt="Darlene at reception"
                className="w-20 h-20"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Earl with toolbox - right side */}
            <div className="absolute bottom-24 right-8">
              <img
                src="/sprites/environment/earl-toolbox.png"
                alt="Earl"
                className="w-16 h-16"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Other PCs around the room */}
            <div className="absolute bottom-24 left-36">
              <img
                src="/sprites/equipment/pc.png"
                alt="PC"
                className="w-10 h-10"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="absolute bottom-24 right-36">
              <img
                src="/sprites/equipment/pc.png"
                alt="PC"
                className="w-10 h-10"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
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
