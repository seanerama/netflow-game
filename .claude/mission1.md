# NetQuest: Mission 1 Design Document
## "Getting Bubba's Properties Online"

---

## SETTING & CONTEXT

**Year:** 2001  
**Location:** Possum Holler, Rural USA  
**Company:** Bubba's Premium Property Management ("We Put the 'Manage' in 'Mangled Fences'")  
**Employees:** 4 (Bubba, his cousin Earl, receptionist Darlene, and "the accountant" who is actually Bubba's mom working from the back room)  
**Internet Provider:** Possum Holler Telecom (only offers T1 circuits, $800/month - "It ain't cheap, but it's the only pipe into town")

**How Player Gets the Job:**  
Player sees a classified ad in the "Possum Holler Gazette" want ads:

> **HELP WANTED:** Need computer feller to hook up them internets. Got four computin' machines need to go online. Will pay fair. Ask for Bubba. 555-RENT

---

## MISSION 1 OVERVIEW

**Win Condition:** All 4 PCs can browse the internet, send email, and the network is secure from basic external threats.

**Total Sub-Missions:**
- 1.1 - Connect to the Internet (Router + Hub + Basic Config)
- 1.2 - Lock the Door (Basic Firewall/ACLs)
- 1.3 - Growing Pains (Second Hub + Collision Domain Problems)
- 1.4 - The Great Slowdown (Diagnose Collision Issues)
- 1.5 - Switching Things Up (Upgrade to a Switch)
- 1.6 - Sharing is Caring (File Server + Network Shares)
- 1.7 - Print Money (Network Printer Setup)
- 1.8 - You're Hired! (Full-time offer, sets up Mission 2)

---

## SUB-MISSION 1.1: "Hook 'Em Up"
### Connecting the Office to the Internet

---

### NARRATIVE SETUP

**Opening Cutscene:**
Player enters Bubba's office. It's a converted double-wide trailer. Bubba sits behind a desk made from sawhorses and a door. Four beige PCs sit on desks around the room, power cables dangling, but no network cables in sight. A brand new T1 demarc box is mounted on the wall with a blinking green light.

**Bubba (dialogue):**
> "Well howdy there, computer person! See that blinky box on the wall? The phone company feller said that's our 'Tee-One' internet pipe. Cost me eight hunnerd dollars a month! Now I got four computers here that need to talk to that there internet so Darlene can do her email and Earl can look up... well, whatever Earl looks up. Here's $350 for whatever doodads you need. Git 'er done!"

**Budget Received:** $350

---

### STEP 1: THE EQUIPMENT STORE

**Screen:** "Hank's Hardware & Electronics" - A 16-bit storefront with shelves of networking equipment

**Player Task:** Select equipment to purchase

**AVAILABLE ITEMS:**

| Item | Price | Description (shown on hover/select) |
|------|-------|-------------------------------------|
| **LinkSys BEFSR41 Router** | $89 | 4-port 10/100 router with NAT, basic firewall, 1 WAN port. "The little blue box that could!" |
| **NetGear RP114 Router** | $79 | Similar specs, slightly cheaper. "Budget friendly!" |
| **D-Link DI-604 Router** | $85 | 4-port router, good reviews. "Reliable as a pickup truck." |
| **NetGear DS108 8-Port Hub** | $45 | 10/100 hub, 8 ports. "Connects stuff together!" |
| **NetGear DS104 4-Port Hub** | $29 | 10/100 hub, 4 ports. "The basics." |
| **3Com OfficeConnect Switch** | $129 | 8-port 10/100 switch. "Fancy pants networking!" |
| **Cat5 Cable (25ft)** | $8 each | "The blue spaghetti that makes it all work" |
| **Cat5 Cable (50ft)** | $12 each | "Extra long blue spaghetti" |
| **USB WiFi Adapter** | $49 | "Wireless internets!" (RED HERRING - won't help here) |
| **56K Modem** | $35 | "For dial-up connections" (RED HERRING - they have T1) |

**CORRECT SHOPPING LIST:**
- 1x Router (any of the three) = ~$85
- 1x 8-Port Hub = $45 (need 8 ports: 4 PCs + 1 for router + 3 spare for growth)
- 5x Cat5 cables = $40-60
- **Total:** ~$170-190 (under budget, Bubba will be pleased)

**WRONG CHOICES & FEEDBACK:**

| Wrong Choice | What Happens | Analogy/Explanation |
|--------------|--------------|---------------------|
| **No router, just hub** | Red X appears. Earl's PC shows error "NO INTERNET" | "A hub is like a party line telephone - everyone can talk to each other in the room, but nobody can call outside! You need a router to connect your local network to the internet. Think of it like a translator that speaks both 'office language' and 'internet language.'" |
| **Only router, no hub** | Router only has 4 LAN ports. Config screen shows you can connect 4 PCs but router is maxed | "That router only has 4 ports, and you've got 4 PCs. That works... barely. But what happens when Bubba hires someone new? Or wants to add a printer? You need a hub to expand your network - it's like adding a power strip to get more outlets." |
| **56K Modem** | Bubba scratches head, points at T1 box | "Son, I'm already payin' $800 a month for that fancy T1 line! Why would I want to use the phone line at 56 thousand bits when I got 1.5 MILLION bits right there on the wall?" (Shows comparison: T1 = 1.544 Mbps vs Modem = 0.056 Mbps) |
| **USB WiFi Adapter** | Shows adapter, then shows the 4 desktop PCs with no WiFi capability | "These old beige boxes don't have WiFi antennas, and even if they did, you'd need a wireless access point, not just an adapter. Plus, you've got a perfectly good T1 sitting there! Let's crawl before we fly." |
| **No cables** | Bubba stares at equipment sitting unconnected | "Well shoot, how are these boxes supposed to talk to each other - telepathy? You need cables to connect everything! Think of 'em like the pipes that carry water between your well and your faucets." |
| **4-port hub instead of 8** | Works initially, but shows "NO PORTS AVAILABLE" when trying to add something later | "Works for now, but you're maxed out. Good network folks always plan for growth. It's like buying a house with exactly as many bedrooms as you have kids - no room for surprises!" |

---

### STEP 2: PHYSICAL SETUP

**Screen:** Top-down view of the office showing:
- T1 demarc box on wall (pulsing green)
- 4 PC workstations (Bubba, Earl, Darlene, Accountant)
- Empty desk where router will go
- Cable runs visible as dotted lines

**Player Task:** Drag and drop to connect:
1. Router to T1 demarc (WAN port)
2. Router to Hub (LAN port)
3. Each PC to Hub

**VISUAL FEEDBACK:**
- Correct connection = cable solidifies, small green checkmark
- Wrong connection = cable turns red, buzzer sound, reverts

**WRONG CONNECTIONS:**

| Wrong Connection | Visual Feedback | Explanation |
|------------------|-----------------|-------------|
| PC directly to T1 demarc | Red cable, sparks | "Whoa there! You can't plug a PC directly into the T1 line. That's like trying to drink directly from the water main - you need pipes (the router) to make it usable and safe!" |
| Router WAN to Hub | Yellow warning | "You've connected the router's 'outside' port to your inside network. The WAN port needs to connect to the internet (the T1), not to your local devices. It's like connecting your front door to your bedroom instead of the outside world!" |
| Hub to Hub (if player bought 2) | Causes loop, network goes haywire | "Network loop detected! When you connect hubs in a circle, data packets get confused and keep spinning forever like a dog chasing its tail. We'll learn how to properly daisy-chain equipment later." |
| PC to Router LAN (when hub available) | Yellow warning | "That works, but you're using up one of your router's precious 4 ports. Save those for important stuff and use the hub to expand - that's what it's for!" |

**COMPLETION STATE:**
When all connections are correct, cables all show solid green, and a "HARDWARE READY" banner appears.

---

### STEP 3: ROUTER CONFIGURATION

**Screen:** Simulated router admin page (styled like classic LinkSys blue interface, but with 16-bit aesthetic)

**Configuration Tasks:**

**3A. WAN Setup (The Outside Connection)**

The T1 provider has given you:
- IP Address: 203.45.67.89
- Subnet Mask: 255.255.255.248
- Gateway: 203.45.67.81
- DNS: 203.45.67.1, 203.45.67.2

**Player must enter these correctly into WAN configuration fields.**

**WRONG ENTRIES:**

| Error | What Happens | Explanation |
|-------|--------------|-------------|
| Wrong IP address | "NO INTERNET" error | "That IP address is like your street address on the internet. If you put the wrong one, it's like mail going to the wrong house - nobody can find you, and you can't find them!" |
| Wrong Subnet Mask | Partial connectivity, some sites work | "The subnet mask tells your router which addresses are 'neighbors' and which are 'far away.' Wrong mask = confused router. It's like having a map where some streets are in the wrong neighborhood." |
| Wrong Gateway | No outbound traffic | "The gateway is your 'door to the outside world.' Without the right gateway, your router knows the local network but doesn't know how to reach the internet. It's like knowing every house in your neighborhood but not knowing where the highway entrance is!" |
| Wrong DNS | Sites don't resolve by name | "DNS is like the internet's phone book - it turns names like 'google.com' into actual addresses. Wrong DNS = you have to know everyone's number by heart!" |

**3B. LAN Setup (The Inside Network)**

**Player must configure:**
- Router LAN IP: 192.168.1.1
- Subnet Mask: 255.255.255.0
- DHCP: OFF (we're doing static for learning purposes)

**TEACHING MOMENT - POPUP:**
> "Now, here's the thing - Bubba only has ONE public IP address (203.45.67.89), but he's got FOUR computers! How does that work?
>
> It's like having one phone number for a whole office. When someone calls, the receptionist (that's NAT - Network Address Translation) answers and routes the call to the right person. From the outside, everyone just sees one number. Inside, each person has their own extension.
>
> Your 192.168.x.x addresses are 'internal extensions' - they only work inside the office. The router translates between inside addresses and the one outside address. Pretty clever, huh?"

**VISUAL AID:** Split screen showing:
- LEFT: House with 4 people inside, one mailbox outside
- RIGHT: Office with 4 computers, one public IP, router translating

---

### STEP 4: PC CONFIGURATION

**Screen:** Windows XP-style network configuration dialog (16-bit styled)

**For each of the 4 PCs, player must configure:**

| PC | IP Address | Subnet | Gateway | DNS |
|----|------------|--------|---------|-----|
| Bubba's PC | 192.168.1.10 | 255.255.255.0 | 192.168.1.1 | 192.168.1.1 |
| Earl's PC | 192.168.1.11 | 255.255.255.0 | 192.168.1.1 | 192.168.1.1 |
| Darlene's PC | 192.168.1.12 | 255.255.255.0 | 192.168.1.1 | 192.168.1.1 |
| Accountant PC | 192.168.1.13 | 255.255.255.0 | 192.168.1.1 | 192.168.1.1 |

**WRONG ENTRIES:**

| Error | Symptom | Explanation |
|-------|---------|-------------|
| Duplicate IP (two PCs same address) | Both PCs show "IP CONFLICT" error, neither works | "It's like two houses with the same street address - the mailman doesn't know which one to deliver to, so nobody gets their mail! Every device needs a UNIQUE IP address." |
| Wrong subnet (192.168.2.x instead of 192.168.1.x) | PC can't see router or other PCs | "You put that computer in a different neighborhood! 192.168.1.x and 192.168.2.x are different networks. It's like being in a different zip code - your local mail carrier can't reach you." |
| Gateway pointing to itself | PC shows "NO ROUTE TO HOST" | "You told the computer to ask itself how to get to the internet. That's like asking yourself for directions to a place you've never been!" |
| Gateway pointing to another PC | Same PC can't reach internet | "That's just Earl's computer, not the router! Earl's computer doesn't know how to get to the internet either. The gateway has to be the router - the only device that actually connects to the outside." |
| Wrong subnet mask | Intermittent connectivity | "The subnet mask helps the computer understand which addresses are 'local' (use hub) vs 'remote' (use router). Wrong mask = confusion about who's a neighbor." |

---

### STEP 5: THE TEST

**Screen:** Split view showing all 4 PCs with browser windows

**Test Sequence:**
1. Each PC pings the router (192.168.1.1) - Green checkmarks appear
2. Each PC pings another PC - More green checkmarks
3. Each PC loads "possum-holler-news.com" (fictional site) - Browser shows webpage
4. Darlene sends a test email - Envelope animation flies

**SUCCESS CELEBRATION:**
Bubba jumps up from his chair (pixel animation):
> "HOT DIGGITY DOG! Darlene, we got the internets! Send Mama an email and tell her to check the Beanie Baby prices on that eBay thing!"

**UNLOCK:** $50 bonus added to budget for future missions. "You came in under budget, so I'm lettin' you keep the difference!"

---

### THE WHY - CONCEPT SUMMARY (Post-Mission)

**Popup/Scroll explaining what the player just did:**

---

**📬 IP ADDRESSES - Your Digital Street Address**

Just like houses need addresses for mail delivery, computers need IP addresses for data delivery.

*Public IP (203.45.67.89):* Your address on the global internet. Like your street address that anyone in the world can send mail to.

*Private IP (192.168.1.x):* Your internal "room number." Only works inside your building. Three ranges are reserved for private use:
- 10.0.0.0 - 10.255.255.255 (Class A - Huge company)
- 172.16.0.0 - 172.31.255.255 (Class B - Medium company)
- 192.168.0.0 - 192.168.255.255 (Class C - Small office/home)

---

**🔄 NAT - The Receptionist**

NAT (Network Address Translation) lets multiple devices share one public IP address.

*Analogy:* Imagine an office with one main phone number. When someone calls, the receptionist answers and transfers the call to the right person. From outside, callers only see one number. Inside, everyone has their own extension.

When Earl visits a website:
1. His PC (192.168.1.11) sends request to router
2. Router changes the "from" address to 203.45.67.89 (and remembers Earl asked)
3. Website sees request from 203.45.67.89, sends response there
4. Router receives response, remembers "this was Earl's request"
5. Router forwards response to 192.168.1.11

---

**🔌 HUBS - The Party Line**

A hub is like an old-fashioned party line telephone - when one person talks, EVERYONE hears it.

When Darlene's PC sends data:
1. Data arrives at the hub
2. Hub copies it to ALL other ports
3. All PCs receive it
4. Only the intended recipient actually processes it

*Problems with this:*
- Wasted bandwidth (everyone gets everything)
- Collisions (two people talk at once)
- No privacy (everyone can eavesdrop)

*Why we used it:* It's cheap and simple. For 4 PCs doing light web browsing, it works fine. But wait until the office grows...

---

**🌐 DNS - The Internet Phone Book**

DNS (Domain Name System) translates human-friendly names to IP addresses.

You type: www.google.com
DNS returns: 142.250.80.46

Without DNS, you'd need to memorize numbers for every website. Imagine memorizing phone numbers for every person you know instead of looking them up by name!

---

## MISSION 1.2: "Lock the Door"
### Basic Firewall Configuration

---

### NARRATIVE SETUP

**Opening Scene:**
Player arrives at office. Darlene is frantic.

**Darlene (dialogue):**
> "Oh thank goodness you're here! My sister Lurleen said her computer got them 'worms' from the internet and now it sends emails to everyone in her address book about discount pharmaceuticals! Bubba's worried the same thing'll happen to us. Can you put some kinda lock on our internet door?"

**Bubba adds:**
> "Yeah, I don't need Earl accidentally downloadin' no viruses while he's... researching tractors. Or whatever he does."

---

### STEP 1: UNDERSTANDING THE THREAT

**Teaching Popup:**

> "Right now, your network is like a house with no locks. Anyone on the internet can theoretically knock on any 'door' (port) of your public IP address. Most of the time nothing bad happens, but there are automated programs constantly scanning the internet looking for open doors to sneak through.
>
> The T1 connection means you're 'always on' - unlike dial-up where you're only connected when you're using it. It's like leaving your front door wide open 24/7 vs only opening it when you expect a visitor."

**Visual:** Animation showing random "knock knock" attempts on different ports, some labeled "Port 21 - FTP", "Port 23 - Telnet", "Port 445 - Windows Sharing"

---

### STEP 2: FIREWALL CONFIGURATION

**Screen:** Router admin page, Firewall section

**Task:** Configure basic firewall rules

**AVAILABLE OPTIONS:**

| Rule | Setting | Effect |
|------|---------|--------|
| Block All Inbound | ON/OFF | Blocks all unsolicited incoming connections |
| Allow Established | ON/OFF | Lets responses to YOUR requests come back |
| Block ICMP (Ping) | ON/OFF | Makes your IP invisible to basic scans |
| Block Specific Ports | List | Target specific dangerous services |

**CORRECT CONFIGURATION:**
- Block All Inbound: ON
- Allow Established: ON (CRITICAL - otherwise nothing works!)
- Block ICMP: ON (optional, but good practice)

**WRONG CHOICES:**

| Wrong Setting | What Happens | Explanation |
|---------------|--------------|-------------|
| Block All Inbound ON, Allow Established OFF | NO INTERNET - pages won't load | "You locked the door AND blocked the mail slot! When you visit a website, you send a request OUT, but the response needs to come back IN. 'Allow Established' lets responses to your requests come through while still blocking strangers from initiating contact." |
| Everything OFF | Bubba gets a popup about "ILOVEYOU virus" | "Wide open! You're basically inviting trouble. Security 101: Block everything by default, then only allow what you specifically need." |
| Block specific ports but miss common attack vectors | "Partial protection" warning | "Good effort, but you're playing whack-a-mole. It's easier to block EVERYTHING and allow exceptions than to try to block every bad thing individually." |

---

### STEP 3: THE TEST

**Visual:** "Hacker view" showing external scan of Bubba's IP
- Before firewall: Multiple open ports visible
- After firewall: "Host appears down" or "All ports filtered"

**Darlene:**
> "So we're safe now?"

**Player Response Options (teaching moment):**
> A) "Completely safe!" ❌
> B) "Safer, but not invincible. Don't click weird email attachments." ✓

