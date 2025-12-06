import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  swapCompleteDialogue,
  resultsDialogue,
  bubbaSatisfiedDialogue,
  macLearningExplanation,
} from '../../data/mission1-5';

interface SwitchInstallProps {
  onComplete: () => void;
}

type InstallPhase = 'intro' | 'swapping' | 'swapped' | 'testing' | 'results' | 'explanation' | 'complete';

export function SwitchInstall({ onComplete }: SwitchInstallProps) {
  const addDialogue = useGameStore((state) => state.addDialogue);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);

  const [phase, setPhase] = useState<InstallPhase>('intro');
  const [swapProgress, setSwapProgress] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  // Live metrics for the "after" state
  const [liveSpeed, setLiveSpeed] = useState(92);
  const [liveCollisions] = useState(0);

  useEffect(() => {
    if (phase === 'testing') {
      const interval = setInterval(() => {
        setLiveSpeed(88 + Math.floor(Math.random() * 8));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleStartSwap = () => {
    setPhase('swapping');
    // Simulate swap progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setSwapProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setPhase('swapped');
        addDialogue(swapCompleteDialogue);
      }
    }, 300);
  };

  const handleDialogueComplete = () => {
    if (phase === 'swapped') {
      setPhase('testing');
      setShowBeforeAfter(true);
      // Auto-advance to results after showing the comparison
      setTimeout(() => {
        addDialogue(resultsDialogue);
        setPhase('results');
      }, 3000);
    } else if (phase === 'results') {
      addDialogue(bubbaSatisfiedDialogue);
      setPhase('explanation');
    } else if (phase === 'explanation') {
      addDialogue(macLearningExplanation);
      setPhase('complete');
    } else if (phase === 'complete') {
      onComplete();
    }
  };

  const devices = [
    { name: 'Bubba', ip: '.10' },
    { name: 'Earl', ip: '.11' },
    { name: 'Darlene', ip: '.12' },
    { name: 'Mom', ip: '.13' },
    { name: 'Scooter', ip: '.14' },
    { name: 'Wayne', ip: '.15' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-3 border-b-4 border-[#0f3460]">
        <div className="flex items-center justify-between">
          <div className="text-[var(--color-accent-blue)] text-sm font-bold">
            Network Upgrade: Hub to Switch
          </div>
          <div className="text-[var(--color-text-secondary)] text-xs">
            {phase === 'intro' && 'Ready to swap'}
            {phase === 'swapping' && 'Installing...'}
            {phase === 'swapped' && 'Swap complete'}
            {phase === 'testing' && 'Testing performance...'}
            {phase === 'results' && 'Results'}
            {phase === 'explanation' && 'Understanding switches'}
            {phase === 'complete' && 'Mission complete!'}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-bg-medium)]">
        <div className="max-w-4xl mx-auto">
          {/* Network Topology Visualization */}
          <div className="mb-6 p-6 bg-[var(--color-bg-dark)] border-4 border-[var(--color-border)]">
            <div className="text-xs text-[var(--color-accent-blue)] mb-4 text-center">
              Network Topology
            </div>

            <div className="flex items-center justify-center gap-8">
              {/* Internet/Router */}
              <div className="text-center">
                <div className="w-16 h-12 bg-[var(--color-accent-orange)] border-2 border-[var(--color-border)] flex items-center justify-center text-xs">
                  T1
                </div>
                <div className="text-[8px] mt-1">Internet</div>
              </div>

              <div className="text-2xl">→</div>

              <div className="text-center">
                <div className="w-16 h-12 bg-[var(--color-accent-blue)] border-2 border-[var(--color-border)] flex items-center justify-center text-xs">
                  Router
                </div>
                <div className="text-[8px] mt-1">192.168.1.1</div>
              </div>

              <div className="text-2xl">→</div>

              {/* Hub or Switch */}
              <div className="text-center">
                {phase === 'intro' || phase === 'swapping' ? (
                  <>
                    <div
                      className={`w-20 h-12 border-2 border-[var(--color-border)] flex items-center justify-center text-xs transition-all ${
                        phase === 'swapping'
                          ? 'bg-[var(--color-accent-yellow)] animate-pulse'
                          : 'bg-[var(--color-accent-red)]'
                      }`}
                    >
                      {phase === 'swapping' ? '...' : 'HUB'}
                    </div>
                    <div className="text-[8px] mt-1 text-[var(--color-accent-red)]">
                      {phase === 'swapping' ? 'Swapping...' : 'Collision Domain'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-12 bg-[var(--color-accent-green)] border-2 border-[var(--color-border)] flex items-center justify-center text-xs">
                      SWITCH
                    </div>
                    <div className="text-[8px] mt-1 text-[var(--color-accent-green)]">
                      Smart Forwarding
                    </div>
                  </>
                )}
              </div>

              <div className="text-2xl">→</div>

              {/* PCs */}
              <div className="text-center">
                <div className="grid grid-cols-3 gap-1">
                  {devices.map((device) => (
                    <div
                      key={device.name}
                      className="w-8 h-8 bg-[var(--color-pc)] border border-[var(--color-border)] text-[6px] flex flex-col items-center justify-center"
                    >
                      <span>{device.name.substring(0, 3)}</span>
                      <span className="text-[5px] text-[var(--color-text-muted)]">
                        {device.ip}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[8px] mt-1">6 PCs</div>
              </div>
            </div>

            {/* Swap Progress Bar */}
            {phase === 'swapping' && (
              <div className="mt-6">
                <div className="text-center text-[10px] text-[var(--color-accent-yellow)] mb-2">
                  Swapping hub for switch...
                </div>
                <div className="w-full h-4 bg-[var(--color-bg-medium)] border-2 border-[var(--color-border)]">
                  <div
                    className="h-full bg-[var(--color-accent-yellow)] transition-all"
                    style={{ width: `${swapProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Before/After Comparison */}
          {showBeforeAfter && (
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Before (Hub) */}
              <div className="p-4 bg-[var(--color-accent-red)]/20 border-4 border-[var(--color-accent-red)]">
                <div className="text-center text-[var(--color-accent-red)] font-bold mb-4">
                  BEFORE (Hub)
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px]">
                    <span>PC-to-PC Speed:</span>
                    <span className="text-[var(--color-accent-red)] font-mono">
                      3-8 Mbps
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Collisions/hour:</span>
                    <span className="text-[var(--color-accent-red)] font-mono">
                      847
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Collision Domains:</span>
                    <span className="text-[var(--color-accent-red)] font-mono">
                      1 (shared)
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Traffic Handling:</span>
                    <span className="text-[var(--color-accent-red)] font-mono">
                      Broadcast ALL
                    </span>
                  </div>
                </div>
              </div>

              {/* After (Switch) */}
              <div className="p-4 bg-[var(--color-accent-green)]/20 border-4 border-[var(--color-accent-green)]">
                <div className="text-center text-[var(--color-accent-green)] font-bold mb-4">
                  AFTER (Switch)
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px]">
                    <span>PC-to-PC Speed:</span>
                    <span className="text-[var(--color-accent-green)] font-mono">
                      {liveSpeed} Mbps
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Collisions/hour:</span>
                    <span className="text-[var(--color-accent-green)] font-mono">
                      {liveCollisions}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Collision Domains:</span>
                    <span className="text-[var(--color-accent-green)] font-mono">
                      6 (per port)
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Traffic Handling:</span>
                    <span className="text-[var(--color-accent-green)] font-mono">
                      Smart Forward
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MAC Address Table Visualization */}
          {(phase === 'explanation' || phase === 'complete') && (
            <div className="mb-6 p-4 bg-black border-2 border-[#333]">
              <div className="text-[var(--color-accent-green)] font-mono text-xs mb-3">
                SWITCH MAC ADDRESS TABLE
              </div>
              <div className="grid grid-cols-3 gap-2 text-[8px] font-mono">
                <div className="text-[var(--color-text-muted)]">PORT</div>
                <div className="text-[var(--color-text-muted)]">MAC ADDRESS</div>
                <div className="text-[var(--color-text-muted)]">DEVICE</div>
                {devices.map((device, index) => (
                  <>
                    <div key={`port-${index}`} className="text-[var(--color-accent-blue)]">
                      Port {index + 1}
                    </div>
                    <div key={`mac-${index}`} className="text-[var(--color-accent-yellow)]">
                      00:1A:2B:3C:4D:{(0x10 + index).toString(16).toUpperCase()}
                    </div>
                    <div key={`name-${index}`}>{device.name}'s PC</div>
                  </>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          {phase === 'intro' && dialogueQueue.length === 0 && (
            <div className="text-center">
              <div className="mb-4 text-[var(--color-text-secondary)] text-[10px]">
                The switch is ready. Time to replace that hub!
              </div>
              <PixelButton variant="primary" onClick={handleStartSwap}>
                Begin Swap
              </PixelButton>
            </div>
          )}
        </div>
      </div>

      {/* Dialogue overlay */}
      {dialogueQueue.length > 0 && (
        <DialogueManager onComplete={handleDialogueComplete} />
      )}
    </div>
  );
}
