import type { EquipmentItem } from '../types';

export const equipmentCatalog: EquipmentItem[] = [
  // === ROUTERS ===
  {
    id: 'linksys-befsr41',
    name: 'LinkSys BEFSR41 Router',
    category: 'router',
    price: 89,
    description: '4-port 10/100 router with NAT, basic firewall, 1 WAN port.',
    hoverDescription: '"The little blue box that could!" - Industry standard for small offices.',
    wanPorts: 1,
    lanPorts: 4,
  },

  // === HUBS ===
  {
    id: 'netgear-ds108',
    name: 'NetGear DS108 8-Port Hub',
    category: 'hub',
    price: 45,
    description: '10/100 hub with 8 ports for connecting multiple devices.',
    hoverDescription: '"Connects stuff together!" - Perfect for small offices that need expansion.',
    ports: 8,
  },

  // === CABLES ===
  {
    id: 'cat5-cable',
    name: 'Cat5 Ethernet Cable',
    category: 'cable',
    price: 8,
    description: 'Standard ethernet cable for connecting devices.',
    hoverDescription: '"The blue spaghetti that makes it all work" - One cable per connection.',
  },

  // === RED HERRINGS ===
  {
    id: 'usb-wifi-adapter',
    name: 'USB WiFi Adapter',
    category: 'other',
    price: 49,
    description: 'Adds wireless capability to a computer.',
    hoverDescription: '"Wireless internets!" - Cutting edge technology... for laptops.',
    isRedHerring: true,
    redHerringFeedback: {
      title: 'Wrong Tool for the Job',
      explanation: 'These old beige boxes don\'t have WiFi antennas, and even if they did, you\'d need a wireless access point, not just an adapter.',
      analogy: 'Plus, you\'ve got a perfectly good T1 sitting there! Let\'s crawl before we fly.',
    },
  },
  {
    id: '56k-modem',
    name: '56K Modem',
    category: 'other',
    price: 35,
    description: 'For dial-up internet connections.',
    hoverDescription: '"For dial-up connections" - Remember when this was fast?',
    isRedHerring: true,
    redHerringFeedback: {
      title: 'You Already Have Better!',
      explanation: 'Son, I\'m already payin\' $800 a month for that fancy T1 line! Why would I want to use the phone line at 56 thousand bits when I got 1.5 MILLION bits right there on the wall?',
      analogy: 'T1 = 1.544 Mbps vs Modem = 0.056 Mbps. That\'s almost 28 times faster!',
    },
  },
];

export function getEquipmentById(id: string): EquipmentItem | undefined {
  return equipmentCatalog.find((item) => item.id === id);
}

export function getEquipmentByCategory(category: EquipmentItem['category']): EquipmentItem[] {
  return equipmentCatalog.filter((item) => item.category === category);
}

export function calculateTotal(items: { id: string; quantity: number }[]): number {
  return items.reduce((total, item) => {
    const equipment = getEquipmentById(item.id);
    return total + (equipment?.price ?? 0) * item.quantity;
  }, 0);
}

// Validation for Mission 1.1
export function validateMission11Cart(items: { id: string; quantity: number }[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const hasRouter = items.some((item) => {
    const equip = getEquipmentById(item.id);
    return equip?.category === 'router';
  });

  const hasHub = items.some((item) => {
    const equip = getEquipmentById(item.id);
    return equip?.category === 'hub';
  });

  const cableCount = items.reduce((count, item) => {
    const equip = getEquipmentById(item.id);
    if (equip?.category === 'cable') {
      return count + item.quantity;
    }
    return count;
  }, 0);

  // Check for red herrings
  items.forEach((item) => {
    const equip = getEquipmentById(item.id);
    if (equip?.isRedHerring) {
      errors.push(`${equip.name}: ${equip.redHerringFeedback?.explanation}`);
    }
  });

  if (!hasRouter) {
    errors.push('No router selected! A hub is like a party line telephone - everyone can talk to each other in the room, but nobody can call outside! You need a router to connect your local network to the internet.');
  }

  if (!hasHub) {
    errors.push('No hub selected! The router only has 4 LAN ports, and you\'ve got 4 PCs. That works... barely. But what happens when Bubba hires someone new? You need a hub to expand your network.');
  }

  if (cableCount < 6) {
    errors.push(`Only ${cableCount} cable(s) selected! You need at least 6 cables: 1 for T1 to router, 1 for router to hub, and 4 for the PCs. How are these boxes supposed to talk to each other - telepathy?`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