**If A:** Darlene immediately clicks a "YOU WON A FREE CRUISE" email attachment. Lesson about social engineering and human factors.

**If B:** Darlene nods sagely. Brief popup about layers of security.

---

### THE WHY - CONCEPT SUMMARY

**📡 TCP/IP - The Delivery Protocol**

TCP (Transmission Control Protocol) is like certified mail:
- Confirms delivery
- Requests missing pieces to be resent
- Reliable but slower

UDP (User Datagram Protocol) is like postcards:
- Just sends and hopes it arrives
- No confirmation
- Faster but less reliable

**🚪 PORTS - Doors to Services**

Every network service uses a "port" - a numbered door. Common ones:
- Port 80: HTTP (websites)
- Port 443: HTTPS (secure websites)
- Port 25: SMTP (sending email)
- Port 21: FTP (file transfer)
- Port 23: Telnet (remote access - DANGER!)
- Port 3389: Remote Desktop (DANGER if exposed!)

**🧱 FIREWALLS - The Bouncer**

A firewall is like a bouncer at a club:
- Checks ID (source/destination address)
- Checks invitation (is this a response to something we requested?)
- Blocks uninvited guests
- Has a VIP list (allowed exceptions)

---

## MISSION 1.3: "Growing Pains"
### Second Hub and Collision Domain Introduction

