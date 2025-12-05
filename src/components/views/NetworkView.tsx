import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useDevices, useConnections, useUIState } from '../../store/gameStore';
import { VISUAL_METAPHORS } from '../../types';
import type { Position, NetworkDevice } from '../../types';
import { PacketVisualization } from '../network/PacketVisualization';
import { startPacketSimulation, stopPacketSimulation } from '../../simulation/packetEngine';

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
  const { selectDevice, selectConnection, updateDevice, openModal } = useGameStore();
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

  // Start/stop packet simulation when component mounts/unmounts
  useEffect(() => {
    startPacketSimulation();
    return () => {
      stopPacketSimulation();
    };
  }, []);

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

      {/* SVG layer for connections (pipes) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Pipe gradient */}
          <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
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

          return (
            <g key={conn.id}>
              {/* Pipe outer */}
              <line
                x1={fromDevice.position.x}
                y1={fromDevice.position.y}
                x2={toDevice.position.x}
                y2={toDevice.position.y}
                stroke={isSelected ? '#3B82F6' : '#4B5563'}
                strokeWidth={conn.bandwidth >= 1000 ? 12 : conn.bandwidth >= 100 ? 8 : 4}
                strokeLinecap="round"
                className="cursor-pointer pointer-events-auto"
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
          </ul>
        </div>
      )}
    </div>
  );
};
