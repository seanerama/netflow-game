import { create } from 'zustand';
import type {
  GameState,
  GamePhase,
  SubMission,
  InventoryItem,
  PlacedDevice,
  Connection,
  TopologySlot,
  DialogueLine,
  RouterConfig,
  PCConfig,
  FirewallRule,
  EquipmentItem,
} from '../types';

interface GameStore extends GameState {
  // Phase management
  setPhase: (phase: GamePhase) => void;
  advanceToNextPhase: () => void;

  // Budget management
  setBudget: (amount: number) => void;
  spendBudget: (amount: number) => boolean;
  addBudget: (amount: number) => void;

  // Inventory management
  addToInventory: (item: EquipmentItem, quantity?: number) => void;
  removeFromInventory: (instanceId: string, quantity?: number) => void;
  clearInventory: () => void;

  // Topology management
  placeDevice: (device: PlacedDevice) => void;
  removeDevice: (deviceId: string) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (connectionId: string) => void;
  updateConnectionStatus: (connectionId: string, status: Connection['status'], error?: string) => void;
  setSlots: (slots: TopologySlot[]) => void;
  markSlotOccupied: (slotId: string, occupied: boolean) => void;

  // Configuration management
  setRouterConfig: (config: RouterConfig) => void;
  setPCConfig: (deviceId: string, config: PCConfig) => void;
  setFirewallRules: (rules: FirewallRule[]) => void;

  // Dialogue management
  addDialogue: (lines: DialogueLine[]) => void;
  advanceDialogue: () => DialogueLine | null;
  clearDialogue: () => void;

  // Flags management
  setFlag: (key: string, value: boolean) => void;
  getFlag: (key: string) => boolean;

  // Mission management
  setSubMission: (subMission: SubMission) => void;

  // Game reset
  resetGame: () => void;
  resetForSubMission: (subMission: SubMission, budget: number) => void;
}

const PHASE_ORDER: GamePhase[] = ['title', 'intro', 'store', 'topology', 'config', 'test', 'summary', 'complete'];

const initialState: GameState = {
  currentMission: 1,
  currentSubMission: '1.1',
  phase: 'title',
  budget: 350,
  inventory: [],
  topologyState: {
    devices: [],
    connections: [],
    availableSlots: [],
  },
  configState: {
    routerConfig: null,
    pcConfigs: {},
    firewallRules: [],
  },
  dialogueQueue: [],
  flags: {},
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // Phase management
  setPhase: (phase) => set({ phase }),

  advanceToNextPhase: () => {
    const currentIndex = PHASE_ORDER.indexOf(get().phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      set({ phase: PHASE_ORDER[currentIndex + 1] });
    }
  },

  // Budget management
  setBudget: (amount) => set({ budget: amount }),

  spendBudget: (amount) => {
    const { budget } = get();
    if (budget >= amount) {
      set({ budget: budget - amount });
      return true;
    }
    return false;
  },

  addBudget: (amount) => set((state) => ({ budget: state.budget + amount })),

  // Inventory management
  addToInventory: (item, quantity = 1) => {
    set((state) => {
      const existingItem = state.inventory.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          inventory: state.inventory.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      const newItem: InventoryItem = {
        ...item,
        instanceId: `${item.id}-${Date.now()}`,
        quantity,
      };
      return { inventory: [...state.inventory, newItem] };
    });
  },

  removeFromInventory: (instanceId, quantity = 1) => {
    set((state) => {
      const item = state.inventory.find((i) => i.instanceId === instanceId);
      if (!item) return state;

      if (item.quantity <= quantity) {
        return { inventory: state.inventory.filter((i) => i.instanceId !== instanceId) };
      }
      return {
        inventory: state.inventory.map((i) =>
          i.instanceId === instanceId ? { ...i, quantity: i.quantity - quantity } : i
        ),
      };
    });
  },

  clearInventory: () => set({ inventory: [] }),

  // Topology management
  placeDevice: (device) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        devices: [...state.topologyState.devices, device],
      },
    }));
  },

  removeDevice: (deviceId) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        devices: state.topologyState.devices.filter((d) => d.id !== deviceId),
        connections: state.topologyState.connections.filter(
          (c) => c.fromDeviceId !== deviceId && c.toDeviceId !== deviceId
        ),
      },
    }));
  },

  addConnection: (connection) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        connections: [...state.topologyState.connections, connection],
      },
    }));
  },

  removeConnection: (connectionId) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        connections: state.topologyState.connections.filter((c) => c.id !== connectionId),
      },
    }));
  },

  updateConnectionStatus: (connectionId, status, error) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        connections: state.topologyState.connections.map((c) =>
          c.id === connectionId ? { ...c, status, errorMessage: error } : c
        ),
      },
    }));
  },

  setSlots: (slots) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        availableSlots: slots,
      },
    }));
  },

  markSlotOccupied: (slotId, occupied) => {
    set((state) => ({
      topologyState: {
        ...state.topologyState,
        availableSlots: state.topologyState.availableSlots.map((s) =>
          s.id === slotId ? { ...s, occupied } : s
        ),
      },
    }));
  },

  // Configuration management
  setRouterConfig: (config) => {
    set((state) => ({
      configState: {
        ...state.configState,
        routerConfig: config,
      },
    }));
  },

  setPCConfig: (deviceId, config) => {
    set((state) => ({
      configState: {
        ...state.configState,
        pcConfigs: {
          ...state.configState.pcConfigs,
          [deviceId]: config,
        },
      },
    }));
  },

  setFirewallRules: (rules) => {
    set((state) => ({
      configState: {
        ...state.configState,
        firewallRules: rules,
      },
    }));
  },

  // Dialogue management
  addDialogue: (lines) => {
    set((state) => ({
      dialogueQueue: [...state.dialogueQueue, ...lines],
    }));
  },

  advanceDialogue: () => {
    const { dialogueQueue } = get();
    if (dialogueQueue.length === 0) return null;

    const [current, ...rest] = dialogueQueue;
    set({ dialogueQueue: rest });
    return current;
  },

  clearDialogue: () => set({ dialogueQueue: [] }),

  // Flags management
  setFlag: (key, value) => {
    set((state) => ({
      flags: { ...state.flags, [key]: value },
    }));
  },

  getFlag: (key) => get().flags[key] ?? false,

  // Mission management
  setSubMission: (subMission) => set({ currentSubMission: subMission }),

  // Game reset
  resetGame: () => set(initialState),

  resetForSubMission: (subMission, budget) => {
    set({
      ...initialState,
      currentSubMission: subMission,
      budget,
      phase: 'intro',
    });
  },
}));