---

### NARRATIVE SETUP

**Opening Scene:**
Office is busier. Two new desks with PCs. Bubba is on the phone.

**Bubba (hanging up):**
> "Good news and bad news. Good news: Business is boomin'! We bought out Billy Ray's Rental Properties, so now we got more units to manage. Bad news: I hired my nephew Scooter and his friend Wayne to help out, and they need computers too. Here's $100 - make it work."

**Current Setup:**
- 8-port hub with 5 ports used (4 PCs + 1 router connection)
- 3 ports remaining
- Need to add: 2 new PCs

**Budget:** $100

---

### STEP 1: EQUIPMENT DECISION

**Bubba's Stipulation:**
> "Now, I ain't made of money. We ain't buyin' no fancy new hub or switch thing. We got ports left over, right? Just plug 'em in!"

**Reality Check:**
- Current hub has 3 free ports
- Need 2 ports for new PCs
- This WILL work... for now

**Player Options:**

| Option | Cost | Bubba's Reaction |
|--------|------|------------------|
| Use existing hub ports | $0 + cables | "Now that's what I like to hear!" |
| Buy 8-port switch (suggest) | $129 | "What? The hub's just fine! We ain't spending that." |
| Buy another hub (daisy-chain) | $45 + cables | "Well... if we gotta, I guess." |

