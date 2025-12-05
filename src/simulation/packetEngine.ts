import { useGameStore } from '../store/gameStore';
import type { Packet, IPv4Address, MACAddress, RouterConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Packet Simulation Engine
 *
 * Creates and manages packet flow through the network.
 * Handles:
 * - Normal traffic (HTTP requests from computers)
 * - Attack traffic (port scans, brute force from internet)
 * - Firewall blocking visualization
 * - NAT translation effects
 */

// Helper to create a blank MAC address
function blankMAC(): MACAddress {
  return { segments: ['00', '00', '00', '00', '00', '00'] };
}

// Helper to create an IP address
function createIP(a: number, b: number, c: number, d: number): IPv4Address {
  return { octets: [a, b, c, d] };
}

/**
 * Find a path between two devices using BFS
 */
function findPath(
  fromDeviceId: string,
  toDeviceId: string,
  adjacencyList: Record<string, string[]>
): string[] | null {
  if (fromDeviceId === toDeviceId) return [fromDeviceId];

  const visited = new Set<string>();
  const queue: { node: string; path: string[] }[] = [
    { node: fromDeviceId, path: [fromDeviceId] },
  ];

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = adjacencyList[node] || [];
    for (const neighbor of neighbors) {
      const newPath = [...path, neighbor];

      if (neighbor === toDeviceId) {
        return newPath;
      }

      if (!visited.has(neighbor)) {
        queue.push({ node: neighbor, path: newPath });
      }
    }
  }

  return null; // No path found
}

/**
 * Create a packet for normal traffic
 */
export function createNormalPacket(
  fromDeviceId: string,
  toDeviceId: string,
  type: Packet['type'] = 'http'
): Packet | null {
  const store = useGameStore.getState();
  const { devices, topology } = store.network;

  const fromDevice = devices[fromDeviceId];
  const toDevice = devices[toDeviceId];

  if (!fromDevice || !toDevice) return null;

  // Find path through network
  const path = findPath(fromDeviceId, toDeviceId, topology.adjacencyList);
  if (!path || path.length < 2) return null;

  // Get source IP
  const sourceIP =
    fromDevice.interfaces.find((i) => i.ipAddress)?.ipAddress ||
    createIP(0, 0, 0, 0);

  // Get destination IP
  const destIP =
    toDevice.interfaces.find((i) => i.ipAddress)?.ipAddress ||
    createIP(0, 0, 0, 0);

  const packet: Packet = {
    id: uuidv4(),
    type,
    state: 'in-transit',

    // Layer 2
    sourceMac: fromDevice.interfaces[0]?.macAddress || blankMAC(),
    destinationMac: toDevice.interfaces[0]?.macAddress || blankMAC(),

    // Layer 3
    sourceIp: sourceIP,
    destinationIp: destIP,
    ttl: 64,

    // Layer 4
    sourcePort: 49152 + Math.floor(Math.random() * 16383), // Ephemeral port
    destinationPort: type === 'http' ? 80 : type === 'https' ? 443 : 53,
    protocol: 'tcp',

    // Payload
    payload: {
      type: 'http-request',
      size: 500 + Math.floor(Math.random() * 1000),
      description: `${type.toUpperCase()} request from ${fromDevice.name}`,
    },

    // Animation state
    createdAt: Date.now(),
    currentPosition: fromDevice.position,
    currentDevice: fromDeviceId,
    route: path,
    routeIndex: 0,
    animationProgress: 0,

    // Visual
    color: '#3B82F6',
    size: 'small',
    highlighted: false,
  };

  return packet;
}

/**
 * Create an attack packet from the internet
 */
export function createAttackPacket(
  targetDeviceId: string,
  attackType: 'port-scan' | 'brute-force' | 'malware' = 'port-scan'
): Packet | null {
  const store = useGameStore.getState();
  const { devices, topology } = store.network;

  // Attack comes from the internet
  const internetDevice = devices['internet'];
  const targetDevice = devices[targetDeviceId];

  if (!internetDevice || !targetDevice) return null;

  // Find path from internet to target (through router)
  const path = findPath('internet', targetDeviceId, topology.adjacencyList);
  if (!path || path.length < 2) return null;

  // Random attack source IP
  const attackerIP = createIP(
    45 + Math.floor(Math.random() * 200),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  );

  const targetPort =
    attackType === 'port-scan'
      ? [22, 23, 80, 443, 3389, 8080][Math.floor(Math.random() * 6)]
      : attackType === 'brute-force'
        ? 22
        : 445;

  const packet: Packet = {
    id: uuidv4(),
    type: 'tcp',
    state: 'in-transit',

    // Layer 2
    sourceMac: blankMAC(),
    destinationMac: blankMAC(),

    // Layer 3
    sourceIp: attackerIP,
    destinationIp:
      targetDevice.interfaces.find((i) => i.ipAddress)?.ipAddress ||
      createIP(192, 168, 1, 10),
    ttl: 64,

    // Layer 4
    sourcePort: 12345 + Math.floor(Math.random() * 50000),
    destinationPort: targetPort,
    protocol: 'tcp',

    tcpFlags: {
      syn: true,
      ack: false,
      fin: false,
      rst: false,
      psh: false,
    },

    // Payload
    payload: {
      type: 'attack',
      size: 64,
      description:
        attackType === 'port-scan'
          ? `Port scan attempt on port ${targetPort}`
          : attackType === 'brute-force'
            ? 'SSH brute force attempt'
            : 'Malware payload delivery',
    },

    // Animation state
    createdAt: Date.now(),
    currentPosition: internetDevice.position,
    currentDevice: 'internet',
    route: path,
    routeIndex: 0,
    animationProgress: 0,

    // Visual
    color: '#EF4444',
    size: 'medium',
    highlighted: true,
  };

  return packet;
}

