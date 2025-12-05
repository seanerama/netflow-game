// ============================================================
// CORE TYPES - Network Infrastructure
// ============================================================

export type DeviceType = 'router' | 'switch' | 'hub' | 'computer' | 'server' | 'firewall';
export type ConnectionType = 'ethernet' | 'fiber' | 'wireless';
export type PacketType = 'tcp' | 'udp' | 'icmp' | 'dns' | 'http' | 'https';
export type PacketState = 'created' | 'in-transit' | 'delivered' | 'dropped' | 'blocked';

export interface Position {
  x: number;
  y: number;
}

export interface IPv4Address {
  octets: [number, number, number, number]; // [192, 168, 1, 1]
  cidr?: number; // Optional subnet mask in CIDR notation
}

export interface MACAddress {
  segments: [string, string, string, string, string, string]; // ["AA", "BB", "CC", "DD", "EE", "FF"]
}

export interface PortNumber {
  value: number; // 1-65535
  protocol: 'tcp' | 'udp';
}

// ============================================================
// NETWORK DEVICES
// ============================================================

export interface NetworkDevice {
  id: string;
  type: DeviceType;
  name: string;
  position: Position;
  status: 'online' | 'offline' | 'error' | 'configuring';
  interfaces: NetworkInterface[];
  config: DeviceConfig;
  purchaseCost: number;
  monthlyOperatingCost: number;
}

export interface NetworkInterface {
  id: string;
  name: string; // "eth0", "wan", "lan1", etc.
  macAddress: MACAddress;
  ipAddress?: IPv4Address;
  subnetMask?: IPv4Address;
  gateway?: IPv4Address;
  isUp: boolean;
  speed: number; // Mbps
  connectedTo?: string; // ID of connected interface
}

export interface DeviceConfig {
  hostname: string;
  [key: string]: unknown; // Device-specific configuration
}

// ============================================================
// ROUTER SPECIFIC
// ============================================================

export interface Router extends NetworkDevice {
  type: 'router';
  config: RouterConfig;
}

export interface RouterConfig extends DeviceConfig {
  nat: NATConfig;
  firewall: FirewallConfig;
  dhcp?: DHCPConfig;
  routes: StaticRoute[];
}

export interface NATConfig {
  enabled: boolean;
  type: 'pat' | 'static' | 'dynamic'; // PAT (Port Address Translation) for MVP
  insideInterface: string; // Interface ID
  outsideInterface: string; // Interface ID
  translations: NATTranslation[]; // Active translations (runtime)
  staticMappings: StaticNATMapping[]; // Port forwarding rules
}

export interface NATTranslation {
  id: string;
  insideAddress: IPv4Address;
  insidePort: number;
  outsideAddress: IPv4Address;
  outsidePort: number;
  protocol: 'tcp' | 'udp';
  createdAt: number;
  lastUsed: number;
  state: 'active' | 'expired';
}

export interface StaticNATMapping {
  id: string;
  name: string; // User-friendly name
  externalPort: number;
  internalAddress: IPv4Address;
  internalPort: number;
  protocol: 'tcp' | 'udp' | 'both';
  enabled: boolean;
}

export interface FirewallConfig {
  enabled: boolean;
  defaultInboundPolicy: 'allow' | 'deny';
  defaultOutboundPolicy: 'allow' | 'deny';
  rules: FirewallRule[];
  statefulInspection: boolean; // Track connection states
  connectionTable: ConnectionState[]; // Active connections (runtime)
}

export interface FirewallRule {
  id: string;
  name: string;
  priority: number; // Lower = higher priority
  direction: 'inbound' | 'outbound' | 'both';
  action: 'allow' | 'deny' | 'log';
  sourceAddress?: IPv4Address | 'any';
  sourcePort?: number | 'any';
  destinationAddress?: IPv4Address | 'any';
  destinationPort?: number | 'any';
  protocol?: 'tcp' | 'udp' | 'icmp' | 'any';
  enabled: boolean;
}

export interface ConnectionState {
  id: string;
  sourceAddress: IPv4Address;
  sourcePort: number;
  destinationAddress: IPv4Address;
  destinationPort: number;
  protocol: 'tcp' | 'udp';
  state: 'new' | 'established' | 'related' | 'closing';
  tcpState?: TCPState;
  createdAt: number;
  lastActivity: number;
  packetsIn: number;
  packetsOut: number;
}

export type TCPState =
  | 'listen'
  | 'syn-sent'
  | 'syn-received'
  | 'established'
  | 'fin-wait-1'
  | 'fin-wait-2'
  | 'close-wait'
  | 'closing'
  | 'last-ack'
  | 'time-wait'
  | 'closed';

