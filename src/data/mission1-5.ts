import type { DialogueLine, EducationalSection, StoreItem } from '../types';

// Mission 1.5: "Switching Things Up" - Upgrading from Hub to Switch

export const MISSION_1_5_BUDGET = 150;

export const introDialogue: DialogueLine[] = [
  {
    id: 'm15-intro-1',
    speaker: 'narrator',
    text: 'Armed with Bubba\'s approval and $150, it\'s time to upgrade the network.',
  },
  {
    id: 'm15-intro-2',
    speaker: 'bubba',
    text: 'Alright, go get that fancy switch thing. Just make sure it fixes this slowdown or I\'m gonna be madder than a wet hen.',
  },
  {
    id: 'm15-intro-3',
    speaker: 'narrator',
    text: 'Time to head back to Hank\'s Hardware & Electronics.',
  },
];

export const storeIntroDialogue: DialogueLine[] = [
  {
    id: 'm15-store-1',
    speaker: 'narrator',
    text: 'Hank\'s Hardware & Electronics. The familiar smell of new electronics fills the air.',
  },
  {
    id: 'm15-store-2',
    speaker: 'narrator',
    text: 'You need a switch to replace that collision-causing hub. Choose wisely.',
  },
];

// Store items for Mission 1.5
export const switchStoreItems: StoreItem[] = [
  {
    id: 'switch-3com-8',
    name: '3Com OfficeConnect 8-Port Switch',
    price: 129,
    description: 'Premium 8-port 10/100 switch with full MAC learning',
    icon: '8P',
    category: 'network',
    required: false,
    hint: 'Unlike a hub, a switch learns which devices are on which ports and only sends traffic where it needs to go. No more collisions!',
  },
  {
    id: 'switch-netgear-8',
    name: 'NetGear FS108 8-Port Switch',
    price: 119,
    description: 'Reliable 8-port 10/100 switch for small offices',
    icon: '8P',
    category: 'network',
    required: false,
    hint: 'A solid budget choice. Same switching technology, slightly lower price.',
  },
  {
    id: 'switch-dlink-8',
    name: 'D-Link DSS-8+ 8-Port Switch',
    price: 99,
    description: 'Basic 8-port 10/100 switch',
    icon: '8P',
    category: 'network',
    required: false,
    hint: 'Gets the job done at the lowest price. All switches eliminate collisions.',
  },
  {
    id: 'hub-netgear-8',
    name: 'NetGear DS108 8-Port Hub',
    price: 45,
    description: '10/100 hub, 8 ports',
    icon: 'HUB',
    category: 'network',
    required: false,
    hint: 'Wait, didn\'t we just learn that hubs cause collisions? This won\'t fix the problem!',
  },
  {
    id: 'cat5-25',
    name: 'Cat5 Cable (25ft)',
    price: 8,
    description: 'Standard network cable',
    icon: '~',
    category: 'cables',
    required: false,
    hint: 'Good for short runs. You might want a couple extra.',
  },
];

export const wrongPurchaseDialogue: DialogueLine[] = [
  {
    id: 'm15-wrong-1',
    speaker: 'narrator',
    text: 'Hmm, that\'s a hub - the same technology causing all the collisions! You need a SWITCH to fix the problem.',
  },
];

export const correctPurchaseDialogue: DialogueLine[] = [
  {
    id: 'm15-correct-1',
    speaker: 'narrator',
    text: 'Perfect choice! This switch will eliminate those collision problems.',
  },
  {
    id: 'm15-correct-2',
    speaker: 'narrator',
    text: 'Time to head back to the office and swap out that problematic hub.',
  },
];

export const installIntroDialogue: DialogueLine[] = [
  {
    id: 'm15-install-1',
    speaker: 'narrator',
    text: 'Back at Bubba\'s office. Time to replace the hub with the new switch.',
  },
  {
    id: 'm15-install-2',
    speaker: 'narrator',
    text: 'The swap is straightforward - same cables, same ports, but completely different technology inside.',
  },
];

export const swapCompleteDialogue: DialogueLine[] = [
  {
    id: 'm15-swap-1',
    speaker: 'narrator',
    text: 'The switch is installed. All the cables are connected to the same ports as before.',
  },
  {
    id: 'm15-swap-2',
    speaker: 'narrator',
    text: 'But watch what happens now when you monitor the network traffic...',
  },
];

