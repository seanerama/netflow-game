import type { Character } from '../types';

export const characters: Record<string, Character> = {
  bubba: {
    id: 'bubba',
    name: 'Bubba',
    role: 'Owner, Bubba\'s Premium Property Management',
    portraitColor: '#8B4513', // Saddle brown
    dialogueStyle: 'rural',
  },
  earl: {
    id: 'earl',
    name: 'Earl',
    role: 'Bubba\'s Cousin / "Maintenance"',
    portraitColor: '#6B8E23', // Olive drab
    dialogueStyle: 'rural',
  },
  darlene: {
    id: 'darlene',
    name: 'Darlene',
    role: 'Receptionist',
    portraitColor: '#DA70D6', // Orchid
    dialogueStyle: 'rural',
  },
  accountant: {
    id: 'accountant',
    name: 'Bubba\'s Mama',
    role: 'Accountant (works from the back room)',
    portraitColor: '#B0C4DE', // Light steel blue
    dialogueStyle: 'rural',
  },
  scooter: {
    id: 'scooter',
    name: 'Scooter',
    role: 'Bubba\'s Nephew',
    portraitColor: '#FF6347', // Tomato
    dialogueStyle: 'rural',
  },
  wayne: {
    id: 'wayne',
    name: 'Wayne',
    role: 'Scooter\'s Friend',
    portraitColor: '#4682B4', // Steel blue
    dialogueStyle: 'rural',
  },
  narrator: {
    id: 'narrator',
    name: '',
    role: 'Narrator',
    portraitColor: 'transparent',
    dialogueStyle: 'professional',
  },
  player: {
    id: 'player',
    name: 'You',
    role: 'Network Administrator',
    portraitColor: '#4169E1', // Royal blue
    dialogueStyle: 'professional',
  },
  system: {
    id: 'system',
    name: 'System',
    role: 'Game System',
    portraitColor: '#5DADE2',
    dialogueStyle: 'tech-savvy',
  },
};

export function getCharacter(id: string): Character {
  return characters[id] || characters.narrator;
}

export function getInitial(name: string): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}