export interface DHCPConfig {
  enabled: boolean;
  poolStart: IPv4Address;
  poolEnd: IPv4Address;
  subnetMask: IPv4Address;
  gateway: IPv4Address;
  dns: IPv4Address[];
  leaseTime: number; // seconds
  leases: DHCPLease[];
}

export interface DHCPLease {
  macAddress: MACAddress;
  ipAddress: IPv4Address;
  hostname?: string;
  leaseStart: number;
  leaseEnd: number;
}

export interface StaticRoute {
  id: string;
  destination: IPv4Address;
  subnetMask: IPv4Address;
  nextHop: IPv4Address;
  interface: string;
  metric: number;
}

// ============================================================
// SWITCH SPECIFIC
// ============================================================

export interface Switch extends NetworkDevice {
  type: 'switch';
  config: SwitchConfig;
}

export interface SwitchConfig extends DeviceConfig {
  macTable: MACTableEntry[];
  vlans?: VLAN[]; // Future phases
}

export interface MACTableEntry {
  macAddress: MACAddress;
  port: string; // Interface ID
  vlan?: number;
  learned: number; // Timestamp
  type: 'dynamic' | 'static';
}

export interface VLAN {
  id: number;
  name: string;
  ports: string[]; // Interface IDs
}

// ============================================================
// COMPUTER/ENDPOINT SPECIFIC
// ============================================================

export interface Computer extends NetworkDevice {
  type: 'computer';
  config: ComputerConfig;
  assignedTo?: string; // Employee ID
}

export interface ComputerConfig extends DeviceConfig {
  ipConfig: 'dhcp' | 'static';
  dnsServers: IPv4Address[];
  applications: Application[];
}

export interface Application {
  id: string;
  name: string;
  icon: string;
  trafficProfile: TrafficProfile;
  isRunning: boolean;
}

export interface TrafficProfile {
  protocol: 'tcp' | 'udp';
  destinationPorts: number[];
  averageBandwidth: number; // Kbps
  burstBandwidth: number; // Kbps
  packetFrequency: number; // packets per second
}

// ============================================================
// CONNECTIONS (CABLES/PIPES)
// ============================================================

export interface Connection {
  id: string;
  type: ConnectionType;
  fromDevice: string; // Device ID
  fromInterface: string; // Interface ID
  toDevice: string; // Device ID
  toInterface: string; // Interface ID
  bandwidth: number; // Mbps
  latency: number; // ms
  packetLoss: number; // 0-1 percentage
  status: 'connected' | 'disconnected' | 'error';
  visualPath?: Position[]; // Points for rendering curved pipes
}

// ============================================================
// PACKETS (DATA FLOW)
// ============================================================

export interface Packet {
  id: string;
  type: PacketType;
  state: PacketState;

  // Layer 2
  sourceMac: MACAddress;
  destinationMac: MACAddress;

  // Layer 3
  sourceIp: IPv4Address;
  destinationIp: IPv4Address;
  ttl: number;

  // Layer 4
  sourcePort: number;
  destinationPort: number;
  protocol: 'tcp' | 'udp';

  // TCP specific
  tcpFlags?: {
    syn: boolean;
    ack: boolean;
    fin: boolean;
    rst: boolean;
    psh: boolean;
  };
  sequenceNumber?: number;
  acknowledgmentNumber?: number;

  // Payload
  payload: PacketPayload;

  // Simulation
  createdAt: number;
  currentPosition: Position;
  currentDevice?: string;
  route: string[]; // Device IDs in order
  routeIndex: number;
  animationProgress: number; // 0-1 for smooth animation

  // Visual
  color: string;
  size: 'small' | 'medium' | 'large';
  highlighted: boolean;
}

export interface PacketPayload {
  type:
    | 'http-request'
    | 'http-response'
    | 'dns-query'
    | 'dns-response'
    | 'email'
    | 'file-transfer'
    | 'video-stream'
    | 'attack'
    | 'generic';
  size: number; // bytes
  description: string;
  data?: unknown;
}

// ============================================================
// BUSINESS SIMULATION
// ============================================================

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  founded: number; // Game day

  // Financial
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  itBudget: number;

  // Growth
  level: number; // Business growth level
  reputation: number; // 0-100

  // Staff
  employees: Employee[];
  maxEmployees: number;

  // Infrastructure
  offices: Office[];
}

export type BusinessType =
  | 'design-agency'
  | 'software-startup'
  | 'consulting-firm'
  | 'retail-shop'
  | 'manufacturing';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  avatar: string;
  hireDate: number;
  salary: number;

  // Work simulation
  productivity: number; // 0-100, affected by network quality
  satisfaction: number; // 0-100
  currentTask?: Task;
  assignedComputer?: string; // Computer device ID

  // Network usage
  trafficProfile: EmployeeTrafficProfile;
}

