import type { Mission } from '../../types';

/**
 * Mission 1-3: Security Breach
 *
 * Lisa's PC gets infected with malware after clicking a phishing link.
 * The company gives you an emergency budget to improve security.
 * Players learn about TCP, firewalls, and why inbound connections are blocked.
 *
 * This mission teaches:
 * - What TCP is (the three-way handshake)
 * - How firewalls protect networks
 * - Why inbound connections are blocked by default
 * - The concept of stateful inspection
 * - How NAT provides implicit protection
 */
export const MISSION_1_3: Mission = {
  id: 'mission-1-3',
  phase: 1,
  order: 3,

  title: 'Security Breach!',
  briefing: `
**URGENT: Security Incident Report**

Bad news! Lisa clicked on a phishing email and her PC got infected with malware.
The malware is trying to "phone home" to its command server and has opened a backdoor
that attackers are actively trying to exploit.

The good news? Your router's firewall blocked most of the incoming attack attempts!
But management is concerned and has approved an **emergency IT security budget of $500**
to improve your network defenses.

Your mission:
1. Understand what happened and why the firewall helped
2. Verify your firewall settings are properly configured
3. Learn about TCP and why blocking inbound connections is crucial

*Plumbing analogy time:* Think of your network like a house. The firewall is like
having locks on all your doors that only open from the INSIDE. You can go out and
come back in (because you started the trip), but strangers can't just walk in
unless you explicitly let them.

Let's secure your network!
  `.trim(),

  objectives: [
    {
      id: 'obj-observe-attack',
      description: 'Watch the attack packets being blocked by your firewall',
      type: 'troubleshoot',
      target: 'observe-blocked-packets',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-check-firewall',
      description: 'Verify the router firewall is enabled with "deny inbound" policy',
      type: 'configure-firewall',
      target: 'router',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-understand-tcp',
      description: 'Read about TCP and the three-way handshake',
      type: 'troubleshoot',
      target: 'learn-tcp',
      current: 0,
      required: 1,
      completed: false,
      optional: false,
    },
    {
      id: 'obj-block-attacks',
      description: 'Successfully block 10 attack attempts',
      type: 'block-attack',
      target: 10,
      current: 0,
      required: 10,
      completed: false,
      optional: false,
    },
  ],

  learningObjectives: [
    {
      id: 'learn-tcp-handshake',
      concept: 'tcp-handshake',
      description: 'Understand the SYN, SYN-ACK, ACK process that establishes connections',
      assessmentType: 'observation',
      completed: false,
    },
    {
      id: 'learn-stateful-firewall',
      concept: 'stateful-firewall',
      description: 'Learn how stateful inspection tracks connection state',
      assessmentType: 'observation',
      completed: false,
    },
    {
      id: 'learn-inbound-outbound',
      concept: 'nat-purpose',
      description: 'Understand why outbound is allowed but inbound is blocked by default',
      assessmentType: 'action',
      completed: false,
    },
  ],

  hints: [
    // Observe attack
    {
      id: 'hint-1-attack',
      order: 1,
      condition: { type: 'stuck-on-step', value: 'obj-observe-attack' },
      content: `
**Understanding the Attack**

Go to the **Network** tab and watch for **red packets** - these are attack attempts
coming from the Internet trying to reach devices on your network.

You'll see them travel from the Internet (☁️) toward your router, then get **blocked**
with an X symbol. This is your firewall doing its job!

*What's happening technically:*
Attackers on the internet are sending TCP SYN packets (connection requests) to random
ports on your public IP address. They're looking for:
- Open SSH ports (22) - to try brute-force password attacks
- Open RDP ports (3389) - to take control of Windows machines
- Open web ports (80, 443) - to find vulnerable web applications

Your firewall sees these as **unsolicited inbound connections** and blocks them because
there's no matching outbound request - nobody inside your network asked for this traffic!

*Plumbing analogy:* Someone outside your house is jiggling all your door handles
trying to find one that's unlocked. Your security system (firewall) is blocking
each attempt and logging it.
      `.trim(),
      type: 'dialog',
    },
    // Check firewall
    {
      id: 'hint-2-firewall',
      order: 2,
      condition: { type: 'stuck-on-step', value: 'obj-check-firewall' },
      content: `
**Verify Your Firewall Configuration**

Your router has a built-in firewall that should already be configured, but let's verify:

**What to do:**
1. **Double-click** on your router to open its configuration
2. Look for the **Firewall** section
3. Verify these settings:
   - **Firewall Enabled:** Yes ✓
   - **Default Inbound Policy:** DENY ✓
   - **Default Outbound Policy:** ALLOW ✓
   - **Stateful Inspection:** Yes ✓

**Why these settings?**

- **Deny Inbound:** Blocks all incoming connections that weren't requested from inside.
  This is your primary defense against internet attacks!

- **Allow Outbound:** Lets your computers reach out to websites, email servers, etc.
  When they get responses, the firewall remembers they asked and lets the response in.

- **Stateful Inspection:** The firewall keeps a table of active connections.
  It knows "Sarah's PC asked to connect to google.com, so let Google's response through."

*Plumbing analogy:* The "deny inbound" rule is like having one-way valves on your
pipes - water can flow OUT but can't flow back IN unless you opened the valve yourself.
      `.trim(),
      type: 'dialog',
    },
    // Understand TCP
    {
      id: 'hint-3-tcp',
      order: 3,
      condition: { type: 'stuck-on-step', value: 'obj-understand-tcp' },
      content: `
**Understanding TCP: The Three-Way Handshake**

TCP (Transmission Control Protocol) is how most internet communication works.
Before any data is sent, both sides must agree to talk using a "three-way handshake":

**The Handshake (like a formal greeting):**

1. **SYN** (Client → Server): "Hello, I'd like to talk. Here's my sequence number."
   *Like knocking on a door*

2. **SYN-ACK** (Server → Client): "Hello! I heard your knock. Here's MY sequence number,
   and I acknowledge yours."
   *Like someone answering and saying "Come in!"*

3. **ACK** (Client → Server): "Great, I got your response. Let's talk!"
   *Like stepping inside and closing the door*

**Why This Matters for Security:**

When an attacker sends a SYN packet to your network, they're trying to START a conversation.
Your firewall sees this SYN packet coming from the internet and checks:
- "Did anyone INSIDE my network ask to talk to this person?" → NO
- "Should I let unsolicited strangers in?" → NO (deny inbound policy)
- Result: **BLOCKED** ✓

But when Sarah visits google.com:
- Sarah's PC sends SYN to Google → Firewall remembers this
- Google sends SYN-ACK back → Firewall says "Sarah asked for this!" → ALLOWED ✓
- Sarah sends ACK → Connection established!

*Plumbing analogy:* The three-way handshake is like a formal water connection process:
1. You call the water company: "I want water service"
2. They say: "Acknowledged, we'll connect you"
3. You confirm: "Thanks, turn it on!"

Random strangers can't just turn on your water - only connections YOU initiated!
      `.trim(),
      type: 'dialog',
    },
    // Block attacks
    {
      id: 'hint-4-block',
      order: 4,
      condition: { type: 'stuck-on-step', value: 'obj-block-attacks' },
      content: `
**Blocking Attack Attempts**

Your firewall is automatically blocking attacks, but let's make sure you're seeing them!

**What to look for:**
- **Red packets** coming from the Internet
- Packets that hit your router and show an **X** (blocked)
- The "Blocked Attacks" counter increasing

**Types of attacks you might see:**
- **Port Scan:** Attacker probing different ports looking for open services
- **Brute Force:** Repeated attempts to guess SSH or login passwords
- **Malware Delivery:** Trying to send malicious payloads

Each blocked packet counts toward your objective. As long as your firewall is
enabled with "deny inbound," you're protected!

**Why NAT Also Helps:**

Remember NAT (Network Address Translation) from Mission 1? It provides
accidental security too! Attackers can only see your PUBLIC IP address.
They have no idea that 192.168.1.10, 192.168.1.11, etc. even exist behind it.
Even if they guess those addresses, the router doesn't know how to forward
unsolicited traffic to them.

*Plumbing analogy:* NAT is like having a single street address for an apartment
building. Mail addressed to "Building 123" arrives, but the mailroom (router)
needs to know which apartment to deliver it to. If there's no matching request,
it gets returned to sender (blocked)!

**Pro tip:** In a real network, you'd also:
- Set up intrusion detection (IDS)
- Configure rate limiting
- Enable logging for forensics
- Consider a dedicated firewall device

But for now, your router's basic firewall is doing great!
      `.trim(),
      type: 'dialog',
    },
  ],

  prerequisites: ['mission-1-2'],
  unlocks: ['mission-2-1'], // Next phase - maybe broadcast storms and switches

  rewards: [
    {
      type: 'cash',
      value: 500,
      description: 'Emergency security budget from management',
    },
    {
      type: 'xp',
      value: 75,
      description: 'Experience for understanding network security',
    },
    {
      type: 'unlock-hardware',
      value: 'router-business',
      description: 'Unlocks business-grade router with advanced firewall',
    },
  ],

  status: 'locked',
};

// Helper to get hint by ID
export function getHintById(hintId: string) {
  return MISSION_1_3.hints.find((h) => h.id === hintId);
}

// Helper to get next hint for current progress
export function getNextHint(completedObjectives: string[]) {
  const objectiveOrder = MISSION_1_3.objectives.map((o) => o.id);

  for (const objId of objectiveOrder) {
    if (!completedObjectives.includes(objId)) {
      const hint = MISSION_1_3.hints.find(
        (h) => h.condition.type === 'stuck-on-step' && h.condition.value === objId
      );
      return hint;
    }
  }
  return null;
}
