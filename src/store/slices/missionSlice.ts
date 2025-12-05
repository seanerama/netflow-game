import type { StateCreator } from 'zustand';
import type { Mission, Objective } from '../../types';

export interface MissionSlice {
  currentPhase: number;
  currentMission?: string;
  completedMissions: string[];
  missions: Record<string, Mission>;

  // Mission actions
  loadMission: (mission: Mission) => void;
  startMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  failMission: (missionId: string) => void;

  // Objective actions
  updateObjective: (missionId: string, objectiveId: string, updates: Partial<Objective>) => void;
  completeObjective: (missionId: string, objectiveId: string) => void;

  // Progress
  advancePhase: () => void;
  getMissionStatus: (missionId: string) => Mission['status'] | undefined;
}

export const createMissionSlice: StateCreator<MissionSlice> = (set, get) => ({
  currentPhase: 1,
  currentMission: undefined,
  completedMissions: [],
  missions: {},

  loadMission: (mission) =>
    set((state) => ({
      missions: {
        ...state.missions,
        [mission.id]: mission,
      },
    })),

  startMission: (missionId) =>
    set((state) => {
      const mission = state.missions[missionId];
      if (!mission || mission.status !== 'available') return state;

      return {
        currentMission: missionId,
        missions: {
          ...state.missions,
          [missionId]: {
            ...mission,
            status: 'active',
            startedAt: Date.now(),
          },
        },
      };
    }),

  completeMission: (missionId) =>
    set((state) => {
      const mission = state.missions[missionId];
      if (!mission || mission.status !== 'active') return state;

      // Unlock next missions
      const updatedMissions = { ...state.missions };
      mission.unlocks.forEach((unlockId) => {
        if (updatedMissions[unlockId]) {
          updatedMissions[unlockId] = {
            ...updatedMissions[unlockId],
            status: 'available',
          };
        }
      });

      updatedMissions[missionId] = {
        ...mission,
        status: 'completed',
        completedAt: Date.now(),
      };

      return {
        currentMission: undefined,
        completedMissions: [...state.completedMissions, missionId],
        missions: updatedMissions,
      };
    }),

  failMission: (missionId) =>
    set((state) => {
      const mission = state.missions[missionId];
      if (!mission || mission.status !== 'active') return state;

      return {
        currentMission: undefined,
        missions: {
          ...state.missions,
          [missionId]: {
            ...mission,
            status: 'failed',
          },
        },
      };
    }),

  updateObjective: (missionId, objectiveId, updates) =>
    set((state) => {
      const mission = state.missions[missionId];
      if (!mission) return state;

      const updatedObjectives = mission.objectives.map((obj) =>
        obj.id === objectiveId ? { ...obj, ...updates } : obj
      );

      return {
        missions: {
          ...state.missions,
          [missionId]: {
            ...mission,
            objectives: updatedObjectives,
          },
        },
      };
    }),

  completeObjective: (missionId, objectiveId) =>
    set((state) => {
      const mission = state.missions[missionId];
      if (!mission) return state;

      const updatedObjectives = mission.objectives.map((obj) =>
        obj.id === objectiveId
          ? { ...obj, completed: true, current: obj.required }
          : obj
      );

      return {
        missions: {
          ...state.missions,
          [missionId]: {
            ...mission,
            objectives: updatedObjectives,
          },
        },
      };
    }),

  advancePhase: () =>
    set((state) => ({
      currentPhase: state.currentPhase + 1,
    })),

  getMissionStatus: (missionId) => {
    return get().missions[missionId]?.status;
  },
});
