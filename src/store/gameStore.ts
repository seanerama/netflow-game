import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type NetworkSlice, createNetworkSlice } from './slices/networkSlice';
import { type BusinessSlice, createBusinessSlice } from './slices/businessSlice';
import { type MissionSlice, createMissionSlice } from './slices/missionSlice';
import { type SimulationSlice, createSimulationSlice } from './slices/simulationSlice';
import { type UISlice, createUISlice } from './slices/uiSlice';
import type { GameTime, PlayerState } from '../types';

// Game meta state
interface GameMetaSlice {
  version: string;
  saveSlot: number;
  lastSaved: number;
  gameTime: GameTime;
  isPaused: boolean;
  gameSpeed: 1 | 2 | 4;
  unlockedFeatures: string[];
  player: PlayerState;

  // Game control actions
  pauseGame: () => void;
  resumeGame: () => void;
  setGameSpeed: (speed: 1 | 2 | 4) => void;
  advanceTime: (minutes: number) => void;
  saveGame: () => void;

  // Feature unlock
  unlockFeature: (feature: string) => void;
  hasFeature: (feature: string) => boolean;

  // Player actions
  addXP: (amount: number) => void;
  setPlayerName: (name: string) => void;

  // Reset
  resetGame: () => void;
}

const initialPlayerState: PlayerState = {
  name: 'Network Engineer',
  xp: 0,
  level: 1,
  achievements: [],
  preferences: {
    animationSpeed: 'normal',
    showTutorials: true,
    soundEnabled: true,
    musicEnabled: true,
    colorblindMode: false,
  },
};

const initialGameMetaState = {
  version: '1.0.0-mvp',
  saveSlot: 1,
  lastSaved: 0,
  gameTime: {
    day: 1,
    hour: 9,
    minute: 0,
    totalMinutes: 540, // 9:00 AM on day 1
  },
  isPaused: true,
  gameSpeed: 1 as const,
  unlockedFeatures: ['basic-router', 'basic-switch', 'ethernet-cable'],
  player: initialPlayerState,
};

// Combined store type
export type GameStore = GameMetaSlice &
  NetworkSlice &
  BusinessSlice &
  MissionSlice &
  SimulationSlice &
  UISlice;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get, api) => ({
      // Game meta state
      ...initialGameMetaState,

      pauseGame: () => set({ isPaused: true }),

      resumeGame: () => set({ isPaused: false }),

      setGameSpeed: (speed) => set({ gameSpeed: speed }),

      advanceTime: (minutes) =>
        set((state) => {
          const newTotalMinutes = state.gameTime.totalMinutes + minutes;
          const day = Math.floor(newTotalMinutes / 1440) + 1; // 1440 minutes per day
          const dayMinutes = newTotalMinutes % 1440;
          const hour = Math.floor(dayMinutes / 60);
          const minute = dayMinutes % 60;

          return {
            gameTime: {
              day,
              hour,
              minute,
              totalMinutes: newTotalMinutes,
            },
          };
        }),

      saveGame: () => set({ lastSaved: Date.now() }),

      unlockFeature: (feature) =>
        set((state) => ({
          unlockedFeatures: state.unlockedFeatures.includes(feature)
            ? state.unlockedFeatures
            : [...state.unlockedFeatures, feature],
        })),

      hasFeature: (feature) => get().unlockedFeatures.includes(feature),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.player.xp + amount;
          // Level up every 100 XP
          const newLevel = Math.floor(newXP / 100) + 1;

          return {
            player: {
              ...state.player,
              xp: newXP,
              level: newLevel,
            },
          };
        }),

      setPlayerName: (name) =>
        set((state) => ({
          player: {
            ...state.player,
            name,
          },
        })),

      resetGame: () =>
        set({
          ...initialGameMetaState,
          lastSaved: 0,
        }),

      // Slices
      ...createNetworkSlice(set, get, api),
      ...createBusinessSlice(set, get, api),
      ...createMissionSlice(set, get, api),
      ...createSimulationSlice(set, get, api),
      ...createUISlice(set, get, api),
    }),
    {
      name: 'netflow-game-storage',
      partialize: (state) => ({
        // Persist everything except transient UI state
        version: state.version,
        saveSlot: state.saveSlot,
        lastSaved: state.lastSaved,
        gameTime: state.gameTime,
        gameSpeed: state.gameSpeed,
        unlockedFeatures: state.unlockedFeatures,
        player: state.player,
        network: state.network,
        business: state.business,
        currentPhase: state.currentPhase,
        currentMission: state.currentMission,
        completedMissions: state.completedMissions,
        missions: state.missions,
        simulation: {
          ...state.simulation,
          isRunning: false, // Always start paused on load
        },
      }),
    }
  )
);

// Selector hooks for common selections
export const useDevices = () => useGameStore((state) => state.network.devices);
export const useConnections = () => useGameStore((state) => state.network.connections);
export const usePackets = () => useGameStore((state) => state.network.packets);
export const useBusiness = () => useGameStore((state) => state.business);
export const useEmployees = () => useGameStore((state) => state.business.employees);
export const useCurrentMission = () => useGameStore((state) => state.currentMission);
export const useUIState = () => useGameStore((state) => state.ui);
export const useGameTime = () => useGameStore((state) => state.gameTime);
export const useSimulation = () => useGameStore((state) => state.simulation);
export const useToasts = () => useGameStore((state) => state.toasts);
