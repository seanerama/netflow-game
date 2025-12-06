import type { Mission, MissionConfig, IPv4Address } from '../../types';

// Helper to create IPv4Address from octets
const ip = (a: number, b: number, c: number, d: number): IPv4Address => ({
  octets: [a, b, c, d] as [number, number, number, number],
});

/**
 * Mission 1-1 Configuration
 * Defines the multiple-choice options for device configuration
 */
const MISSION_1_1_CONFIG: MissionConfig = {
  configChoices: [
    // Sarah's PC choices
    {
      deviceId: 'computer-sarah',
      ipAddress: [
        {
          id: 'sarah-ip-correct',
          value: ip(192, 168, 1, 10),
          label: '192.168.1.10',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'sarah-ip-wrong-subnet',
          value: ip(10, 0, 0, 50),
          label: '10.0.0.50',
          isCorrect: false,
          hintIfWrong: "This IP is in a different neighborhood (10.0.0.x) than the router (192.168.1.x). It's like mailing a letter to an address in another city - the local mail carrier can't deliver it!",
        },
        {
          id: 'sarah-ip-router-duplicate',
          value: ip(192, 168, 1, 1),
          label: '192.168.1.1',
          isCorrect: false,
          hintIfWrong: "This is the router's IP address! Two devices can't have the same address - it's like two houses having the same street number. The mail carrier wouldn't know which door to deliver to!",
        },
        {
          id: 'sarah-ip-public',
          value: ip(203, 0, 113, 50),
          label: '203.0.113.50',
          isCorrect: false,
          hintIfWrong: "This is a public IP address! Your internal network uses private addresses (192.168.x.x). Public IPs are like international phone numbers - you can't use them for internal office calls.",
        },
      ],
      subnetMask: [
        {
          id: 'sarah-mask-correct',
          value: ip(255, 255, 255, 0),
          label: '255.255.255.0',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'sarah-mask-wrong',
          value: ip(255, 0, 0, 0),
          label: '255.0.0.0',
          isCorrect: false,
          hintIfWrong: "This subnet mask is too broad - it defines a huge neighborhood. For a small office, use 255.255.255.0 to keep things simple and match the router's configuration.",
        },
      ],
      gateway: [
        {
          id: 'sarah-gw-correct',
          value: ip(192, 168, 1, 1),
          label: '192.168.1.1',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'sarah-gw-wrong-self',
          value: ip(192, 168, 1, 10),
          label: '192.168.1.10',
          isCorrect: false,
          hintIfWrong: "That's your own IP address! The gateway should be the router's address. It's like putting your own home as the post office address - your outgoing mail would just come back to you!",
        },
        {
          id: 'sarah-gw-wrong-other',
          value: ip(192, 168, 1, 11),
          label: '192.168.1.11',
          isCorrect: false,
          hintIfWrong: "That's another computer's IP, not the router! The gateway must be the router's address. It's like dropping your mail in your neighbor's mailbox instead of the official mailbox - it won't get picked up!",
        },
        {
          id: 'sarah-gw-wrong-subnet',
          value: ip(10, 0, 0, 1),
          label: '10.0.0.1',
          isCorrect: false,
          hintIfWrong: "This gateway is in a completely different neighborhood! Your gateway must be in the same subnet as your IP address. It's like trying to use a post office in another city.",
        },
      ],
    },
    // Mike's PC choices
    {
      deviceId: 'computer-mike',
      ipAddress: [
        {
          id: 'mike-ip-correct',
          value: ip(192, 168, 1, 11),
          label: '192.168.1.11',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'mike-ip-wrong-subnet',
          value: ip(172, 16, 0, 11),
          label: '172.16.0.11',
          isCorrect: false,
          hintIfWrong: "This IP is in a different neighborhood (172.16.x.x) than the router (192.168.1.x). All devices on your network need to be in the same subnet to communicate directly.",
        },
        {
          id: 'mike-ip-duplicate-sarah',
          value: ip(192, 168, 1, 10),
          label: '192.168.1.10',
          isCorrect: false,
          hintIfWrong: "This IP is already used by Sarah's PC! Every device needs a unique address. It's like two houses having the same street number - the mail carrier wouldn't know where to deliver!",
        },
        {
          id: 'mike-ip-router-duplicate',
          value: ip(192, 168, 1, 1),
          label: '192.168.1.1',
          isCorrect: false,
          hintIfWrong: "This is the router's IP address! Two devices can't share an address.",
        },
      ],
      subnetMask: [
        {
          id: 'mike-mask-correct',
          value: ip(255, 255, 255, 0),
          label: '255.255.255.0',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'mike-mask-wrong',
          value: ip(255, 255, 0, 0),
          label: '255.255.0.0',
          isCorrect: false,
          hintIfWrong: "This subnet mask doesn't match the router's configuration. All devices on the same network should use the same subnet mask.",
        },
      ],
      gateway: [
        {
          id: 'mike-gw-correct',
          value: ip(192, 168, 1, 1),
          label: '192.168.1.1',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'mike-gw-wrong-self',
          value: ip(192, 168, 1, 11),
          label: '192.168.1.11',
          isCorrect: false,
          hintIfWrong: "That's your own IP address! The gateway should be the router's address (192.168.1.1).",
        },
        {
          id: 'mike-gw-wrong-other',
          value: ip(192, 168, 1, 10),
          label: '192.168.1.10',
          isCorrect: false,
          hintIfWrong: "That's Sarah's computer, not the router! The gateway must be the router's address - it's the door to the outside world.",
        },
      ],
    },
    // Lisa's PC choices
    {
      deviceId: 'computer-lisa',
      ipAddress: [
        {
          id: 'lisa-ip-correct',
          value: ip(192, 168, 1, 12),
          label: '192.168.1.12',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'lisa-ip-wrong-subnet',
          value: ip(192, 168, 2, 12),
          label: '192.168.2.12',
          isCorrect: false,
          hintIfWrong: "Close, but this is in subnet 192.168.2.x while your router is in 192.168.1.x! Even one number off means a different neighborhood. Change the third number to 1.",
        },
        {
          id: 'lisa-ip-duplicate-mike',
          value: ip(192, 168, 1, 11),
          label: '192.168.1.11',
          isCorrect: false,
          hintIfWrong: "This IP is already used by Mike's PC! Every device needs its own unique address.",
        },
        {
          id: 'lisa-ip-duplicate-sarah',
          value: ip(192, 168, 1, 10),
          label: '192.168.1.10',
          isCorrect: false,
          hintIfWrong: "This IP is already used by Sarah's PC! Pick a unique address for Lisa.",
        },
      ],
      subnetMask: [
        {
          id: 'lisa-mask-correct',
          value: ip(255, 255, 255, 0),
          label: '255.255.255.0',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'lisa-mask-wrong',
          value: ip(255, 255, 255, 128),
          label: '255.255.255.128',
          isCorrect: false,
          hintIfWrong: "This mask creates a smaller subnet that might not include the router. Use 255.255.255.0 to match the router's configuration.",
        },
      ],
      gateway: [
        {
          id: 'lisa-gw-correct',
          value: ip(192, 168, 1, 1),
          label: '192.168.1.1',
          isCorrect: true,
          hintIfWrong: '',
        },
        {
          id: 'lisa-gw-wrong-self',
          value: ip(192, 168, 1, 12),
          label: '192.168.1.12',
          isCorrect: false,
          hintIfWrong: "That's Lisa's own IP! The gateway should be the router's address.",
        },
        {
          id: 'lisa-gw-wrong-internet',
          value: ip(203, 0, 113, 1),
          label: '203.0.113.1',
          isCorrect: false,
          hintIfWrong: "That's the public IP! Your gateway should be the router's internal (LAN) address, not its public address. Use 192.168.1.1.",
        },
      ],
    },
  ],
};

