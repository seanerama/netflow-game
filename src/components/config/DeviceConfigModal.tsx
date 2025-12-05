import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore, useDevices } from '../../store/gameStore';
import { v4 as uuidv4 } from 'uuid';
import type { Connection, NetworkInterface } from '../../types';
import { Trash2, Link, Settings, Network } from 'lucide-react';

interface DeviceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalData?: {
    deviceId?: string;
    mode?: 'connect';
    fromDevice?: string;
    toDevice?: string;
  };
}

export const DeviceConfigModal: React.FC<DeviceConfigModalProps> = ({
  isOpen,
  onClose,
  modalData,
}) => {
  // If we're in connect mode, show the connection interface
  if (modalData?.mode === 'connect') {
    return (
      <ConnectionModal
        isOpen={isOpen}
        onClose={onClose}
        fromDeviceId={modalData.fromDevice!}
        toDeviceId={modalData.toDevice!}
      />
    );
  }

  // Otherwise show device config
  return (
    <DeviceSettingsModal
      isOpen={isOpen}
      onClose={onClose}
      deviceId={modalData?.deviceId}
    />
  );
};

// Connection Modal - for connecting two devices
const ConnectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  fromDeviceId: string;
  toDeviceId: string;
}> = ({ isOpen, onClose, fromDeviceId, toDeviceId }) => {
  const devices = useDevices();
  const { addConnection, updateTopology } = useGameStore();

  const fromDevice = devices[fromDeviceId];
  const toDevice = devices[toDeviceId];

  const [fromInterface, setFromInterface] = useState<string>('');
  const [toInterface, setToInterface] = useState<string>('');

  if (!fromDevice || !toDevice) {
    return null;
  }

  // Get available (unconnected) interfaces
  const getAvailableInterfaces = (device: typeof fromDevice) => {
    return device.interfaces.filter((iface) => !iface.connectedTo);
  };

  const fromAvailable = getAvailableInterfaces(fromDevice);
  const toAvailable = getAvailableInterfaces(toDevice);

  const handleConnect = () => {
    if (!fromInterface || !toInterface) return;

    const connection: Connection = {
      id: uuidv4(),
      type: 'ethernet',
      fromDevice: fromDeviceId,
      fromInterface,
      toDevice: toDeviceId,
      toInterface,
      bandwidth: 1000,
      latency: 1,
      packetLoss: 0,
      status: 'connected',
    };

    addConnection(connection);

    // Update device interfaces to mark them as connected
    const { updateDevice } = useGameStore.getState();
    updateDevice(fromDeviceId, {
      interfaces: fromDevice.interfaces.map((iface) =>
        iface.id === fromInterface ? { ...iface, connectedTo: toInterface, isUp: true } : iface
      ),
    });
    updateDevice(toDeviceId, {
      interfaces: toDevice.interfaces.map((iface) =>
        iface.id === toInterface ? { ...iface, connectedTo: fromInterface, isUp: true } : iface
      ),
    });

    updateTopology();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Devices" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Select which ports to connect between these devices.
        </p>

        {/* From Device */}
        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{fromDevice.name}</span>
          </div>
          <select
            value={fromInterface}
            onChange={(e) => setFromInterface(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
          >
            <option value="">Select port...</option>
            {fromAvailable.map((iface) => (
              <option key={iface.id} value={iface.id}>
                {iface.name} ({iface.speed} Mbps)
              </option>
            ))}
          </select>
          {fromAvailable.length === 0 && (
            <p className="text-xs text-red-400 mt-1">No available ports</p>
          )}
        </div>

        {/* Connection indicator */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8 bg-gray-600" />
        </div>

        {/* To Device */}
        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-green-400" />
            <span className="font-medium">{toDevice.name}</span>
          </div>
          <select
            value={toInterface}
            onChange={(e) => setToInterface(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm"
          >
            <option value="">Select port...</option>
            {toAvailable.map((iface) => (
              <option key={iface.id} value={iface.id}>
                {iface.name} ({iface.speed} Mbps)
              </option>
            ))}
          </select>
          {toAvailable.length === 0 && (
            <p className="text-xs text-red-400 mt-1">No available ports</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!fromInterface || !toInterface}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50 rounded-lg text-sm"
          >
            Connect
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Device Settings Modal - for configuring a single device
const DeviceSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  deviceId?: string;
}> = ({ isOpen, onClose, deviceId }) => {
  const devices = useDevices();
  const { updateDevice, removeDevice, setDeviceStatus } = useGameStore();

  const device = deviceId ? devices[deviceId] : null;

  const [activeTab, setActiveTab] = useState<'general' | 'interfaces'>('general');

  if (!device) {
    return null;
  }

  const handleDelete = () => {
    if (confirm(`Delete ${device.name}? This cannot be undone.`)) {
      removeDevice(device.id);
      onClose();
    }
  };

  const handleToggleStatus = () => {
    setDeviceStatus(device.id, device.status === 'online' ? 'offline' : 'online');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure: ${device.name}`} size="lg">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            activeTab === 'general' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab('interfaces')}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
            activeTab === 'interfaces' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Network className="w-4 h-4" />
          Interfaces
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-4">
          {/* Device info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Type</label>
              <div className="p-2 bg-gray-900 rounded text-sm capitalize">{device.type}</div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <button
                onClick={handleToggleStatus}
                className={`w-full p-2 rounded text-sm ${
                  device.status === 'online'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-gray-900 text-gray-400'
                }`}
              >
                {device.status}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={device.name}
              onChange={(e) => updateDevice(device.id, { name: e.target.value })}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-sm"
            />
          </div>

          {/* Delete button */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/30 rounded-lg text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Device
            </button>
          </div>
        </div>
      )}

      {activeTab === 'interfaces' && (
        <div className="space-y-3">
          {device.interfaces.map((iface) => (
            <InterfaceConfig
              key={iface.id}
              iface={iface}
              deviceId={device.id}
            />
          ))}
        </div>
      )}
    </Modal>
  );
};

// Interface Configuration Component
const InterfaceConfig: React.FC<{
  iface: NetworkInterface;
  deviceId: string;
}> = ({ iface, deviceId }) => {
  const { updateDevice } = useGameStore();
  const devices = useDevices();
  const device = devices[deviceId];

  const [ipOctets, setIpOctets] = useState<[string, string, string, string]>(
    iface.ipAddress
      ? [
          String(iface.ipAddress.octets[0]),
          String(iface.ipAddress.octets[1]),
          String(iface.ipAddress.octets[2]),
          String(iface.ipAddress.octets[3]),
        ]
      : ['', '', '', '']
  );

  const handleIpChange = (index: number, value: string) => {
    const newOctets = [...ipOctets] as [string, string, string, string];
    newOctets[index] = value;
    setIpOctets(newOctets);

    // Only update if all octets are valid
    const parsed = newOctets.map((o) => parseInt(o, 10));
    if (parsed.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
      const newInterfaces = device.interfaces.map((i) =>
        i.id === iface.id
          ? {
              ...i,
              ipAddress: {
                octets: parsed as [number, number, number, number],
              },
            }
          : i
      );
      updateDevice(deviceId, { interfaces: newInterfaces });
    }
  };

  const handleClearIp = () => {
    setIpOctets(['', '', '', '']);
    const newInterfaces = device.interfaces.map((i) =>
      i.id === iface.id ? { ...i, ipAddress: undefined } : i
    );
    updateDevice(deviceId, { interfaces: newInterfaces });
  };

  return (
    <div className="p-3 bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{iface.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{iface.speed} Mbps</span>
          <span
            className={`w-2 h-2 rounded-full ${
              iface.isUp ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Connection status */}
      {iface.connectedTo && (
        <div className="text-xs text-blue-400 mb-2">
          Connected
        </div>
      )}

      {/* IP Address */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">IP Address</label>
        <div className="flex items-center gap-1">
          {ipOctets.map((octet, i) => (
            <React.Fragment key={i}>
              <input
                type="text"
                value={octet}
                onChange={(e) => handleIpChange(i, e.target.value)}
                placeholder="0"
                maxLength={3}
                className="w-12 p-1.5 bg-gray-700 border border-gray-600 rounded text-center text-sm"
              />
              {i < 3 && <span className="text-gray-500">.</span>}
            </React.Fragment>
          ))}
          <button
            onClick={handleClearIp}
            className="ml-2 p-1 text-gray-500 hover:text-gray-300"
            title="Clear IP"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use 192.168.1.x for private network
        </p>
      </div>
    </div>
  );
};
