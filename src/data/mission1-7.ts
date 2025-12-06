import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.7: "Print Money" - Network Printer Setup

export const MISSION_1_7_BUDGET = 150; // Budget for printer equipment

export const introDialogue: DialogueLine[] = [
  {
    id: 'm17-intro-1',
    speaker: 'narrator',
    text: 'A few days after setting up file sharing. Everyone is loving the shared documents.',
  },
  {
    id: 'm17-intro-2',
    speaker: 'darlene',
    text: 'Hey computer person! We got a problem. Bubba bought this fancy new laser printer for invoices...',
  },
  {
    id: 'm17-intro-3',
    speaker: 'darlene',
    text: 'But right now it\'s hooked up to his computer, and every time I need to print I gotta save my file, walk over, and ask him to print it!',
  },
  {
    id: 'm17-intro-4',
    speaker: 'bubba',
    text: 'It\'s drivin\' me crazy! Every five minutes Darlene\'s asking me to print somethin\'. Can\'t you make it so everyone can print to it?',
  },
  {
    id: 'm17-intro-5',
    speaker: 'narrator',
    text: 'Bubba\'s HP LaserJet 4100 is currently connected directly to his PC via parallel port.',
  },
  {
    id: 'm17-intro-6',
    speaker: 'bubba',
    text: 'Here\'s $150. Get whatever gizmos you need to make this printer work for everybody.',
  },
];

export const printerStoreIntro: DialogueLine[] = [
  {
    id: 'm17-store-1',
    speaker: 'narrator',
    text: 'Time to visit Hank\'s Hardware for some printer networking equipment.',
  },
  {
    id: 'm17-store-2',
    speaker: 'narrator',
    text: 'You need something that will let every PC on the network print to the LaserJet.',
  },
];

// Store items for printer setup
export interface PrinterStoreItem {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  hint: string;
  isCorrect: boolean;
  isRedHerring?: boolean;
  redHerringMessage?: string;
}

export const printerStoreItems: PrinterStoreItem[] = [
  {
    id: 'print-server',
    name: 'HP JetDirect 170X',
    price: 129,
    description: 'External print server - connects printer to network',
    icon: '🖨️',
    hint: 'Plugs into the printer\'s parallel port and connects to your network switch via Ethernet.',
    isCorrect: true,
  },
  {
    id: 'parallel-cable',
    name: 'Parallel Printer Cable (10ft)',
    price: 12,
    description: 'DB25 to Centronics cable for connecting printer to PC',
    icon: '🔌',
    hint: 'Standard cable for connecting a printer directly to one computer.',
    isCorrect: false,
    isRedHerring: true,
    redHerringMessage: 'This only lets ONE computer connect to the printer. You\'d need to run cables to every PC, and they can\'t all use it at once!',
  },
  {
    id: 'usb-hub',
    name: 'USB Hub (4-port)',
    price: 25,
    description: 'Connect multiple USB devices',
    icon: '🔗',
    hint: 'Expands USB ports on a single computer.',
    isCorrect: false,
    isRedHerring: true,
    redHerringMessage: 'This printer uses a parallel port, not USB. And even with USB, a hub doesn\'t share printers across the network.',
  },
  {
    id: 'cat5-cable',
    name: 'Cat5 Cable (25ft)',
    price: 8,
    description: 'Network cable for connecting to switch',
    icon: '📶',
    hint: 'You\'ll need this to connect the print server to your network.',
    isCorrect: true,
  },
  {
    id: 'extra-printer',
    name: 'HP LaserJet 4050',
    price: 450,
    description: 'Another laser printer',
    icon: '🖨️',
    hint: 'A whole new printer... but you already have a perfectly good one!',
    isCorrect: false,
    isRedHerring: true,
    redHerringMessage: 'Bubba already has a great printer! You just need to share it, not buy another one.',
  },
];

export const printServerExplanation: DialogueLine[] = [
  {
    id: 'm17-explain-1',
    speaker: 'narrator',
    text: 'A print server is a device that connects a printer to your network.',
  },
  {
    id: 'm17-explain-2',
    speaker: 'narrator',
    text: 'Instead of the printer being attached to one PC, it becomes a network device that ANY PC can access.',
  },
  {
    id: 'm17-explain-3',
    speaker: 'narrator',
    text: 'The print server has its own IP address, just like a computer. PCs send print jobs to that IP address.',
  },
];

// Printer configuration interface
export interface PrinterConfig {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  printerName: string;
  port: number;
}

export const correctPrinterConfig: PrinterConfig = {
  ipAddress: '192.168.1.20',
  subnetMask: '255.255.255.0',
  gateway: '192.168.1.1',
  printerName: 'Office LaserJet',
  port: 9100,
};

export const configIntroDialogue: DialogueLine[] = [
  {
    id: 'm17-config-1',
    speaker: 'narrator',
    text: 'Now you need to configure the print server. It needs an IP address on your network.',
  },
  {
    id: 'm17-config-2',
    speaker: 'narrator',
    text: 'Use an IP that won\'t conflict with your PCs (192.168.1.10-15 are taken).',
  },
];