export const resultsDialogue: DialogueLine[] = [
  {
    id: 'm15-results-1',
    speaker: 'narrator',
    text: 'The collision counter shows... ZERO! The switch has eliminated all the collisions.',
  },
  {
    id: 'm15-results-2',
    speaker: 'narrator',
    text: 'PC-to-PC transfers now run at full speed - over 90 Mbps instead of 3-8 Mbps!',
  },
  {
    id: 'm15-results-3',
    speaker: 'earl',
    text: 'Hot dang! Them tractor pictures load instant-like now!',
  },
  {
    id: 'm15-results-4',
    speaker: 'scooter',
    text: 'Wayne and me can both download at the same time and it doesn\'t even slow down!',
  },
  {
    id: 'm15-results-5',
    speaker: 'darlene',
    text: 'My emails send in a flash! This is amazing!',
  },
];

export const bubbaSatisfiedDialogue: DialogueLine[] = [
  {
    id: 'm15-bubba-1',
    speaker: 'bubba',
    text: 'Well I\'ll be! Should\'a listened to you earlier about that switch thing.',
  },
  {
    id: 'm15-bubba-2',
    speaker: 'bubba',
    text: 'Guess sometimes you gotta spend money to stop losin\' money on wasted time.',
  },
  {
    id: 'm15-bubba-3',
    speaker: 'narrator',
    text: 'Bubba seems pleased. The network is running smoothly for the first time since Scooter and Wayne joined.',
  },
];

export const macLearningExplanation: DialogueLine[] = [
  {
    id: 'm15-mac-1',
    speaker: 'narrator',
    text: 'Here\'s the magic of a switch: it LEARNS which device is connected to which port.',
  },
  {
    id: 'm15-mac-2',
    speaker: 'narrator',
    text: 'Every network card has a unique MAC address - like a serial number burned into the hardware.',
  },
  {
    id: 'm15-mac-3',
    speaker: 'narrator',
    text: 'When a device sends data, the switch notes its MAC address and which port it came from.',
  },
  {
    id: 'm15-mac-4',
    speaker: 'narrator',
    text: 'Next time data comes in for that MAC address, the switch sends it directly to the right port - no broadcasting needed!',
  },
];

export const successDialogue: DialogueLine[] = [
  {
    id: 'm15-success-1',
    speaker: 'narrator',
    text: 'Mission complete! The network is now running at full speed with no collisions.',
  },
];

// Educational summary for Mission 1.5
export const educationalSummary: EducationalSection[] = [
  {
    icon: '🔀',
    title: 'Hub vs Switch',
    content: 'A hub broadcasts all traffic to all ports, causing collisions. A switch sends traffic only to the destination port, eliminating collisions.',
    details: [
      'Hub behavior:',
      '• Sends to ALL ports (broadcast)',
      '• Single collision domain',
      '• Shared bandwidth',
      '• $30-50 (2001 prices)',
      'Switch behavior:',
      '• Sends to destination port only',
      '• Each port is separate domain',
      '• Dedicated bandwidth per port',
      '• $100-150 (worth every penny!)',
    ],
  },
  {
    icon: '🧠',
    title: 'How Switches Learn',
    content: 'Switches build a MAC address table by observing traffic. They learn which device is on which port and use this to route traffic efficiently.',
    details: [
      'Learning process:',
      '1. Device A sends packet from Port 1',
      '2. Switch records: "A\'s MAC is on Port 1"',
      '3. First packet to unknown = broadcast',
      '4. Device B responds from Port 3',
      '5. Switch records: "B\'s MAC is on Port 3"',
      '6. Future A→B goes directly 1→3',
    ],
  },
  {
    icon: '🔗',
    title: 'MAC Addresses',
    content: 'Every network card has a unique MAC (Media Access Control) address burned into the hardware. Unlike IP addresses which can change, MAC addresses are permanent.',
    details: [
      'MAC address format:',
      '• 6 pairs of hex digits',
      '• Example: 00:1A:2B:3C:4D:5E',
      '• First 3 pairs = manufacturer',
      '• Last 3 pairs = unique ID',
      'Used by switches for:',
      '• Learning device locations',
      '• Forwarding decisions',
    ],
  },
  {
    icon: '📈',
    title: 'Performance Improvement',
    content: 'Replacing the hub with a switch dramatically improved network performance by eliminating collisions and providing dedicated bandwidth.',
    details: [
      'Before (Hub):',
      '• PC-to-PC: 3-8 Mbps',
      '• 847 collisions/hour',
      '• Shared 100 Mbps',
      'After (Switch):',
      '• PC-to-PC: 90+ Mbps',
      '• 0 collisions',
      '• Full 100 Mbps per port',
      'That\'s a 10x improvement!',
    ],
  },
];
