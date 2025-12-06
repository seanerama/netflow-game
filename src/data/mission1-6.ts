import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.6: "Sharing is Caring" - File Server Setup

export const MISSION_1_6_BUDGET = 0; // No equipment needed, just configuration

export const introDialogue: DialogueLine[] = [
  {
    id: 'm16-intro-1',
    speaker: 'narrator',
    text: 'A week after the switch upgrade. The network is running smoothly.',
  },
  {
    id: 'm16-intro-2',
    speaker: 'bubba',
    text: 'Alright, I got another project for ya. See, we got all these property documents - leases, contracts, maintenance records...',
  },
  {
    id: 'm16-intro-3',
    speaker: 'bubba',
    text: 'Right now everybody\'s got their own copies on their own computers. Half the time someone\'s workin\' off an old version!',
  },
  {
    id: 'm16-intro-4',
    speaker: 'darlene',
    text: 'Last week I sent out the wrong lease agreement because Earl had the updated version but I didn\'t!',
  },
  {
    id: 'm16-intro-5',
    speaker: 'bubba',
    text: 'I want ONE place where we keep all the files. Everybody can see \'em, but only certain folks can change \'em. Can you do that?',
  },
];

export const fileShareIntro: DialogueLine[] = [
  {
    id: 'm16-share-1',
    speaker: 'narrator',
    text: 'Time to set up file sharing on Bubba\'s PC. He\'s got the most storage space.',
  },
  {
    id: 'm16-share-2',
    speaker: 'narrator',
    text: 'You\'ll need to create shared folders and set the right permissions.',
  },
];

// Share configuration options
export interface ShareOption {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
}

export const shareOptions: ShareOption[] = [
  {
    id: 'properties',
    name: 'Properties',
    path: 'C:\\Properties',
    icon: '🏠',
    description: 'Property listings and details',
  },
  {
    id: 'contracts',
    name: 'Contracts',
    path: 'C:\\Contracts',
    icon: '📄',
    description: 'Lease agreements and legal docs',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    path: 'C:\\Maintenance',
    icon: '🔧',
    description: 'Work orders and repair records',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    path: 'C:\\Accounting',
    icon: '💰',
    description: 'Financial records (Mama only!)',
  },
];

export type PermissionLevel = 'none' | 'read' | 'full';

export interface SharePermission {
  shareId: string;
  userId: string;
  level: PermissionLevel;
}

export interface UserInfo {
  id: string;
  name: string;
  role: string;
  icon: string;
}

export const users: UserInfo[] = [
  { id: 'bubba', name: 'Bubba', role: 'Owner', icon: 'B' },
  { id: 'earl', name: 'Earl', role: 'Agent', icon: 'E' },
  { id: 'darlene', name: 'Darlene', role: 'Reception', icon: 'D' },
  { id: 'mama', name: 'Mama', role: 'Accountant', icon: 'M' },
  { id: 'scooter', name: 'Scooter', role: 'Agent', icon: 'S' },
  { id: 'wayne', name: 'Wayne', role: 'Agent', icon: 'W' },
];

// Correct permissions for validation
export const correctPermissions: SharePermission[] = [
  // Properties - everyone can read, Bubba/Earl/Agents can write
  { shareId: 'properties', userId: 'bubba', level: 'full' },
  { shareId: 'properties', userId: 'earl', level: 'full' },
  { shareId: 'properties', userId: 'darlene', level: 'read' },
  { shareId: 'properties', userId: 'mama', level: 'read' },
  { shareId: 'properties', userId: 'scooter', level: 'full' },
  { shareId: 'properties', userId: 'wayne', level: 'full' },

  // Contracts - Bubba full, Darlene read (sends them out), others read
  { shareId: 'contracts', userId: 'bubba', level: 'full' },
  { shareId: 'contracts', userId: 'earl', level: 'read' },
  { shareId: 'contracts', userId: 'darlene', level: 'read' },
  { shareId: 'contracts', userId: 'mama', level: 'read' },
  { shareId: 'contracts', userId: 'scooter', level: 'read' },
  { shareId: 'contracts', userId: 'wayne', level: 'read' },

  // Maintenance - Agents and Bubba can write, others read
  { shareId: 'maintenance', userId: 'bubba', level: 'full' },
  { shareId: 'maintenance', userId: 'earl', level: 'full' },
  { shareId: 'maintenance', userId: 'darlene', level: 'read' },
  { shareId: 'maintenance', userId: 'mama', level: 'read' },
  { shareId: 'maintenance', userId: 'scooter', level: 'full' },
  { shareId: 'maintenance', userId: 'wayne', level: 'full' },

  // Accounting - ONLY Mama and Bubba!
  { shareId: 'accounting', userId: 'bubba', level: 'full' },
  { shareId: 'accounting', userId: 'earl', level: 'none' },
  { shareId: 'accounting', userId: 'darlene', level: 'none' },
  { shareId: 'accounting', userId: 'mama', level: 'full' },
  { shareId: 'accounting', userId: 'scooter', level: 'none' },
  { shareId: 'accounting', userId: 'wayne', level: 'none' },
];

export const wrongPermissionWarnings: Record<string, string> = {
  'accounting-earl': 'Earl doesn\'t need to see the books. That\'s how rumors start.',
  'accounting-darlene': 'Darlene doesn\'t need access to financials for her job.',
  'accounting-scooter': 'Scooter definitely doesn\'t need to see how much money Bubba makes!',
  'accounting-wayne': 'Wayne shouldn\'t have access to financial records.',
  'contracts-full': 'Be careful who can MODIFY contracts. That\'s legally sensitive!',
  'properties-none': 'Agents need to at least READ property information to do their jobs.',
};