**FORCED CHOICE:** Bubba won't approve the switch purchase. Player must either use existing hub (if ports available) or daisy-chain a second hub.

**FORESHADOWING:** If player tries to suggest the switch, they get:
> "I'm sure that'd be real nice, but unless this hub catches fire, we're stickin' with what we got."

---

### STEP 2: CONFIGURATION

**Quick setup:** Assign IPs to Scooter (192.168.1.14) and Wayne (192.168.1.15)

**Test:** Both can browse internet. Success... for now.

**Ending Note:**
> "Everything seems fine, but you notice the network activity light on the hub is blinking like crazy even when nobody seems to be doing anything. You make a mental note to keep an eye on it."

---

## MISSION 1.4: "Why's the Internet So Slow?"
### Diagnosing Collision Domain Issues

---

### NARRATIVE SETUP

**Timeline:** 2 weeks later

**Opening Scene:**
Everyone is frustrated. Earl is mashing his keyboard.

**Earl:**
> "This dad-gum internet keeps stutterin'! I'm trying to look at... tractor parts... and the pictures load all herky-jerky!"

**Darlene:**
> "My email takes forever to send, and sometimes it just times out!"

**Scooter:**
> "Yeah, and when Wayne and me are both downloading stuff, everything slows to a crawl!"

**Bubba:**
> "I'm payin' $800 a month for this T1! Fix it!"

