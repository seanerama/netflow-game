import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DevicePlaceholder, PixelButton, PixelPanel, StatusBox } from '../ui';
import { topologyErrors } from '../../data/mission1-1';
import type { PlacedDevice, Connection, InventoryItem, Port, DeviceType } from '../../types';

// Layout positions for Mission 1.1 - spread out for better port access
const OFFICE_LAYOUT = {
  t1Demarc: { x: 60, y: 60, label: 'T1 Demarc' },
  routerSlot: { x: 250, y: 60, label: 'Router' },
  hubSlot: { x: 500, y: 60, label: 'Hub' },
  pcSlots: [
    { x: 120, y: 280, label: "Bubba's PC", name: "bubba-pc" },
    { x: 300, y: 280, label: "Earl's PC", name: "earl-pc" },
    { x: 480, y: 280, label: "Darlene's PC", name: "darlene-pc" },
    { x: 660, y: 280, label: "Accountant PC", name: "accountant-pc" },
  ],
};

function createDevicePorts(type: DeviceType, equipmentItem?: InventoryItem): Port[] {
  switch (type) {
    case 't1-demarc':
      return [{ id: 'eth', type: 'network', label: 'Ethernet' }];
    case 'router':
      const lanPorts = equipmentItem?.lanPorts ?? 4;
      return [
        { id: 'wan', type: 'wan', label: 'WAN' },
        ...Array.from({ length: lanPorts }, (_, i) => ({
          id: `lan${i + 1}`,
          type: 'lan' as const,
          label: `LAN ${i + 1}`,
        })),
      ];
    case 'hub':
    case 'switch':
      const ports = equipmentItem?.ports ?? 8;
      return Array.from({ length: ports }, (_, i) => ({
        id: `port${i + 1}`,
        type: 'network' as const,
        label: `Port ${i + 1}`,
      }));
    case 'pc':
      return [{ id: 'eth', type: 'network', label: 'Ethernet' }];
    default:
      return [];
  }
}

