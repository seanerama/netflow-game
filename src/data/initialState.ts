import { useGameStore } from '../store/gameStore';
import type { NetworkDevice, MACAddress, ComputerConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generate a random MAC address
function generateMAC(): MACAddress {
  const hex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return {
    segments: [hex(), hex(), hex(), hex(), hex(), hex()],
  };
}

// Initialize the game with starting devices
export function initializeGameState() {
  const { addDevice } = useGameStore.getState();

  // Internet connection point (ISP)
  const internet: NetworkDevice = {
    id: 'internet',
    type: 'server',
    name: 'Internet (ISP)',
    position: { x: 400, y: 80 },
    status: 'online',
    interfaces: [
      {
        id: 'isp-handoff',
        name: 'Customer Handoff',
        macAddress: { segments: ['00', '00', '00', '00', '00', '00'] },
        ipAddress: { octets: [203, 0, 113, 47] }, // Public IP
        isUp: true,
        speed: 100,
      },
    ],
    config: { hostname: 'internet' },
    purchaseCost: 0,
    monthlyOperatingCost: 75, // ISP bill
  };

  // Sarah's Computer
  const sarahComputer: NetworkDevice = {
    id: 'computer-sarah',
    type: 'computer',
    name: "Sarah's PC",
    position: { x: 200, y: 350 },
    status: 'offline',
    interfaces: [
      {
        id: uuidv4(),
        name: 'eth0',
        macAddress: generateMAC(),
        isUp: false,
        speed: 1000,
      },
    ],
    config: {
      hostname: 'sarah-pc',
      ipConfig: 'static',
      dnsServers: [],
      applications: [],
    } as ComputerConfig,
    purchaseCost: 0,
    monthlyOperatingCost: 0,
  };

  // Mike's Computer
  const mikeComputer: NetworkDevice = {
    id: 'computer-mike',
    type: 'computer',
    name: "Mike's PC",
    position: { x: 400, y: 350 },
    status: 'offline',
    interfaces: [
      {
        id: uuidv4(),
        name: 'eth0',
        macAddress: generateMAC(),
        isUp: false,
        speed: 1000,
      },
    ],
    config: {
      hostname: 'mike-pc',
      ipConfig: 'static',
      dnsServers: [],
      applications: [],
    } as ComputerConfig,
    purchaseCost: 0,
    monthlyOperatingCost: 0,
  };

  // Lisa's Computer
  const lisaComputer: NetworkDevice = {
    id: 'computer-lisa',
    type: 'computer',
    name: "Lisa's PC",
    position: { x: 600, y: 350 },
    status: 'offline',
    interfaces: [
      {
        id: uuidv4(),
        name: 'eth0',
        macAddress: generateMAC(),
        isUp: false,
        speed: 1000,
      },
    ],
    config: {
      hostname: 'lisa-pc',
      ipConfig: 'static',
      dnsServers: [],
      applications: [],
    } as ComputerConfig,
    purchaseCost: 0,
    monthlyOperatingCost: 0,
  };

  // Add all devices
  addDevice(internet);
  addDevice(sarahComputer);
  addDevice(mikeComputer);
  addDevice(lisaComputer);

  // Update topology
  useGameStore.getState().updateTopology();
}

// Reset game to initial state
export function resetGameToInitial() {
  const store = useGameStore.getState();

  // Clear existing network
  Object.keys(store.network.devices).forEach((id) => {
    store.removeDevice(id);
  });
  Object.keys(store.network.connections).forEach((id) => {
    store.removeConnection(id);
  });

  // Re-initialize
  initializeGameState();
}