export const badChoiceDialogue: DialogueLine[] = [
  {
    id: 'm16-bad-1',
    speaker: 'narrator',
    text: 'Hmm, those permissions might cause problems. Think about who really NEEDS access to each folder.',
  },
];

export const everyoneFullAccessDialogue: DialogueLine[] = [
  {
    id: 'm16-everyone-1',
    speaker: 'narrator',
    text: 'WHOA! Giving everyone full access to everything is a recipe for disaster!',
  },
  {
    id: 'm16-everyone-2',
    speaker: 'narrator',
    text: 'What if someone accidentally deletes the contracts folder? Or Scooter sees Bubba\'s salary?',
  },
  {
    id: 'm16-everyone-3',
    speaker: 'narrator',
    text: 'The principle of "least privilege" means only giving people the access they NEED.',
  },
];

export const shareCDriveDialogue: DialogueLine[] = [
  {
    id: 'm16-cdrive-1',
    speaker: 'narrator',
    text: 'STOP! Sharing the entire C: drive is EXTREMELY dangerous!',
  },
  {
    id: 'm16-cdrive-2',
    speaker: 'narrator',
    text: 'Anyone on the network could access Windows system files, personal documents, EVERYTHING.',
  },
  {
    id: 'm16-cdrive-3',
    speaker: 'narrator',
    text: 'Always share specific folders, never the whole drive.',
  },
];

export const testShareDialogue: DialogueLine[] = [
  {
    id: 'm16-test-1',
    speaker: 'narrator',
    text: 'Shares are configured! Let\'s test from each PC to make sure everyone can access what they need.',
  },
];

export const testSuccessDialogue: DialogueLine[] = [
  {
    id: 'm16-success-1',
    speaker: 'darlene',
    text: 'I can see the Properties and Contracts folders! And they show up as \\\\BUBBA-PC\\Properties',
  },
  {
    id: 'm16-success-2',
    speaker: 'earl',
    text: 'Hot dang! I can update the maintenance logs without havin\' to yell across the room!',
  },
  {
    id: 'm16-success-3',
    speaker: 'bubba',
    text: 'And Mama can do her bookkeepin\' without nobody peekin\' at the numbers. Perfect!',
  },
];

export const smbExplanation: DialogueLine[] = [
  {
    id: 'm16-smb-1',
    speaker: 'narrator',
    text: 'You just set up Windows File Sharing, which uses a protocol called SMB.',
  },
  {
    id: 'm16-smb-2',
    speaker: 'narrator',
    text: 'SMB stands for Server Message Block. It\'s how Windows computers share files over a network.',
  },
  {
    id: 'm16-smb-3',
    speaker: 'narrator',
    text: 'When Darlene types \\\\BUBBA-PC\\Properties, her computer uses SMB to connect to Bubba\'s PC and access that shared folder.',
  },
  {
    id: 'm16-smb-4',
    speaker: 'narrator',
    text: 'The permissions you set control what each person can do - read files, modify them, or nothing at all.',
  },
];

export const successDialogue: DialogueLine[] = [
  {
    id: 'm16-final-1',
    speaker: 'narrator',
    text: 'File sharing is set up! Now everyone works from the same documents.',
  },
];

// Educational summary for Mission 1.6
export const educationalSummary: EducationalSection[] = [
  {
    icon: '📁',
    title: 'Network File Sharing',
    content: 'File sharing lets multiple computers access the same files over a network. This ensures everyone works from the same version of documents.',
    details: [
      'Benefits of centralized files:',
      '• Single source of truth',
      '• No version conflicts',
      '• Easier backups',
      '• Controlled access',
      'Access via UNC path:',
      '• \\\\COMPUTERNAME\\ShareName',
      '• Example: \\\\BUBBA-PC\\Properties',
    ],
  },
  {
    icon: '🔐',
    title: 'Share Permissions',
    content: 'Permissions control who can access shared folders and what they can do. The principle of least privilege means only giving people the access they need.',
    details: [
      'Permission levels:',
      '• Full Control: Read, write, delete, change permissions',
      '• Change/Modify: Read and write files',
      '• Read: View files only, no changes',
      '• None: No access at all',
      'Best practices:',
      '• Start with minimum access',
      '• Grant more only if needed',
      '• Sensitive data = restricted access',
    ],
  },
  {
    icon: '📡',
    title: 'SMB Protocol',
    content: 'SMB (Server Message Block) is the protocol Windows uses for file sharing. It runs on ports 139 and 445.',
    details: [
      'How SMB works:',
      '1. Client requests connection to share',
      '2. Server checks permissions',
      '3. If allowed, file access granted',
      '4. Changes sync to server',
      'SMB versions (2001 era):',
      '• SMB1: Original, works everywhere',
      '• SMB2: Faster (came later)',
      'Note: SMB1 has security issues!',
    ],
  },
  {
    icon: '⚠️',
    title: 'Security Considerations',
    content: 'File shares can be a security risk if not configured properly. Never share more than necessary.',
    details: [
      'DON\'T do these:',
      '• Share entire C: drive',
      '• Give Everyone full access',
      '• Share Windows folder',
      '• Use blank passwords',
      'DO these instead:',
      '• Share specific folders only',
      '• Use least privilege',
      '• Require passwords',
      '• Audit who has access',
    ],
  },
];