---

### STEP 1: DIAGNOSIS TOOLS

**Player receives "Network Diagnostics" toolkit:**

| Tool | What It Shows |
|------|---------------|
| Traffic Monitor | Real-time bandwidth usage per port |
| Collision Counter | Number of collisions detected |
| Network Map | Visual of current topology |
| Speed Test | Internet speed vs local transfer speed |

**FINDINGS:**

**Traffic Monitor:**
- Total hub traffic: 85-95 Mbps (hub maxing out its shared bandwidth)
- Even light browsing causes spikes

**Collision Counter:**
- Collisions detected: 847 in the last hour
- Rate: EXCESSIVE

**Speed Test:**
- Internet speed: 1.5 Mbps (T1 is fine)
- PC-to-PC transfer: 3-8 Mbps (should be ~80+ Mbps on 100Mbps network)

---

### STEP 2: THE EXPLANATION

**Teaching Popup with Animation:**

> "Remember when we said a hub is like a party line telephone? Here's the problem: when two people try to talk at the same time, their voices collide and neither message gets through. Both have to stop, wait a random amount of time, and try again.
>
> With 6 computers on one hub, all sharing the same 'wire,' collisions happen CONSTANTLY. Each collision means:
> 1. The data doesn't get through
> 2. Both computers wait
> 3. Both computers retry
> 4. Maybe they collide AGAIN
>
> It's like a room where 6 people are trying to have 3 different conversations, but there's only one microphone that everyone has to share!"

