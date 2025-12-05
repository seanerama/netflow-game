import { MISSION_1_1, getNextHint as getNextHint_1_1 } from './mission1-1';
import { MISSION_1_2, getNextHint as getNextHint_1_2 } from './mission1-2';
import type { Mission, Hint } from '../../types';

// All missions indexed by ID
export const ALL_MISSIONS: Record<string, Mission> = {
  'mission-1-1': MISSION_1_1,
  'mission-1-2': MISSION_1_2,
};

// Get missions for a specific phase
export function getMissionsByPhase(phase: number): Mission[] {
  return Object.values(ALL_MISSIONS)
    .filter((m) => m.phase === phase)
    .sort((a, b) => a.order - b.order);
}

// Get next hint for a mission based on completed objectives
export function getNextHintForMission(
  missionId: string,
  completedObjectives: string[]
): Hint | null {
  switch (missionId) {
    case 'mission-1-1':
      return getNextHint_1_1(completedObjectives) ?? null;
    case 'mission-1-2':
      return getNextHint_1_2(completedObjectives) ?? null;
    default:
      return null;
  }
}

// Check if a mission's prerequisites are met
export function arePrerequisitesMet(
  missionId: string,
  completedMissions: string[]
): boolean {
  const mission = ALL_MISSIONS[missionId];
  if (!mission) return false;

  return mission.prerequisites.every((prereq) =>
    completedMissions.includes(prereq)
  );
}

// Get all available missions (not locked, prerequisites met)
export function getAvailableMissions(completedMissions: string[]): Mission[] {
  return Object.values(ALL_MISSIONS).filter(
    (mission) =>
      mission.status !== 'completed' &&
      arePrerequisitesMet(mission.id, completedMissions)
  );
}

export { MISSION_1_1, MISSION_1_2 };