export type EmployeeRole =
  | 'designer'
  | 'developer'
  | 'manager'
  | 'sales'
  | 'support'
  | 'executive';

export interface EmployeeTrafficProfile {
  webBrowsing: number; // 0-10 intensity
  email: number;
  fileTransfers: number;
  videoConferencing: number;
  cloudApps: number;
}

export interface Task {
  id: string;
  name: string;
  requiredBandwidth: number;
  duration: number; // Game minutes
  progress: number; // 0-100
  networkDependent: boolean;
}

export interface Office {
  id: string;
  name: string;
  location: string;
  size: 'small' | 'medium' | 'large';
  maxWorkstations: number;
  networkZone: string; // For VLAN mapping in later phases
}

// ============================================================
// GAME EVENTS
// ============================================================

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  triggerCondition: EventTrigger;
  effects: EventEffect[];
  choices?: EventChoice[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  duration?: number; // How long event lasts
  resolved: boolean;
}

export type EventType =
  | 'business-growth' // New employee, revenue increase
  | 'network-issue' // Outage, slow performance
  | 'security-threat' // Hacking attempt, malware
  | 'hardware-failure' // Device dies
  | 'new-requirement' // Boss wants new capability
  | 'random-opportunity' // Discount on hardware
  | 'tutorial'; // Teaching moment

export interface EventTrigger {
  type: 'time' | 'condition' | 'random' | 'mission';
  value: unknown;
}

export interface EventEffect {
  type:
    | 'modify-cash'
    | 'modify-reputation'
    | 'spawn-packets'
    | 'damage-device'
    | 'add-employee'
    | 'unlock-feature';
  target?: string;
  value: unknown;
}

export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  requirements?: ChoiceRequirement[];
}

export interface ChoiceRequirement {
  type: 'cash' | 'device' | 'skill';
  value: unknown;
}

// ============================================================
// MISSION/LEARNING SYSTEM
// ============================================================

export interface Mission {
  id: string;
  phase: number;
  order: number;

  // Display
  title: string;
  briefing: string; // Story/context
  objectives: Objective[];

  // Learning
  learningObjectives: LearningObjective[];
  hints: Hint[];

  // Requirements
  prerequisites: string[]; // Mission IDs
  unlocks: string[]; // What completing this unlocks

  // Rewards
  rewards: Reward[];

  // State
  status: 'locked' | 'available' | 'active' | 'completed' | 'failed';
  startedAt?: number;
  completedAt?: number;
}

export interface Objective {
  id: string;
  description: string;
  type: ObjectiveType;
  target: unknown; // Depends on type
  current: number;
  required: number;
  completed: boolean;
  optional: boolean;
}

export type ObjectiveType =
  | 'connect-device' // Connect X to network
  | 'assign-ip' // Give device an IP
  | 'configure-nat' // Set up NAT
  | 'configure-firewall' // Set up firewall rules
  | 'achieve-connectivity' // Device can reach internet
  | 'block-attack' // Successfully block malicious traffic
  | 'maintain-uptime' // Keep network up for X time
  | 'troubleshoot' // Fix a specific problem
  | 'optimize-performance'; // Achieve X throughput

export interface LearningObjective {
  id: string;
  concept: NetworkConcept;
  description: string;
  assessmentType: 'observation' | 'action' | 'quiz';
  completed: boolean;
}

export type NetworkConcept =
  | 'ipv4-addressing'
  | 'private-vs-public-ip'
  | 'subnetting-basics'
  | 'nat-purpose'
  | 'nat-operation'
  | 'tcp-handshake'
  | 'stateful-firewall'
  | 'port-numbers'
  | 'packet-flow'
  | 'switching-basics'
  | 'routing-basics';

export interface Hint {
  id: string;
  order: number;
  condition: HintCondition;
  content: string;
  type: 'tooltip' | 'dialog' | 'highlight';
  target?: string; // UI element to highlight
}

export interface HintCondition {
  type: 'time-elapsed' | 'attempts-failed' | 'requested' | 'stuck-on-step';
  value: unknown;
}

export interface Reward {
  type: 'cash' | 'unlock-hardware' | 'unlock-feature' | 'xp' | 'achievement';
  value: unknown;
  description: string;
}

// ============================================================
// GAME STATE (ZUSTAND STORE)
// ============================================================

export interface GameState {
  // Meta
  version: string;
  saveSlot: number;
  lastSaved: number;

  // Time
  gameTime: GameTime;
  isPaused: boolean;
  gameSpeed: 1 | 2 | 4;