export function TopologyBuilder() {
  const inventory = useGameStore((state) => state.inventory);
  const topologyState = useGameStore((state) => state.topologyState);
  const placeDevice = useGameStore((state) => state.placeDevice);
  useGameStore((state) => state.removeDevice);
  const addConnection = useGameStore((state) => state.addConnection);
  const removeConnection = useGameStore((state) => state.removeConnection);
  const setPhase = useGameStore((state) => state.setPhase);

  const [, setSelectedDevice] = useState<string | null>(null);
  const [selectedPort, setSelectedPort] = useState<{ deviceId: string; portId: string } | null>(null);
  const [connectionError, setConnectionError] = useState<{ title: string; explanation: string; analogy?: string } | null>(null);

  const { devices, connections } = topologyState;

  // Initialize T1 demarc as a fixed device
  const t1Device: PlacedDevice = {
    id: 't1-demarc',
    type: 't1-demarc',
    name: 'T1 Demarc',
    x: OFFICE_LAYOUT.t1Demarc.x,
    y: OFFICE_LAYOUT.t1Demarc.y,
    ports: createDevicePorts('t1-demarc'),
    configured: true,
  };

  const placedRouter = devices.find((d) => d.type === 'router');
  const placedHub = devices.find((d) => d.type === 'hub' || d.type === 'switch');
  const placedPCs = devices.filter((d) => d.type === 'pc');

  // Get available inventory items that haven't been placed
  const availableRouters = inventory.filter((i) => i.category === 'router' && !devices.some((d) => d.equipmentId === i.instanceId));
  const availableHubs = inventory.filter((i) => (i.category === 'hub' || i.category === 'switch') && !devices.some((d) => d.equipmentId === i.instanceId));
  const availableCables = inventory.filter((i) => i.category === 'cable');

  // Check if device is connected
  const isDeviceConnected = (deviceId: string) => {
    return connections.some((c) => c.fromDeviceId === deviceId || c.toDeviceId === deviceId);
  };

  // Get port connection status
  const getPortConnection = (deviceId: string, portId: string) => {
    return connections.find(
      (c) =>
        (c.fromDeviceId === deviceId && c.fromPortId === portId) ||
        (c.toDeviceId === deviceId && c.toPortId === portId)
    );
  };

  const handlePlaceDevice = (item: InventoryItem, slotType: 'router' | 'hub' | 'pc', pcIndex?: number) => {
    let position = { x: 0, y: 0 };
    let name = item.name;
    let deviceType: DeviceType = item.category as DeviceType;

    if (slotType === 'router') {
      position = OFFICE_LAYOUT.routerSlot;
    } else if (slotType === 'hub') {
      position = OFFICE_LAYOUT.hubSlot;
    } else if (slotType === 'pc' && pcIndex !== undefined) {
      const slot = OFFICE_LAYOUT.pcSlots[pcIndex];
      position = { x: slot.x, y: slot.y };
      name = slot.label;
    }

    const device: PlacedDevice = {
      id: `${deviceType}-${Date.now()}`,
      type: deviceType,
      name,
      x: position.x,
      y: position.y,
      ports: createDevicePorts(deviceType, item),
      equipmentId: item.instanceId,
    };

    placeDevice(device);
  };

  const validateConnection = (
    fromDevice: PlacedDevice | typeof t1Device,
    fromPort: Port,
    toDevice: PlacedDevice | typeof t1Device,
    toPort: Port
  ): { valid: boolean; error?: typeof topologyErrors[keyof typeof topologyErrors] } => {
    // PC directly to T1
    if (
      (fromDevice.type === 'pc' && toDevice.type === 't1-demarc') ||
      (fromDevice.type === 't1-demarc' && toDevice.type === 'pc')
    ) {
      return { valid: false, error: topologyErrors.pcDirectToT1 };
    }

    // Router WAN to Hub
    if (
      (fromDevice.type === 'router' && fromPort.type === 'wan' && (toDevice.type === 'hub' || toDevice.type === 'switch')) ||
      ((fromDevice.type === 'hub' || fromDevice.type === 'switch') && toDevice.type === 'router' && toPort.type === 'wan')
    ) {
      return { valid: false, error: topologyErrors.routerWanToHub };
    }

    // T1 must connect to router WAN
    if (fromDevice.type === 't1-demarc' || toDevice.type === 't1-demarc') {
      const router = fromDevice.type === 'router' ? fromDevice : toDevice;
      const routerPort = fromDevice.type === 'router' ? fromPort : toPort;
      if (router.type !== 'router' || routerPort.type !== 'wan') {
        return { valid: false, error: topologyErrors.pcDirectToT1 };
      }
    }

    return { valid: true };
  };

  const handlePortClick = (device: PlacedDevice | typeof t1Device, port: Port) => {
    // Check if port is already connected
    const existingConnection = getPortConnection(device.id, port.id);
    if (existingConnection) {
      // Remove existing connection
      removeConnection(existingConnection.id);
      return;
    }

    if (!selectedPort) {
      // First port selection
      setSelectedDevice(device.id);
      setSelectedPort({ deviceId: device.id, portId: port.id });
    } else if (selectedPort.deviceId === device.id) {
      // Clicked same device, deselect
      setSelectedPort(null);
      setSelectedDevice(null);
    } else {
      // Second port selection - create connection
      const fromDevice = [t1Device, ...devices].find((d) => d.id === selectedPort.deviceId);
      const toDevice = device;

      if (!fromDevice) {
        setSelectedPort(null);
        setSelectedDevice(null);
        return;
      }

      const fromPort = fromDevice.ports.find((p) => p.id === selectedPort.portId);
      if (!fromPort) {
        setSelectedPort(null);
        setSelectedDevice(null);
        return;
      }

      const validation = validateConnection(fromDevice, fromPort, toDevice, port);

      if (!validation.valid && validation.error) {
        setConnectionError(validation.error);
        setSelectedPort(null);
        setSelectedDevice(null);
        return;
      }

      // Find a cable from inventory
      const cable = availableCables[0];
      if (!cable) {
        setConnectionError({
          title: 'No Cables!',
          explanation: 'You need cables to connect devices!',
        });
        setSelectedPort(null);
        setSelectedDevice(null);
        return;
      }

      const connection: Connection = {
        id: `conn-${Date.now()}`,
        fromDeviceId: selectedPort.deviceId,
        fromPortId: selectedPort.portId,
        toDeviceId: device.id,
        toPortId: port.id,
        cableId: cable.instanceId,
        status: 'valid',
      };

      addConnection(connection);
      setSelectedPort(null);
      setSelectedDevice(null);
    }
  };

  const isTopologyComplete = () => {
    // Must have router connected to T1
    const t1ToRouter = connections.find(
      (c) =>
        (c.fromDeviceId === 't1-demarc' && devices.find((d) => d.id === c.toDeviceId)?.type === 'router') ||
        (c.toDeviceId === 't1-demarc' && devices.find((d) => d.id === c.fromDeviceId)?.type === 'router')
    );
    if (!t1ToRouter) return false;

    // Must have router connected to hub
    const routerToHub = connections.find((c) => {
      const from = devices.find((d) => d.id === c.fromDeviceId);
      const to = devices.find((d) => d.id === c.toDeviceId);
      return (from?.type === 'router' && (to?.type === 'hub' || to?.type === 'switch')) ||
             ((from?.type === 'hub' || from?.type === 'switch') && to?.type === 'router');
    });
    if (!routerToHub) return false;

    // Must have all 4 PCs connected to hub
    if (placedPCs.length < 4) return false;
    const allPCsConnected = placedPCs.every((pc) => isDeviceConnected(pc.id));
    if (!allPCsConnected) return false;

    return true;
  };

  const handleProceed = () => {
    if (isTopologyComplete()) {
      setPhase('config');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pixel-panel-header">
        <h1 className="text-lg text-center">Physical Setup - Connect the Hardware</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Inventory Sidebar */}
        <div className="w-48 p-4 border-r-4 border-[var(--color-border)] overflow-y-auto">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">INVENTORY</h3>

          {inventory.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-[8px]">
              No equipment purchased
            </p>
          ) : (
            <div className="space-y-4">
              {/* Routers */}
              {availableRouters.length > 0 && !placedRouter && (
                <div>
                  <p className="text-[8px] text-[var(--color-text-secondary)] mb-2">Router</p>
                  {availableRouters.map((item) => (
                    <div
                      key={item.instanceId}
                      className="equipment-card p-2 cursor-pointer"
                      onClick={() => handlePlaceDevice(item, 'router')}
                    >
                      <DevicePlaceholder type="router" name={item.name} size="sm" />
                      <div className="text-[8px] mt-1">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hubs/Switches */}
              {availableHubs.length > 0 && !placedHub && (
                <div>
                  <p className="text-[8px] text-[var(--color-text-secondary)] mb-2">Hub/Switch</p>
                  {availableHubs.map((item) => (
                    <div
                      key={item.instanceId}
                      className="equipment-card p-2 cursor-pointer"
                      onClick={() => handlePlaceDevice(item, 'hub')}
                    >
                      <DevicePlaceholder
                        type={item.category as 'hub' | 'switch'}
                        name={item.name}
                        size="sm"
                        showPorts
                        portCount={item.ports}
                      />
                      <div className="text-[8px] mt-1">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cables */}
              <div>
                <p className="text-[8px] text-[var(--color-text-secondary)] mb-2">
                  Cables: {availableCables.reduce((sum, c) => sum + c.quantity, 0) - connections.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Topology Canvas */}
        <div className="flex-1 p-4 relative bg-[var(--color-bg-dark)]">
          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn) => {
              const fromDevice = [t1Device, ...devices].find((d) => d.id === conn.fromDeviceId);
              const toDevice = [t1Device, ...devices].find((d) => d.id === conn.toDeviceId);
              if (!fromDevice || !toDevice) return null;

              return (
                <line
                  key={conn.id}
                  x1={fromDevice.x + 40}
                  y1={fromDevice.y + 40}
                  x2={toDevice.x + 40}
                  y2={toDevice.y + 40}
                  className={`connection-line connection-${conn.status}`}
                />
              );
            })}
          </svg>

          {/* T1 Demarc (fixed) */}
          <div
            className="absolute"
            style={{ left: t1Device.x, top: t1Device.y }}
          >
            <DevicePlaceholder type="t1-demarc" name="T1 Demarc" size="lg" />
            <div className="text-[8px] text-center mt-1 text-[var(--color-accent-orange)]">
              T1 Demarc
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <button
                className={`px-3 py-1.5 text-[8px] font-bold border-2 rounded ${
                  selectedPort?.deviceId === 't1-demarc'
                    ? 'bg-[var(--color-accent-blue)] border-[var(--color-accent-blue)] text-white'
                    : getPortConnection('t1-demarc', 'eth')
                    ? 'bg-[var(--color-accent-green)] border-[var(--color-accent-green)] text-white'
                    : 'bg-[var(--color-bg-medium)] border-[var(--color-border)] hover:border-[var(--color-accent-blue)]'
                }`}
                onClick={() => handlePortClick(t1Device, t1Device.ports[0])}
              >
                ETH
              </button>
            </div>
          </div>

          {/* Router Slot */}
          <div
            className="absolute"
            style={{ left: OFFICE_LAYOUT.routerSlot.x, top: OFFICE_LAYOUT.routerSlot.y }}
          >
            {placedRouter ? (
              <>
                <DevicePlaceholder type="router" name={placedRouter.name} size="lg" />
                <div className="text-[8px] text-center mt-1">Router</div>
                <div className="flex gap-2 justify-center mt-3">
                  {placedRouter.ports.map((port) => (
                    <button
                      key={port.id}
                      className={`px-2 py-1 text-[8px] font-bold border-2 rounded ${
                        selectedPort?.deviceId === placedRouter.id && selectedPort?.portId === port.id
                          ? 'bg-[var(--color-accent-blue)] border-[var(--color-accent-blue)] text-white'
                          : getPortConnection(placedRouter.id, port.id)
                          ? 'bg-[var(--color-accent-green)] border-[var(--color-accent-green)] text-white'
                          : 'bg-[var(--color-bg-medium)] border-[var(--color-border)] hover:border-[var(--color-accent-blue)]'
                      }`}
                      onClick={() => handlePortClick(placedRouter, port)}
                      title={port.label}
                    >
                      {port.type === 'wan' ? 'WAN' : port.label.replace('LAN ', 'L')}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div
                className={`w-24 h-24 border-4 border-dashed flex items-center justify-center ${
                  availableRouters.length > 0
                    ? 'border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]'
                    : 'border-[var(--color-text-muted)] text-[var(--color-text-muted)]'
                }`}
              >
                <span className="text-[8px]">Router</span>
              </div>
            )}
          </div>

          {/* Hub Slot */}
          <div
            className="absolute"
            style={{ left: OFFICE_LAYOUT.hubSlot.x, top: OFFICE_LAYOUT.hubSlot.y }}
          >
            {placedHub ? (
              <>
                <DevicePlaceholder
                  type={placedHub.type as 'hub' | 'switch'}
                  name={placedHub.name}
                  size="lg"
                  showPorts
                  portCount={placedHub.ports.length}
                />
                <div className="text-[8px] text-center mt-1">Hub</div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {placedHub.ports.slice(0, 8).map((port) => (
                    <button
                      key={port.id}
                      className={`w-7 h-7 text-[8px] font-bold border-2 rounded ${
                        selectedPort?.deviceId === placedHub.id && selectedPort?.portId === port.id
                          ? 'bg-[var(--color-accent-blue)] border-[var(--color-accent-blue)] text-white'
                          : getPortConnection(placedHub.id, port.id)
                          ? 'bg-[var(--color-accent-green)] border-[var(--color-accent-green)] text-white'
                          : 'bg-[var(--color-bg-medium)] border-[var(--color-border)] hover:border-[var(--color-accent-blue)]'
                      }`}
                      onClick={() => handlePortClick(placedHub, port)}
                      title={port.label}
                    >
                      {port.id.replace('port', '')}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div
                className={`w-24 h-24 border-4 border-dashed flex items-center justify-center ${
                  availableHubs.length > 0
                    ? 'border-[var(--color-hub)] text-[var(--color-hub)]'
                    : 'border-[var(--color-text-muted)] text-[var(--color-text-muted)]'
                }`}
              >
                <span className="text-[8px]">Hub</span>
              </div>
            )}
          </div>

          {/* PC Slots */}
          {OFFICE_LAYOUT.pcSlots.map((slot) => {
            const placedPC = placedPCs.find((pc) => pc.x === slot.x && pc.y === slot.y);

            return (
              <div
                key={slot.name}
                className="absolute"
                style={{ left: slot.x, top: slot.y }}
              >
                {/* PCs are always present, just need connecting */}
                <DevicePlaceholder type="pc" name={slot.label} size="md" />
                <div className="text-[8px] text-center mt-1">{slot.label}</div>
                {placedPC ? (
                  <div className="flex justify-center mt-2">
                    <button
                      className={`px-3 py-1.5 text-[8px] font-bold border-2 rounded ${
                        selectedPort?.deviceId === placedPC.id
                          ? 'bg-[var(--color-accent-blue)] border-[var(--color-accent-blue)] text-white'
                          : getPortConnection(placedPC.id, 'eth')
                          ? 'bg-[var(--color-accent-green)] border-[var(--color-accent-green)] text-white'
                          : 'bg-[var(--color-bg-medium)] border-[var(--color-border)] hover:border-[var(--color-accent-blue)]'
                      }`}
                      onClick={() => handlePortClick(placedPC, placedPC.ports[0])}
                    >
                      ETH
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-1 text-[6px] text-[var(--color-accent-blue)] underline"
                    onClick={() => {
                      const pc: PlacedDevice = {
                        id: `pc-${slot.name}`,
                        type: 'pc',
                        name: slot.label,
                        x: slot.x,
                        y: slot.y,
                        ports: createDevicePorts('pc'),
                      };
                      placeDevice(pc);
                    }}
                  >
                    Activate
                  </button>
                )}
              </div>
            );
          })}

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4">
            <StatusBox type="info">
              <p className="text-[8px]">
                {selectedPort
                  ? 'Now click another port to connect them'
                  : 'Click a port to start a connection, then click another port to complete it'}
              </p>
            </StatusBox>
          </div>
        </div>

        {/* Status Panel */}
        <div className="w-56 p-4 border-l-4 border-[var(--color-border)]">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">STATUS</h3>

          <div className="space-y-2 text-[8px]">
            <div className={`flex items-center gap-2 ${placedRouter ? 'text-[var(--color-accent-green)]' : ''}`}>
              <span className={`status-dot ${placedRouter ? 'status-connected' : 'status-offline'}`} />
              Router placed
            </div>
            <div className={`flex items-center gap-2 ${isDeviceConnected('t1-demarc') ? 'text-[var(--color-accent-green)]' : ''}`}>
              <span className={`status-dot ${isDeviceConnected('t1-demarc') ? 'status-connected' : 'status-offline'}`} />
              T1 → Router
            </div>
            <div className={`flex items-center gap-2 ${placedHub ? 'text-[var(--color-accent-green)]' : ''}`}>
              <span className={`status-dot ${placedHub ? 'status-connected' : 'status-offline'}`} />
              Hub/Switch placed
            </div>
            <div className={`flex items-center gap-2 ${placedRouter && placedHub && connections.some(c => (c.fromDeviceId === placedRouter?.id || c.toDeviceId === placedRouter?.id) && (c.fromDeviceId === placedHub?.id || c.toDeviceId === placedHub?.id)) ? 'text-[var(--color-accent-green)]' : ''}`}>
              <span className={`status-dot ${placedRouter && placedHub && connections.some(c => (c.fromDeviceId === placedRouter?.id || c.toDeviceId === placedRouter?.id) && (c.fromDeviceId === placedHub?.id || c.toDeviceId === placedHub?.id)) ? 'status-connected' : 'status-offline'}`} />
              Router → Hub
            </div>
            <div className={`flex items-center gap-2 ${placedPCs.length === 4 && placedPCs.every(pc => isDeviceConnected(pc.id)) ? 'text-[var(--color-accent-green)]' : ''}`}>
              <span className={`status-dot ${placedPCs.length === 4 && placedPCs.every(pc => isDeviceConnected(pc.id)) ? 'status-connected' : 'status-offline'}`} />
              All PCs connected ({placedPCs.filter(pc => isDeviceConnected(pc.id)).length}/4)
            </div>
          </div>

          <div className="mt-8">
            <PixelButton
              variant="primary"
              className="w-full"
              onClick={handleProceed}
              disabled={!isTopologyComplete()}
            >
              Continue
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Connection Error Modal */}
      {connectionError && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <PixelPanel title={connectionError.title} className="max-w-md">
            <div className="mb-4">{connectionError.explanation}</div>
            {connectionError.analogy && (
              <div className="text-[8px] text-[var(--color-text-secondary)] italic mb-4">
                {connectionError.analogy}
              </div>
            )}
            <PixelButton onClick={() => setConnectionError(null)}>Got it!</PixelButton>
          </PixelPanel>
        </div>
      )}
    </div>
  );
}