/**
 * Check if packet should be blocked by firewall
 */
export function shouldBlockPacket(packet: Packet): boolean {
  const store = useGameStore.getState();
  const { devices, topology } = store.network;

  // Only check incoming packets from internet
  if (packet.route[0] !== 'internet') return false;

  // Check if there's a router with firewall
  const routerId = topology.internetGateway;
  if (!routerId) return false;

  const router = devices[routerId];
  if (!router) return false;

  const config = router.config as RouterConfig;

  // Check if firewall is enabled with deny inbound policy
  if (config.firewall?.enabled && config.firewall.defaultInboundPolicy === 'deny') {
    // Inbound traffic from internet is blocked by default
    // Attack packets are always blocked
    if (packet.payload.type === 'attack') {
      return true;
    }

    // Check for stateful inspection - if this is a response to outbound request, allow
    // For MVP, we'll block all unsolicited inbound traffic
    return true;
  }

  return false;
}

/**
 * Animate packet along its route
 * Returns true if packet reached destination, false otherwise
 */
export function animatePacket(packetId: string, deltaTime: number): boolean {
  const store = useGameStore.getState();
  const packet = store.network.packets[packetId];

  if (!packet || packet.state !== 'in-transit') return true;

  // Animation speed (progress per ms)
  const speed = 0.002; // Takes ~500ms per hop
  const newProgress = packet.animationProgress + speed * deltaTime;

  if (newProgress >= 1) {
    // Reached next node
    const nextIndex = packet.routeIndex + 1;

    if (nextIndex >= packet.route.length - 1) {
      // Reached destination
      store.updatePacket(packetId, {
        state: 'delivered',
        animationProgress: 1,
        routeIndex: nextIndex,
      });
      return true;
    }

    // Check firewall at router
    const nextDevice = packet.route[nextIndex];
    if (nextDevice && store.network.devices[nextDevice]?.type === 'router') {
      if (shouldBlockPacket(packet)) {
        store.updatePacket(packetId, {
          state: 'blocked',
          animationProgress: 0,
          routeIndex: nextIndex,
        });
        store.recordBlockedAttack();
        return true; // Packet is done (blocked)
      }
    }

    // Move to next hop
    store.updatePacket(packetId, {
      routeIndex: nextIndex,
      animationProgress: 0,
      currentDevice: packet.route[nextIndex],
    });
  } else {
    // Still animating
    store.updatePacket(packetId, {
      animationProgress: newProgress,
    });
  }

  return false;
}

/**
 * Simulation loop - call this in requestAnimationFrame
 */
let lastTime = 0;
let simulationInterval: ReturnType<typeof setInterval> | null = null;

export function startPacketSimulation() {
  if (simulationInterval) return;

  lastTime = Date.now();

  simulationInterval = setInterval(() => {
    const store = useGameStore.getState();
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Animate all packets
    const packets = store.network.packets;

    Object.keys(packets).forEach((packetId) => {
      const isDone = animatePacket(packetId, deltaTime);
      if (isDone) {
        // Schedule removal after animation completes
        setTimeout(() => {
          store.removePacket(packetId);
        }, 1000);
      }
    });
  }, 16); // ~60fps
}

export function stopPacketSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

/**
 * Spawn a wave of attack packets
 */
export function spawnAttackWave(
  count: number,
  targetDeviceId: string,
  attackType: 'port-scan' | 'brute-force' | 'malware' = 'port-scan'
) {
  const store = useGameStore.getState();

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const packet = createAttackPacket(targetDeviceId, attackType);
      if (packet) {
        store.addPacket(packet);
      }
    }, i * 200); // Stagger packets
  }
}

/**
 * Spawn normal traffic from a computer
 */
export function spawnNormalTraffic(fromDeviceId: string) {
  const store = useGameStore.getState();

  const packet = createNormalPacket(fromDeviceId, 'internet', 'http');
  if (packet) {
    store.addPacket(packet);
  }
}
