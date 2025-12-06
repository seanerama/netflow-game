import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.2: "Lock the Door" - Basic Firewall Configuration

export const MISSION_1_2_BUDGET = 50; // Bonus from Mission 1.1

export const introDialogue: DialogueLine[] = [
  {
    id: 'm12-intro-1',
    speaker: 'narrator',
    text: 'You arrive at Bubba\'s office. Darlene rushes over before you can even set down your coffee.',
  },
  {
    id: 'm12-intro-2',
    speaker: 'darlene',
    text: 'Oh thank goodness you\'re here!',
  },
  {
    id: 'm12-intro-3',
    speaker: 'darlene',
    text: 'My sister Lurleen said her computer got them "worms" from the internet and now it sends emails to everyone in her address book about discount pharmaceuticals!',
  },
  {
    id: 'm12-intro-4',
    speaker: 'darlene',
    text: 'Bubba\'s worried the same thing\'ll happen to us. Can you put some kinda lock on our internet door?',
  },
  {
    id: 'm12-intro-5',
    speaker: 'bubba',
    text: 'Yeah, I don\'t need Earl accidentally downloadin\' no viruses while he\'s... researching tractors. Or whatever he does.',
  },
  {
    id: 'm12-intro-6',
    speaker: 'narrator',
    text: 'Earl looks up briefly from his computer, then quickly minimizes something on his screen.',
  },
];

export const threatExplanation: DialogueLine[] = [
  {
    id: 'm12-threat-1',
    speaker: 'narrator',
    text: 'Right now, your network is like a house with no locks.',
  },
  {
    id: 'm12-threat-2',
    speaker: 'narrator',
    text: 'Anyone on the internet can theoretically knock on any "door" (port) of your public IP address.',
  },
  {
    id: 'm12-threat-3',
    speaker: 'narrator',
    text: 'Most of the time nothing bad happens, but there are automated programs constantly scanning the internet looking for open doors to sneak through.',
  },
  {
    id: 'm12-threat-4',
    speaker: 'narrator',
    text: 'The T1 connection means you\'re "always on" - unlike dial-up where you\'re only connected when you\'re using it.',
  },
  {
    id: 'm12-threat-5',
    speaker: 'narrator',
    text: 'It\'s like leaving your front door wide open 24/7 vs only opening it when you expect a visitor.',
  },
];

export const configIntroDialogue: DialogueLine[] = [
  {
    id: 'm12-config-1',
    speaker: 'narrator',
    text: 'You open the router\'s admin panel and navigate to the Firewall section.',
  },
  {
    id: 'm12-config-2',
    speaker: 'narrator',
    text: 'Time to set up some basic security rules.',
  },
];

// Firewall rule options
export interface FirewallRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical?: boolean; // If true, wrong choice causes major issues
}

export const defaultFirewallRules: FirewallRule[] = [
  {
    id: 'block-inbound',
    name: 'Block All Inbound',
    description: 'Blocks all unsolicited incoming connections',
    enabled: false,
    critical: true,
  },
  {
    id: 'allow-established',
    name: 'Allow Established Connections',
    description: 'Lets responses to YOUR requests come back',
    enabled: false,
    critical: true,
  },
  {
    id: 'block-icmp',
    name: 'Block ICMP (Ping)',
    description: 'Makes your IP invisible to basic scans',
    enabled: false,
  },
];

export const correctFirewallConfig = {
  'block-inbound': true,
  'allow-established': true,
  'block-icmp': true, // Optional but recommended
};

// Error messages for wrong configurations
export const firewallErrors = {
  noInboundNoEstablished: {
    title: 'No Internet Connection!',
    explanation: 'You locked the door AND blocked the mail slot! When you visit a website, you send a request OUT, but the response needs to come back IN.',
    detail: '"Allow Established" lets responses to your requests come through while still blocking strangers from initiating contact.',
    visual: 'blocked',
  },
  allOff: {
    title: 'Wide Open!',
    explanation: 'You\'re basically inviting trouble. Security 101: Block everything by default, then only allow what you specifically need.',
    detail: 'Bubba gets a popup about the "ILOVEYOU virus"',
    visual: 'virus',
  },
  partialProtection: {
    title: 'Partial Protection',
    explanation: 'Good effort, but you\'re playing whack-a-mole.',
    detail: 'It\'s easier to block EVERYTHING and allow exceptions than to try to block every bad thing individually.',
    visual: 'warning',
  },
};

