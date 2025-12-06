import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  diagnosticTools,
  diagnosticResults,
  collisionExplanation,
  collisionDomainExplanation,
  reportToBubba,
} from '../../data/mission1-4';

interface DiagnosticsPanelProps {
  onComplete: () => void;
}

export function DiagnosticsPanel({ onComplete }: DiagnosticsPanelProps) {
  const addDialogue = useGameStore((state) => state.addDialogue);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [scannedTools, setScannedTools] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationShown, setExplanationShown] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Simulated live values for traffic monitor
  const [liveTraffic, setLiveTraffic] = useState(87);
  const [liveCollisions, setLiveCollisions] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTraffic(85 + Math.floor(Math.random() * 10));
      setLiveCollisions((prev) => prev + Math.floor(Math.random() * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToolSelect = async (toolId: string) => {
    if (isScanning) return;

    setSelectedTool(toolId);
    setIsScanning(true);

    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!scannedTools.includes(toolId)) {
      setScannedTools([...scannedTools, toolId]);
    }
    setIsScanning(false);
  };

  const allToolsScanned = diagnosticTools.every((tool) =>
    scannedTools.includes(tool.id)
  );

  const handleAnalyze = () => {
    if (!explanationShown) {
      addDialogue([...collisionExplanation, ...collisionDomainExplanation]);
      setShowExplanation(true);
      setExplanationShown(true);
    }
  };

  const handleDialogueComplete = () => {
    if (showExplanation && !showReport) {
      setShowReport(true);
      addDialogue(reportToBubba);
    } else if (showReport) {
      onComplete();
    }
  };

  const getResultsForTool = (toolId: string) => {
    return diagnosticResults.filter((r) => r.toolId === toolId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-[var(--color-accent-green)]';
      case 'warning':
        return 'text-[var(--color-accent-yellow)]';
      case 'critical':
        return 'text-[var(--color-accent-red)]';
      default:
        return '';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-[var(--color-accent-green)]/20 border-[var(--color-accent-green)]';
      case 'warning':
        return 'bg-[var(--color-accent-yellow)]/20 border-[var(--color-accent-yellow)]';
      case 'critical':
        return 'bg-[var(--color-accent-red)]/20 border-[var(--color-accent-red)]';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-3 border-b-4 border-[#0f3460]">
        <div className="flex items-center justify-between">
          <div className="text-[var(--color-accent-blue)] text-sm font-bold">
            Network Diagnostics Toolkit
          </div>
          <div className="text-[var(--color-text-secondary)] text-xs">
            Scan all tools to analyze the problem
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool Selection Sidebar */}
        <div className="w-48 p-4 border-r-4 border-[var(--color-border)] bg-[var(--color-bg-dark)]">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">
            DIAGNOSTIC TOOLS
          </h3>

          <div className="space-y-2">
            {diagnosticTools.map((tool) => {
              const isScanned = scannedTools.includes(tool.id);
              const isSelected = selectedTool === tool.id;

              return (
                <button
                  key={tool.id}
                  className={`w-full p-3 border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/20'
                      : isScanned
                      ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-medium)] hover:border-[var(--color-accent-blue)]'
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                  disabled={isScanning}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tool.icon}</span>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold">{tool.name}</div>
                      <div className="text-[8px] text-[var(--color-text-muted)]">
                        {isScanned ? '✓ Scanned' : 'Click to scan'}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <div className="text-[8px] text-[var(--color-text-secondary)] mb-2">
              {scannedTools.length}/{diagnosticTools.length} tools scanned
            </div>
            {allToolsScanned && !explanationShown && (
              <PixelButton variant="primary" onClick={handleAnalyze}>
                Analyze Results
              </PixelButton>
            )}
          </div>
        </div>

        {/* Main Results Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[var(--color-bg-medium)]">
          {!selectedTool ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-[var(--color-text-secondary)]">
                  Select a diagnostic tool to begin scanning
                </div>
              </div>
            </div>
          ) : isScanning ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse">📡</div>
                <div className="text-[var(--color-accent-blue)]">
                  Scanning network...
                </div>
                <div className="mt-4 w-48 h-2 bg-[var(--color-bg-dark)] mx-auto">
                  <div className="h-full bg-[var(--color-accent-blue)] animate-pulse w-2/3" />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Tool Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">
                  {diagnosticTools.find((t) => t.id === selectedTool)?.icon}
                </span>
                <div>
                  <h2 className="text-lg font-bold">
                    {diagnosticTools.find((t) => t.id === selectedTool)?.name}
                  </h2>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">
                    {
                      diagnosticTools.find((t) => t.id === selectedTool)
                        ?.description
                    }
                  </p>
                </div>
              </div>

              {/* Live Monitor for Traffic */}
              {selectedTool === 'traffic' && (
                <div className="mb-6 p-4 bg-black border-2 border-[#333]">
                  <div className="text-[var(--color-accent-green)] font-mono text-xs mb-2">
                    LIVE TRAFFIC MONITOR
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[8px] text-[var(--color-text-muted)]">
                        Hub Bandwidth
                      </div>
                      <div className="text-2xl font-mono text-[var(--color-accent-red)]">
                        {liveTraffic} Mbps
                      </div>
                      <div className="w-full h-2 bg-[#333] mt-1">
                        <div
                          className="h-full bg-[var(--color-accent-red)] transition-all"
                          style={{ width: `${liveTraffic}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] text-[var(--color-text-muted)]">
                        Max Capacity
                      </div>
                      <div className="text-2xl font-mono text-[var(--color-accent-yellow)]">
                        100 Mbps
                      </div>
                      <div className="text-[8px] text-[var(--color-accent-red)] mt-2">
                        ⚠ NEAR SATURATION
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Monitor for Collisions */}
              {selectedTool === 'collision' && (
                <div className="mb-6 p-4 bg-black border-2 border-[#333]">
                  <div className="text-[var(--color-accent-green)] font-mono text-xs mb-2">
                    COLLISION COUNTER
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-mono text-[var(--color-accent-red)]">
                      {liveCollisions}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      collisions in the last hour
                    </div>
                    <div className="text-[8px] text-[var(--color-accent-red)] mt-2 animate-pulse">
                      💥 EXCESSIVE - Network severely impacted
                    </div>
                  </div>
                </div>
              )}

              {/* Network Map for map tool */}
              {selectedTool === 'map' && (
                <div className="mb-6 p-4 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-accent-blue)] mb-4">
                    Current Network Topology
                  </div>
                  <div className="flex items-center justify-center gap-8">
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
                      <div className="text-[8px] mt-1">Gateway</div>
                    </div>
                    <div className="text-2xl">→</div>
                    <div className="text-center">
                      <div className="w-20 h-12 bg-[var(--color-accent-red)] border-2 border-[var(--color-border)] flex items-center justify-center text-xs animate-pulse">
                        HUB
                      </div>
                      <div className="text-[8px] mt-1 text-[var(--color-accent-red)]">
                        ⚠ Bottleneck!
                      </div>
                    </div>
                    <div className="text-2xl">→</div>
                    <div className="text-center">
                      <div className="grid grid-cols-3 gap-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 bg-[var(--color-pc)] border border-[var(--color-border)] text-[6px] flex items-center justify-center"
                          >
                            PC
                          </div>
                        ))}
                      </div>
                      <div className="text-[8px] mt-1">6 PCs</div>
                    </div>
                  </div>
                  <div className="text-center mt-4 text-[8px] text-[var(--color-accent-yellow)]">
                    All 6 PCs sharing ONE collision domain
                  </div>
                </div>
              )}

              {/* Results Cards */}
              <div className="space-y-3">
                {getResultsForTool(selectedTool).map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-2 ${getStatusBg(result.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{result.title}</span>
                      <span
                        className={`font-mono text-lg ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {result.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      {result.detail}
                    </p>
                    {result.isClue && (
                      <div className="mt-2 text-[8px] text-[var(--color-accent-yellow)]">
                        🔍 This is a clue!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Findings Sidebar */}
        <div className="w-56 p-4 border-l-4 border-[var(--color-border)] bg-[var(--color-bg-dark)]">
          <h3 className="text-xs text-[var(--color-accent-yellow)] mb-4">
            FINDINGS
          </h3>

          {scannedTools.length === 0 ? (
            <div className="text-[8px] text-[var(--color-text-muted)]">
              Scan tools to collect findings...
            </div>
          ) : (
            <div className="space-y-3">
              {diagnosticResults
                .filter(
                  (r) => scannedTools.includes(r.toolId) && r.isClue
                )
                .map((result, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[var(--color-bg-medium)] border-l-2 border-[var(--color-accent-yellow)]"
                  >
                    <div className="text-[8px] font-bold">{result.title}</div>
                    <div
                      className={`text-[10px] ${getStatusColor(result.status)}`}
                    >
                      {result.value}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {allToolsScanned && (
            <div className="mt-6 p-3 bg-[var(--color-accent-red)]/20 border-2 border-[var(--color-accent-red)]">
              <div className="text-[10px] font-bold text-[var(--color-accent-red)]">
                DIAGNOSIS:
              </div>
              <div className="text-[8px] mt-1">
                Hub creating collision bottleneck. Need to upgrade to a switch.
              </div>
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
