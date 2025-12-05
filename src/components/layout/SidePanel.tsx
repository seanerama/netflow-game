import React from 'react';
import {
  Network,
  Building2,
  ShoppingBag,
  Target,
  Settings,
} from 'lucide-react';
import { useGameStore, useUIState } from '../../store/gameStore';

const navItems = [
  { id: 'network', icon: Network, label: 'Network', view: 'network' as const },
  { id: 'office', icon: Building2, label: 'Office', view: 'office' as const },
  { id: 'shop', icon: ShoppingBag, label: 'Shop', view: 'shop' as const },
  { id: 'missions', icon: Target, label: 'Missions', view: 'missions' as const },
  { id: 'config', icon: Settings, label: 'Config', view: 'config' as const },
];

export const SidePanel: React.FC = () => {
  const { setCurrentView } = useGameStore();
  const ui = useUIState();

  return (
    <aside className="w-16 bg-gray-800 border-l border-gray-700 flex flex-col items-center py-4 gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = ui.currentView === item.view;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.view)}
            className={`
              p-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }
            `}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </aside>
  );
};