// Port scan visualization data
export const commonPorts = [
  { port: 21, name: 'FTP', danger: 'medium' },
  { port: 22, name: 'SSH', danger: 'low' },
  { port: 23, name: 'Telnet', danger: 'high' },
  { port: 25, name: 'SMTP', danger: 'medium' },
  { port: 80, name: 'HTTP', danger: 'low' },
  { port: 110, name: 'POP3', danger: 'medium' },
  { port: 135, name: 'RPC', danger: 'high' },
  { port: 139, name: 'NetBIOS', danger: 'high' },
  { port: 443, name: 'HTTPS', danger: 'low' },
  { port: 445, name: 'SMB', danger: 'high' },
  { port: 3389, name: 'RDP', danger: 'high' },
];

// Success dialogue after correct configuration
export const successDialogue: DialogueLine[] = [
  {
    id: 'm12-success-1',
    speaker: 'narrator',
    text: 'The firewall is now configured. External port scans will see the network as unresponsive.',
  },
  {
    id: 'm12-success-2',
    speaker: 'darlene',
    text: 'So we\'re safe now?',
  },
];

// Choice after Darlene's question
export const safetyChoices = {
  question: 'How do you respond to Darlene?',
  options: [
    {
      id: 'completely-safe',
      text: '"Completely safe!"',
      correct: false,
      response: [
        {
          id: 'm12-wrong-1',
          speaker: 'narrator',
          text: 'Darlene immediately clicks a "YOU WON A FREE CRUISE" email attachment.',
        },
        {
          id: 'm12-wrong-2',
          speaker: 'narrator',
          text: 'A lesson in social engineering and human factors...',
        },
        {
          id: 'm12-wrong-3',
          speaker: 'darlene',
          text: 'Huh, the computer\'s acting funny now. It says I need to call this number to remove a virus?',
        },
      ],
    },
    {
      id: 'safer-not-invincible',
      text: '"Safer, but not invincible. Don\'t click weird email attachments."',
      correct: true,
      response: [
        {
          id: 'm12-right-1',
          speaker: 'darlene',
          text: 'Like that email I got about winning a cruise?',
        },
        {
          id: 'm12-right-2',
          speaker: 'narrator',
          text: 'You nod sagely. A firewall blocks network attacks, but can\'t stop someone from inviting trouble in themselves.',
        },
        {
          id: 'm12-right-3',
          speaker: 'bubba',
          text: 'Hear that, Earl? No clickin\' on nothin\' suspicious!',
        },
        {
          id: 'm12-right-4',
          speaker: 'narrator',
          text: 'Earl nods, clearly not paying attention.',
        },
      ],
    },
  ],
};

// Educational summary for Mission 1.2
export const educationalSummary: EducationalSection[] = [
  {
    icon: '📡',
    title: 'TCP/IP - The Delivery Protocol',
    content: 'TCP (Transmission Control Protocol) is like certified mail - it confirms delivery and requests missing pieces to be resent. Reliable but slower. UDP is like postcards - just sends and hopes it arrives. Faster but less reliable.',
    details: [
      'TCP: Used for web browsing, email, file transfers',
      '• Guarantees delivery and order',
      '• Retransmits lost packets',
      'UDP: Used for streaming, gaming, DNS',
      '• No delivery confirmation',
      '• Lower latency',
    ],
  },
  {
    icon: '🚪',
    title: 'Ports - Doors to Services',
    content: 'Every network service uses a "port" - a numbered door. Think of your IP address as a building, and ports as different offices inside.',
    details: [
      'Common Ports:',
      '• Port 80: HTTP (websites)',
      '• Port 443: HTTPS (secure websites)',
      '• Port 25: SMTP (sending email)',
      '• Port 21: FTP (file transfer)',
      '• Port 23: Telnet (remote access - DANGER!)',
      '• Port 3389: Remote Desktop (DANGER if exposed!)',
    ],
  },
  {
    icon: '🧱',
    title: 'Firewalls - The Bouncer',
    content: 'A firewall is like a bouncer at a club. It checks ID (source/destination address), checks invitation (is this a response to something we requested?), and blocks uninvited guests.',
    details: [
      'Firewall Rules:',
      '• Block inbound: Stop unsolicited connections',
      '• Allow established: Let responses through',
      '• The order of rules matters!',
      'Remember: A firewall blocks network attacks,',
      'but can\'t stop users from clicking bad links!',
    ],
  },
  {
    icon: '🔐',
    title: 'Defense in Depth',
    content: 'Security is like layers of an onion. A firewall is just one layer. You also need: user education, software updates, antivirus, backups, and common sense.',
    details: [
      'Layers of Security:',
      '• Network: Firewalls, NAT',
      '• Host: Antivirus, Updates',
      '• User: Training, Awareness',
      '• Physical: Locked doors, Secure equipment',
      'No single layer is enough!',
    ],
  },
];
