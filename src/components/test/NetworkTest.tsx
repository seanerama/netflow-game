import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton } from '../ui';
import { pcConfigs, successDialogue } from '../../data/mission1-1';

interface TestStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  detail?: string;
}

export function NetworkTest() {
  const setPhase = useGameStore((state) => state.setPhase);
  const addDialogue = useGameStore((state) => state.addDialogue);
  const addBudget = useGameStore((state) => state.addBudget);

  const [testSteps, setTestSteps] = useState<TestStep[]>([
    { id: 'ping-router', description: 'PCs pinging router (192.168.1.1)', status: 'pending' },
    { id: 'ping-each', description: 'PCs pinging each other', status: 'pending' },
    { id: 'dns-resolve', description: 'DNS resolution test', status: 'pending' },
    { id: 'web-browse', description: 'Loading possum-holler-news.com', status: 'pending' },
    { id: 'email-test', description: 'Darlene sending test email', status: 'pending' },
  ]);

  const [, setCurrentTest] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [allPassed, setAllPassed] = useState(false);
  const [showBrowsers, setShowBrowsers] = useState(false);

  const runTests = async () => {
    setIsRunning(true);

    for (let i = 0; i < testSteps.length; i++) {
      setCurrentTest(i);

      // Update status to running
      setTestSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'running' } : step
        )
      );

      // Simulate test running
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark as passed (in real game, would validate actual config)
      setTestSteps((prev) =>
        prev.map((step, idx) =>
          idx === i
            ? {
                ...step,
                status: 'passed',
                detail: getTestDetail(step.id),
              }
            : step
        )
      );

      // Show browsers after DNS test
      if (i === 2) {
        setShowBrowsers(true);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setAllPassed(true);
  };

  const getTestDetail = (testId: string): string => {
    switch (testId) {
      case 'ping-router':
        return 'Reply from 192.168.1.1: time<1ms TTL=64';
      case 'ping-each':
        return 'All 4 PCs responding';
      case 'dns-resolve':
        return 'possum-holler-news.com → 198.51.100.42';
      case 'web-browse':
        return 'HTTP 200 OK';
      case 'email-test':
        return 'SMTP: Message sent successfully';
      default:
        return '';
    }
  };

  const handleComplete = () => {
    // Add bonus for coming under budget
    addBudget(50);
    // Queue success dialogue
    addDialogue(successDialogue);
    // Move to summary phase
    setPhase('summary');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pixel-panel-header text-center">
        <h1 className="text-lg">Network Test - Verifying Connectivity</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Test Steps Panel */}
        <div className="w-80 p-4 border-r-4 border-[var(--color-border)] overflow-y-auto">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">TEST SEQUENCE</h3>

          <div className="space-y-2">
            {testSteps.map((step) => (
              <div
                key={step.id}
                className={`test-step ${step.status}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {step.status === 'pending' && (
                      <span className="status-dot status-offline" />
                    )}
                    {step.status === 'running' && (
                      <span className="status-dot status-warning blink-active" />
                    )}
                    {step.status === 'passed' && (
                      <span className="text-[var(--color-accent-green)]">✓</span>
                    )}
                    {step.status === 'failed' && (
                      <span className="text-[var(--color-accent-red)]">✗</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px]">{step.description}</div>
                    {step.detail && (
                      <div className="text-[8px] text-[var(--color-accent-green)] font-mono mt-1">
                        {step.detail}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            {!isRunning && !allPassed && (
              <PixelButton variant="primary" className="w-full" onClick={runTests}>
                Start Tests
              </PixelButton>
            )}
            {isRunning && (
              <div className="text-center text-[var(--color-accent-yellow)]">
                Testing in progress...
              </div>
            )}
            {allPassed && (
              <PixelButton variant="primary" className="w-full" onClick={handleComplete}>
                Continue
              </PixelButton>
            )}
          </div>
        </div>

        {/* Visual Display */}
        <div className="flex-1 p-6 bg-[var(--color-bg-dark)]">
          {!showBrowsers ? (
            // Terminal-style ping output
            <div className="bg-black p-4 font-mono text-[10px] text-[var(--color-accent-green)] h-full overflow-y-auto">
              <div className="mb-2">C:\&gt; Testing network connectivity...</div>
              {testSteps.filter((s) => s.status !== 'pending').map((step) => (
                <div key={step.id} className="mb-2">
                  <div className="text-white">&gt; {step.description}</div>
                  {step.status === 'running' && (
                    <div className="blink-active">Sending packets...</div>
                  )}
                  {step.status === 'passed' && step.detail && (
                    <div>{step.detail}</div>
                  )}
                </div>
              ))}
              {isRunning && <span className="blink-active">_</span>}
            </div>
          ) : (
            // Browser windows showing success
            <div className="grid grid-cols-2 gap-4 h-full">
              {pcConfigs.map((pc) => (
                <div key={pc.name} className="flex flex-col">
                  {/* Browser chrome */}
                  <div className="bg-[#ece9d8] p-1 flex items-center gap-1 border-b border-[#aca899]">
                    <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
                    <div className="w-2 h-2 bg-[#ffd93d] rounded-full" />
                    <div className="w-2 h-2 bg-[#6bcb77] rounded-full" />
                    <div className="flex-1 bg-white mx-2 px-2 py-0.5 text-[8px] text-black">
                      http://possum-holler-news.com
                    </div>
                  </div>
                  {/* Browser content */}
                  <div className="flex-1 bg-white p-4 overflow-hidden">
                    <div className="text-center">
                      <h2 className="text-lg text-[#333] font-bold mb-2" style={{ fontFamily: 'serif' }}>
                        Possum Holler Gazette
                      </h2>
                      <div className="text-[8px] text-[#666] mb-4">
                        "All the News Fit to Print in Possum Holler"
                      </div>
                      <div className="text-[10px] text-[#333] text-left">
                        <p className="mb-2">
                          <strong>Breaking:</strong> Local Beanie Baby Collection Valued at $50,000
                        </p>
                        <p className="mb-2">
                          Tractor Pull Rescheduled Due to Rain
                        </p>
                        <p className="text-[8px] text-[#888]">
                          Viewing from: {pc.name} ({pc.ip})
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* PC label */}
                  <div className="text-center text-[8px] text-[var(--color-text-secondary)] mt-1">
                    {pc.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Panel */}
        <div className="w-56 p-4 border-l-4 border-[var(--color-border)]">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">NETWORK STATUS</h3>

          <div className="space-y-4">
            <div className="text-[8px]">
              <div className="text-[var(--color-text-secondary)] mb-1">Internet</div>
              <div className={`flex items-center gap-2 ${allPassed ? 'text-[var(--color-accent-green)]' : ''}`}>
                <span className={`status-dot ${allPassed ? 'status-connected' : 'status-offline'}`} />
                {allPassed ? 'Connected' : 'Testing...'}
              </div>
            </div>

            <div className="text-[8px]">
              <div className="text-[var(--color-text-secondary)] mb-1">Router</div>
              <div className="flex items-center gap-2 text-[var(--color-accent-green)]">
                <span className="status-dot status-connected" />
                192.168.1.1
              </div>
            </div>

            <div className="text-[8px]">
              <div className="text-[var(--color-text-secondary)] mb-1">Devices</div>
              {pcConfigs.map((pc) => (
                <div key={pc.name} className="flex items-center gap-2 mb-1">
                  <span className={`status-dot ${
                    testSteps[0].status === 'passed' ? 'status-connected' : 'status-offline'
                  }`} />
                  <span className="flex-1">{pc.name.split("'")[0]}</span>
                  <span className="text-[var(--color-text-muted)]">{pc.ip.split('.')[3]}</span>
                </div>
              ))}
            </div>
          </div>

          {allPassed && (
            <div className="mt-8 success-box text-center">
              <div className="text-xl mb-2">🎉</div>
              <div className="text-[10px] text-[var(--color-accent-green)]">
                ALL TESTS PASSED!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
