import React from 'react';
import { TopBar } from './TopBar';
import { SidePanel } from './SidePanel';
import { BottomBar } from './BottomBar';

interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-hidden">{children}</main>
        <SidePanel />
      </div>
      <BottomBar />
    </div>
  );
};
