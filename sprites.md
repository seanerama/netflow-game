# NetQuest Sprite Guide

## Overall Art Style

### Visual Direction
NetQuest uses a **retro pixel art style** inspired by late 90s/early 2000s educational games and simulation titles. The aesthetic should evoke the era the game is set in (2001) while remaining charming and accessible to modern players.

### Key Style Characteristics

**Pixel Density & Resolution**
- Target a **16x16 base grid** for the smallest elements
- Scale up in multiples: 16, 32, 48, 64, 128
- Maintain crisp, hard pixel edges - no anti-aliasing or smoothing
- All sprites should be pixel-perfect with no sub-pixel rendering

**Color Palette**
- Use a **limited, warm color palette** (32-64 colors max)
- Primary tones: Beige, tan, brown, muted greens, soft blues
- Accent colors: Green (success/active), Red (error/danger), Yellow (warning/highlight), Blue (information/links)
- Avoid pure black (#000) and pure white (#FFF) - use near-black (#1a1a2e) and off-white (#f0ead6)
- Colors should feel slightly desaturated, like a CRT monitor from the era

**Shading & Lighting**
- Use **2-3 shades per color** maximum (base, shadow, highlight)
- Light source from top-left (consistent across all sprites)
- Dithering patterns acceptable for gradients on larger sprites
- No gradients or soft shadows - all shading should be hard-edged

**Outline Style**
- **Dark outlines** (1-2px) on all sprites for clarity
- Outline color should be a darker shade of the adjacent fill color, not pure black
- Internal details can use thinner lines or rely on color contrast

**Character Style**
- **Chibi/simplified proportions** - large heads, small bodies
- Expressive faces with minimal detail (2-3 pixels for eyes, simple mouth shapes)
- Each character has a distinct **signature color** for easy identification
- Clothing and accessories should reflect rural/small-town 2001 aesthetic

**Equipment Style**
- Based on **real hardware from 1999-2002** (Linksys, Cisco, HP, etc.)
- Recognizable silhouettes - players should identify equipment at a glance
- Include small details like LED indicators, ports, and labels
- Slightly exaggerated proportions to emphasize key features

**Animation Guidelines**
- Simple **2-4 frame animations** for idle states
- Blinking LEDs: 2 frames (on/off)
- Character expressions: swap face sprites rather than animate
- Data packets: simple 2-frame "pulse" animation
- Keep animations subtle - this is a puzzle/strategy game, not an action game

**UI Integration**
- Sprites should feel cohesive with the terminal/DOS-inspired UI
- Equipment sprites need to work on both dark and light backgrounds
- Include "selected" and "hover" states for interactive elements
- Maintain consistent padding/margins when sprites are placed in UI containers

---

## Sprite Specifications

### Characters (Portraits for Dialogue)

| Sprite | Size | Description |
|--------|------|-------------|
| **Bubba** | 64x64 | Owner of Bubba's Premium Property Management. Middle-aged man with a friendly, slightly overweight appearance. Tan/brown skin tone. Wears a short-sleeve button-up shirt (sometimes with a poorly-knotted tie for formal occasions). Has a warm, approachable expression. Signature color: Brown (#8B4513). |
| **Darlene** | 64x64 | Office receptionist/secretary. Cheerful woman with a helpful demeanor. Styled hair typical of early 2000s. Wears professional but casual office attire. Always has a friendly smile. Signature color: Gold (#DAA520). |
| **Earl** | 64x64 | Property maintenance worker. Older man, rural appearance with a simple, honest look. Wears work clothes - flannel shirt or overalls. Tech-challenged but good-natured. Loves tractors. Signature color: Green (#228B22). |
| **Scooter** | 64x64 | Bubba's nephew, new hire in Mission 1.3. Young man in his early 20s, eager but inexperienced. Casual clothes - t-shirt and jeans. Youthful energy. Signature color: Orange (#FF8C00). |
| **Wayne** | 64x64 | Scooter's friend, also a new hire in Mission 1.3. Similar age to Scooter. Slightly more reserved personality. Baseball cap optional. Signature color: Purple (#9370DB). |
| **Player** | 64x64 | The network administrator (you). Generic silhouette or customizable avatar. Professional but approachable - polo shirt or button-up. Should feel like a capable IT professional. Signature color: Blue (#4169E1). |
| **Narrator** | 64x64 | Optional sprite for narrator text. Could be represented as an open book, a scroll, a monitor with text, or simply omitted (text-only narrator). Signature color: Gray (#708090). |

### Network Equipment (Topology/Store)

| Sprite | Size | Description |
|--------|------|-------------|
| **Router** | 48x48 | Linksys-style consumer/small business router from 2001 era. Rectangular box with 1-2 small antennas on back. Front has a row of LED indicators (power, WAN, LAN ports). Beige/white plastic casing with blue or teal accent stripe. Visible ethernet ports on back/side. |
| **Hub** | 48x48 | Basic network hub - simple rectangular box. Multiple ethernet ports visible (8-port). Single collision domain indicator LED. Simpler than switch - fewer status lights. Beige/gray plastic casing. Should look "dumber" than the switch. |
| **Switch** | 48x48 | 8-port network switch - similar form factor to hub but with per-port activity LEDs. More professional appearance. Each port has its own status indicator. Slightly more detailed/premium look than hub. Dark gray or black casing. |
| **T1 Demarc** | 32x32 | T1 demarcation point / smart jack. Wall-mounted gray box. Has a single blinking status LED (green when active). Represents the ISP handoff point. Industrial/utilitarian appearance. Usually mounted high on wall. |
| **PC/Computer** | 48x48 | Classic beige tower PC from 2001. Boxy desktop tower case with visible floppy drive slot, CD-ROM, and power button. Optional: include a small CRT monitor (or offer as separate sprite). Power LED and HDD activity LED on front. |
| **Network Printer** | 48x48 | HP LaserJet style office printer. Beige/gray boxy design with paper tray visible. Control panel with a few buttons and small LCD or LED display. Paper output tray on top. Substantial, professional office equipment look. |
| **Print Server** | 32x32 | HP JetDirect external print server. Small rectangular box that connects to printer's parallel port. Has ethernet port on one side, parallel connector on other. Status LEDs (link, activity). Much smaller than the printer itself. |
| **Ethernet Cable (Cat5)** | 16x64 | Blue Category 5 ethernet cable with RJ-45 connectors on each end. Cable should have a slight curve/flexibility to it. Connectors should be clearly visible and recognizable. Standard networking blue color. |
| **Crossover Cable** | 16x64 | Yellow or orange ethernet cable - visually distinct from regular Cat5. Same RJ-45 connectors but different cable color. Used to indicate special purpose. Some visual indicator it's "different" (stripe pattern, different shade). |

### UI Elements

| Sprite | Size | Description |
|--------|------|-------------|
| **Connection Success** | 16x16 | Green checkmark icon indicating successful connection or valid configuration. Bright, positive green. Clear checkmark shape recognizable at small size. |
| **Connection Error** | 16x16 | Red X icon indicating failed connection or invalid configuration. Bright warning red. Clear X shape. Should feel "wrong" at a glance. |
| **Warning** | 16x16 | Yellow/amber triangle with exclamation point. Standard caution symbol. Used for non-critical issues or things that need attention but aren't errors. |
| **Packet** | 8x8 | Small data packet for network animations. Could be a tiny envelope, a small square with binary (01), or a simple colored dot. Used to show data flowing through cables. |
| **Collision** | 24x24 | Explosion or spark effect indicating network collision (hub). Small starburst or impact symbol. Yellow/orange coloring. Used in Mission 1.4/1.5 to visualize hub problems. |
| **Port Indicator (Active)** | 8x8 | Small green LED indicator showing active/connected port. Simple circle or rounded square. Bright green glow effect optional. |
| **Port Indicator (Inactive)** | 8x8 | Small gray/dark LED indicator showing inactive/disconnected port. Same shape as active but unlit. Dark gray or very dim. |
| **Money/Budget Icon** | 16x16 | Dollar sign or small stack of bills. Used in store interfaces and budget displays. Green coloring. |
| **Lock Icon** | 16x16 | Padlock symbol for security/firewall related UI. Closed lock = secure, open lock = vulnerable. |
| **Folder Icon** | 16x16 | File folder for file sharing missions. Classic manila folder look. Can have shared/network variant with small network symbol. |

### Environment/Background

| Sprite | Size | Description |
|--------|------|-------------|
| **Office Background** | 800x600 | Main scene backdrop for Bubba's office. Beige/tan walls, brown carpet or wood floor. Shows a typical small business office from 2001 - drop ceiling with fluorescent lights (implied), maybe a window with blinds, wall clock, filing cabinet in corner. Should feel warm but slightly dated. Can be a single large image or composed of tileable elements. |
| **Server Closet** | 800x600 | Alternative scene for technical work. Small room/closet with networking equipment. Exposed cables, wall-mounted equipment, maybe a small rack. More utilitarian than the main office. Slightly darker, more "techy" feeling. |
| **Desk** | 128x64 | Wooden office desk as a furniture piece. Can be placed in scenes. Brown wood grain, maybe with some items on top (papers, coffee mug). Solid, practical office furniture. |
| **Wall Panel** | 64x64 | Tileable wall texture. Beige/off-white office wall. Subtle texture - not perfectly flat but not distracting. Can include baseboard at bottom. |
| **Floor Tile** | 64x64 | Tileable floor texture. Options: brown carpet with subtle pattern, or wood laminate flooring. Should tile seamlessly. |
| **Window** | 96x128 | Office window with blinds (partially open). Shows vague outdoor scene (sky, maybe trees). Provides natural lighting reference. Blinds are horizontal slats, typical office style. |
| **Filing Cabinet** | 48x96 | Metal filing cabinet, 2-4 drawers. Gray or beige metal. Typical office furniture from the era. Can be background element. |
| **Wall Clock** | 32x32 | Simple round wall clock. White face, black numbers, basic hands. Generic office clock. Optional - can show "2001" time period. |

---

## File Organization

Sprites should be organized in the following directory structure:

```
/public/sprites/
  /characters/
    bubba.png
    bubba-tie.png (variant with tie)
    darlene.png
    earl.png
    scooter.png
    wayne.png
    player.png
    narrator.png
  /equipment/
    router.png
    hub.png
    switch.png
    t1-demarc.png
    pc.png
    printer.png
    print-server.png
    cable-ethernet.png
    cable-crossover.png
  /ui/
    icon-success.png
    icon-error.png
    icon-warning.png
    packet.png
    collision.png
    led-active.png
    led-inactive.png
    icon-money.png
    icon-lock.png
    icon-folder.png
  /backgrounds/
    office-main.png
    server-closet.png
  /tiles/
    wall-panel.png
    floor-carpet.png
    floor-wood.png
  /furniture/
    desk.png
    filing-cabinet.png
    window.png
    clock.png
```

---

## Technical Requirements

- **File Format**: PNG with transparency
- **Color Depth**: 8-bit (256 colors) or indexed color preferred
- **Transparency**: Use alpha channel, not color key
- **Naming**: lowercase, hyphen-separated (e.g., `print-server.png`)
- **Scaling**: Sprites will be rendered at 1x, 2x, or 3x scale - ensure they look good at all sizes
- **Consistency**: All sprites in a category should have consistent style, outline weight, and color treatment
