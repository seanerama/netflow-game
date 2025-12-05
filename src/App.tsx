import { GameLayout } from './components/layout/GameLayout';
import { NetworkView } from './components/views/NetworkView';
import { useUIState } from './store/gameStore';
import './index.css';

function App() {
  const ui = useUIState();

  const renderView = () => {
    switch (ui.currentView) {
      case 'network':
        return <NetworkView />;
      case 'office':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Office View - Coming Soon</p>
          </div>
        );
      case 'shop':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Shop View - Coming Soon</p>
          </div>
        );
      case 'missions':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Missions View - Coming Soon</p>
          </div>
        );
      case 'config':
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Config View - Coming Soon</p>
          </div>
        );
      default:
        return <NetworkView />;
    }
  };

  return <GameLayout>{renderView()}</GameLayout>;
}

export default App;
