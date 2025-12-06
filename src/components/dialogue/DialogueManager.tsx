import { useGameStore } from '../../store/gameStore';
import { DialogueBox } from './DialogueBox';
import type { DialogueChoice } from '../../types';

interface DialogueManagerProps {
  onComplete?: () => void;
}

export function DialogueManager({ onComplete }: DialogueManagerProps) {
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);

  const currentLine = dialogueQueue[0];

  if (!currentLine) {
    return null;
  }

  const handleAdvance = () => {
    const next = advanceDialogue();
    // If that was the last line, call onComplete
    if (dialogueQueue.length <= 1) {
      currentLine.onComplete?.();
      onComplete?.();
    } else {
      next?.onComplete?.();
    }
  };

  const handleChoice = (choice: DialogueChoice) => {
    choice.effect?.();
    if (choice.response) {
      // Insert the response at the front of the queue
      useGameStore.getState().addDialogue([choice.response]);
    }
    handleAdvance();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <DialogueBox
        line={currentLine}
        onAdvance={handleAdvance}
        onChoice={handleChoice}
      />
    </div>
  );
}
