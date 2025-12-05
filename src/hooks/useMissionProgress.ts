import { useEffect, useCallback } from 'react';
import { useGameStore, useDevices, useConnections } from '../store/gameStore';
import type { NetworkDevice, RouterConfig } from '../types';

/**
 * Hook to automatically check and update mission objectives based on game state.
 * This runs on every relevant state change and updates objective progress.
 */
export function useMissionProgress() {
  const devices = useDevices();
  const connections = useConnections();
  const {
    currentMission,
    missions,
    updateObjective,
    completeObjective,
    addToast,
  } = useGameStore();

  // Get current mission
  const mission = currentMission ? missions[currentMission] : null;

  // Check objectives whenever devices or connections change
  const checkObjectives = useCallback(() => {
    if (!mission || mission.status !== 'active') return;

    const deviceList = Object.values(devices);
    const connectionList = Object.values(connections);

    // Helper functions
    const hasDeviceOfType = (type: string) =>
      deviceList.some((d) => d.type === type && d.id !== 'internet');

    const getDevicesOfType = (type: string) =>
      deviceList.filter((d) => d.type === type && d.id !== 'internet');

    const isConnectedTo = (device: NetworkDevice, targetType: string) => {
      return connectionList.some(
        (conn) =>
          (conn.fromDevice === device.id &&
            devices[conn.toDevice]?.type === targetType) ||
          (conn.toDevice === device.id &&
            devices[conn.fromDevice]?.type === targetType)
      );
    };

    const isConnectedToId = (device: NetworkDevice, targetId: string) => {
      return connectionList.some(
        (conn) =>
          (conn.fromDevice === device.id && conn.toDevice === targetId) ||
          (conn.toDevice === device.id && conn.fromDevice === targetId)
      );
    };

    const hasIP = (device: NetworkDevice) =>
      device.interfaces.some((i) => i.ipAddress);

    const hasGateway = (device: NetworkDevice) =>
      device.interfaces.some((i) => i.gateway);

    const canReachInternet = (device: NetworkDevice) => {
      // A device can reach internet if:
      // 1. It has an IP address
      // 2. It has a gateway set
      // 3. There's a path to a router connected to the internet
      // 4. That router has NAT enabled

      if (!hasIP(device) || !hasGateway(device)) return false;

      // Find a router connected to the internet
      const routers = getDevicesOfType('router');
      const connectedRouter = routers.find((router) => {
        // Router must be connected to internet
        const routerConnectedToInternet = isConnectedToId(router, 'internet');
        if (!routerConnectedToInternet) return false;

        // Router must have NAT enabled
        const routerConfig = router.config as RouterConfig;
        if (!routerConfig.nat?.enabled) return false;

        // Device must have a path to this router (through hub/switch or direct)
        // For simplicity, check if device is connected to something that connects to router
        const deviceConnections = connectionList.filter(
          (conn) =>
            conn.fromDevice === device.id || conn.toDevice === device.id
        );

        for (const conn of deviceConnections) {
          const otherDeviceId =
            conn.fromDevice === device.id ? conn.toDevice : conn.fromDevice;

          // Direct connection to router
          if (otherDeviceId === router.id) return true;

          // Connected through hub/switch
          const otherDevice = devices[otherDeviceId];
          if (
            otherDevice &&
            (otherDevice.type === 'hub' || otherDevice.type === 'switch')
          ) {
            // Check if hub/switch connects to router
            const hubConnections = connectionList.filter(
              (c) =>
                c.fromDevice === otherDevice.id ||
                c.toDevice === otherDevice.id
            );
            for (const hubConn of hubConnections) {
              const hubOther =
                hubConn.fromDevice === otherDevice.id
                  ? hubConn.toDevice
                  : hubConn.fromDevice;
              if (hubOther === router.id) return true;
            }
          }
        }

        return false;
      });

      return !!connectedRouter;
    };

    // Check each objective
    mission.objectives.forEach((objective) => {
      if (objective.completed) return; // Skip already completed

      let newCurrent = objective.current;
      let shouldComplete = false;

      switch (objective.id) {
        // Purchase a router
        case 'obj-buy-router': {
          newCurrent = hasDeviceOfType('router') ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Connect router to ISP
        case 'obj-connect-isp': {
          const routers = getDevicesOfType('router');
          const connectedRouter = routers.find((r) => isConnectedToId(r, 'internet'));
          newCurrent = connectedRouter ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Purchase a hub
        case 'obj-buy-hub': {
          const hasHub = hasDeviceOfType('hub') || hasDeviceOfType('switch');
          newCurrent = hasHub ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Connect hub to router
        case 'obj-connect-hub': {
          const hubs = [...getDevicesOfType('hub'), ...getDevicesOfType('switch')];
          const connectedHub = hubs.find((h) => isConnectedTo(h, 'router'));
          newCurrent = connectedHub ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Connect all 3 computers to hub
        case 'obj-connect-pcs': {
          const computers = getDevicesOfType('computer');
          const connectedComputers = computers.filter(
            (c) => isConnectedTo(c, 'hub') || isConnectedTo(c, 'switch')
          );
          newCurrent = connectedComputers.length;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Assign IPs to all computers
        case 'obj-configure-ips': {
          const computers = getDevicesOfType('computer');
          const computersWithIP = computers.filter(hasIP);
          newCurrent = computersWithIP.length;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Set gateway on all computers
        case 'obj-configure-gateways': {
          const computers = getDevicesOfType('computer');
          const computersWithGateway = computers.filter(hasGateway);
          newCurrent = computersWithGateway.length;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // All computers can reach internet
        case 'obj-internet-access': {
          const computers = getDevicesOfType('computer');
          const onlineComputers = computers.filter(canReachInternet);
          newCurrent = onlineComputers.length;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // === MISSION 1-2 OBJECTIVES ===

        // Connect Alex's PC to network
        case 'obj-connect-alex': {
          const alexPC = devices['computer-alex'];
          if (alexPC) {
            const isConnected = isConnectedTo(alexPC, 'hub') || isConnectedTo(alexPC, 'switch');
            newCurrent = isConnected ? 1 : 0;
          }
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Configure Alex's IP
        case 'obj-configure-alex-ip': {
          const alexPC = devices['computer-alex'];
          if (alexPC) {
            newCurrent = hasIP(alexPC) ? 1 : 0;
          }
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Configure Alex's gateway
        case 'obj-configure-alex-gateway': {
          const alexPC = devices['computer-alex'];
          if (alexPC) {
            newCurrent = hasGateway(alexPC) ? 1 : 0;
          }
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Alex can reach internet
        case 'obj-alex-online': {
          const alexPC = devices['computer-alex'];
          if (alexPC) {
            newCurrent = canReachInternet(alexPC) ? 1 : 0;
          }
          shouldComplete = newCurrent >= objective.required;
          break;
        }
      }

      // Update objective if progress changed
      if (newCurrent !== objective.current) {
        updateObjective(mission.id, objective.id, { current: newCurrent });
      }

      // Complete objective if threshold reached
      if (shouldComplete && !objective.completed) {
        completeObjective(mission.id, objective.id);

        // Show notification
        addToast({
          type: 'success',
          message: `Objective complete: ${objective.description}`,
        });
      }
    });
  }, [
    devices,
    connections,
    mission,
    updateObjective,
    completeObjective,
    addToast,
  ]);

  // Run check whenever dependencies change
  useEffect(() => {
    checkObjectives();
  }, [checkObjectives]);

  return {
    mission,
    checkObjectives,
  };
}

/**
 * Get the current "stuck" objective - the first incomplete objective
 */
export function useCurrentObjective() {
  const { currentMission, missions } = useGameStore();
  const mission = currentMission ? missions[currentMission] : null;

  if (!mission) return null;

  return mission.objectives.find((o) => !o.completed) || null;
}
