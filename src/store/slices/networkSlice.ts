import type { StateCreator } from 'zustand';
import type {
  NetworkState,
  NetworkDevice,
  Connection,
  Packet,
} from '../../types';

export interface NetworkSlice {
  network: NetworkState;

  // Device actions
  addDevice: (device: NetworkDevice) => void;
  removeDevice: (deviceId: string) => void;
  updateDevice: (deviceId: string, updates: Partial<NetworkDevice>) => void;
  setDeviceStatus: (deviceId: string, status: NetworkDevice['status']) => void;

  // Connection actions
  addConnection: (connection: Connection) => void;
  removeConnection: (connectionId: string) => void;
  updateConnection: (connectionId: string, updates: Partial<Connection>) => void;

  // Packet actions
  addPacket: (packet: Packet) => void;
  removePacket: (packetId: string) => void;
  updatePacket: (packetId: string, updates: Partial<Packet>) => void;
  clearPackets: () => void;

  // Topology actions
  updateTopology: () => void;
  setInternetGateway: (routerId: string) => void;
}

const initialNetworkState: NetworkState = {
  devices: {},
  connections: {},
  packets: {},
  topology: {
    adjacencyList: {},
    devicesByType: {
      router: [],
      switch: [],
      hub: [],
      computer: [],
      server: [],
      firewall: [],
    },
    internetGateway: undefined,
    publicIP: undefined,
  },
};

export const createNetworkSlice: StateCreator<NetworkSlice> = (set) => ({
  network: initialNetworkState,

  addDevice: (device) =>
    set((state) => {
      const newDevices = { ...state.network.devices, [device.id]: device };
      const newDevicesByType = { ...state.network.topology.devicesByType };
      newDevicesByType[device.type] = [...newDevicesByType[device.type], device.id];

      return {
        network: {
          ...state.network,
          devices: newDevices,
          topology: {
            ...state.network.topology,
            devicesByType: newDevicesByType,
          },
        },
      };
    }),

  removeDevice: (deviceId) =>
    set((state) => {
      const device = state.network.devices[deviceId];
      if (!device) return state;

      const { [deviceId]: removed, ...remainingDevices } = state.network.devices;
      const newDevicesByType = { ...state.network.topology.devicesByType };
      newDevicesByType[device.type] = newDevicesByType[device.type].filter(
        (id) => id !== deviceId
      );

      // Remove connections involving this device
      const remainingConnections = Object.fromEntries(
        Object.entries(state.network.connections).filter(
          ([, conn]) => conn.fromDevice !== deviceId && conn.toDevice !== deviceId
        )
      );

      return {
        network: {
          ...state.network,
          devices: remainingDevices,
          connections: remainingConnections,
          topology: {
            ...state.network.topology,
            devicesByType: newDevicesByType,
          },
        },
      };
    }),

  updateDevice: (deviceId, updates) =>
    set((state) => {
      const device = state.network.devices[deviceId];
      if (!device) return state;

      return {
        network: {
          ...state.network,
          devices: {
            ...state.network.devices,
            [deviceId]: { ...device, ...updates },
          },
        },
      };
    }),

  setDeviceStatus: (deviceId, status) =>
    set((state) => {
      const device = state.network.devices[deviceId];
      if (!device) return state;

      return {
        network: {
          ...state.network,
          devices: {
            ...state.network.devices,
            [deviceId]: { ...device, status },
          },
        },
      };
    }),

  addConnection: (connection) =>
    set((state) => ({
      network: {
        ...state.network,
        connections: {
          ...state.network.connections,
          [connection.id]: connection,
        },
      },
    })),

  removeConnection: (connectionId) =>
    set((state) => {
      const { [connectionId]: removed, ...remainingConnections } =
        state.network.connections;
      return {
        network: {
          ...state.network,
          connections: remainingConnections,
        },
      };
    }),

  updateConnection: (connectionId, updates) =>
    set((state) => {
      const connection = state.network.connections[connectionId];
      if (!connection) return state;

      return {
        network: {
          ...state.network,
          connections: {
            ...state.network.connections,
            [connectionId]: { ...connection, ...updates },
          },
        },
      };
    }),

  addPacket: (packet) =>
    set((state) => ({
      network: {
        ...state.network,
        packets: {
          ...state.network.packets,
          [packet.id]: packet,
        },
      },
    })),

  removePacket: (packetId) =>
    set((state) => {
      const { [packetId]: removed, ...remainingPackets } = state.network.packets;
      return {
        network: {
          ...state.network,
          packets: remainingPackets,
        },
      };
    }),

  updatePacket: (packetId, updates) =>
    set((state) => {
      const packet = state.network.packets[packetId];
      if (!packet) return state;

      return {
        network: {
          ...state.network,
          packets: {
            ...state.network.packets,
            [packetId]: { ...packet, ...updates },
          },
        },
      };
    }),

  clearPackets: () =>
    set((state) => ({
      network: {
        ...state.network,
        packets: {},
      },
    })),

  updateTopology: () =>
    set((state) => {
      const adjacencyList: Record<string, string[]> = {};

      // Build adjacency list from connections
      Object.values(state.network.connections).forEach((conn) => {
        if (conn.status === 'connected') {
          if (!adjacencyList[conn.fromDevice]) {
            adjacencyList[conn.fromDevice] = [];
          }
          if (!adjacencyList[conn.toDevice]) {
            adjacencyList[conn.toDevice] = [];
          }
          adjacencyList[conn.fromDevice].push(conn.toDevice);
          adjacencyList[conn.toDevice].push(conn.fromDevice);
        }
      });

      return {
        network: {
          ...state.network,
          topology: {
            ...state.network.topology,
            adjacencyList,
          },
        },
      };
    }),

  setInternetGateway: (routerId) =>
    set((state) => ({
      network: {
        ...state.network,
        topology: {
          ...state.network.topology,
          internetGateway: routerId,
        },
      },
    })),
});