**Visual:** Animation showing data packets colliding, backing off, retrying

**💥 COLLISION DOMAIN explained:**
> "A collision domain is the group of devices that might interfere with each other. With a hub, EVERY connected device is in the SAME collision domain. It's like a single-lane road where everyone has to take turns."

---

### STEP 3: THE REVELATION

**Player reports findings to Bubba:**
> "The hub is creating a bottleneck. Everyone's data is fighting for the same wire, causing collisions. The more computers you add, the worse it gets."

**Bubba:**
> "So what, I gotta buy one of them fancy switches after all?"

**Player Response:**
> "Yes. A switch creates a separate 'lane' for each computer. No collisions, no fighting, everyone gets full speed."

**Bubba (sighing):**
> "Alright, alright. But this better fix it. Here's $150 - get whatever you need."

---

## MISSION 1.5: "Switching Things Up"
### Upgrading from Hub to Switch

---

### STEP 1: EQUIPMENT PURCHASE

**Budget:** $150

**CORRECT PURCHASE:**
- 3Com OfficeConnect 8-Port Switch: $129
- Extra Cat5 cables if needed: $8 each

**Store Description:**
> "Unlike a hub, a switch learns which devices are connected to which ports. When data comes in, it only sends it out the port where the recipient is, not everywhere. It's like having a smart secretary who knows exactly which desk everyone sits at!"

