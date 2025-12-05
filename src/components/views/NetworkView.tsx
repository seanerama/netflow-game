import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, useDevices, useConnections, useUIState } from '../../store/gameStore';
import { VISUAL_METAPHORS } from '../../types';

export const NetworkView: React.FC = () => {
  const devices = useDevices();
  const connections = useConnections();
  const ui = useUIState();
  const { selectDevice, selectConnection } = useGameStore();

  const deviceList = Object.values(devices);
  const connectionList = Object.values(connections);

  return (
    <div className="relative w-full h-full network-canvas overflow-hidden">
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
                onClick={() => selectConnection(conn.id)}
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

      {/* Device layer */}
      {deviceList.map((device) => {
        const isSelected = ui.selectedDevice === device.id;
        const icon = VISUAL_METAPHORS.deviceIcons[device.type] || '📦';

        return (
          <motion.div
            key={device.id}
            className={`
              absolute cursor-pointer device
              ${isSelected ? 'selected' : ''}
              ${device.status === 'offline' ? 'opacity-50' : ''}
            `}
            style={{
              left: device.position.x - 40,
              top: device.position.y - 40,
            }}
            onClick={() => selectDevice(device.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                {device.name}
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
          </motion.div>
        );
      })}

      {/* Empty state */}
      {deviceList.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">No devices yet</p>
            <p className="text-sm">Open the Shop to purchase network equipment</p>
          </div>
        </div>
      )}
    </div>
  );
};
