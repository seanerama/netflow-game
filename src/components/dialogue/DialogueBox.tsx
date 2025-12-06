import React, { useState, useEffect } from 'react';
import { Portrait } from '../ui/Portrait';
import { getCharacter } from '../../data/characters';
import type { DialogueLine, DialogueChoice } from '../../types';

interface DialogueBoxProps {
  line: DialogueLine;
  onAdvance: () => void;
  onChoice?: (choice: DialogueChoice) => void;
}

export function DialogueBox({ line, onAdvance, onChoice }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const character = getCharacter(line.speaker);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    const text = line.text;
    const typeSpeed = 30; // ms per character

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, typeSpeed);

    return () => clearInterval(timer);
  }, [line.text]);

  const handleClick = () => {
    if (isTyping) {
      // Skip to end of text
      setDisplayedText(line.text);
      setIsTyping(false);
    } else if (!line.choices) {
      onAdvance();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div
      className="dialogue-box w-full max-w-3xl mx-auto cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Advance dialogue"
    >
      <div className="flex gap-4">
        {line.speaker !== 'narrator' && (
          <div className="flex-shrink-0">
            <Portrait characterId={line.speaker} size="md" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Speaker name */}
          {character.name && (
            <div className="text-[var(--color-accent-blue)] font-bold mb-2 text-xs">
              {character.name}
            </div>
          )}

          {/* Dialogue text */}
          <div
            className={`leading-relaxed ${
              line.speaker === 'narrator' ? 'italic text-[var(--color-text-secondary)]' : ''
            }`}
          >
            {displayedText}
            {isTyping && <span className="blink-active">▌</span>}
          </div>

          {/* Choices */}
          {!isTyping && line.choices && (
            <div className="mt-4 flex flex-col gap-2">
              {line.choices.map((choice, index) => (
                <button
                  key={index}
                  className="text-left px-4 py-2 bg-[var(--color-bg-medium)] border-2 border-[var(--color-border)] hover:border-[var(--color-accent-blue)] hover:bg-[var(--color-bg-light)] transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChoice?.(choice);
                  }}
                >
                  <span className="text-[var(--color-accent-yellow)] mr-2">
                    {String.fromCharCode(65 + index)})
                  </span>
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
