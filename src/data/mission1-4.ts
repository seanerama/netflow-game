import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.4: "The Great Slowdown" - Diagnosing Collision Domain Issues

export const MISSION_1_4_BUDGET = 0; // Diagnosis only, no purchases

export const introDialogue: DialogueLine[] = [
  {
    id: 'm14-intro-1',
    speaker: 'narrator',
    text: 'Two weeks later. The office is tense. Everyone seems frustrated.',
  },
  {
    id: 'm14-intro-2',
    speaker: 'earl',
    text: 'This dad-gum internet keeps stutterin\'! I\'m trying to look at... tractor parts... and the pictures load all herky-jerky!',
  },
  {
    id: 'm14-intro-3',
    speaker: 'darlene',
    text: 'My email takes forever to send, and sometimes it just times out!',
  },
  {
    id: 'm14-intro-4',
    speaker: 'scooter',
    text: 'Yeah, and when Wayne and me are both downloading stuff, everything slows to a crawl!',
  },
  {
    id: 'm14-intro-5',
    speaker: 'bubba',
    text: 'I\'m payin\' $800 a month for this T1! Fix it!',
  },
];

export const diagnosticsIntro: DialogueLine[] = [
  {
    id: 'm14-diag-1',
    speaker: 'narrator',
    text: 'Time to figure out what\'s going on. You pull out your network diagnostics toolkit.',
  },
  {
    id: 'm14-diag-2',
    speaker: 'narrator',
    text: 'Let\'s check the traffic, collisions, and network speeds to find the problem.',
  },
];

// Diagnostics data
export interface DiagnosticTool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const diagnosticTools: DiagnosticTool[] = [
  {
    id: 'traffic',
    name: 'Traffic Monitor',
    icon: '📊',
    description: 'Real-time bandwidth usage per port',
  },
  {
    id: 'collision',
    name: 'Collision Counter',
    icon: '💥',
    description: 'Number of collisions detected',
  },
  {
    id: 'speed',
    name: 'Speed Test',
    icon: '🚀',
    description: 'Internet vs local transfer speed',
  },
  {
    id: 'map',
    name: 'Network Map',
    icon: '🗺️',
    description: 'Visual of current topology',
  },
];

export interface DiagnosticResult {
  toolId: string;
  status: 'good' | 'warning' | 'critical';
  title: string;
  value: string;
  detail: string;
  isClue: boolean;
}

export const diagnosticResults: DiagnosticResult[] = [
  {
    toolId: 'traffic',
    status: 'critical',
    title: 'Hub Traffic',
    value: '85-95 Mbps',
    detail: 'Hub is maxing out shared bandwidth. Even light browsing causes spikes.',
    isClue: true,
  },
  {
    toolId: 'collision',
    status: 'critical',
    title: 'Collisions',
    value: '847/hour',
    detail: 'EXCESSIVE collision rate! Data packets are constantly fighting each other.',
    isClue: true,
  },
  {
    toolId: 'speed',
    status: 'warning',
    title: 'Internet Speed',
    value: '1.5 Mbps',
    detail: 'T1 line is working fine - the problem is internal.',
    isClue: false,
  },
  {
    toolId: 'speed',
    status: 'critical',
    title: 'Local Transfer',
    value: '3-8 Mbps',
    detail: 'Should be ~80+ Mbps on 100Mbps network! Something is very wrong.',
    isClue: true,
  },
  {
    toolId: 'map',
    status: 'warning',
    title: 'Topology',
    value: '6 PCs on 1 Hub',
    detail: 'All devices sharing one collision domain.',
    isClue: true,
  },
];

