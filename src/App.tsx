import { useEffect, useState } from 'react';
import { GameLayout } from './components/layout/GameLayout';
import { NetworkView } from './components/views/NetworkView';
import { ShopView } from './components/views/ShopView';
import { MissionView } from './components/views/MissionView';
import { LandingPage } from './components/views/LandingPage';
import { DeviceConfigModal } from './components/config/DeviceConfigModal';
import { ToastContainer } from './components/ui/Toast';
import { useGameStore, useUIState, useToasts } from './store/gameStore';
import { initializeGameState } from './data/initialState';
import { useMissionProgress } from './hooks/useMissionProgress';
import './index.css';

function App() {
  const ui = useUIState();
  const toasts = useToasts();
  const { closeModal, network, dismissToast } = useGameStore();

  // Track mission progress automatically
  useMissionProgress();

  // Track if user has started the game (persisted in localStorage)
  const [hasStarted, setHasStarted] = useState(() => {
    return localStorage.getItem('netflow-game-started') === 'true';
  });

  const handleStartGame = () => {
    localStorage.setItem('netflow-game-started', 'true');
    setHasStarted(true);
  };

  // Initialize game state on first load
  useEffect(() => {
    // Only initialize if network is empty and game has started
    if (hasStarted && Object.keys(network.devices).length === 0) {
      initializeGameState();
    }
  }, [hasStarted]);

  // Show landing page if game hasn't started
  if (!hasStarted) {
    return <LandingPage onStartGame={handleStartGame} />;
  }

  const renderView = () => {
    switch (ui.currentView) {
      case 'network':
        return <NetworkView />;
      case 'shop':
        return <ShopView />;
      case 'office':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg">Office View</p>
              <p className="text-sm">Coming Soon - View your employees and their productivity</p>
            </div>
          </div>
        );
      case 'missions':
        return <MissionView />;
      case 'config':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg">Global Config</p>
              <p className="text-sm">Coming Soon - Game settings and preferences</p>
            </div>
          </div>
        );
      default:
        return <NetworkView />;
    }
  };

  return (
    <>
      <GameLayout>{renderView()}</GameLayout>

      {/* Modals */}
      <DeviceConfigModal
        isOpen={ui.activeModal === 'device-config'}
        onClose={closeModal}
        modalData={ui.modalData as { deviceId?: string; mode?: 'connect'; fromDevice?: string; toDevice?: string }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default App;
