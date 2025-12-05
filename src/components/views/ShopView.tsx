import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Lock, DollarSign, Cpu, Cable } from 'lucide-react';
import { useGameStore, useBusiness } from '../../store/gameStore';
import { HARDWARE_CATALOG, CABLE_CATALOG, type HardwareItem } from '../../data/hardware/catalog';
import { v4 as uuidv4 } from 'uuid';
import type { NetworkDevice, NetworkInterface, MACAddress, RouterConfig, SwitchConfig } from '../../types';

// Generate a random MAC address
function generateMAC(): MACAddress {
  const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  return {
    segments: [hex(), hex(), hex(), hex(), hex(), hex()],
  };
}

// Create a network device from hardware item
function createDeviceFromHardware(item: HardwareItem, position: { x: number; y: number }): NetworkDevice {
  const baseInterfaces: NetworkInterface[] = [];

  if (item.type === 'router') {
    // WAN port
    baseInterfaces.push({
      id: `${uuidv4()}-wan`,
      name: 'wan',
      macAddress: generateMAC(),
      isUp: false,
      speed: item.specs.maxBandwidth as number || 100,
    });
    // LAN ports
    const lanPorts = (item.specs.lanPorts as number) || 4;
    for (let i = 0; i < lanPorts; i++) {
      baseInterfaces.push({
        id: `${uuidv4()}-lan${i}`,
        name: `lan${i}`,
        macAddress: generateMAC(),
        isUp: false,
        speed: 1000,
      });
    }
  } else if (item.type === 'switch') {
    const ports = (item.specs.ports as number) || 4;
    for (let i = 0; i < ports; i++) {
      baseInterfaces.push({
        id: `${uuidv4()}-port${i}`,
        name: `port${i}`,
        macAddress: generateMAC(),
        isUp: false,
        speed: (item.specs.speed as number) || 1000,
      });
    }
  }

  const baseDevice: NetworkDevice = {
    id: uuidv4(),
    type: item.type,
    name: item.name,
    position,
    status: 'offline',
    interfaces: baseInterfaces,
    config: { hostname: item.name.toLowerCase().replace(/\s+/g, '-') },
    purchaseCost: item.cost,
    monthlyOperatingCost: item.monthlyCost,
  };

  // Add type-specific config
  if (item.type === 'router') {
    (baseDevice as NetworkDevice & { config: RouterConfig }).config = {
      ...baseDevice.config,
      nat: {
        enabled: true,
        type: 'pat',
        insideInterface: baseInterfaces[1]?.id || '',
        outsideInterface: baseInterfaces[0]?.id || '',
        translations: [],
        staticMappings: [],
      },
      firewall: {
        enabled: true,
        defaultInboundPolicy: 'deny',
        defaultOutboundPolicy: 'allow',
        rules: [],
        statefulInspection: true,
        connectionTable: [],
      },
      routes: [],
    };
  } else if (item.type === 'switch') {
    (baseDevice as NetworkDevice & { config: SwitchConfig }).config = {
      ...baseDevice.config,
      macTable: [],
    };
  }

  return baseDevice;
}

export const ShopView: React.FC = () => {
  const business = useBusiness();
  const { addDevice, modifyCash, unlockedFeatures } = useGameStore();

  const handlePurchase = (item: HardwareItem) => {
    if (business.cash < item.cost) {
      return; // Can't afford
    }
    if (item.locked && !unlockedFeatures.includes(item.id)) {
      return; // Locked
    }

    // Create device at a default position (center-ish of canvas)
    const position = {
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 100,
    };

    const device = createDeviceFromHardware(item, position);
    addDevice(device);
    modifyCash(-item.cost);
  };

  const canAfford = (cost: number) => business.cash >= cost;
  const isLocked = (item: HardwareItem) => item.locked && !unlockedFeatures.includes(item.id);

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Hardware Shop</h1>
          <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-lg font-mono">${business.cash.toLocaleString()}</span>
          </div>
        </div>

        {/* Routers Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Routers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HARDWARE_CATALOG.routers.map((item) => (
              <HardwareCard
                key={item.id}
                item={item}
                canAfford={canAfford(item.cost)}
                locked={isLocked(item) ?? false}
                onPurchase={() => handlePurchase(item)}
              />
            ))}
          </div>
        </section>

        {/* Switches Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Switches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HARDWARE_CATALOG.switches.map((item) => (
              <HardwareCard
                key={item.id}
                item={item}
                canAfford={canAfford(item.cost)}
                locked={isLocked(item) ?? false}
                onPurchase={() => handlePurchase(item)}
              />
            ))}
          </div>
        </section>

        {/* Cables Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Cable className="w-5 h-5" />
            Cables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CABLE_CATALOG.map((cable) => (
              <div
                key={cable.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{cable.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{cable.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{cable.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Max Speed: {cable.maxSpeed} Mbps
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono">${cable.cost}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      Click devices to connect
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <h3 className="font-semibold text-blue-300 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Purchase a router first to connect your network to the internet</li>
            <li>• Use switches to connect multiple devices when you run out of router ports</li>
            <li>• Devices appear on the Network view after purchase</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Hardware Card Component
interface HardwareCardProps {
  item: HardwareItem;
  canAfford: boolean;
  locked: boolean;
  onPurchase: () => void;
}

const HardwareCard: React.FC<HardwareCardProps> = ({ item, canAfford, locked, onPurchase }) => {
  const disabled = locked || !canAfford;

  return (
    <motion.div
      className={`
        relative p-4 rounded-lg border transition-all
        ${disabled
          ? 'bg-gray-800/50 border-gray-700 opacity-60'
          : 'bg-gray-800 border-gray-600 hover:border-blue-500 cursor-pointer'
        }
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onPurchase}
    >
      {locked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="text-4xl">{item.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{item.description}</p>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mt-3">
            {item.specs.lanPorts != null && (
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                {String(item.specs.lanPorts)} LAN ports
              </span>
            )}
            {item.specs.ports != null && (
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                {String(item.specs.ports)} ports
              </span>
            )}
            {item.specs.maxBandwidth != null && (
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
                {String(item.specs.maxBandwidth)} Mbps
              </span>
            )}
          </div>

          {locked && item.unlockCondition && (
            <p className="text-xs text-yellow-500 mt-2">🔒 {item.unlockCondition}</p>
          )}
        </div>

        <div className="text-right">
          <div className={`text-lg font-mono ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
            ${item.cost}
          </div>
          {!canAfford && !locked && (
            <p className="text-xs text-red-400 mt-1">Can't afford</p>
          )}
        </div>
      </div>

      {!disabled && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
            Purchase
          </button>
        </div>
      )}
    </motion.div>
  );
};