---

### STEP 2: THE SWAP

**Task:** Replace hub with switch (simple drag-and-drop, same physical topology)

**Visual Change:**
- Traffic monitor now shows individual conversations, not chaos
- Collision counter: 0
- Speed test PC-to-PC: 92 Mbps

---

### STEP 3: THE TEST

**Earl:**
> "Hot dang! Them tractor pictures load instant-like now!"

**Scooter:**
> "Wayne and me can both download at the same time and it doesn't even slow down!"

---

### THE WHY - CONCEPT SUMMARY

**🔀 HUB vs SWITCH**

| Feature | Hub | Switch |
|---------|-----|--------|
| Traffic handling | Broadcasts to ALL ports | Sends only to destination port |
| Collision domain | Single (all ports) | Multiple (each port is separate) |
| Learning | None | Builds MAC address table |
| Speed | Shared bandwidth | Dedicated bandwidth per port |
| Price (2001) | $30-50 | $100-150 |
| Best for | Very small, light use | Any real network |

**🧠 HOW SWITCHES LEARN**

1. Device A sends packet to Device B
2. Switch sees packet from Device A on Port 1
3. Switch records: "Device A's MAC address is on Port 1"
4. Switch broadcasts to find Device B (first time only)
5. Device B responds from Port 3
6. Switch records: "Device B's MAC address is on Port 3"
7. Future A→B traffic goes directly Port 1 → Port 3, no broadcast needed!

**🔗 MAC ADDRESSES**

Every network card has a unique MAC (Media Access Control) address.
Example: 00:1A:2B:3C:4D:5E

Unlike IP addresses (which can change), MAC addresses are burned into the hardware. They're like serial numbers. Switches use these to figure out who's connected where.

---

## MISSIONS 1.6 & 1.7: NETWORK SERVICES
### File Sharing and Printing

*[Brief outlines - full detail in future iterations]*

**1.6 - File Server:**
- Bubba wants everyone to access the same property documents
- Set up Windows File Sharing
- Teach: SMB protocol, shares, permissions
- Wrong choice: Everyone shares their whole C: drive publicly

**1.7 - Network Printer:**
- Add shared printer for invoices
- Teach: Print servers, TCP/IP printing, port 9100
- Wrong choice: Each PC has printer installed locally (inefficient)

---

## MISSION 1.8: "You're Hired!"
### Transition to Full-Time

---

### CLOSING SCENE

**Bubba's office. He's wearing a tie (poorly knotted).**

**Bubba:**
> "Well, you done good, computer person. Real good. Our internet's fast, it's secure, and even Earl can print his... tractor brochures... without hollerin' for help.
>
> Now here's the thing. My buddy Harlan owns a car dealership over in Springfield. He's got 30 employees and a computer system from 1995. He needs help BAD. And I told him I knew just the person.
>
> But more'n that - I want you to stick around. Part-time contractor ain't cuttin' it. How about you come work for Bubba's full-time? We'll call you our 'Network Administrator.' Whaddya say?"