export const wrongConfigMessages: Record<string, string> = {
  'duplicate-ip': 'That IP address is already in use! Pick an unused one like 192.168.1.20.',
  'wrong-subnet': 'That\'s not on the same network as your PCs. Use 192.168.1.x to stay in the same subnet.',
  'wrong-mask': 'The subnet mask should match your other devices: 255.255.255.0',
  'wrong-gateway': 'The gateway should be your router: 192.168.1.1',
  'wrong-port': 'Port 9100 is the standard for raw TCP/IP printing. Most print servers use this.',
};

export const installDialogue: DialogueLine[] = [
  {
    id: 'm17-install-1',
    speaker: 'narrator',
    text: 'Time to physically connect the print server.',
  },
  {
    id: 'm17-install-2',
    speaker: 'narrator',
    text: 'First, disconnect the printer from Bubba\'s PC. Then connect the print server.',
  },
];

export const setupPCDialogue: DialogueLine[] = [
  {
    id: 'm17-setup-1',
    speaker: 'narrator',
    text: 'Now you need to add the network printer to each PC.',
  },
  {
    id: 'm17-setup-2',
    speaker: 'narrator',
    text: 'On each computer, you\'ll add a TCP/IP printer pointing to 192.168.1.20 on port 9100.',
  },
];

export const wrongSetupMessages: Record<string, string> = {
  'local-install': 'Installing the printer as a "local printer" won\'t work - it\'s on the network now, not connected directly!',
  'wrong-ip': 'That\'s not the print server\'s IP address. It should be 192.168.1.20.',
  'no-driver': 'You need to install the HP LaserJet 4100 driver so the computer knows how to talk to the printer.',
};

export const testDialogue: DialogueLine[] = [
  {
    id: 'm17-test-1',
    speaker: 'narrator',
    text: 'Let\'s test the printer from each workstation.',
  },
];

export const testSuccessDialogue: DialogueLine[] = [
  {
    id: 'm17-success-1',
    speaker: 'darlene',
    text: 'Oh my stars! I just hit Print and it came out over there! I didn\'t have to walk anywhere!',
  },
  {
    id: 'm17-success-2',
    speaker: 'earl',
    text: 'Now I can print my tractor pictures... I mean, property inspection reports... from my own desk!',
  },
  {
    id: 'm17-success-3',
    speaker: 'bubba',
    text: 'And I don\'t have Darlene interruptin\' me every five minutes! This is great!',
  },
];

export const queueExplanation: DialogueLine[] = [
  {
    id: 'm17-queue-1',
    speaker: 'narrator',
    text: 'But wait - what if two people try to print at the same time?',
  },
  {
    id: 'm17-queue-2',
    speaker: 'narrator',
    text: 'The print server handles this with a print queue. Jobs line up and print one at a time.',
  },
  {
    id: 'm17-queue-3',
    speaker: 'narrator',
    text: 'First come, first served. No collisions, no confusion!',
  },
];

export const successDialogue: DialogueLine[] = [
  {
    id: 'm17-final-1',
    speaker: 'narrator',
    text: 'Network printing is set up! Everyone can print from their desk.',
  },
  {
    id: 'm17-final-2',
    speaker: 'bubba',
    text: 'Hot dang! The office is really comin\' together now!',
  },
];

// Educational summary for Mission 1.7
export const educationalSummary: EducationalSection[] = [
  {
    icon: '🖨️',
    title: 'Network Printing',
    content: 'A network printer allows multiple computers to share one printer. Instead of being connected to one PC, the printer becomes a device on the network.',
    details: [
      'Two ways to share a printer:',
      '• PC Shared: Printer on one PC, shared via Windows',
      '  - Pro: No extra hardware',
      '  - Con: That PC must be on',
      '• Print Server: Dedicated device on network',
      '  - Pro: Works independently',
      '  - Con: Extra cost (~$100-150)',
    ],
  },
  {
    icon: '📡',
    title: 'Print Servers',
    content: 'A print server is a small device that connects a printer directly to the network. It has its own IP address and accepts print jobs from any PC.',
    details: [
      'How it works:',
      '1. Print server connects to printer (parallel/USB)',
      '2. Print server connects to network (Ethernet)',
      '3. Print server gets IP address (static or DHCP)',
      '4. PCs send jobs to that IP address',
      '5. Print server feeds jobs to printer',
      'Popular 2001 models:',
      '• HP JetDirect (external or internal)',
      '• Intel NetportExpress',
      '• Linksys PSUS4',
    ],
  },
  {
    icon: '🔢',
    title: 'Port 9100 - RAW Printing',
    content: 'Port 9100 is the standard for TCP/IP "raw" printing. Print data is sent directly to the printer with no protocol overhead.',
    details: [
      'Common printing ports:',
      '• 9100: RAW/JetDirect (most common)',
      '• 515: LPR/LPD (older Unix style)',
      '• 631: IPP (Internet Printing Protocol)',
      'Why 9100?',
      '• Simple and fast',
      '• Printer-language agnostic',
      '• Supported by almost everything',
    ],
  },
  {
    icon: '📋',
    title: 'Print Queues',
    content: 'When multiple people print at once, jobs wait in a queue. The print server or print spooler manages this line.',
    details: [
      'Print queue functions:',
      '• Holds jobs waiting to print',
      '• First-in-first-out (usually)',
      '• Can prioritize certain users',
      '• Shows job status',
      'Common queue issues:',
      '• Stuck job blocks everything',
      '• Solution: Clear the queue',
      '• Paper jams stop the queue',
      '• Large jobs delay others',
    ],
  },
];
