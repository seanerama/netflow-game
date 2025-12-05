# NetFlow - The Network Engineering Game

An educational RPG-style game that teaches network engineering fundamentals through an interactive plumbing-metaphor visualization, where players manage IT infrastructure for a growing small business.

## Overview

NetFlow uses a plumbing metaphor to make networking concepts intuitive:
- **Data packets** = water droplets
- **Bandwidth** = pipe diameter
- **Router** = valve junction / manifold
- **Firewall** = filter / strainer
- **NAT** = address relabeling station
- **Switch** = pipe splitter

## Tech Stack

| Component | Choice |
|-----------|--------|
| Language | TypeScript |
| Framework | React 18 |
| State Management | Zustand |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Build Tool | Vite |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── layout/       # GameLayout, TopBar, SidePanel, BottomBar
│   ├── views/        # NetworkView, OfficeView, ShopView, etc.
│   ├── network/      # Device, Connection, Packet components
│   ├── visualization/# PipeSystem, PacketFlow, NATVisualization
│   ├── config/       # Device configuration forms
│   ├── business/     # Employee, productivity components
│   ├── missions/     # Mission briefings, objectives
│   └── ui/           # Shared UI components
├── store/
│   ├── gameStore.ts  # Main Zustand store
│   └── slices/       # Network, Business, Mission, Simulation, UI
├── simulation/       # Network simulation engine
├── game/             # Game loop, managers
├── data/             # Missions, hardware catalog, events
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── hooks/            # Custom React hooks
```

## Game Features

### Phase 1 (MVP)
- Core network simulation (packet routing, basic switching)
- Router with NAT (PAT - Port Address Translation)
- Basic stateful firewall
- IP configuration (static)
- Pipe visualization with animated data flow
- 4 tutorial missions
- Hardware shop (routers, switches, cables)
- Business simulation with 3 employees
- Save/load via localStorage

### Future Phases
- DHCP
- VLANs
- Subnetting
- VPN
- DMZ
- QoS
- IPv6

## Learning Objectives

Players will learn:
- IPv4 addressing and private vs public IPs
- How NAT allows multiple devices to share one public IP
- TCP three-way handshake
- Stateful firewall operation
- Basic routing and switching concepts
- Port numbers and protocols

## License

MIT
