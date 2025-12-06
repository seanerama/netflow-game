import { useEffect, useCallback, useRef } from 'react';
import { useGameStore, useDevices, useConnections } from '../store/gameStore';
import type { NetworkDevice, RouterConfig } from '../types';
import { spawnAttackWave } from '../simulation/packetEngine';

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
    simulation,
  } = useGameStore();

  // Track if we've started the attack wave for mission 1-3
  const attackWaveStarted = useRef(false);
  // Track if user has observed an attack (saw the visualization)
  const hasObservedAttack = useRef(false);
  // Track if user has viewed TCP info (in a real app, track via hint viewed)
  const hasLearnedTCP = useRef(false);
  // Track which diagnostic hints we've already shown (to avoid spam)
  const shownDiagnosticHints = useRef<Set<string>>(new Set());

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

      // Both masks should match (same subnet configuration)
      if (!ipEquals(mask1, mask2)) return false;

      // Calculate network addresses and compare
      const net1 = getNetworkAddress(ip1, mask1);
      const net2 = getNetworkAddress(ip2, mask2);
      return net1.every((octet, i) => octet === net2[i]);
    };

    // Format IP for display
    const formatIP = (ip: { octets: number[] } | undefined): string => {
      if (!ip) return 'not set';
      return ip.octets.join('.');
    };

    // Diagnose network configuration issues and return helpful error message
    type ConfigDiagnosis = { valid: true } | { valid: false; error: string; hint: string };

    const diagnoseNetworkConfig = (device: NetworkDevice, router: NetworkDevice): ConfigDiagnosis => {
      const deviceInterface = device.interfaces.find((i) => i.ipAddress);
      const routerInterface = router.interfaces.find((i) => i.ipAddress);

      // Missing IP on device
      if (!deviceInterface?.ipAddress) {
        return {
          valid: false,
          error: 'No IP address',
          hint: `${device.name} doesn't have an IP address. Think of an IP like a house number - without it, the mail carrier (router) doesn't know where to deliver packets!`,
        };
      }

      // Missing subnet mask on device
      if (!deviceInterface?.subnetMask) {
        return {
          valid: false,
          error: 'No subnet mask',
          hint: `${device.name} is missing a subnet mask. The subnet mask defines your "neighborhood" - it tells the device which addresses are local (on the same street) vs. which need to go through the router (post office) to reach.`,
        };
      }

      // Missing config on router
      if (!routerInterface?.ipAddress || !routerInterface?.subnetMask) {
        return {
          valid: false,
          error: 'Router not configured',
          hint: `The router needs an IP address first. The router is like your local post office - it needs its own address before it can help route mail to other neighborhoods!`,
        };
      }

      // Check 1: Device's gateway must match router's LAN IP
      if (!ipEquals(deviceInterface.gateway, routerInterface.ipAddress)) {
        const deviceGW = formatIP(deviceInterface.gateway);
        const routerIP = formatIP(routerInterface.ipAddress);
        return {
          valid: false,
          error: 'Wrong gateway',
          hint: `${device.name}'s gateway is set to ${deviceGW}, but the router's address is ${routerIP}. It's like dropping your outgoing mail in your neighbor's mailbox instead of the official mailbox - your letters will never get picked up! Set the gateway to ${routerIP}.`,
        };
      }

      // Check 2: Subnet masks must match
      if (!ipEquals(deviceInterface.subnetMask, routerInterface.subnetMask)) {
        const deviceMask = formatIP(deviceInterface.subnetMask);
        const routerMask = formatIP(routerInterface.subnetMask);
        return {
          valid: false,
          error: 'Subnet mask mismatch',
          hint: `${device.name}'s subnet mask (${deviceMask}) doesn't match the router's (${routerMask}). Think of subnet masks as neighborhood boundary maps - if you and the router have different maps, you'll disagree about what's "local" and what's not! Both should use ${routerMask}.`,
        };
      }

      // Check 3: Device and router must be in the same subnet
      if (!sameSubnet(
        deviceInterface.ipAddress,
        deviceInterface.subnetMask,
        routerInterface.ipAddress,
        routerInterface.subnetMask
      )) {
        const deviceIP = formatIP(deviceInterface.ipAddress);
        const routerIP = formatIP(routerInterface.ipAddress);
        return {
          valid: false,
          error: 'Different subnet',
          hint: `${device.name} (${deviceIP}) is not in the same subnet as the router (${routerIP}). It's like living on Maple Street but claiming your address is on Oak Avenue - the local mail carrier can't find you! With subnet mask ${formatIP(deviceInterface.subnetMask)}, both IPs need to share the same network portion.`,
        };
      }

      // Check 4: Device IP must not be the same as router IP (no duplicates)
      if (ipEquals(deviceInterface.ipAddress, routerInterface.ipAddress)) {
        const duplicateIP = formatIP(deviceInterface.ipAddress);
        return {
          valid: false,
          error: 'Duplicate IP',
          hint: `${device.name} has the same IP address as the router (${duplicateIP}). Two houses can't have the same address - the mail carrier wouldn't know which door to deliver to! Give ${device.name} a different IP in the same subnet.`,
        };
      }

      return { valid: true };
    };

    // Check if device is properly configured to communicate with router
    const hasValidNetworkConfig = (device: NetworkDevice, router: NetworkDevice): boolean => {
      const diagnosis = diagnoseNetworkConfig(device, router);
      return diagnosis.valid;
    };

    const canReachInternet = (device: NetworkDevice) => {
      // A device can reach internet if:
      // 1. It has an IP address with subnet mask
      // 2. It has a gateway set
      // 3. There's a path to a router connected to the internet
      // 4. That router has NAT enabled
      // 5. The gateway is set to the router's LAN IP
      // 6. The device IP is in the SAME SUBNET as the router (CRITICAL!)
      // 7. The subnet masks match

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

        // Device must have valid network config (gateway, same subnet, matching masks)
        if (!hasValidNetworkConfig(device, router)) return false;

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

          // Show diagnostic hints for computers that have IP+gateway but can't reach internet
          if (!shouldComplete) {
            const routers = getDevicesOfType('router');
            const connectedRouter = routers.find((r) => isConnectedToId(r, 'internet'));

            if (connectedRouter) {
              computers.forEach((computer) => {
                // Only check computers that have both IP and gateway set but still can't connect
                if (hasIP(computer) && hasGateway(computer) && !canReachInternet(computer)) {
                  const diagnosis = diagnoseNetworkConfig(computer, connectedRouter);
                  if (!diagnosis.valid) {
                    const hintKey = `${computer.id}-${diagnosis.error}`;
                    if (!shownDiagnosticHints.current.has(hintKey)) {
                      shownDiagnosticHints.current.add(hintKey);
                      addToast({
                        type: 'warning',
                        message: diagnosis.hint,
                        duration: 10000, // Show for 10 seconds
                      });
                    }
                  }
                }
              });
            }
          }
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

            // Show diagnostic hint if Alex has IP+gateway but can't connect
            if (!newCurrent && hasIP(alexPC) && hasGateway(alexPC)) {
              const routers = getDevicesOfType('router');
              const connectedRouter = routers.find((r) => isConnectedToId(r, 'internet'));

              if (connectedRouter) {
                const diagnosis = diagnoseNetworkConfig(alexPC, connectedRouter);
                if (!diagnosis.valid) {
                  const hintKey = `${alexPC.id}-${diagnosis.error}`;
                  if (!shownDiagnosticHints.current.has(hintKey)) {
                    shownDiagnosticHints.current.add(hintKey);
                    addToast({
                      type: 'warning',
                      message: diagnosis.hint,
                      duration: 10000,
                    });
                  }
                }
              }
            }
          }
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // === MISSION 1-3 OBJECTIVES ===

        // Observe attack packets being blocked
        case 'obj-observe-attack': {
          // Complete once user has seen at least one blocked attack
          // We track this via the simulation's blockedAttacks counter
          if (simulation.blockedAttacks > 0) {
            hasObservedAttack.current = true;
          }
          newCurrent = hasObservedAttack.current ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Verify firewall is configured correctly
        case 'obj-check-firewall': {
          const routers = getDevicesOfType('router');
          const configuredRouter = routers.find((router) => {
            const routerConfig = router.config as RouterConfig;
            return (
              routerConfig.firewall?.enabled === true &&
              routerConfig.firewall?.defaultInboundPolicy === 'deny'
            );
          });
          newCurrent = configuredRouter ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Learn about TCP (completed when user views the TCP hint)
        case 'obj-understand-tcp': {
          // This gets marked complete when the user views the TCP hint
          // For now, auto-complete once firewall objective is done
          const firewallObjective = mission.objectives.find(
            (o) => o.id === 'obj-check-firewall'
          );
          if (firewallObjective?.completed && simulation.blockedAttacks >= 3) {
            hasLearnedTCP.current = true;
          }
          newCurrent = hasLearnedTCP.current ? 1 : 0;
          shouldComplete = newCurrent >= objective.required;
          break;
        }

        // Block 10 attack attempts
        case 'obj-block-attacks': {
          newCurrent = Math.min(simulation.blockedAttacks, objective.required);
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
    simulation.blockedAttacks,
  ]);

  // Run check whenever dependencies change
  useEffect(() => {
    checkObjectives();
  }, [checkObjectives]);

  // Start attack wave when Mission 1-3 becomes active
  useEffect(() => {
    if (
      currentMission === 'mission-1-3' &&
      mission?.status === 'active' &&
      !attackWaveStarted.current
    ) {
      attackWaveStarted.current = true;

      // Start continuous attack waves
      const startAttacks = () => {
        // Spawn initial wave
        spawnAttackWave(5, 'router', 'port-scan');

        // Continue spawning attacks every 3 seconds until mission is complete
        const interval = setInterval(() => {
          const store = useGameStore.getState();
          const currentMissionStatus = store.missions['mission-1-3']?.status;

          if (currentMissionStatus === 'completed') {
            clearInterval(interval);
            return;
          }

          // Randomly pick attack type and target
          const attackTypes: ('port-scan' | 'brute-force')[] = [
            'port-scan',
            'brute-force',
          ];
          const attackType =
            attackTypes[Math.floor(Math.random() * attackTypes.length)];

          spawnAttackWave(2 + Math.floor(Math.random() * 3), 'router', attackType);
        }, 3000);
      };

      // Small delay to let UI settle
      setTimeout(startAttacks, 1000);
    }
  }, [currentMission, mission?.status]);

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
