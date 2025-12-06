import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelInput, DevicePlaceholder } from '../ui';
import { pcConfigs, configErrors } from '../../data/mission1-1';
import type { PCConfig } from '../../types';

interface PCConfigPanelProps {
  onComplete: () => void;
}

interface PCFormState {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns1: string;
}

export function PCConfigPanel({ onComplete }: PCConfigPanelProps) {
  const setPCConfig = useGameStore((state) => state.setPCConfig);
  const configState = useGameStore((state) => state.configState);

  const [currentPCIndex, setCurrentPCIndex] = useState(0);
  const [formState, setFormState] = useState<PCFormState>({
    ipAddress: '',
    subnetMask: '',
    gateway: '',
    dns1: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedPCs, setCompletedPCs] = useState<string[]>([]);

  const currentPC = pcConfigs[currentPCIndex];
  const allConfiguredIPs = Object.values(configState.pcConfigs).map((c) => c.ipAddress);

  const validateConfig = (): boolean => {
    const newErrors: Record<string, string> = {};
    const expectedIP = currentPC.ip;

    // Check for duplicate IP
    if (allConfiguredIPs.includes(formState.ipAddress)) {
      newErrors.ip = configErrors.duplicateIP.explanation;
    }

    // Check if IP is in correct subnet
    if (!formState.ipAddress.startsWith('192.168.1.')) {
      // Extract what the player entered for a dynamic error message
      const enteredParts = formState.ipAddress.split('.');
      const enteredSubnet = enteredParts.length >= 3 ? `${enteredParts[0]}.${enteredParts[1]}.${enteredParts[2]}.x` : formState.ipAddress;
      newErrors.ip = `You put that computer in a different neighborhood! 192.168.1.x and ${enteredSubnet} are different networks. It's like being in a different zip code - your local mail carrier can't reach you.`;
    }

    // Check gateway
    if (formState.gateway === formState.ipAddress) {
      newErrors.gateway = configErrors.gatewayToSelf.explanation;
    } else if (formState.gateway !== '192.168.1.1') {
      // Check if gateway points to another PC
      const allIPs = [...allConfiguredIPs, ...pcConfigs.map((pc) => pc.ip)];
      if (allIPs.includes(formState.gateway) && formState.gateway !== '192.168.1.1') {
        newErrors.gateway = configErrors.gatewayToPC.explanation;
      } else if (formState.gateway !== '192.168.1.1') {
        newErrors.gateway = 'The gateway should be the router\'s LAN IP: 192.168.1.1';
      }
    }

    // Check subnet
    if (formState.subnetMask !== '255.255.255.0') {
      newErrors.subnet = configErrors.wrongSubnet.explanation;
    }

    // Check DNS
    if (formState.dns1 !== '192.168.1.1') {
      newErrors.dns = 'For this setup, use the router as DNS server: 192.168.1.1';
    }

    // Suggest correct IP if wrong
    if (formState.ipAddress !== expectedIP && !newErrors.ip) {
      // Allow any valid IP in the range, but suggest the expected one
      const ipNum = parseInt(formState.ipAddress.split('.')[3]);
      if (isNaN(ipNum) || ipNum < 2 || ipNum > 254 || ipNum === 1) {
        newErrors.ip = `Try an IP like ${expectedIP}. Remember: .1 is the router, .0 and .255 are reserved.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateConfig()) {
      const config: PCConfig = {
        ipAddress: formState.ipAddress,
        subnetMask: formState.subnetMask,
        gateway: formState.gateway,
        dns1: formState.dns1,
      };

      setPCConfig(currentPC.name, config);
      setCompletedPCs([...completedPCs, currentPC.name]);

      if (currentPCIndex < pcConfigs.length - 1) {
        setCurrentPCIndex(currentPCIndex + 1);
        setFormState({
          ipAddress: '',
          subnetMask: '',
          gateway: '',
          dns1: '',
        });
        setErrors({});
      } else {
        onComplete();
      }
    }
  };

  const handleAutoFill = (field: keyof PCFormState, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Windows XP-style title bar */}
      <div className="bg-gradient-to-r from-[#0054e3] via-[#0066ff] to-[#0054e3] p-2 flex items-center gap-2">
        <div className="w-4 h-4 bg-[#ff6b6b] border border-[#cc5555] rounded-sm" />
        <div className="w-4 h-4 bg-[#ffd93d] border border-[#ccae31] rounded-sm" />
        <div className="w-4 h-4 bg-[#6bcb77] border border-[#56a260] rounded-sm" />
        <h1 className="text-white ml-2">Network Configuration - {currentPC.name}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PC List Sidebar */}
        <div className="w-48 bg-[#ece9d8] p-4 border-r-2 border-[#aca899]">
          <h3 className="text-[10px] text-[#003399] mb-4">COMPUTERS</h3>
          {pcConfigs.map((pc, index) => (
            <div
              key={pc.name}
              className={`flex items-center gap-2 p-2 mb-1 cursor-pointer border-2 ${
                index === currentPCIndex
                  ? 'bg-[#316ac5] border-[#316ac5] text-white'
                  : completedPCs.includes(pc.name)
                  ? 'bg-[#c1e2c1] border-[#a1c2a1]'
                  : 'bg-white border-[#aca899] hover:bg-[#e8e8e8]'
              }`}
            >
              <DevicePlaceholder type="pc" name={pc.name} size="sm" />
              <div className="flex-1 text-[8px]">
                <div className="font-bold">{pc.name}</div>
                <div className={index === currentPCIndex ? 'text-white/80' : 'text-[#666]'}>
                  {completedPCs.includes(pc.name) ? `✓ ${pc.ip}` : 'Not configured'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Panel */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#f5f5f5]">
          <div className="max-w-lg mx-auto">
            {/* Reference Card */}
            <div className="info-box mb-6">
              <p className="font-bold text-[10px] mb-2 text-[var(--color-bg-dark)]">
                Network Reference:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[8px] text-[var(--color-bg-dark)]">
                <div>Router IP: <span className="font-bold">192.168.1.1</span></div>
                <div>Subnet: <span className="font-bold">255.255.255.0</span></div>
                <div>Suggested IP: <span className="font-bold">{currentPC.ip}</span></div>
                <div>DNS: <span className="font-bold">192.168.1.1</span></div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#aca899] p-4">
              <h2 className="text-sm text-[#003399] mb-4 border-b border-[#aca899] pb-2">
                Internet Protocol (TCP/IP) Properties
              </h2>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-[10px]">
                  <input type="radio" checked readOnly className="w-3 h-3" />
                  Use the following IP address:
                </label>
              </div>

              <div className="grid gap-4 pl-6">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-[10px]">IP address:</label>
                  <PixelInput
                    value={formState.ipAddress}
                    onChange={(e) => handleAutoFill('ipAddress', e.target.value)}
                    error={errors.ip}
                    placeholder={currentPC.ip}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-[10px]">Subnet mask:</label>
                  <PixelInput
                    value={formState.subnetMask}
                    onChange={(e) => handleAutoFill('subnetMask', e.target.value)}
                    error={errors.subnet}
                    placeholder="255.255.255.0"
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-[10px]">Default gateway:</label>
                  <PixelInput
                    value={formState.gateway}
                    onChange={(e) => handleAutoFill('gateway', e.target.value)}
                    error={errors.gateway}
                    placeholder="192.168.1.1"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="my-4 border-t border-[#aca899]" />

              <div className="mb-4">
                <label className="flex items-center gap-2 text-[10px]">
                  <input type="radio" checked readOnly className="w-3 h-3" />
                  Use the following DNS server addresses:
                </label>
              </div>

              <div className="grid gap-4 pl-6">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right text-[10px]">Preferred DNS:</label>
                  <PixelInput
                    value={formState.dns1}
                    onChange={(e) => handleAutoFill('dns1', e.target.value)}
                    error={errors.dns}
                    placeholder="192.168.1.1"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <PixelButton variant="primary" onClick={handleSave}>
                {currentPCIndex < pcConfigs.length - 1 ? 'Save & Next' : 'Finish Configuration'}
              </PixelButton>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 text-center text-[8px] text-[var(--color-text-secondary)]">
              Configuring PC {currentPCIndex + 1} of {pcConfigs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
