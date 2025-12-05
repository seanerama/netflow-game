import { useEffect } from 'react';
import { GameLayout } from './components/layout/GameLayout';
import { NetworkView } from './components/views/NetworkView';
import { ShopView } from './components/views/ShopView';
import { DeviceConfigModal } from './components/config/DeviceConfigModal';
import { useGameStore, useUIState } from './store/gameStore';
import { initializeGameState } from './data/initialState';
import './index.css';

function App() {
  const ui = useUIState();
  const { closeModal, network } = useGameStore();

  // Initialize game state on first load
  useEffect(() => {
    // Only initialize if network is empty
    if (Object.keys(network.devices).length === 0) {
      initializeGameState();
    }
  }, []);

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
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg">Missions View</p>
              <p className="text-sm">Coming Soon - Track objectives and learn networking</p>
            </div>
          </div>
        );
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
    </>
  );
}

export default App;
