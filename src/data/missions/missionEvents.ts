import { useGameStore } from '../../store/gameStore';
import type { NetworkDevice, ComputerConfig, MACAddress } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Generate a random MAC address
function generateMAC(): MACAddress {
  const hex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  return {
    segments: [hex(), hex(), hex(), hex(), hex(), hex()],
  };
}

/**
 * Mission event handlers - called when missions start/complete
 * These can spawn devices, grant rewards, trigger story events, etc.
 */

export function onMissionStart(missionId: string) {
  const store = useGameStore.getState();

  switch (missionId) {
    case 'mission-1-2': {
      // Add Alex's PC to the network when mission starts
      const alexExists = store.network.devices['computer-alex'];
      if (!alexExists) {
        const alexComputer: NetworkDevice = {
          id: 'computer-alex',
          type: 'computer',
          name: "Alex's PC (New!)",
          position: { x: 150, y: 450 }, // Positioned below and to the left
          status: 'offline',
          interfaces: [
            {
              id: uuidv4(),
              name: 'eth0',
              macAddress: generateMAC(),
              isUp: false,
              speed: 1000,
            },
          ],
          config: {
            hostname: 'alex-pc',
            ipConfig: 'static',
            dnsServers: [],
            applications: [],
          } as ComputerConfig,
          purchaseCost: 0,
          monthlyOperatingCost: 0,
        };

        store.addDevice(alexComputer);
        store.updateTopology();

        // Notify the player
        store.addToast({
          type: 'info',
          message: "Alex's new PC has arrived! It's waiting to be connected.",
          action: {
            label: 'Go to Network',
            onClick: () => store.setCurrentView('network'),
          },
        });
      }
      break;
    }

    case 'mission-1-3': {
      // Security breach mission - will trigger attack simulation
      // This will be implemented when we add packet visualization
      store.addToast({
        type: 'error',
        message: '⚠️ Security Alert: Suspicious network activity detected!',
      });
      break;
    }
  }
}

export function onMissionComplete(missionId: string) {
  const store = useGameStore.getState();

  switch (missionId) {
    case 'mission-1-1': {
      // Grant rewards
      store.modifyCash(100);
      store.addXP(50);
      store.unlockFeature('switch-l2-8port');

      store.addToast({
        type: 'success',
        message: '🎉 Mission Complete! Rewards granted: $100, 50 XP, L2 Switches unlocked!',
      });
      break;
    }

    case 'mission-1-2': {
      // Grant rewards
      store.modifyCash(75);
      store.addXP(35);

      // Update Alex's PC name to remove "(New!)"
      const alexPC = store.network.devices['computer-alex'];
      if (alexPC) {
        store.updateDevice('computer-alex', { name: "Alex's PC" });
      }

      store.addToast({
        type: 'success',
        message: '🎉 Mission Complete! Alex is now online. Rewards: $75, 35 XP',
      });
      break;
    }
  }
}
