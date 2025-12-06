import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useDevices, useConnections, useUIState } from '../../store/gameStore';
import { VISUAL_METAPHORS } from '../../types';
import type { Position, NetworkDevice } from '../../types';
import { PacketVisualization } from '../network/PacketVisualization';
import { startPacketSimulation, stopPacketSimulation } from '../../simulation/packetEngine';
import { Trash2, X } from 'lucide-react';

// Helper to compare two IP addresses
const ipEquals = (
  ip1: { octets: number[] } | undefined,
  ip2: { octets: number[] } | undefined
): boolean => {
  if (!ip1 || !ip2) return false;
  return ip1.octets.every((octet, i) => octet === ip2.octets[i]);
};

// Calculate network address by applying subnet mask to IP
const getNetworkAddress = (
  ip: { octets: number[] },
  mask: { octets: number[] }
): number[] => {
  return ip.octets.map((octet, i) => octet & mask.octets[i]);
};

// Check if two IPs are in the same subnet
const sameSubnet = (
  ip1: { octets: number[] } | undefined,
  mask1: { octets: number[] } | undefined,
  ip2: { octets: number[] } | undefined,
  mask2: { octets: number[] } | undefined
): boolean => {
  if (!ip1 || !mask1 || !ip2 || !mask2) return false;
  if (!ipEquals(mask1, mask2)) return false;
  const net1 = getNetworkAddress(ip1, mask1);
  const net2 = getNetworkAddress(ip2, mask2);
  return net1.every((octet, i) => octet === net2[i]);
};

// Check if a device has valid network configuration relative to a router
const hasValidNetworkConfig = (device: NetworkDevice, router: NetworkDevice): boolean => {
  const deviceInterface = device.interfaces.find((i) => i.ipAddress);
  const routerInterface = router.interfaces.find((i) => i.ipAddress);

  if (!deviceInterface?.ipAddress || !deviceInterface?.subnetMask) return false;
  if (!routerInterface?.ipAddress || !routerInterface?.subnetMask) return false;

  // Gateway must match router's LAN IP
  if (!ipEquals(deviceInterface.gateway, routerInterface.ipAddress)) return false;

  // Subnet masks must match
  if (!ipEquals(deviceInterface.subnetMask, routerInterface.subnetMask)) return false;

  // Must be in same subnet
  if (!sameSubnet(
    deviceInterface.ipAddress,
    deviceInterface.subnetMask,
    routerInterface.ipAddress,
    routerInterface.subnetMask
  )) return false;

  // Must not have duplicate IP
  if (ipEquals(deviceInterface.ipAddress, routerInterface.ipAddress)) return false;

  return true;
};

// Device tooltip content based on device type and state
const getDeviceTooltip = (device: NetworkDevice, connectingFrom: string | null) => {
  const isConnectTarget = connectingFrom && connectingFrom !== device.id;

  if (isConnectTarget) {
    return 'Click to connect';
  }

  const availablePorts = device.interfaces.filter(i => !i.connectedTo).length;
  const totalPorts = device.interfaces.length;

  const lines = [
    `${device.type.charAt(0).toUpperCase() + device.type.slice(1)} - ${device.status}`,
    `Ports: ${availablePorts}/${totalPorts} available`,
    '',
    'Right-click: Connect',
    'Double-click: Configure',
  ];

  return lines;
};

