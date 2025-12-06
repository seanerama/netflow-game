import type { DialogueLine, EducationalSection } from '../types';

// Mission 1.1: "Hook 'Em Up" - Connecting the Office to the Internet

export const MISSION_1_1_BUDGET = 350;

export const introDialogue: DialogueLine[] = [
  {
    id: 'intro-1',
    speaker: 'narrator',
    text: 'You enter Bubba\'s office. It\'s a converted double-wide trailer. Bubba sits behind a desk made from sawhorses and a door.',
  },
  {
    id: 'intro-2',
    speaker: 'narrator',
    text: 'Four beige PCs sit on desks around the room, power cables dangling, but no network cables in sight.',
  },
  {
    id: 'intro-3',
    speaker: 'narrator',
    text: 'A brand new T1 demarc box is mounted on the wall with a blinking green light.',
  },
  {
    id: 'intro-4',
    speaker: 'bubba',
    text: 'Well howdy there, computer person!',
  },
  {
    id: 'intro-5',
    speaker: 'bubba',
    text: 'See that blinky box on the wall? The phone company feller said that\'s our "Tee-One" internet pipe.',
  },
  {
    id: 'intro-6',
    speaker: 'bubba',
    text: 'Cost me eight hunnerd dollars a month!',
  },
  {
    id: 'intro-7',
    speaker: 'bubba',
    text: 'Now I got four computers here that need to talk to that there internet so Darlene can do her email and Earl can look up... well, whatever Earl looks up.',
  },
  {
    id: 'intro-8',
    speaker: 'bubba',
    text: 'Here\'s $350 for whatever doodads you need.',
  },
  {
    id: 'intro-9',
    speaker: 'bubba',
    text: 'Git \'er done!',
  },
];

export const storeIntroDialogue: DialogueLine[] = [
  {
    id: 'store-intro-1',
    speaker: 'narrator',
    text: 'You head over to Hank\'s Hardware & Electronics, the only tech store in Possum Holler.',
  },
  {
    id: 'store-intro-2',
    speaker: 'narrator',
    text: 'The shelves are lined with networking equipment from the leading brands of 2001.',
  },
];

export const topologyIntroDialogue: DialogueLine[] = [
  {
    id: 'topology-intro-1',
    speaker: 'narrator',
    text: 'Back at Bubba\'s office with your purchases. Time to connect everything.',
  },
  {
    id: 'topology-intro-2',
    speaker: 'narrator',
    text: 'The T1 demarc on the wall is ready and waiting. Connect the router first, then expand from there.',
  },
];

export const configIntroDialogue: DialogueLine[] = [
  {
    id: 'config-intro-1',
    speaker: 'narrator',
    text: 'Hardware\'s connected! Now to configure everything.',
  },
  {
    id: 'config-intro-2',
    speaker: 'system',
    text: 'The T1 provider included a sheet with your connection details...',
  },
];

export const successDialogue: DialogueLine[] = [
  {
    id: 'success-1',
    speaker: 'narrator',
    text: 'All four PCs are online! The familiar dial-up-free sound of constant connectivity fills the office.',
  },
  {
    id: 'success-2',
    speaker: 'bubba',
    text: 'HOT DIGGITY DOG!',
  },
  {
    id: 'success-3',
    speaker: 'bubba',
    text: 'Darlene, we got the internets! Send Mama an email and tell her to check the Beanie Baby prices on that eBay thing!',
  },
  {
    id: 'success-4',
    speaker: 'darlene',
    text: '*already typing excitedly*',
  },
  {
    id: 'success-5',
    speaker: 'bubba',
    text: 'You came in under budget! Here\'s an extra $50 for doing such a fine job.',
  },
];

// WAN Configuration provided by ISP
export const ispConfig = {
  ipAddress: '203.45.67.89',
  subnetMask: '255.255.255.248',
  gateway: '203.45.67.81',
  dns1: '203.45.67.1',
  dns2: '203.45.67.2',
};

// Correct LAN configuration
export const correctLanConfig = {
  ipAddress: '192.168.1.1',
  subnetMask: '255.255.255.0',
  dhcpEnabled: false,
};

// PC Configurations
export const pcConfigs = [
  { name: 'Bubba\'s PC', ip: '192.168.1.10' },
  { name: 'Earl\'s PC', ip: '192.168.1.11' },
  { name: 'Darlene\'s PC', ip: '192.168.1.12' },
  { name: 'Accountant PC', ip: '192.168.1.13' },
];