**CHOICE:**
- "I'm in!" → Continue as Bubba's full-time IT person, Mission 2 begins
- "Let me think about it" → Same outcome but different dialogue

**UNLOCK:**
- Title: "Bubba's Network Administrator"
- Mission 2: "Harlan's House of Hondas" (30 employees, larger network, VLANs, more complex firewall)
- Reputation system begins

---

## VISUAL STYLE NOTES

### 16-Bit Aesthetic References

**Primary Inspiration:** Stardew Valley
- Charming pixel art characters with personality
- Warm, slightly desaturated color palette
- Expressive character portraits for dialogue
- Top-down perspective for office layout

**Secondary References:**
- EarthBound/Mother series: Quirky dialogue, mundane settings made interesting
- SimCity 2000: Technical UI elements, status panels
- Papers Please: Document/form interaction, attention to detail matters

**UI Elements:**
- Router admin pages: Simplified pixel versions of real interfaces
- Error messages: Friendly, slightly humorous pixel popups
- Teaching moments: "Professor" character or chalkboard aesthetic

**Color Coding:**
- Green: Correct/Connected/Working
- Red: Error/Wrong/Disconnected
- Yellow: Warning/Suboptimal
- Blue: Informational/Teaching

---

## THEME MODULARITY NOTES

For easy modding/theme changes:

**SEPARATION OF CONCERNS:**
1. **Narrative Layer:** Character dialogue, company names, scenarios (easily replaceable)
2. **Technical Layer:** Actual networking concepts (stays constant)
3. **Visual Layer:** Sprites, UI skins (theme-able)

**SUGGESTED FILE STRUCTURE:**
```
/themes/
  /bubba_redneck/ (default)
    characters.json
    dialogue.json
    sprites/
  /corporate_startup/
    characters.json
    dialogue.json
    sprites/
  /cyberpunk/
    ...
```

**KEEP CONSISTENT:**
- Equipment names (unless modernizing)
- IP addresses and configurations
- Correct/wrong answer logic
- Teaching explanations

**MODDABLE:**
- Character names and personalities
- Company backstory
- Dialogue tone (redneck humor → corporate jargon → cyberpunk slang)
- Visual assets
- Analogies in explanations (water/mail → data/packets → neon/circuits)

---

## APPENDIX: TECHNICAL ACCURACY NOTES

### Real Equipment Used as Reference (2001 Era)

**Routers:**
- Linksys BEFSR41 (actual 2001 device, ~$80 retail)
- Netgear RP114
- D-Link DI-604

**Hubs:**
- Netgear DS108 (8-port 10/100)
- Still sold in 2001, but already being phased out

**Switches:**
- 3Com OfficeConnect (affordable business switch)
- Netgear FS108 (8-port 10/100 switch)

**T1 Pricing:**
- ~$800-1500/month in 2001 for rural areas
- Includes 1.544 Mbps symmetric bandwidth
- Often the ONLY business-grade option outside metro areas

### Private IP Ranges (For Reference)
- 10.0.0.0/8 (Class A)
- 172.16.0.0/12 (Class B)
- 192.168.0.0/16 (Class C)

We use 192.168.1.x as it's the most common default for small routers.

---

## NEXT STEPS FOR DEV TEAM

1. **Art Team:** Begin character designs for Bubba, Earl, Darlene, and unnamed Accountant
2. **UI Team:** Mockup router admin interface in 16-bit style
3. **Writing Team:** Review dialogue for tone consistency
4. **Dev Team:** Prototype drag-and-drop network topology builder

**Questions for Discussion:**
- Do we want voice acting? (Text only recommended for modding flexibility)
- Mobile vs Desktop first?
- Tutorial hand-holding level (skippable for experienced players?)

---

*Document Version 1.0*
*For internal development use*