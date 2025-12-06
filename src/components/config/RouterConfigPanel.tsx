import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel, PixelInput } from '../ui';
import { ispConfig, correctLanConfig, configErrors } from '../../data/mission1-1';
import type { RouterConfig, WANConfig, LANConfig } from '../../types';

interface RouterConfigPanelProps {
  onComplete: () => void;
}

export function RouterConfigPanel({ onComplete }: RouterConfigPanelProps) {
  const setRouterConfig = useGameStore((state) => state.setRouterConfig);

  const [wanConfig, setWanConfig] = useState<Partial<WANConfig>>({
    connectionType: 'static',
    ipAddress: '',
    subnetMask: '',
    gateway: '',
    dns1: '',
    dns2: '',
  });

  const [lanConfig, setLanConfig] = useState<Partial<LANConfig>>({
    ipAddress: '',
    subnetMask: '',
    dhcpEnabled: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNATExplanation, setShowNATExplanation] = useState(false);
  const [configPhase, setConfigPhase] = useState<'wan' | 'lan'>('wan');

  const validateWAN = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (wanConfig.ipAddress !== ispConfig.ipAddress) {
      newErrors.wanIp = configErrors.wrongIP.explanation;
    }
    if (wanConfig.subnetMask !== ispConfig.subnetMask) {
      newErrors.wanSubnet = configErrors.wrongSubnet.explanation;
    }
    if (wanConfig.gateway !== ispConfig.gateway) {
      newErrors.wanGateway = configErrors.wrongGateway.explanation;
    }
    if (wanConfig.dns1 !== ispConfig.dns1) {
      newErrors.wanDns1 = configErrors.wrongDNS.explanation;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLAN = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (lanConfig.ipAddress !== correctLanConfig.ipAddress) {
      newErrors.lanIp = 'The router LAN IP should be 192.168.1.1 - this will be the gateway for all your PCs.';
    }
    if (lanConfig.subnetMask !== correctLanConfig.subnetMask) {
      newErrors.lanSubnet = 'For a small office network, 255.255.255.0 gives you 254 usable addresses - plenty of room!';
    }
    if (lanConfig.dhcpEnabled !== correctLanConfig.dhcpEnabled) {
      newErrors.lanDhcp = 'For learning purposes, we\'re using static IPs. Turn DHCP OFF.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWANContinue = () => {
    if (validateWAN()) {
      setConfigPhase('lan');
      setShowNATExplanation(true);
    }
  };

  const handleLANContinue = () => {
    if (validateLAN()) {
      const fullConfig: RouterConfig = {
        wan: wanConfig as WANConfig,
        lan: lanConfig as LANConfig,
      };
      setRouterConfig(fullConfig);
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header styled like router admin page */}
      <div className="bg-[#0054a6] p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1e90ff] border-4 border-[#003d7a] flex items-center justify-center text-white font-bold">
            RTR
          </div>
          <div>
            <h1 className="text-lg text-white">Router Configuration</h1>
            <p className="text-[10px] text-blue-200">LinkSys BEFSR41 Administration</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-48 bg-[#003366] p-2">
          <div className={`p-2 mb-1 cursor-pointer ${configPhase === 'wan' ? 'bg-[#0054a6]' : 'hover:bg-[#004080]'}`}>
            <span className="text-white text-[10px]">WAN Setup</span>
          </div>
          <div className={`p-2 mb-1 cursor-pointer ${configPhase === 'lan' ? 'bg-[#0054a6]' : 'hover:bg-[#004080]'}`}>
            <span className="text-white text-[10px]">LAN Setup</span>
          </div>
        </div>

        {/* Main Config Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#e8e8e8]">
          {configPhase === 'wan' ? (
            <div>
              <h2 className="text-sm text-[#003366] border-b-2 border-[#003366] pb-2 mb-4">
                WAN Connection Settings
              </h2>

              {/* ISP Info Card */}
              <div className="info-box mb-6">
                <p className="font-bold text-[10px] mb-2 text-[var(--color-bg-dark)]">
                  ISP Configuration Sheet (from Possum Holler Telecom):
                </p>
                <div className="grid grid-cols-2 gap-2 text-[8px] text-[var(--color-bg-dark)]">
                  <div>IP Address: <span className="font-bold">{ispConfig.ipAddress}</span></div>
                  <div>Subnet Mask: <span className="font-bold">{ispConfig.subnetMask}</span></div>
                  <div>Gateway: <span className="font-bold">{ispConfig.gateway}</span></div>
                  <div>DNS Primary: <span className="font-bold">{ispConfig.dns1}</span></div>
                  <div>DNS Secondary: <span className="font-bold">{ispConfig.dns2}</span></div>
                </div>
              </div>

              <div className="config-section">
                <div className="grid gap-4">
                  <PixelInput
                    label="WAN IP Address"
                    value={wanConfig.ipAddress}
                    onChange={(e) => setWanConfig({ ...wanConfig, ipAddress: e.target.value })}
                    error={errors.wanIp}
                    placeholder="e.g., 203.45.67.89"
                  />
                  <PixelInput
                    label="Subnet Mask"
                    value={wanConfig.subnetMask}
                    onChange={(e) => setWanConfig({ ...wanConfig, subnetMask: e.target.value })}
                    error={errors.wanSubnet}
                    placeholder="e.g., 255.255.255.248"
                  />
                  <PixelInput
                    label="Gateway"
                    value={wanConfig.gateway}
                    onChange={(e) => setWanConfig({ ...wanConfig, gateway: e.target.value })}
                    error={errors.wanGateway}
                    placeholder="e.g., 203.45.67.81"
                  />
                  <PixelInput
                    label="Primary DNS"
                    value={wanConfig.dns1}
                    onChange={(e) => setWanConfig({ ...wanConfig, dns1: e.target.value })}
                    error={errors.wanDns1}
                    placeholder="e.g., 203.45.67.1"
                  />
                  <PixelInput
                    label="Secondary DNS"
                    value={wanConfig.dns2}
                    onChange={(e) => setWanConfig({ ...wanConfig, dns2: e.target.value })}
                    placeholder="e.g., 203.45.67.2"
                  />
                </div>
              </div>

              <div className="mt-6">
                <PixelButton variant="primary" onClick={handleWANContinue}>
                  Save WAN Settings
                </PixelButton>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-sm text-[#003366] border-b-2 border-[#003366] pb-2 mb-4">
                LAN Connection Settings
              </h2>

              <div className="config-section">
                <div className="grid gap-4">
                  <PixelInput
                    label="Router LAN IP Address"
                    value={lanConfig.ipAddress}
                    onChange={(e) => setLanConfig({ ...lanConfig, ipAddress: e.target.value })}
                    error={errors.lanIp}
                    placeholder="e.g., 192.168.1.1"
                  />
                  <PixelInput
                    label="Subnet Mask"
                    value={lanConfig.subnetMask}
                    onChange={(e) => setLanConfig({ ...lanConfig, subnetMask: e.target.value })}
                    error={errors.lanSubnet}
                    placeholder="e.g., 255.255.255.0"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="dhcp"
                      checked={lanConfig.dhcpEnabled}
                      onChange={(e) => setLanConfig({ ...lanConfig, dhcpEnabled: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="dhcp" className="config-label">
                      Enable DHCP Server
                    </label>
                  </div>
                  {errors.lanDhcp && (
                    <span className="text-[8px] text-[var(--color-accent-red)]">{errors.lanDhcp}</span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <PixelButton variant="primary" onClick={handleLANContinue}>
                  Save LAN Settings
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NAT Explanation Modal */}
      {showNATExplanation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <PixelPanel title="Understanding NAT" className="max-w-2xl">
            <div className="mb-4">
              <p className="mb-4">
                Now, here's the thing - Bubba only has ONE public IP address ({ispConfig.ipAddress}), but he's got FOUR computers! How does that work?
              </p>
              <p className="mb-4">
                It's like having one phone number for a whole office. When someone calls, the <span className="text-[var(--color-accent-yellow)]">receptionist</span> (that's <span className="text-[var(--color-accent-blue)]">NAT - Network Address Translation</span>) answers and routes the call to the right person.
              </p>
              <p className="mb-4">
                From the outside, everyone just sees one number. Inside, each person has their own extension.
              </p>
              <p>
                Your <span className="text-[var(--color-accent-green)]">192.168.x.x addresses</span> are "internal extensions" - they only work inside the office. The router translates between inside addresses and the one outside address.
              </p>
            </div>

            <div className="flex gap-4 mb-4 p-4 bg-[var(--color-bg-dark)]">
              <div className="flex-1 text-center">
                <div className="text-[var(--color-accent-orange)] mb-2">OUTSIDE</div>
                <div className="text-lg">{ispConfig.ipAddress}</div>
                <div className="text-[8px] text-[var(--color-text-secondary)]">1 Public Address</div>
              </div>
              <div className="flex items-center text-2xl">→</div>
              <div className="flex-1 text-center">
                <div className="text-[var(--color-accent-blue)] mb-2">ROUTER (NAT)</div>
                <div className="text-lg">192.168.1.1</div>
                <div className="text-[8px] text-[var(--color-text-secondary)]">Translates Traffic</div>
              </div>
              <div className="flex items-center text-2xl">→</div>
              <div className="flex-1 text-center">
                <div className="text-[var(--color-accent-green)] mb-2">INSIDE</div>
                <div className="text-[10px]">192.168.1.10-13</div>
                <div className="text-[8px] text-[var(--color-text-secondary)]">4 Private Addresses</div>
              </div>
            </div>

            <PixelButton onClick={() => setShowNATExplanation(false)}>
              Got it! Let's configure the LAN.
            </PixelButton>
          </PixelPanel>
        </div>
      )}
    </div>
  );
}
