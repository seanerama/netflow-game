import type { DeviceType } from '../../types';

export interface HardwareItem {
  id: string;
  name: string;
  description: string;
  type: DeviceType;
  cost: number;
  monthlyCost: number;
  icon: string;
  specs: Record<string, unknown>;
  locked?: boolean;
  unlockCondition?: string;
}

export interface CableItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxSpeed: number;
  icon: string;
}

export const HARDWARE_CATALOG: Record<string, HardwareItem[]> = {
  routers: [
    {
      id: 'router-basic',
      name: 'BasicNet Home Router',
      description: 'Simple router with NAT, basic firewall, and 4 LAN ports. Perfect for getting started.',
      type: 'router',
      cost: 150,
      monthlyCost: 0,
      icon: '🔀',
      specs: {
        wanPorts: 1,
        lanPorts: 4,
        maxBandwidth: 100,
        features: ['nat', 'basic-firewall', 'dhcp'],
        maxConnections: 32,
      },
    },
    {
      id: 'router-business',
      name: 'ProNet Business Router',
      description: 'Business-grade router with advanced firewall, VPN capability, and 8 LAN ports.',
      type: 'router',
      cost: 400,
      monthlyCost: 0,
      icon: '🔀',
      specs: {
        wanPorts: 1,
        lanPorts: 8,
        maxBandwidth: 1000,
        features: ['nat', 'stateful-firewall', 'dhcp', 'vpn-ready', 'qos'],
        maxConnections: 256,
      },
      locked: true,
      unlockCondition: 'Complete Mission 1-3',
    },
  ],
  switches: [
    {
      id: 'switch-4port',
      name: '4-Port Desktop Switch',
      description: 'Simple unmanaged switch to connect more devices.',
      type: 'switch',
      cost: 50,
      monthlyCost: 0,
      icon: '⚡',
      specs: {
        ports: 4,
        speed: 1000,
        managed: false,
      },
    },
    {
      id: 'switch-8port',
      name: '8-Port Desktop Switch',
      description: 'Larger unmanaged switch for growing networks.',
      type: 'switch',
      cost: 80,
      monthlyCost: 0,
      icon: '⚡',
      specs: {
        ports: 8,
        speed: 1000,
        managed: false,
      },
    },
  ],
};

export const CABLE_CATALOG: CableItem[] = [
  {
    id: 'cable-cat5e',
    name: 'Cat5e Ethernet Cable',
    description: 'Standard ethernet cable, up to 1 Gbps.',
    cost: 10,
    maxSpeed: 1000,
    icon: '🔌',
  },
];

// Helper to get all available (unlocked) hardware
export function getAvailableHardware(unlockedFeatures: string[]): HardwareItem[] {
  const allHardware = Object.values(HARDWARE_CATALOG).flat();
  return allHardware.filter((item) => !item.locked || unlockedFeatures.includes(item.id));
}

// Helper to find hardware by ID
export function getHardwareById(id: string): HardwareItem | undefined {
  return Object.values(HARDWARE_CATALOG)
    .flat()
    .find((item) => item.id === id);
}