// Educational Summary Content
export const educationalSummary: EducationalSection[] = [
  {
    icon: '📬',
    title: 'IP ADDRESSES - Your Digital Street Address',
    content: 'Just like houses need addresses for mail delivery, computers need IP addresses for data delivery.',
    details: [
      'Public IP (203.45.67.89): Your address on the global internet. Like your street address that anyone in the world can send mail to.',
      'Private IP (192.168.1.x): Your internal "room number." Only works inside your building.',
      'Three ranges are reserved for private use:',
      '• 10.0.0.0 - 10.255.255.255 (Class A - Huge company)',
      '• 172.16.0.0 - 172.31.255.255 (Class B - Medium company)',
      '• 192.168.0.0 - 192.168.255.255 (Class C - Small office/home)',
    ],
  },
  {
    icon: '🔄',
    title: 'NAT - The Receptionist',
    content: 'NAT (Network Address Translation) lets multiple devices share one public IP address.',
    details: [
      'Analogy: Imagine an office with one main phone number. When someone calls, the receptionist answers and transfers the call to the right person.',
      'From outside, callers only see one number. Inside, everyone has their own extension.',
      'When Earl visits a website:',
      '1. His PC (192.168.1.11) sends request to router',
      '2. Router changes "from" address to 203.45.67.89 (and remembers Earl asked)',
      '3. Website sees request from 203.45.67.89, sends response there',
      '4. Router receives response, remembers "this was Earl\'s request"',
      '5. Router forwards response to 192.168.1.11',
    ],
  },
  {
    icon: '🔌',
    title: 'HUBS - The Party Line',
    content: 'A hub is like an old-fashioned party line telephone - when one person talks, EVERYONE hears it.',
    details: [
      'When Darlene\'s PC sends data:',
      '1. Data arrives at the hub',
      '2. Hub copies it to ALL other ports',
      '3. All PCs receive it',
      '4. Only the intended recipient actually processes it',
      '',
      'Problems with this:',
      '• Wasted bandwidth (everyone gets everything)',
      '• Collisions (two people talk at once)',
      '• No privacy (everyone can eavesdrop)',
      '',
      'Why we used it: It\'s cheap and simple. For 4 PCs doing light web browsing, it works fine. But wait until the office grows...',
    ],
  },
  {
    icon: '🌐',
    title: 'DNS - The Internet Phone Book',
    content: 'DNS (Domain Name System) translates human-friendly names to IP addresses.',
    details: [
      'You type: www.google.com',
      'DNS returns: 142.250.80.46',
      '',
      'Without DNS, you\'d need to memorize numbers for every website.',
      'Imagine memorizing phone numbers for every person you know instead of looking them up by name!',
    ],
  },
];

// Error messages for configuration mistakes
export const configErrors = {
  wrongIP: {
    title: 'Wrong IP Address',
    explanation: 'That IP address is like your street address on the internet. If you put the wrong one, it\'s like mail going to the wrong house - nobody can find you, and you can\'t find them!',
  },
  wrongSubnet: {
    title: 'Wrong Subnet Mask',
    explanation: 'The subnet mask tells your router which addresses are "neighbors" and which are "far away." Wrong mask = confused router. It\'s like having a map where some streets are in the wrong neighborhood.',
  },
  wrongGateway: {
    title: 'Wrong Gateway',
    explanation: 'The gateway is your "door to the outside world." Without the right gateway, your router knows the local network but doesn\'t know how to reach the internet. It\'s like knowing every house in your neighborhood but not knowing where the highway entrance is!',
  },
  wrongDNS: {
    title: 'Wrong DNS',
    explanation: 'DNS is like the internet\'s phone book - it turns names like "google.com" into actual addresses. Wrong DNS = you have to know everyone\'s number by heart!',
  },
  duplicateIP: {
    title: 'IP Address Conflict!',
    explanation: 'It\'s like two houses with the same street address - the mailman doesn\'t know which one to deliver to, so nobody gets their mail! Every device needs a UNIQUE IP address.',
  },
  wrongPCSubnet: {
    title: 'Wrong Network!',
    explanation: 'You put that computer in a different neighborhood! 192.168.1.x and 192.168.2.x are different networks. It\'s like being in a different zip code - your local mail carrier can\'t reach you.',
  },
  gatewayToSelf: {
    title: 'Gateway Points to Self!',
    explanation: 'You told the computer to ask itself how to get to the internet. That\'s like asking yourself for directions to a place you\'ve never been!',
  },
  gatewayToPC: {
    title: 'Gateway Points to Another PC!',
    explanation: 'That\'s just Earl\'s computer, not the router! Earl\'s computer doesn\'t know how to get to the internet either. The gateway has to be the router - the only device that actually connects to the outside.',
  },
};

// Error messages for topology mistakes
export const topologyErrors = {
  pcDirectToT1: {
    title: 'DANGER!',
    explanation: 'Whoa there! You can\'t plug a PC directly into the T1 line.',
    analogy: 'That\'s like trying to drink directly from the water main - you need pipes (the router) to make it usable and safe!',
  },
  routerWanToHub: {
    title: 'Wrong Port!',
    explanation: 'You\'ve connected the router\'s "outside" port to your inside network. The WAN port needs to connect to the internet (the T1), not to your local devices.',
    analogy: 'It\'s like connecting your front door to your bedroom instead of the outside world!',
  },
  hubToHub: {
    title: 'Network Loop!',
    explanation: 'Network loop detected! When you connect hubs in a circle, data packets get confused and keep spinning forever.',
    analogy: 'Like a dog chasing its tail. We\'ll learn how to properly daisy-chain equipment later.',
  },
  pcToRouterLan: {
    title: 'Suboptimal Connection',
    explanation: 'That works, but you\'re using up one of your router\'s precious 4 ports. Save those for important stuff and use the hub to expand - that\'s what it\'s for!',
  },
};