export const collisionExplanation: DialogueLine[] = [
  {
    id: 'm14-explain-1',
    speaker: 'narrator',
    text: 'Remember when we said a hub is like a party line telephone?',
  },
  {
    id: 'm14-explain-2',
    speaker: 'narrator',
    text: 'Here\'s the problem: when two people try to talk at the same time, their voices COLLIDE and neither message gets through.',
  },
  {
    id: 'm14-explain-3',
    speaker: 'narrator',
    text: 'Both have to stop, wait a random amount of time, and try again. Maybe they collide AGAIN.',
  },
  {
    id: 'm14-explain-4',
    speaker: 'narrator',
    text: 'With 6 computers on one hub, all sharing the same "wire," collisions happen CONSTANTLY.',
  },
  {
    id: 'm14-explain-5',
    speaker: 'narrator',
    text: 'It\'s like a room where 6 people are trying to have 3 different conversations, but there\'s only one microphone everyone has to share!',
  },
];

export const collisionDomainExplanation: DialogueLine[] = [
  {
    id: 'm14-domain-1',
    speaker: 'narrator',
    text: 'A COLLISION DOMAIN is the group of devices that might interfere with each other.',
  },
  {
    id: 'm14-domain-2',
    speaker: 'narrator',
    text: 'With a hub, EVERY connected device is in the SAME collision domain.',
  },
  {
    id: 'm14-domain-3',
    speaker: 'narrator',
    text: 'It\'s like a single-lane road where everyone has to take turns.',
  },
];

export const reportToBubba: DialogueLine[] = [
  {
    id: 'm14-report-1',
    speaker: 'narrator',
    text: 'You report your findings to Bubba.',
  },
  {
    id: 'm14-report-2',
    speaker: 'narrator',
    text: '"The hub is creating a bottleneck. Everyone\'s data is fighting for the same wire, causing collisions. The more computers you add, the worse it gets."',
  },
  {
    id: 'm14-report-3',
    speaker: 'bubba',
    text: 'So what, I gotta buy one of them fancy switches after all?',
  },
  {
    id: 'm14-report-4',
    speaker: 'narrator',
    text: '"Yes. A switch creates a separate \'lane\' for each computer. No collisions, no fighting, everyone gets full speed."',
  },
  {
    id: 'm14-report-5',
    speaker: 'bubba',
    text: '*sighs* Alright, alright. But this better fix it. Here\'s $150 - get whatever you need.',
  },
];

export const successDialogue: DialogueLine[] = [
  {
    id: 'm14-success-1',
    speaker: 'narrator',
    text: 'Bubba has authorized the switch purchase. Time to upgrade the network!',
  },
];

// Educational summary for Mission 1.4
export const educationalSummary: EducationalSection[] = [
  {
    icon: '💥',
    title: 'Collisions Explained',
    content: 'When two devices on a hub transmit at the same time, their signals collide. Both transmissions fail and must be retried after a random delay.',
    details: [
      'What happens during a collision:',
      '• Data doesn\'t get through',
      '• Both devices detect the collision',
      '• Both wait a random time (backoff)',
      '• Both retry transmission',
      '• May collide again!',
      'More devices = more collisions',
    ],
  },
  {
    icon: '🚧',
    title: 'Collision Domains',
    content: 'A collision domain is the group of devices that can interfere with each other. Hubs create ONE big collision domain for all connected devices.',
    details: [
      'Hub: Single collision domain',
      '• All 6 PCs share one "wire"',
      '• Like a single-lane road',
      '• Everyone takes turns',
      'Switch: Multiple collision domains',
      '• Each port is its own domain',
      '• Like a multi-lane highway',
    ],
  },
  {
    icon: '📉',
    title: 'Performance Impact',
    content: 'As more devices are added to a hub, performance degrades exponentially due to increased collision probability.',
    details: [
      'Hub performance with 6 devices:',
      '• Expected: ~80 Mbps local transfer',
      '• Actual: 3-8 Mbps (90% loss!)',
      '• 847 collisions per hour',
      'The T1 was fine all along!',
      'The bottleneck was internal.',
    ],
  },
  {
    icon: '💡',
    title: 'The Solution',
    content: 'A switch solves the collision problem by learning which devices are on which ports and only sending traffic where it needs to go.',
    details: [
      'Why switches are better:',
      '• Dedicated bandwidth per port',
      '• No collisions between ports',
      '• Builds MAC address table',
      '• Full speed for everyone',
      'Coming next: Installing the switch!',
    ],
  },
];
