import type { Mission } from '../../types';

/**
 * Mission 1-2: New Employee
 *
 * The company is growing! A new employee (Alex) has joined and needs a computer
 * connected to the network. This reinforces the basics from Mission 1-1 and
 * introduces the concept of running out of hub ports.
 *
 * This mission teaches:
 * - Reinforcing IP addressing and gateway concepts
 * - Hub port limitations (4-port hub might be full!)
 * - Planning for network growth
 * - The importance of documentation (knowing what IPs are used)
 */
export const MISSION_1_2: Mission = {
  id: 'mission-1-2',
  phase: 1,
  order: 2,

  title: 'New Employee',
  briefing: `
Great news! NexGen Design is growing, and a new employee named **Alex** has just been hired as a junior designer.

Alex's desk is set up and a new computer is waiting, but it's not connected to the network yet.
Your job is to get Alex online so they can start working with the team.

Remember from last time:
- Each device needs a **unique IP address** (like a house number)
- Each device needs to know the **default gateway** (the exit door to the internet)
- All devices connect through the **hub** (the pipe splitter)

But wait... do you have enough ports on your hub? You might need to plan ahead!

*Plumbing reminder:* You're adding another faucet to your plumbing system. Make sure you have
room on your pipe splitter (hub), and give the new faucet its own unique address.
  `.trim(),

  objectives: [
    {
      id: 'obj-connect-alex',
      description: "Connect Alex's PC to the network",
      type: 'connect-device',
      target: 'computer-alex',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-configure-alex-ip',
      description: "Assign an IP address to Alex's PC",
      type: 'assign-ip',
      target: 'computer-alex',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-configure-alex-gateway',
      description: "Set the default gateway on Alex's PC",
      type: 'assign-ip',
      target: 'gateway-alex',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-alex-online',
      description: "Verify Alex's PC can reach the internet",
      type: 'achieve-connectivity',
      target: 'computer-alex',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
  ],

  learningObjectives: [
    {
      id: 'learn-ip-planning',
      concept: 'ipv4-addressing',
      description: 'Understand the importance of tracking which IP addresses are already in use',
      assessmentType: 'action',
      completed: false,
    },
    {
      id: 'learn-port-limits',
      concept: 'switching-basics',
      description: 'Discover that physical devices have port limitations',
      assessmentType: 'observation',
      completed: false,
    },
    {
      id: 'learn-network-growth',
      concept: 'routing-basics',
      description: 'Consider how networks need to scale as businesses grow',
      assessmentType: 'observation',
      completed: false,
    },
  ],

  hints: [
    // Check available ports
    {
      id: 'hint-1-ports',
      order: 1,
      condition: { type: 'stuck-on-step', value: 'obj-connect-alex' },
      content: `
**Step 1: Check Your Hub Ports**

Before connecting Alex's PC, check if your hub has any available ports!

A 4-port hub can only connect 4 devices. If you already have:
- 1 port → Router connection (uplink)
- 3 ports → Sarah, Mike, and Lisa's PCs

...then you're out of ports! You'll need to either:
1. **Buy a bigger hub** (8-port) from the Shop
2. **Buy a second hub** and connect it to the first (called "daisy-chaining")

*Plumbing analogy:* If your pipe splitter only has 4 outlets and they're all being used,
you need a bigger splitter or another splitter connected to the first one!

**What to do:**
1. Hover over your hub to see how many ports are available
2. If no ports are free, go to the **Shop** and buy an 8-port hub ($40)
3. You can either replace your old hub or add the new one

*Tip:* Right-click on Alex's PC, then click on your hub (with available ports) to connect.
      `.trim(),
      type: 'dialog',
    },
    // Choosing a unique IP
    {
      id: 'hint-2-unique-ip',
      order: 2,
      condition: { type: 'stuck-on-step', value: 'obj-configure-alex-ip' },
      content: `
**Step 2: Choose a Unique IP Address**

Every device on your network needs a **unique** IP address. If two devices have the same IP,
it's like two houses having the same street address - mail carriers (data packets) get confused!

You probably used these IPs for your other computers:
- Sarah's PC: 192.168.1.10
- Mike's PC: 192.168.1.11
- Lisa's PC: 192.168.1.12

So for Alex, you could use **192.168.1.13** (or any unused number from 2-254).

**What to do:**
1. **Double-click** on Alex's PC to open configuration
2. Set the IP address to **192.168.1.13**
3. Set the subnet mask to **255.255.255.0** (or use /24 preset)

*Why 192.168.1.x?* All devices on the same local network should share the same "street name"
(the first three numbers). Only the last number (the "house number") changes.

*Pro tip:* In real networks, IT teams keep a spreadsheet of all assigned IPs to avoid conflicts.
This is called an "IP address management" (IPAM) system.
      `.trim(),
      type: 'dialog',
    },
    // Setting gateway
    {
      id: 'hint-3-gateway',
      order: 3,
      condition: { type: 'stuck-on-step', value: 'obj-configure-alex-gateway' },
      content: `
**Step 3: Set the Default Gateway**

Alex's PC has an address now, but it doesn't know how to reach the internet yet!

The **default gateway** is the IP address of your router's LAN interface - it's the "exit door"
that traffic uses to leave your local network and reach the outside world.

Your router's LAN IP is probably **192.168.1.1** (check by double-clicking the router).

**What to do:**
1. In Alex's PC configuration, find the **Default Gateway** field
2. Enter the router's LAN IP address (e.g., **192.168.1.1**)

*Plumbing analogy:* The gateway is like telling Alex: "If you need to send water outside
this building, send it to the main valve at address 192.168.1.1 - it knows how to connect
to the city water system."

Without a gateway, Alex can talk to Sarah, Mike, and Lisa (same building), but can't
reach anything on the internet (outside world).
      `.trim(),
      type: 'dialog',
    },
    // Verify connectivity
    {
      id: 'hint-4-verify',
      order: 4,
      condition: { type: 'stuck-on-step', value: 'obj-alex-online' },
      content: `
**Step 4: Verify Everything Works**

Let's make sure Alex can reach the internet! Check that you have:

✅ **Physical connection:** Alex's PC → Hub → Router → ISP
✅ **IP Address:** Unique address like 192.168.1.13
✅ **Subnet Mask:** 255.255.255.0
✅ **Default Gateway:** Points to router (192.168.1.1)

**Common problems:**

❌ **"No available ports"** → Need a bigger hub or second hub
❌ **"IP conflict"** → Another device has the same IP - choose a different one
❌ **"Can't reach internet"** → Gateway might be wrong, or router isn't connected to ISP

*The path data takes:*
1. Alex's PC sends data to gateway (192.168.1.1)
2. Router receives it on LAN interface
3. Router uses NAT to translate private IP → public IP
4. Router sends it out WAN interface to ISP
5. Response comes back, NAT translates back, delivers to Alex

If any step in this chain is broken, connectivity fails!
      `.trim(),
      type: 'dialog',
    },
  ],

  prerequisites: ['mission-1-1'],
  unlocks: ['mission-1-3'],

  rewards: [
    {
      type: 'cash',
      value: 75,
      description: 'Bonus for onboarding the new employee',
    },
    {
      type: 'xp',
      value: 35,
      description: 'Experience for reinforcing network basics',
    },
  ],

  status: 'locked', // Unlocked after completing mission-1-1
};

// Helper to get hint by ID
export function getHintById(hintId: string) {
  return MISSION_1_2.hints.find((h) => h.id === hintId);
}

// Helper to get next hint for current progress
export function getNextHint(completedObjectives: string[]) {
  const objectiveOrder = MISSION_1_2.objectives.map((o) => o.id);

  for (const objId of objectiveOrder) {
    if (!completedObjectives.includes(objId)) {
      const hint = MISSION_1_2.hints.find(
        (h) => h.condition.type === 'stuck-on-step' && h.condition.value === objId
      );
      return hint;
    }
  }
  return null;
}
