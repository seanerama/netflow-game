import type { StateCreator } from 'zustand';
import type { SimulationState, Threat, NetworkMetrics } from '../../types';

export interface SimulationSlice {
  simulation: SimulationState;

  // Simulation control
  startSimulation: () => void;
  stopSimulation: () => void;
  setTickRate: (rate: number) => void;
  tick: () => void;

  // Threat management
  addThreat: (threat: Threat) => void;
  removeThreat: (threatId: string) => void;
  recordBlockedAttack: () => void;
  recordSuccessfulAttack: () => void;

  // Metrics
  updateMetrics: (metrics: Partial<NetworkMetrics>) => void;
  resetMetrics: () => void;
}

const initialSimulationState: SimulationState = {
  isRunning: false,
  tickRate: 100, // ms per tick
  lastTick: 0,
  activeThreats: [],
  blockedAttacks: 0,
  successfulAttacks: 0,
  metrics: {
    uptime: 100,
    averageLatency: 0,
    packetLoss: 0,
    throughput: 0,
    activeConnections: 0,
  },
};

export const createSimulationSlice: StateCreator<SimulationSlice> = (set) => ({
  simulation: initialSimulationState,

  startSimulation: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        isRunning: true,
        lastTick: Date.now(),
      },
    })),

  stopSimulation: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        isRunning: false,
      },
    })),

  setTickRate: (rate) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        tickRate: rate,
      },
    })),

  tick: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        lastTick: Date.now(),
      },
    })),

  addThreat: (threat) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        activeThreats: [...state.simulation.activeThreats, threat],
      },
    })),

  removeThreat: (threatId) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        activeThreats: state.simulation.activeThreats.filter(
          (t) => t.id !== threatId
        ),
      },
    })),

  recordBlockedAttack: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        blockedAttacks: state.simulation.blockedAttacks + 1,
      },
    })),

  recordSuccessfulAttack: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        successfulAttacks: state.simulation.successfulAttacks + 1,
      },
    })),

  updateMetrics: (metrics) =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        metrics: {
          ...state.simulation.metrics,
          ...metrics,
        },
      },
    })),

  resetMetrics: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        metrics: initialSimulationState.metrics,
      },
    })),
});
