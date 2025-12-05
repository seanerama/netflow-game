import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useGameStore, useDevices } from '../../store/gameStore';
import { v4 as uuidv4 } from 'uuid';
import type { Connection, NetworkInterface, RouterConfig } from '../../types';
import { Trash2, Link, Settings, Network, Globe, AlertTriangle } from 'lucide-react';

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

// Check if this is an ISP connection (router connecting to internet)
const isISPConnection = (
  fromDevice: { type: string; id: string },
  toDevice: { type: string; id: string }
) => {
  const isRouterToServer =
    (fromDevice.type === 'router' && toDevice.type === 'server') ||
    (fromDevice.type === 'server' && toDevice.type === 'router');
  const involvesInternet = fromDevice.id === 'internet' || toDevice.id === 'internet';
  return isRouterToServer && involvesInternet;
};

// Connection Modal - for connecting two devices
const ConnectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  fromDeviceId: string;
  toDeviceId: string;
}> = ({ isOpen, onClose, fromDeviceId, toDeviceId }) => {
  const devices = useDevices();
  const { addConnection, updateTopology, setInternetGateway, addToast } = useGameStore();

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

  // Check if this is a special ISP connection
  const isISP = isISPConnection(fromDevice, toDevice);
  const routerDevice = fromDevice.type === 'router' ? fromDevice : toDevice.type === 'router' ? toDevice : null;
  const ispDevice = fromDevice.id === 'internet' ? fromDevice : toDevice.id === 'internet' ? toDevice : null;

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
    const { updateDevice, setDeviceStatus } = useGameStore.getState();

    // For ISP connection, configure the router's WAN interface with public IP and set NAT
    if (isISP && routerDevice && ispDevice) {
      const ispInterface = ispDevice.interfaces.find((i) => i.id === (fromDevice.id === 'internet' ? fromInterface : toInterface));
      const routerInterfaceId = fromDevice.type === 'router' ? fromInterface : toInterface;

      // Get the public IP from ISP
      const publicIP = ispInterface?.ipAddress;

      // Update router's WAN interface with public IP and gateway
      updateDevice(routerDevice.id, {
        interfaces: routerDevice.interfaces.map((iface) =>
          iface.id === routerInterfaceId
            ? {
                ...iface,
                connectedTo: fromDevice.type === 'router' ? toInterface : fromInterface,
                isUp: true,
                ipAddress: publicIP, // Gets public IP from ISP
                subnetMask: { octets: [255, 255, 255, 0] as [number, number, number, number] },
                gateway: publicIP, // ISP is the gateway
              }
            : iface
        ),
        config: {
          ...routerDevice.config,
          nat: {
            ...(routerDevice.config as RouterConfig).nat,
            enabled: true,
            outsideInterface: routerInterfaceId,
          },
        } as RouterConfig,
      });

      // Set this router as the internet gateway
      setInternetGateway(routerDevice.id);

      // Bring the router online
      setDeviceStatus(routerDevice.id, 'online');

      // Update ISP interface
      updateDevice(ispDevice.id, {
        interfaces: ispDevice.interfaces.map((iface) =>
          iface.id === (fromDevice.id === 'internet' ? fromInterface : toInterface)
            ? { ...iface, connectedTo: routerInterfaceId, isUp: true }
            : iface
        ),
      });

      // Show notification about NAT setup
      addToast({
        type: 'success',
        message: `Router connected to ISP! NAT enabled. Public IP: ${publicIP?.octets.join('.')}`,
      });
    } else {
      // Normal connection
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
    }

    updateTopology();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Devices" size="md">
      <div className="space-y-4">
        {/* ISP Connection Warning/Info */}
        {isISP && (
          <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg flex items-start gap-2">
            <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-300 font-medium">Internet Connection</p>
              <p className="text-gray-400 text-xs mt-1">
                This will configure NAT on the router and assign a public IP address.
                The router will become your network's gateway to the internet.
              </p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400">
          Select which ports to connect between these devices.
        </p>

        {/* From Device */}
        <div className="p-3 bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{fromDevice.name}</span>
            {fromDevice.id === 'internet' && (
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">ISP</span>
            )}
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
                {iface.ipAddress && ` - ${iface.ipAddress.octets.join('.')}`}
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
            {toDevice.id === 'internet' && (
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">ISP</span>
            )}
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
                {iface.ipAddress && ` - ${iface.ipAddress.octets.join('.')}`}
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
            {isISP ? 'Connect to Internet' : 'Connect'}
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

  // Check if this is the ISP (can't delete or modify much)
  const isISP = device.id === 'internet';

  const handleDelete = () => {
    if (isISP) return;
    if (confirm(`Delete ${device.name}? This cannot be undone.`)) {
      removeDevice(device.id);
      onClose();
    }
  };

  const handleToggleStatus = () => {
    if (isISP) return;
    setDeviceStatus(device.id, device.status === 'online' ? 'offline' : 'online');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure: ${device.name}`} size="lg">
      {/* ISP Warning */}
      {isISP && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-yellow-300 font-medium">Internet Service Provider</p>
            <p className="text-gray-400 text-xs mt-1">
              This is your ISP connection. It cannot be deleted or modified.
              Connect your router's WAN port here to get internet access.
            </p>
          </div>
        </div>
      )}

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
                disabled={isISP}
                className={`w-full p-2 rounded text-sm ${
                  device.status === 'online'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-gray-900 text-gray-400'
                } ${isISP ? 'cursor-not-allowed' : ''}`}
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
              disabled={isISP}
              className={`w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-sm ${
                isISP ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Delete button */}
          {!isISP && (
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/30 rounded-lg text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Device
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'interfaces' && (
        <div className="space-y-3">
          {device.interfaces.map((iface) => (
            <InterfaceConfig
              key={iface.id}
              iface={iface}
              deviceId={device.id}
              deviceType={device.type}
              isISP={isISP}
            />
          ))}
        </div>
      )}
    </Modal>
  );
};

// Common subnet masks with CIDR notation
const COMMON_SUBNETS = [
  { label: '/24 (255.255.255.0) - 254 hosts', octets: [255, 255, 255, 0] },
  { label: '/25 (255.255.255.128) - 126 hosts', octets: [255, 255, 255, 128] },
  { label: '/26 (255.255.255.192) - 62 hosts', octets: [255, 255, 255, 192] },
  { label: '/27 (255.255.255.224) - 30 hosts', octets: [255, 255, 255, 224] },
  { label: '/28 (255.255.255.240) - 14 hosts', octets: [255, 255, 255, 240] },
  { label: '/16 (255.255.0.0) - 65534 hosts', octets: [255, 255, 0, 0] },
];

// Interface Configuration Component
const InterfaceConfig: React.FC<{
  iface: NetworkInterface;
  deviceId: string;
  deviceType: string;
  isISP?: boolean;
}> = ({ iface, deviceId, deviceType, isISP }) => {
  const { updateDevice } = useGameStore();
  const devices = useDevices();
  const device = devices[deviceId];

  // Don't show IP config for hubs (Layer 1 devices)
  const showIPConfig = deviceType !== 'hub';

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

  const [subnetOctets, setSubnetOctets] = useState<[string, string, string, string]>(
    iface.subnetMask
      ? [
          String(iface.subnetMask.octets[0]),
          String(iface.subnetMask.octets[1]),
          String(iface.subnetMask.octets[2]),
          String(iface.subnetMask.octets[3]),
        ]
      : ['255', '255', '255', '0'] // Default /24
  );

  const [gatewayOctets, setGatewayOctets] = useState<[string, string, string, string]>(
    iface.gateway
      ? [
          String(iface.gateway.octets[0]),
          String(iface.gateway.octets[1]),
          String(iface.gateway.octets[2]),
          String(iface.gateway.octets[3]),
        ]
      : ['', '', '', '']
  );

  // Update interface in store
  const updateInterface = (updates: Partial<NetworkInterface>) => {
    const newInterfaces = device.interfaces.map((i) =>
      i.id === iface.id ? { ...i, ...updates } : i
    );
    updateDevice(deviceId, { interfaces: newInterfaces });
  };

  const handleIpChange = (index: number, value: string) => {
    const newOctets = [...ipOctets] as [string, string, string, string];
    newOctets[index] = value;
    setIpOctets(newOctets);

    const parsed = newOctets.map((o) => parseInt(o, 10));
    if (parsed.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
      updateInterface({
        ipAddress: { octets: parsed as [number, number, number, number] },
      });
    }
  };

  const handleSubnetChange = (index: number, value: string) => {
    const newOctets = [...subnetOctets] as [string, string, string, string];
    newOctets[index] = value;
    setSubnetOctets(newOctets);

    const parsed = newOctets.map((o) => parseInt(o, 10));
    if (parsed.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
      updateInterface({
        subnetMask: { octets: parsed as [number, number, number, number] },
      });
    }
  };

  const handleSubnetPreset = (octets: number[]) => {
    const stringOctets = octets.map(String) as [string, string, string, string];
    setSubnetOctets(stringOctets);
    updateInterface({
      subnetMask: { octets: octets as [number, number, number, number] },
    });
  };

  const handleGatewayChange = (index: number, value: string) => {
    const newOctets = [...gatewayOctets] as [string, string, string, string];
    newOctets[index] = value;
    setGatewayOctets(newOctets);

    const parsed = newOctets.map((o) => parseInt(o, 10));
    if (parsed.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
      updateInterface({
        gateway: { octets: parsed as [number, number, number, number] },
      });
    } else if (newOctets.every((o) => o === '')) {
      updateInterface({ gateway: undefined });
    }
  };

  const handleClearIp = () => {
    setIpOctets(['', '', '', '']);
    setGatewayOctets(['', '', '', '']);
    updateInterface({ ipAddress: undefined, gateway: undefined });
  };

  // Find what this interface is connected to
  const getConnectedDeviceName = () => {
    if (!iface.connectedTo) return null;
    for (const dev of Object.values(devices)) {
      for (const intf of dev.interfaces) {
        if (intf.id === iface.connectedTo) {
          return `${dev.name} (${intf.name})`;
        }
      }
    }
    return 'Unknown';
  };

  const connectedTo = getConnectedDeviceName();

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
      {connectedTo && (
        <div className="text-xs text-blue-400 mb-3 flex items-center gap-1">
          <Link className="w-3 h-3" />
          Connected to: {connectedTo}
        </div>
      )}

      {/* IP Configuration - not for hubs */}
      {showIPConfig ? (
        <div className="space-y-3">
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
                    disabled={isISP}
                    className={`w-12 p-1.5 bg-gray-700 border border-gray-600 rounded text-center text-sm ${
                      isISP ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  {i < 3 && <span className="text-gray-500">.</span>}
                </React.Fragment>
              ))}
              {!isISP && (
                <button
                  onClick={handleClearIp}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-300"
                  title="Clear IP"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Subnet Mask */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Subnet Mask</label>
            <div className="flex items-center gap-1 mb-2">
              {subnetOctets.map((octet, i) => (
                <React.Fragment key={i}>
                  <input
                    type="text"
                    value={octet}
                    onChange={(e) => handleSubnetChange(i, e.target.value)}
                    placeholder="255"
                    maxLength={3}
                    disabled={isISP}
                    className={`w-12 p-1.5 bg-gray-700 border border-gray-600 rounded text-center text-sm ${
                      isISP ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  {i < 3 && <span className="text-gray-500">.</span>}
                </React.Fragment>
              ))}
            </div>
            {!isISP && (
              <div className="flex flex-wrap gap-1">
                {COMMON_SUBNETS.slice(0, 4).map((subnet) => (
                  <button
                    key={subnet.label}
                    onClick={() => handleSubnetPreset(subnet.octets)}
                    className="text-xs px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    /{subnet.octets[3] === 0 ? '24' : subnet.octets[3] === 128 ? '25' : subnet.octets[3] === 192 ? '26' : '27'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Default Gateway - show for computers and devices that need it */}
          {(deviceType === 'computer' || deviceType === 'server') && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Default Gateway</label>
              <div className="flex items-center gap-1">
                {gatewayOctets.map((octet, i) => (
                  <React.Fragment key={i}>
                    <input
                      type="text"
                      value={octet}
                      onChange={(e) => handleGatewayChange(i, e.target.value)}
                      placeholder="0"
                      maxLength={3}
                      className="w-12 p-1.5 bg-gray-700 border border-gray-600 rounded text-center text-sm"
                    />
                    {i < 3 && <span className="text-gray-500">.</span>}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usually your router's LAN IP (e.g., 192.168.1.1)
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-500 italic">
          Layer 1 device - no IP configuration needed
        </div>
      )}
    </div>
  );
};