  // Progress
  currentPhase: number;
  currentMission?: string;
  completedMissions: string[];
  unlockedFeatures: string[];

  // Business
  business: Business;

  // Network
  network: NetworkState;

  // Simulation
  simulation: SimulationState;

  // UI
  ui: UIState;

  // Player
  player: PlayerState;
}

export interface GameTime {
  day: number;
  hour: number;
  minute: number;
  totalMinutes: number;
}

export interface NetworkState {
  devices: Record<string, NetworkDevice>;
  connections: Record<string, Connection>;
  packets: Record<string, Packet>;

  // Derived/cached
  topology: NetworkTopology;
}

export interface NetworkTopology {
  // Graph representation for routing
  adjacencyList: Record<string, string[]>;
  // Quick lookups
  devicesByType: Record<DeviceType, string[]>;
  // Internet gateway
  internetGateway?: string; // Router ID
  publicIP?: IPv4Address;
}

export interface SimulationState {
  isRunning: boolean;
  tickRate: number; // ms per tick
  lastTick: number;

  // Attack simulation
  activeThreats: Threat[];
  blockedAttacks: number;
  successfulAttacks: number;

  // Performance metrics
  metrics: NetworkMetrics;
}

export interface Threat {
  id: string;
  type: 'port-scan' | 'brute-force' | 'ddos' | 'malware';
  sourceIP: IPv4Address;
  targetPort?: number;
  intensity: number;
  startedAt: number;
  packets: string[]; // Packet IDs
}

export interface NetworkMetrics {
  uptime: number; // Percentage
  averageLatency: number;
  packetLoss: number;
  throughput: number;
  activeConnections: number;
}

export interface UIState {
  currentView: 'office' | 'network' | 'config' | 'shop' | 'missions';
  selectedDevice?: string;
  selectedConnection?: string;
  showDataFlow: boolean;
  showLabels: boolean;
  zoom: number;
  pan: Position;

  // Modals
  activeModal?: ModalType;
  modalData?: unknown;

  // Tutorial
  tutorialStep?: number;
  highlightedElements: string[];
}

export type ModalType =
  | 'device-config'
  | 'shop'
  | 'mission-briefing'
  | 'mission-complete'
  | 'event'
  | 'help'
  | 'settings';

export interface PlayerState {
  name: string;
  xp: number;
  level: number;
  achievements: Achievement[];
  preferences: PlayerPreferences;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

export interface PlayerPreferences {
  animationSpeed: 'slow' | 'normal' | 'fast';
  showTutorials: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  colorblindMode: boolean;
}

// ============================================================
// VISUAL CONSTANTS
// ============================================================

export const VISUAL_METAPHORS = {
  concepts: {
    'data-packet': 'water droplet',
    bandwidth: 'pipe diameter',
    router: 'valve junction / manifold',
    firewall: 'filter / strainer',
    nat: 'address relabeling station',
    switch: 'pipe splitter',
    'ip-address': 'house number on pipe',
    internet: 'city water main',
    lan: 'internal home plumbing',
    latency: 'pipe length / travel time',
    'packet-loss': 'leaky pipe',
    'tcp-handshake': 'three-knock confirmation',
    port: 'numbered faucet / outlet',
  },

  packetColors: {
    http: '#3B82F6', // Blue - web traffic
    https: '#2563EB', // Darker blue - secure web
    dns: '#F59E0B', // Amber - DNS
    email: '#10B981', // Green - email
    'file-transfer': '#8B5CF6', // Purple - files
    video: '#EC4899', // Pink - video/streaming
    attack: '#EF4444', // Red - malicious
    blocked: '#6B7280', // Gray - blocked packets
  },

  pipeStyles: {
    '10mbps': { diameter: 4, color: '#9CA3AF' },
    '100mbps': { diameter: 8, color: '#6B7280' },
    '1gbps': { diameter: 12, color: '#4B5563' },
    '10gbps': { diameter: 16, color: '#374151' },
  },

  deviceIcons: {
    router: '🔀',
    switch: '⚡',
    hub: '🔌',
    computer: '🖥️',
    server: '🗄️',
    firewall: '🛡️',
    internet: '☁️',
  },
} as const;

export const ANIMATION_CONFIG = {
  packetFlow: {
    baseDuration: 2000, // ms for packet to traverse one connection
    variancePercent: 20, // Random variation for natural look
  },

  tcpHandshake: {
    synDuration: 500,
    synAckDuration: 500,
    ackDuration: 500,
    pauseBetween: 200,
  },

  natTranslation: {
    labelSwapDuration: 300,
    highlightDuration: 500,
  },

  firewall: {
    checkDuration: 200,
    allowAnimation: 'pass-through',
    blockAnimation: 'bounce-back',
  },
} as const;
