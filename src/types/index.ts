// NetQuest Type Definitions

// ==================== GAME STATE ====================

export type GamePhase =
  | 'title'           // Title screen
  | 'intro'           // Mission intro/narrative
  | 'store'           // Equipment store
  | 'topology'        // Physical setup (drag-and-drop)
  | 'config'          // Device configuration
  | 'test'            // Testing network
  | 'summary'         // Educational summary
  | 'complete'        // Mission complete
  | 'firewall'        // Mission 1.2: Firewall config
  | 'security-choice' // Mission 1.2: Are we safe now?
  | 'mission-select'; // Between missions

export type SubMission = '1.1' | '1.2' | '1.3' | '1.4' | '1.5' | '1.6' | '1.7' | '1.8';

export interface GameState {
  currentMission: number;
  currentSubMission: SubMission;
  phase: GamePhase;
  budget: number;
  inventory: InventoryItem[];
  topologyState: TopologyState;
  configState: ConfigState;
  dialogueQueue: DialogueLine[];
  flags: Record<string, boolean>;
}

// ==================== INVENTORY & STORE ====================

export type EquipmentCategory = 'router' | 'hub' | 'switch' | 'cable' | 'other';

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  price: number;
  description: string;
  hoverDescription: string;
  ports?: number;
  wanPorts?: number;
  lanPorts?: number;
  cableLength?: number;
  isRedHerring?: boolean;
  redHerringFeedback?: WrongChoiceFeedback;
}

export interface InventoryItem extends EquipmentItem {
  instanceId: string;
  quantity: number;
}

export interface WrongChoiceFeedback {
  title: string;
  explanation: string;
  analogy?: string;
}

// ==================== TOPOLOGY ====================

export type DeviceType = 'router' | 'hub' | 'switch' | 'pc' | 't1-demarc';

export type PortType = 'wan' | 'lan' | 'uplink' | 'network';

export interface Port {
  id: string;
  type: PortType;
  label: string;
  connectedTo?: string; // Port ID of connected device
  configured?: boolean;
}

export interface PlacedDevice {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  ports: Port[];
  configured?: boolean;
  equipmentId?: string; // Reference to equipment item
}

export interface Connection {
  id: string;
  fromDeviceId: string;
  fromPortId: string;
  toDeviceId: string;
  toPortId: string;
  cableId: string; // Inventory item ID
  status: 'pending' | 'valid' | 'invalid' | 'warning';
  errorMessage?: string;
}

export interface TopologyState {
  devices: PlacedDevice[];
  connections: Connection[];
  availableSlots: TopologySlot[];
}

export interface TopologySlot {
  id: string;
  x: number;
  y: number;
  label: string;
  acceptsTypes: DeviceType[];
  occupied: boolean;
}

// ==================== CONFIGURATION ====================

export interface IPConfig {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns1: string;
  dns2?: string;
}

export interface WANConfig extends IPConfig {
  connectionType: 'static' | 'dhcp';
}

export interface LANConfig {
  ipAddress: string;
  subnetMask: string;
  dhcpEnabled: boolean;
}

export interface RouterConfig {
  wan: WANConfig;
  lan: LANConfig;
}

export interface PCConfig extends IPConfig {}

export interface ConfigState {
  routerConfig: RouterConfig | null;
  pcConfigs: Record<string, PCConfig>;
  firewallRules: FirewallRule[];
}

export interface FirewallRule {
  id: string;
  name: string;
  enabled: boolean;
  action: 'allow' | 'block';
  direction: 'inbound' | 'outbound' | 'both';
  description: string;
}

// ==================== DIALOGUE ====================

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  portrait?: string;
  choices?: DialogueChoice[];
  onComplete?: () => void;
}

export interface DialogueChoice {
  text: string;
  isCorrect?: boolean;
  response?: DialogueLine;
  effect?: () => void;
}

// ==================== VALIDATION ====================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'connection' | 'config' | 'missing';
  deviceId?: string;
  message: string;
  explanation: string;
  analogy?: string;
}

export interface ValidationWarning {
  type: 'suboptimal' | 'future-problem';
  deviceId?: string;
  message: string;
  explanation: string;
}

// ==================== MISSION DATA ====================

export interface MissionData {
  id: string;
  title: string;
  subMissions: SubMissionData[];
}

export interface SubMissionData {
  id: SubMission;
  title: string;
  subtitle: string;
  budget: number;
  introDialogue: DialogueLine[];
  requiredEquipment: string[]; // Equipment IDs
  topologyRequirements: TopologyRequirement[];
  configRequirements: ConfigRequirement[];
  successDialogue: DialogueLine[];
  educationalSummary: EducationalSection[];
}

export interface TopologyRequirement {
  deviceType: DeviceType;
  minCount: number;
  maxCount?: number;
  connectionRules: ConnectionRule[];
}

export interface ConnectionRule {
  fromType: DeviceType;
  fromPort: PortType;
  toType: DeviceType;
  toPort: PortType;
  required: boolean;
  errorIfViolated?: WrongChoiceFeedback;
}

export interface ConfigRequirement {
  deviceType: DeviceType;
  deviceName?: string;
  expectedConfig: Partial<IPConfig | RouterConfig>;
  errorMessages: Record<string, WrongChoiceFeedback>;
}

export interface EducationalSection {
  icon: string;
  title: string;
  content: string;
  details?: string[];
}

// ==================== CHARACTERS ====================

export interface Character {
  id: string;
  name: string;
  role: string;
  portraitColor: string; // Placeholder color for sprite
  dialogueStyle: 'rural' | 'professional' | 'tech-savvy';
}