/**
 * Mission 1-1: Getting Online
 *
 * The very first mission. Players start with 3 employee PCs and an ISP connection point.
 * They need to purchase networking equipment and configure it to get their employees online.
 *
 * This mission teaches:
 * - Basic network topology (ISP -> Router -> Hub -> PCs)
 * - IP addressing fundamentals
 * - What a default gateway is and why it's needed
 * - Basic NAT concepts
 */
export const MISSION_1_1: Mission = {
  id: 'mission-1-1',
  phase: 1,
  order: 1,

  title: 'Getting Online',
  briefing: `
Welcome to your first day as the IT manager at NexGen Design!

Your three employees - Sarah, Mike, and Lisa - are eager to start working, but there's a problem:
none of their computers can connect to the internet. The previous IT person left in a hurry,
and all they left behind was an ISP connection and three workstations.

Your mission is to get everyone online so they can start doing their jobs.

Think of your network like a plumbing system:
- The **Internet (ISP)** is like the city's main water supply
- Your office needs internal **pipes** (cables) to distribute that water
- You'll need a **valve junction (router)** to connect your internal plumbing to the city water
- A **pipe splitter (hub or switch)** to distribute water to multiple faucets (computers)
- Each faucet needs a **house number (IP address)** so water knows where to go

Let's build your network!
  `.trim(),

  objectives: [
    {
      id: 'obj-buy-router',
      description: 'Purchase a router from the Shop',
      type: 'connect-device',
      target: 'router',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-connect-isp',
      description: 'Connect the router to the ISP (Internet)',
      type: 'connect-device',
      target: { from: 'router', to: 'internet' },
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-buy-hub',
      description: 'Purchase a hub or switch to connect multiple computers',
      type: 'connect-device',
      target: 'hub',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-connect-hub',
      description: 'Connect the hub to the router',
      type: 'connect-device',
      target: { from: 'hub', to: 'router' },
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-connect-pcs',
      description: 'Connect all 3 employee computers to the hub',
      type: 'connect-device',
      target: 'computer',
      current: 0,
      required: 3,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-configure-ips',
      description: 'Assign IP addresses to all computers',
      type: 'assign-ip',
      target: 'computer',
      current: 0,
      required: 3,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-configure-gateways',
      description: 'Set the default gateway on all computers',
      type: 'assign-ip',
      target: 'gateway',
      current: 0,
      required: 3,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-internet-access',
      description: 'Verify all 3 computers can reach the internet',
      type: 'achieve-connectivity',
      target: 'internet',
      current: 0,
      required: 3,
      completed: false,
      optional: false,
    },
  ],

  learningObjectives: [
    {
      id: 'learn-ip-addressing',
      concept: 'ipv4-addressing',
      description: 'Understand that each device needs a unique IP address to communicate',
      assessmentType: 'action',
      completed: false,
    },
    {
      id: 'learn-private-ip',
      concept: 'private-vs-public-ip',
      description: 'Learn the difference between private (192.168.x.x) and public IP addresses',
      assessmentType: 'observation',
      completed: false,
    },
    {
      id: 'learn-gateway',
      concept: 'routing-basics',
      description: 'Understand that a default gateway is the "exit door" for traffic leaving your network',
      assessmentType: 'action',
      completed: false,
    },
    {
      id: 'learn-nat',
      concept: 'nat-purpose',
      description: 'Learn why NAT allows many private IP addresses to share one public IP',
      assessmentType: 'observation',
      completed: false,
    },
  ],

  hints: [
    // Progressive hints for buying a router
    {
      id: 'hint-1-router',
      order: 1,
      condition: { type: 'stuck-on-step', value: 'obj-buy-router' },
      content: `
**Step 1: You Need a Router!**

Think of a router like the main valve junction in a plumbing system. It's the device that connects your internal pipes (your office network) to the city water main (the Internet).

Without a router, your computers have no way to reach the outside world - they're like houses with pipes that don't connect to anything!

**What to do:** Go to the **Shop** tab and purchase a "BasicNet Home Router" ($150).

*Why a router specifically?* Routers operate at Layer 3 of the network - they understand IP addresses and can "translate" between your private internal network and the public Internet using something called NAT (Network Address Translation).
      `.trim(),
      type: 'dialog',
    },
    // Connect router to ISP
    {
      id: 'hint-2-isp',
      order: 2,
      condition: { type: 'stuck-on-step', value: 'obj-connect-isp' },
      content: `
**Step 2: Connect to the Internet!**

Your router is like a valve that can connect two pipe systems together. One side connects to the "city water" (Internet), the other to your internal plumbing (LAN).

The ISP has given you a "handoff" point - this is like the meter where the city water enters your property. Your router's **WAN (Wide Area Network) port** connects here.

**What to do:**
1. Go to the **Network** tab
2. **Right-click** on your router
3. Click on the **Internet (ISP)** device to connect them

When you connect, the router automatically gets a **public IP address** from the ISP and enables **NAT**. NAT is like a secretary who receives all mail addressed to "Your Building" and then figures out which apartment (computer) it should go to.
      `.trim(),
      type: 'dialog',
    },
    // Buy a hub
    {
      id: 'hint-3-hub',
      order: 3,
      condition: { type: 'stuck-on-step', value: 'obj-buy-hub' },
      content: `
**Step 3: You Need a Hub!**

You have 3 computers that need to connect, but your router only has so many ports. Plus, connecting everything directly to the router isn't ideal.

A **Hub** is like a pipe splitter - it takes one incoming pipe and splits it into multiple outgoing pipes. It's a simple, cheap device that lets multiple computers share a connection.

**What to do:** Go to the **Shop** and buy a "4-Port Network Hub" ($25).

*Why a hub instead of a switch?* Hubs are "dumb" - they just broadcast everything to everyone (like shouting in a room). Switches are smarter but cost more. For now, a hub will do!

*Plumbing analogy:* A hub is like a manifold that splits one water line into multiple lines. Whatever goes in comes out of ALL the other ports - simple but not efficient for high traffic.
      `.trim(),
      type: 'dialog',
    },
    // Connect hub to router
    {
      id: 'hint-4-hub-router',
      order: 4,
      condition: { type: 'stuck-on-step', value: 'obj-connect-hub' },
      content: `
**Step 4: Connect the Hub to Your Router!**

Now you need to connect your hub to one of the router's **LAN ports**. LAN stands for Local Area Network - it's your internal network.

Think of it like this: The router's WAN port faces "outward" to the Internet (city water), while its LAN ports face "inward" to your office (internal pipes). The hub extends those internal pipes.

**What to do:**
1. On the **Network** tab, **right-click** on the hub
2. Click on the **router** to connect them
3. The hub should connect to one of the router's **LAN** ports (lan0, lan1, etc.)

Now data can flow: Internet → Router WAN → Router LAN → Hub → Computers
      `.trim(),
      type: 'dialog',
    },
    // Connect computers
    {
      id: 'hint-5-pcs',
      order: 5,
      condition: { type: 'stuck-on-step', value: 'obj-connect-pcs' },
      content: `
**Step 5: Connect the Computers!**

Time to connect Sarah, Mike, and Lisa's computers to the hub. Each computer has an ethernet port (eth0) that needs a cable to the hub.

**What to do:**
1. **Right-click** on each computer
2. Click on the **hub** to connect them
3. Do this for all 3 computers

*Plumbing analogy:* You're running individual water lines from the splitter (hub) to each faucet (computer). Now water CAN flow to them... but they don't have addresses yet!

Think of it like having pipes installed to houses that don't have street numbers. The mail carrier (data packets) wouldn't know where to deliver!
      `.trim(),
      type: 'dialog',
    },
    // Configure IPs
    {
      id: 'hint-6-ips',
      order: 6,
      condition: { type: 'stuck-on-step', value: 'obj-configure-ips' },
      content: `
**Step 6: Assign IP Addresses!**

Every device on a network needs a unique **IP address** - it's like a street address for data. Without it, data packets don't know where to go!

For your internal network, you'll use **private IP addresses**. The most common range is **192.168.1.x**:
- 192.168.1.1 → typically the router
- 192.168.1.2 through 192.168.1.254 → available for your devices

**What to do:**
1. **Double-click** on each computer to open its configuration
2. Set an IP address like:
   - Sarah's PC: **192.168.1.10**
   - Mike's PC: **192.168.1.11**
   - Lisa's PC: **192.168.1.12**
3. Set the subnet mask to **255.255.255.0** (or use the /24 preset)

*Why these specific numbers?* The "192.168.1" part is like the street name - all devices on the same network share it. The last number (10, 11, 12) is the house number - unique for each device.

*Why "private" IPs?* These addresses only work inside your network. They can't be used on the Internet directly - that's where NAT comes in!
      `.trim(),
      type: 'dialog',
    },
    // Configure gateways
    {
      id: 'hint-7-gateway',
      order: 7,
      condition: { type: 'stuck-on-step', value: 'obj-configure-gateways' },
      content: `
**Step 7: Set the Default Gateway!**

An IP address lets devices talk to each other on the same network, but how do they reach the Internet? They need to know the **"exit door"** - the **default gateway**.

Think of it like giving directions: "To leave this building, go to the lobby." The default gateway is your lobby - specifically, it's your **router's LAN IP address**.

**What to do:**
1. **Double-click** each computer
2. Set the **Default Gateway** to your router's LAN IP (likely **192.168.1.1**)
3. The router's LAN IP should be visible in its configuration

*Plumbing analogy:* If water in your house needs to go somewhere outside your building, it flows to the main valve (router). The default gateway tells each faucet: "If you need water to go outside, send it THIS way."

Without a gateway, your computers can talk to each other (same building), but can't reach the Internet (outside world)!
      `.trim(),
      type: 'dialog',
    },
    // Final check
    {
      id: 'hint-8-verify',
      order: 8,
      condition: { type: 'stuck-on-step', value: 'obj-internet-access' },
      content: `
**Step 8: Verify Connectivity!**

Almost there! Let's make sure everything is working. For a computer to reach the Internet, you need:

✅ **Physical connection** - Cable from PC → Hub → Router → ISP
✅ **IP Address** - Each PC has a unique address (192.168.1.x)
✅ **Subnet Mask** - Defines the network boundary (255.255.255.0)
✅ **Default Gateway** - Points to the router (192.168.1.1)
✅ **Router NAT enabled** - Translates private IPs to public (automatic when connected to ISP)

**Troubleshooting checklist:**
- Is the router connected to the ISP? (Should show "online" status)
- Is the router connected to the hub?
- Are all computers connected to the hub?
- Does each computer have a UNIQUE IP?
- Does each computer have the gateway set to the router?

*How it works:* When Sarah's PC wants to visit a website:
1. It sends data to the gateway (router)
2. Router uses NAT to "translate" from private IP to public IP
3. Data goes out to the Internet
4. Response comes back to router's public IP
5. Router's NAT table knows to send it back to Sarah's private IP

That's the magic of NAT - one public address, many private devices!
      `.trim(),
      type: 'dialog',
    },
  ],

  // Mission-specific configuration choices
  missionConfig: MISSION_1_1_CONFIG,

  prerequisites: [],
  unlocks: ['mission-1-2'], // Unlocks the Layer 2 switch mission

  rewards: [
    {
      type: 'cash',
      value: 100,
      description: 'Bonus for getting everyone online',
    },
    {
      type: 'xp',
      value: 50,
      description: 'Experience points for completing your first network',
    },
    {
      type: 'unlock-hardware',
      value: 'switch-l2-8port',
      description: 'Unlocks Layer 2 managed switches in the shop',
    },
  ],

  status: 'available',
};

// Helper to get hint by ID
export function getHintById(hintId: string) {
  return MISSION_1_1.hints.find((h) => h.id === hintId);
}

// Helper to get next hint for current progress
export function getNextHint(completedObjectives: string[]) {
  const objectiveOrder = MISSION_1_1.objectives.map((o) => o.id);

  for (const objId of objectiveOrder) {
    if (!completedObjectives.includes(objId)) {
      // Find hint for this objective
      const hint = MISSION_1_1.hints.find(
        (h) => h.condition.type === 'stuck-on-step' && h.condition.value === objId
      );
      return hint;
    }
  }
  return null;
}
