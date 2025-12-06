import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.8: "You're Hired!" - Transition to Full-Time

export const MISSION_1_8_BUDGET = 0; // No budget needed for this mission

export const introDialogue: DialogueLine[] = [
  {
    id: 'm18-intro-1',
    speaker: 'narrator',
    text: 'A few weeks have passed. Bubba called you to his office for an important meeting.',
  },
  {
    id: 'm18-intro-2',
    speaker: 'narrator',
    text: 'He\'s wearing a tie (poorly knotted) and looks unusually serious.',
  },
];

export const bubbaOfferDialogue: DialogueLine[] = [
  {
    id: 'm18-offer-1',
    speaker: 'bubba',
    text: 'Well, you done good, computer person. Real good.',
  },
  {
    id: 'm18-offer-2',
    speaker: 'bubba',
    text: 'Our internet\'s fast, it\'s secure, and even Earl can print his... tractor brochures... without hollerin\' for help.',
  },
  {
    id: 'm18-offer-3',
    speaker: 'bubba',
    text: 'I want you to stick around. Part-time contractor ain\'t cuttin\' it.',
  },
  {
    id: 'm18-offer-4',
    speaker: 'bubba',
    text: 'How about you come work for Bubba\'s full-time? We\'ll call you our "Network Administrator."',
  },
  {
    id: 'm18-offer-5',
    speaker: 'bubba',
    text: 'Whaddya say?',
  },
];

export const acceptDialogue: DialogueLine[] = [
  {
    id: 'm18-accept-1',
    speaker: 'player',
    text: 'I\'m in!',
  },
  {
    id: 'm18-accept-2',
    speaker: 'bubba',
    text: 'HOT DIGGITY DOG! That\'s what I like to hear!',
  },
  {
    id: 'm18-accept-3',
    speaker: 'bubba',
    text: 'Welcome to the team, officially! I\'ll get Mama to add you to the payroll.',
  },
  {
    id: 'm18-accept-4',
    speaker: 'darlene',
    text: 'Congratulations! I\'ll make you a name badge!',
  },
  {
    id: 'm18-accept-5',
    speaker: 'earl',
    text: 'Alright! Now I got someone to help me when the computer does that weird thing!',
  },
];

export const thinkDialogue: DialogueLine[] = [
  {
    id: 'm18-think-1',
    speaker: 'player',
    text: 'Let me think about it...',
  },
  {
    id: 'm18-think-2',
    speaker: 'bubba',
    text: 'Well, take your time. No rush.',
  },
  {
    id: 'm18-think-3',
    speaker: 'narrator',
    text: 'After some consideration, you decide this is exactly the opportunity you\'ve been looking for.',
  },
  {
    id: 'm18-think-4',
    speaker: 'player',
    text: 'You know what, Bubba? I\'m in.',
  },
  {
    id: 'm18-think-5',
    speaker: 'bubba',
    text: 'That\'s what I was hopin\' to hear! Welcome aboard!',
  },
];

export const harlanSetupDialogue: DialogueLine[] = [
  {
    id: 'm18-harlan-1',
    speaker: 'bubba',
    text: 'Now that you\'re official, we got big plans for this office.',
  },
  {
    id: 'm18-harlan-2',
    speaker: 'bubba',
    text: 'The network you built is runnin\' smooth as butter.',
  },
  {
    id: 'm18-harlan-3',
    speaker: 'bubba',
    text: 'I reckon we\'ll be needin\' your skills for a long time.',
  },
  {
    id: 'm18-harlan-4',
    speaker: 'narrator',
    text: 'You\'ve proven yourself. The future looks bright.',
  },
];

export const successDialogue: DialogueLine[] = [
  {
    id: 'm18-success-1',
    speaker: 'narrator',
    text: 'Mission 1 Complete!',
  },
  {
    id: 'm18-success-2',
    speaker: 'narrator',
    text: 'You\'ve successfully set up Bubba\'s network and earned a full-time position.',
  },
  {
    id: 'm18-success-3',
    speaker: 'narrator',
    text: 'Congratulations, Network Administrator!',
  },
];

// Network accomplishments summary
export const accomplishments = [
  {
    icon: '🌐',
    title: 'Internet Connected',
    description: 'Connected 6 employees to T1 internet via router',
  },
  {
    icon: '🔒',
    title: 'Network Secured',
    description: 'Configured firewall to block unauthorized access',
  },
  {
    icon: '👥',
    title: 'Network Expanded',
    description: 'Added 2 new employees to the growing network',
  },
  {
    icon: '⚡',
    title: 'Performance Improved',
    description: 'Replaced hub with switch to eliminate collisions',
  },
  {
    icon: '📁',
    title: 'File Sharing Enabled',
    description: 'Set up shared folders with proper permissions',
  },
  {
    icon: '🖨️',
    title: 'Network Printing',
    description: 'Installed print server for shared printing',
  },
];

// Educational summary for Mission 1.8
export const educationalSummary: EducationalSection[] = [
  {
    icon: '🎓',
    title: 'Mission 1 Complete!',
    content: 'You\'ve built a complete small office network from scratch. Let\'s recap what you learned.',
    details: [
      'Key accomplishments:',
      '• Connected office to internet via T1',
      '• Configured router with NAT',
      '• Set up firewall for security',
      '• Upgraded from hub to switch',
      '• Enabled file and print sharing',
    ],
  },
  {
    icon: '🔧',
    title: 'Technical Skills Gained',
    content: 'You now understand the fundamentals of small office networking.',
    details: [
      'Skills acquired:',
      '• IP addressing and subnetting',
      '• NAT and private vs public IPs',
      '• Firewall configuration',
      '• Hub vs Switch (collision domains)',
      '• Windows file sharing (SMB)',
      '• Network printing (port 9100)',
    ],
  },
  {
    icon: '🚀',
    title: 'Ready for More?',
    content: 'You\'ve mastered the basics of small office networking. Keep learning!',
    details: [
      'You now understand:',
      '• Network topology and design',
      '• IP addressing fundamentals',
      '• Security best practices',
      '• Performance optimization',
      '• File and print services',
      '• Troubleshooting techniques',
    ],
  },
];