export const NetworkView: React.FC = () => {
  const devices = useDevices();
  const connections = useConnections();
  const ui = useUIState();
  const { selectDevice, selectConnection, updateDevice, openModal, removeConnection } = useGameStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Connection mode state
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  // Dragging state
  const [draggingDevice, setDraggingDevice] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Hover state for tooltips
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const deviceList = Object.values(devices);
  const connectionList = Object.values(connections);

  // Compute which connections should be highlighted as "valid" (properly configured)
  const validConnectionIds = useMemo(() => {
    const validIds = new Set<string>();

    // Find the router with a configured LAN IP
    const router = deviceList.find(
      (d) => d.type === 'router' && d.interfaces.some((i) => i.ipAddress)
    );
    if (!router) return validIds;

    // Find all properly configured computers
    const configuredComputers = deviceList.filter(
      (d) => d.type === 'computer' && hasValidNetworkConfig(d, router)
    );

    // For each configured computer, trace the path to the router and mark connections as valid
    configuredComputers.forEach((computer) => {
      // Find direct connection to hub/switch or router
      connectionList.forEach((conn) => {
        const isFromComputer = conn.fromDevice === computer.id;
        const isToComputer = conn.toDevice === computer.id;

        if (isFromComputer || isToComputer) {
          const otherDeviceId = isFromComputer ? conn.toDevice : conn.fromDevice;
          const otherDevice = devices[otherDeviceId];

          if (!otherDevice) return;

          // Direct connection to router
          if (otherDevice.type === 'router') {
            validIds.add(conn.id);
          }

          // Connection to hub/switch
          if (otherDevice.type === 'hub' || otherDevice.type === 'switch') {
            validIds.add(conn.id);

            // Also mark the hub/switch to router connection as valid
            connectionList.forEach((hubConn) => {
              const isHubFrom = hubConn.fromDevice === otherDevice.id;
              const isHubTo = hubConn.toDevice === otherDevice.id;

              if (isHubFrom || isHubTo) {
                const hubOtherId = isHubFrom ? hubConn.toDevice : hubConn.fromDevice;
                const hubOther = devices[hubOtherId];

                if (hubOther?.type === 'router') {
                  validIds.add(hubConn.id);
                }
              }
            });
          }
        }
      });
    });

    return validIds;
  }, [deviceList, connectionList, devices]);

  // Start/stop packet simulation when component mounts/unmounts
  useEffect(() => {
    startPacketSimulation();
    return () => {
      stopPacketSimulation();
    };
  }, []);

  // Handle deleting the selected connection
  const handleDeleteConnection = useCallback(() => {
    if (ui.selectedConnection) {
      removeConnection(ui.selectedConnection);
      selectConnection(undefined);
    }
  }, [ui.selectedConnection, removeConnection, selectConnection]);

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && ui.selectedConnection) {
        e.preventDefault();
        handleDeleteConnection();
      }
      if (e.key === 'Escape') {
        if (connectingFrom) {
          setConnectingFrom(null);
        } else {
          selectDevice(undefined);
          selectConnection(undefined);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ui.selectedConnection, handleDeleteConnection, connectingFrom, selectDevice, selectConnection]);

  // Handle mouse move for connection line preview
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setMousePos(pos);

    // Handle device dragging
    if (draggingDevice) {
      updateDevice(draggingDevice, {
        position: {
          x: pos.x - dragOffset.x,
          y: pos.y - dragOffset.y,
        },
      });
    }
  };

  // Handle starting a connection
  const handleDeviceClick = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (connectingFrom) {
      // We're completing a connection
      if (connectingFrom !== deviceId) {
        // Open connection modal to select interfaces
        openModal('device-config', {
          mode: 'connect',
          fromDevice: connectingFrom,
          toDevice: deviceId,
        });
      }
      setConnectingFrom(null);
    } else {
      // Just selecting the device
      selectDevice(deviceId);
    }
  };

  // Handle right-click to start connection
  const handleDeviceRightClick = (deviceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConnectingFrom(deviceId);
    selectDevice(deviceId);
  };

  // Handle double-click to open config
  const handleDeviceDoubleClick = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('device-config', { deviceId });
  };

  // Handle drag start
  const handleDragStart = (deviceId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    const device = devices[deviceId];
    if (!device || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - device.position.x,
      y: e.clientY - rect.top - device.position.y,
    });
    setDraggingDevice(deviceId);
  };

  const handleDragEnd = () => {
    setDraggingDevice(null);
  };

  // Handle hover for tooltips
  const handleMouseEnter = (deviceId: string) => {
    if (draggingDevice) return;
    const timeout = setTimeout(() => setHoveredDevice(deviceId), 600);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredDevice(null);
  };

  // Cancel connection mode
  const handleCanvasClick = () => {
    if (connectingFrom) {
      setConnectingFrom(null);
    } else {
      selectDevice(undefined);
      selectConnection(undefined);
    }
  };

  // Get the connecting device for line preview
  const connectingDevice = connectingFrom ? devices[connectingFrom] : null;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full network-canvas overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onClick={handleCanvasClick}
    >
      {/* Connection mode indicator */}
      {connectingFrom && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 rounded-lg text-sm z-10">
          Click another device to connect, or click empty space to cancel
        </div>
      )}

      {/* Selected connection toolbar */}
      {ui.selectedConnection && connections[ui.selectedConnection] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
        >
          <span className="text-sm text-gray-300">
            {devices[connections[ui.selectedConnection].fromDevice]?.name || 'Device'}
            {' ↔ '}
            {devices[connections[ui.selectedConnection].toDevice]?.name || 'Device'}
          </span>
          <div className="w-px h-4 bg-gray-600" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteConnection();
            }}
            className="flex items-center gap-1 px-2 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
            title="Delete connection (Del)"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              selectConnection(undefined);
            }}
            className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Deselect (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* SVG layer for connections (pipes) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Pipe gradient - default */}
          <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
          {/* Pipe gradient - valid/configured (green glow) */}
          <linearGradient id="pipeGradientValid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          {/* Glow filter for valid connections */}
          <filter id="validGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Flow animation pattern */}
          <pattern
            id="flowPattern"
            patternUnits="userSpaceOnUse"
            width="20"
            height="10"
          >
            <rect width="20" height="10" fill="url(#pipeGradient)" />
            <circle cx="5" cy="5" r="2" fill="rgba(59, 130, 246, 0.5)">
              <animate
                attributeName="cx"
                from="-5"
                to="25"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </pattern>
        </defs>

        {/* Preview line when connecting */}
        {connectingDevice && (
          <line
            x1={connectingDevice.position.x}
            y1={connectingDevice.position.y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#3B82F6"
            strokeWidth={4}
            strokeDasharray="8 4"
            strokeLinecap="round"
            opacity={0.6}
          />
        )}

        {/* Render connections as pipes */}
        {connectionList.map((conn) => {
          const fromDevice = devices[conn.fromDevice];
          const toDevice = devices[conn.toDevice];
          if (!fromDevice || !toDevice) return null;

          const isSelected = ui.selectedConnection === conn.id;
          const isValid = validConnectionIds.has(conn.id);

          // Determine stroke color: selected > valid > default
          const strokeColor = isSelected
            ? '#3B82F6'
            : isValid
            ? '#22c55e'
            : '#4B5563';

          return (
            <g key={conn.id}>
              {/* Glow effect for valid connections */}
              {isValid && !isSelected && (
                <line
                  x1={fromDevice.position.x}
                  y1={fromDevice.position.y}
                  x2={toDevice.position.x}
                  y2={toDevice.position.y}
                  stroke="#22c55e"
                  strokeWidth={conn.bandwidth >= 1000 ? 16 : conn.bandwidth >= 100 ? 12 : 8}
                  strokeLinecap="round"
                  opacity={0.3}
                  filter="url(#validGlow)"
                  className="pointer-events-none"
                />
              )}
              {/* Pipe outer */}
              <line
                x1={fromDevice.position.x}
                y1={fromDevice.position.y}
                x2={toDevice.position.x}
                y2={toDevice.position.y}
                stroke={strokeColor}
                strokeWidth={conn.bandwidth >= 1000 ? 12 : conn.bandwidth >= 100 ? 8 : 4}
                strokeLinecap="round"
                className="cursor-pointer pointer-events-auto transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  selectConnection(conn.id);
                }}
              />
              {/* Pipe inner (flow) */}
              <line
                x1={fromDevice.position.x}
                y1={fromDevice.position.y}
                x2={toDevice.position.x}
                y2={toDevice.position.y}
                stroke="url(#flowPattern)"
                strokeWidth={conn.bandwidth >= 1000 ? 8 : conn.bandwidth >= 100 ? 5 : 2}
                strokeLinecap="round"
                className="pointer-events-none"
                style={{ opacity: ui.showDataFlow ? 1 : 0 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Packet visualization layer */}
      {ui.showDataFlow && <PacketVisualization />}

      {/* Device layer */}
      {deviceList.map((device) => {
        const isSelected = ui.selectedDevice === device.id;
        const isConnecting = connectingFrom === device.id;
        const icon = VISUAL_METAPHORS.deviceIcons[device.type] || '📦';
        const isHovered = hoveredDevice === device.id;
        const tooltip = getDeviceTooltip(device, connectingFrom);

        return (
          <motion.div
            key={device.id}
            className={`
              absolute cursor-pointer device select-none
              ${isSelected ? 'selected z-10' : ''}
              ${isConnecting ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900' : ''}
              ${device.status === 'offline' ? 'opacity-70' : ''}
              ${draggingDevice === device.id ? 'cursor-grabbing z-20' : 'cursor-grab'}
            `}
            style={{
              left: device.position.x - 40,
              top: device.position.y - 40,
            }}
            onClick={(e) => handleDeviceClick(device.id, e)}
            onContextMenu={(e) => handleDeviceRightClick(device.id, e)}
            onDoubleClick={(e) => handleDeviceDoubleClick(device.id, e)}
            onMouseDown={(e) => handleDragStart(device.id, e)}
            onMouseEnter={() => handleMouseEnter(device.id)}
            onMouseLeave={handleMouseLeave}
            whileHover={draggingDevice ? {} : { scale: 1.05 }}
            whileTap={draggingDevice ? {} : { scale: 0.95 }}
            animate={draggingDevice === device.id ? { scale: 1.1 } : {}}
          >
            <div
              className={`
                w-20 h-20 rounded-xl flex flex-col items-center justify-center
                ${
                  device.status === 'online'
                    ? 'bg-gray-700 border-2 border-green-500'
                    : device.status === 'error'
                    ? 'bg-gray-700 border-2 border-red-500'
                    : 'bg-gray-800 border-2 border-gray-600'
                }
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}
              `}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs text-gray-300 mt-1 truncate w-full text-center px-1">
                {device.name.length > 12 ? device.name.slice(0, 10) + '...' : device.name}
              </span>
            </div>

            {/* Status indicator */}
            <div
              className={`
                absolute -top-1 -right-1 w-3 h-3 rounded-full
                ${
                  device.status === 'online'
                    ? 'bg-green-500'
                    : device.status === 'error'
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-gray-500'
                }
              `}
            />

            {/* IP label */}
            {ui.showLabels && device.interfaces[0]?.ipAddress && (
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap bg-gray-900 px-1 rounded">
                {device.interfaces[0].ipAddress.octets.join('.')}
              </div>
            )}

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && !draggingDevice && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 pointer-events-none"
                >
                  <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl text-xs whitespace-nowrap">
                    {typeof tooltip === 'string' ? (
                      <span className="text-blue-300 font-medium">{tooltip}</span>
                    ) : (
                      tooltip.map((line, i) => (
                        <div key={i} className={line === '' ? 'h-1' : i >= 3 ? 'text-gray-500' : 'text-gray-300'}>
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 border-b border-r border-gray-700 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Empty state */}
      {deviceList.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">No devices yet</p>
            <p className="text-sm">Open the Shop to purchase network equipment</p>
            <p className="text-xs mt-4 text-gray-600">
              Tip: Right-click a device to start connecting
            </p>
          </div>
        </div>
      )}

      {/* Instructions overlay when there are devices */}
      {deviceList.length > 0 && deviceList.length < 3 && (
        <div className="absolute bottom-4 left-4 p-3 bg-gray-800/90 rounded-lg text-xs text-gray-400 max-w-xs">
          <p className="font-semibold text-gray-300 mb-1">Controls:</p>
          <ul className="space-y-0.5">
            <li>• <span className="text-gray-300">Drag</span> to move devices</li>
            <li>• <span className="text-gray-300">Right-click</span> to connect devices</li>
            <li>• <span className="text-gray-300">Double-click</span> to configure</li>
            <li>• <span className="text-gray-300">Click cable</span> then <span className="text-gray-300">Delete</span> to remove</li>
          </ul>
        </div>
      )}
    </div>
  );
};
