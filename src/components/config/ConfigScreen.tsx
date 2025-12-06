import { useState } from 'react';
import { RouterConfigPanel } from './RouterConfigPanel';
import { PCConfigPanel } from './PCConfigPanel';
import { useGameStore } from '../../store/gameStore';

export function ConfigScreen() {
  const setPhase = useGameStore((state) => state.setPhase);
  const [configStep, setConfigStep] = useState<'router' | 'pcs'>('router');

  const handleRouterComplete = () => {
    setConfigStep('pcs');
  };

  const handlePCsComplete = () => {
    setPhase('test');
  };

  if (configStep === 'router') {
    return <RouterConfigPanel onComplete={handleRouterComplete} />;
  }

  return <PCConfigPanel onComplete={handlePCsComplete} />;
}
