import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.3: "Growing Pains" - Second Hub and Collision Domain Introduction

export const MISSION_1_3_BUDGET = 100;

export const introDialogue: DialogueLine[] = [
  {
    id: 'm13-intro-1',
    speaker: 'narrator',
    text: 'The office is busier than usual. Two new desks have appeared, each with a fresh PC.',
  },
  {
    id: 'm13-intro-2',
    speaker: 'bubba',
    text: 'Good news and bad news.',
  },
  {
    id: 'm13-intro-3',
    speaker: 'bubba',
    text: 'Good news: Business is boomin\'! We bought out Billy Ray\'s Rental Properties, so now we got more units to manage.',
  },
  {
    id: 'm13-intro-4',
    speaker: 'bubba',
    text: 'Bad news: I hired my nephew Scooter and his friend Wayne to help out, and they need computers too.',
  },
  {
    id: 'm13-intro-5',
    speaker: 'bubba',
    text: 'Here\'s $100 - make it work.',
  },
];

export const equipmentDialogue: DialogueLine[] = [
  {
    id: 'm13-equip-1',
    speaker: 'narrator',
    text: 'You check the current hub: 8 ports total, with 5 currently in use (4 PCs + 1 router connection).',
  },
  {
    id: 'm13-equip-2',
    speaker: 'narrator',
    text: '3 ports are still available. You need to add 2 new PCs.',
  },
];

export const bubbaStipulation: DialogueLine[] = [
  {
    id: 'm13-stipulation-1',
    speaker: 'bubba',
    text: 'Now, I ain\'t made of money.',
  },
  {
    id: 'm13-stipulation-2',
    speaker: 'bubba',
    text: 'We ain\'t buyin\' no fancy new hub or switch thing. We got ports left over, right? Just plug \'em in!',
  },
];

// Equipment options for Mission 1.3
export interface EquipmentOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  canSelect: boolean;
  bubbaReaction?: DialogueLine[];
  isRecommended?: boolean;
}

export const equipmentOptions: EquipmentOption[] = [
  {
    id: 'use-existing',
    name: 'Use Existing Hub Ports',
    cost: 16, // Just 2 cables at $8 each
    description: 'The current hub has 3 free ports. Just add 2 cables for the new PCs.',
    canSelect: true,
    bubbaReaction: [
      {
        id: 'm13-existing-1',
        speaker: 'bubba',
        text: 'Now that\'s what I like to hear! Save that money for important stuff!',
      },
    ],
  },
  {
    id: 'buy-switch',
    name: '8-Port Switch (Recommended)',
    cost: 129,
    description: 'Replace the hub with a proper switch. Much better performance.',
    canSelect: false,
    isRecommended: true,
    bubbaReaction: [
      {
        id: 'm13-switch-1',
        speaker: 'bubba',
        text: 'What? The hub\'s just fine! We ain\'t spendin\' $129 on fancy equipment!',
      },
      {
        id: 'm13-switch-2',
        speaker: 'bubba',
        text: 'Unless that hub catches fire, we\'re stickin\' with what we got.',
      },
    ],
  },
  {
    id: 'buy-hub',
    name: 'Add Another 8-Port Hub',
    cost: 53, // $45 hub + 1 cable to daisy-chain
    description: 'Daisy-chain a second hub for more ports (more than needed).',
    canSelect: true,
    bubbaReaction: [
      {
        id: 'm13-hub-1',
        speaker: 'bubba',
        text: 'Well... if we gotta, I guess. But why not just use the ports we already got?',
      },
    ],
  },
];

// New PCs to configure
export const newPCs = [
  { name: 'Scooter\'s PC', ip: '192.168.1.14', owner: 'scooter' },
  { name: 'Wayne\'s PC', ip: '192.168.1.15', owner: 'wayne' },
];

// Config validation for new PCs
export const correctConfigs = {
  scooter: {
    ipAddress: '192.168.1.14',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '192.168.1.1',
  },
  wayne: {
    ipAddress: '192.168.1.15',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '192.168.1.1',
  },
};

export const configSuccessDialogue: DialogueLine[] = [
  {
    id: 'm13-config-success-1',
    speaker: 'narrator',
    text: 'Both new PCs are now connected and configured.',
  },
  {
    id: 'm13-config-success-2',
    speaker: 'scooter',
    text: 'Sweet! The internet works! Wayne, check it out!',
  },
  {
    id: 'm13-config-success-3',
    speaker: 'wayne',
    text: 'Dude, nice.',
  },
];

export const testSuccessDialogue: DialogueLine[] = [
  {
    id: 'm13-test-1',
    speaker: 'narrator',
    text: 'All 6 PCs can now access the internet. The network is operational.',
  },
  {
    id: 'm13-test-2',
    speaker: 'narrator',
    text: 'However, you notice the network activity light on the hub is blinking like crazy, even when nobody seems to be doing anything.',
  },
  {
    id: 'm13-test-3',
    speaker: 'narrator',
    text: 'You make a mental note to keep an eye on it...',
  },
];

export const foreshadowingDialogue: DialogueLine[] = [
  {
    id: 'm13-foreshadow-1',
    speaker: 'narrator',
    text: 'Everything seems to be working, but something feels off.',
  },
  {
    id: 'm13-foreshadow-2',
    speaker: 'narrator',
    text: 'The hub\'s collision light flickers occasionally. Probably nothing... right?',
  },
];

// Educational summary for Mission 1.3
export const educationalSummary: EducationalSection[] = [
  {
    icon: '🔌',
    title: 'Network Growth',
    content: 'Networks rarely stay the same size. Planning for growth is important, but sometimes budget constraints force suboptimal solutions.',
    details: [
      'Current setup:',
      '• 8-port hub with 6 devices connected',
      '• 4 original PCs + 2 new PCs + router link',
      '• 1 free port remaining',
      'The hub is getting crowded...',
    ],
  },
  {
    icon: '📡',
    title: 'Hub Basics Review',
    content: 'A hub is a simple device that broadcasts everything to everyone. All ports share the same bandwidth and "collision domain."',
    details: [
      'How a hub works:',
      '• Data comes in on one port',
      '• Hub copies it to ALL other ports',
      '• All devices receive all traffic',
      '• Only the intended recipient processes it',
      'This works fine for small networks...',
    ],
  },
  {
    icon: '💥',
    title: 'What is a Collision?',
    content: 'When two devices try to send data at the same time on a hub, their signals "collide" and both transmissions fail. Both devices must wait and retry.',
    details: [
      'Collision effects:',
      '• Data doesn\'t get through',
      '• Both devices wait random time',
      '• Both devices retry',
      '• More devices = more collisions',
      '• Performance degrades quickly!',
    ],
  },
  {
    icon: '⚠️',
    title: 'Foreshadowing',
    content: 'With 6 PCs now on one hub, collisions will become more frequent. The more devices that share a hub, the worse the performance gets.',
    details: [
      'Warning signs to watch:',
      '• Activity lights constantly blinking',
      '• Slow file transfers',
      '• Web pages loading "jerky"',
      '• Email timeouts',
      'The solution? We\'ll find out soon...',
    ],
  },
];
