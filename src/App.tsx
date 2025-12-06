import { useGameStore } from './store/gameStore';
import { TitleScreen } from './components/screens/TitleScreen';
import { IntroScreen } from './components/screens/IntroScreen';
import { MissionCompleteScreen } from './components/screens/MissionCompleteScreen';
import { MissionSelectScreen } from './components/screens/MissionSelectScreen';
import { EquipmentStore } from './components/store/EquipmentStore';
import { TopologyBuilder } from './components/topology/TopologyBuilder';
import { ConfigScreen } from './components/config/ConfigScreen';
import { NetworkTest } from './components/test/NetworkTest';
import { EducationalSummary } from './components/summary/EducationalSummary';
import { DialogueManager } from './components/dialogue/DialogueManager';
import { FirewallConfigPanel } from './components/config/FirewallConfigPanel';
import { SecurityChoice } from './components/test/SecurityChoice';
import { GrowingPainsStore } from './components/store/GrowingPainsStore';
import { NewPCConfig } from './components/config/NewPCConfig';
import { DiagnosticsPanel } from './components/diagnostics/DiagnosticsPanel';
import { SwitchStore } from './components/store/SwitchStore';
import { SwitchInstall } from './components/network/SwitchInstall';
import { FileShareSetup } from './components/config/FileShareSetup';
import { PrinterSetup } from './components/config/PrinterSetup';
import { HiredScreen } from './components/screens/HiredScreen';
import { DebugPanel } from './components/debug/DebugPanel';
import { successDialogue as mission12SuccessDialogue } from './data/mission1-2';
import { configSuccessDialogue, testSuccessDialogue, foreshadowingDialogue } from './data/mission1-3';
import { successDialogue as mission14SuccessDialogue } from './data/mission1-4';
import { successDialogue as mission15SuccessDialogue, installIntroDialogue } from './data/mission1-5';
import { successDialogue as mission16SuccessDialogue } from './data/mission1-6';
import { successDialogue as mission17SuccessDialogue } from './data/mission1-7';

function App() {
  const phase = useGameStore((state) => state.phase);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const budget = useGameStore((state) => state.budget);
  const currentSubMission = useGameStore((state) => state.currentSubMission);

  const setPhase = useGameStore((state) => state.setPhase);
  const addDialogue = useGameStore((state) => state.addDialogue);

  const handleFirewallComplete = () => {
    addDialogue(mission12SuccessDialogue);
    setPhase('security-choice');
  };

  const handleSecurityChoiceComplete = () => {
    setPhase('mission-select');
  };

  const handleGrowingStoreComplete = () => {
    setPhase('new-pc-config');
  };

  const handleNewPCConfigComplete = () => {
    addDialogue([...configSuccessDialogue, ...testSuccessDialogue, ...foreshadowingDialogue]);
    setPhase('summary');
  };

  const handleDiagnosticsComplete = () => {
    addDialogue(mission14SuccessDialogue);
    setPhase('summary');
  };

  const handleSwitchStoreComplete = () => {
    addDialogue(installIntroDialogue);
    setPhase('switch-install');
  };

  const handleSwitchInstallComplete = () => {
    addDialogue(mission15SuccessDialogue);
    setPhase('summary');
  };

  const handleFileShareComplete = () => {
    addDialogue(mission16SuccessDialogue);
    setPhase('summary');
  };

  const handlePrinterSetupComplete = () => {
    addDialogue(mission17SuccessDialogue);
    setPhase('summary');
  };

  const handleHiredComplete = () => {
    // Mission 1 complete - return to title for now (Mission 2 coming soon)
    setPhase('title');
  };

  const renderPhase = () => {
    switch (phase) {
      case 'title':
        return <TitleScreen />;
      case 'intro':
        return <IntroScreen />;
      case 'store':
        return <EquipmentStore />;
      case 'topology':
        return <TopologyBuilder />;
      case 'config':
        return <ConfigScreen />;
      case 'test':
        return <NetworkTest />;
      case 'summary':
        return <EducationalSummary />;
      case 'complete':
        return <MissionCompleteScreen />;
      case 'mission-select':
        return <MissionSelectScreen />;
      case 'firewall':
        return <FirewallConfigPanel onComplete={handleFirewallComplete} />;
      case 'security-choice':
        return <SecurityChoice onComplete={handleSecurityChoiceComplete} />;
      case 'growing-store':
        return <GrowingPainsStore onComplete={handleGrowingStoreComplete} />;
      case 'new-pc-config':
        return <NewPCConfig onComplete={handleNewPCConfigComplete} />;
      case 'diagnostics':
        return <DiagnosticsPanel onComplete={handleDiagnosticsComplete} />;
      case 'switch-store':
        return <SwitchStore onComplete={handleSwitchStoreComplete} />;
      case 'switch-install':
        return <SwitchInstall onComplete={handleSwitchInstallComplete} />;
      case 'file-share':
        return <FileShareSetup onComplete={handleFileShareComplete} />;
      case 'printer-setup':
        return <PrinterSetup onComplete={handlePrinterSetupComplete} />;
      case 'hired':
        return <HiredScreen onComplete={handleHiredComplete} />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--color-bg-dark)]">
      {/* Top status bar (hidden on title screen) */}
      {phase !== 'title' && phase !== 'complete' && (
        <div className="h-8 bg-[var(--color-panel-header)] border-b-2 border-[var(--color-border)] flex items-center justify-between px-4">
          <div className="text-[10px] text-[var(--color-text-secondary)]">
            Mission 1.{currentSubMission.split('.')[1]}: {getMissionTitle(currentSubMission)}
          </div>
          <div className="text-[10px]">
            <span className="text-[var(--color-text-secondary)]">Budget: </span>
            <span className="price-tag">${budget}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {renderPhase()}
      </div>

      {/* Floating dialogue (for phases that show dialogue over content) */}
      {phase === 'store' && dialogueQueue.length > 0 && (
        <DialogueManager />
      )}

      {/* Debug Panel - toggle with Ctrl+Shift+D */}
      <DebugPanel />
    </div>
  );
}

function getMissionTitle(subMission: string): string {
  const titles: Record<string, string> = {
    '1.1': 'Hook \'Em Up',
    '1.2': 'Lock the Door',
    '1.3': 'Growing Pains',
    '1.4': 'The Great Slowdown',
    '1.5': 'Switching Things Up',
    '1.6': 'Sharing is Caring',
    '1.7': 'Print Money',
    '1.8': 'You\'re Hired!',
  };
  return titles[subMission] || 'Unknown';
}

export default App;
