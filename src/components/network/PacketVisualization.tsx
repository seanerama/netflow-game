import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePackets, useDevices } from '../../store/gameStore';
import { VISUAL_METAPHORS } from '../../types';
import type { Packet, Position } from '../../types';

/**
 * PacketVisualization renders animated packets flowing through the network.
 * Packets are rendered as small colored droplets (water metaphor) that
 * travel along connection lines between devices.
 */

interface PacketDotProps {
  packet: Packet;
  fromPos: Position;
  toPos: Position;
}

const PacketDot: React.FC<PacketDotProps> = ({ packet, fromPos, toPos }) => {
  // Determine packet color based on type
  const getPacketColor = () => {
    if (packet.state === 'blocked') return VISUAL_METAPHORS.packetColors.blocked;
    if (packet.payload.type === 'attack') return VISUAL_METAPHORS.packetColors.attack;

    switch (packet.type) {
      case 'http':
        return VISUAL_METAPHORS.packetColors.http;
      case 'https':
        return VISUAL_METAPHORS.packetColors.https;
      case 'dns':
        return VISUAL_METAPHORS.packetColors.dns;
      default:
        return VISUAL_METAPHORS.packetColors.http;
    }
  };

  // Calculate position along the path based on animation progress
  const progress = packet.animationProgress;
  const x = fromPos.x + (toPos.x - fromPos.x) * progress;
  const y = fromPos.y + (toPos.y - fromPos.y) * progress;

  // Packet size based on payload size
  const size = packet.size === 'large' ? 12 : packet.size === 'medium' ? 8 : 6;

  const color = getPacketColor();
  const isAttack = packet.payload.type === 'attack';
  const isBlocked = packet.state === 'blocked';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isBlocked ? [1, 1.5, 0] : 1,
        opacity: isBlocked ? [1, 1, 0] : 1,
        x: isBlocked ? [0, -10, 10, 0] : 0, // Shake if blocked
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        duration: isBlocked ? 0.5 : 0.2,
      }}
      className="absolute pointer-events-none z-20"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
      }}
    >
      {/* Main packet dot */}
      <div
        className={`
          w-full h-full rounded-full
          ${packet.highlighted ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''}
        `}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 ${size}px ${color}`,
        }}
      />

      {/* Attack indicator - pulsing glow */}
      {isAttack && !isBlocked && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
          style={{
            backgroundColor: color,
          }}
        />
      )}

      {/* Blocked X indicator */}
      {isBlocked && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 45 }}
          className="absolute inset-0 flex items-center justify-center text-white font-bold"
          style={{ fontSize: size * 0.8 }}
        >
          ✕
        </motion.div>
      )}
    </motion.div>
  );
};

export const PacketVisualization: React.FC = () => {
  const packets = usePackets();
  const devices = useDevices();

  // Convert packets object to array
  const packetList = Object.values(packets);

  // Get device position by ID
  const getDevicePosition = (deviceId: string): Position | null => {
    const device = devices[deviceId];
    return device ? device.position : null;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {packetList.map((packet) => {
          // Get current and next device in route
          const currentDeviceId = packet.route[packet.routeIndex];
          const nextDeviceId = packet.route[packet.routeIndex + 1];

          if (!currentDeviceId || !nextDeviceId) return null;

          const fromPos = getDevicePosition(currentDeviceId);
          const toPos = getDevicePosition(nextDeviceId);

          if (!fromPos || !toPos) return null;

          return (
            <PacketDot
              key={packet.id}
              packet={packet}
              fromPos={fromPos}
              toPos={toPos}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Packet trail effect (optional enhancement)
export const PacketTrail: React.FC<{
  packet: Packet;
  fromPos: Position;
  toPos: Position;
}> = ({ packet, fromPos, toPos }) => {
  const trailCount = 3;
  const trails = Array.from({ length: trailCount }, (_, i) => {
    const trailProgress = Math.max(0, packet.animationProgress - (i + 1) * 0.1);
    return {
      x: fromPos.x + (toPos.x - fromPos.x) * trailProgress,
      y: fromPos.y + (toPos.y - fromPos.y) * trailProgress,
      opacity: 0.3 - i * 0.1,
      scale: 0.8 - i * 0.2,
    };
  });

  const color =
    packet.payload.type === 'attack'
      ? VISUAL_METAPHORS.packetColors.attack
      : VISUAL_METAPHORS.packetColors.http;

  return (
    <>
      {trails.map((trail, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            backgroundColor: color,
            opacity: trail.opacity,
            transform: `scale(${trail.scale})`,
          }}
        />
      ))}
    </>
  );
};
