import { useState } from 'react';
import { PixelButton, DevicePlaceholder } from '../ui';
import { newPCs, correctConfigs } from '../../data/mission1-3';

interface PCConfig {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
}

interface NewPCConfigProps {
  onComplete: () => void;
}

export function NewPCConfig({ onComplete }: NewPCConfigProps) {
  const [currentPCIndex, setCurrentPCIndex] = useState(0);
  const [configs, setConfigs] = useState<Record<string, PCConfig>>({});
  const [error, setError] = useState<string | null>(null);
  const [completedPCs, setCompletedPCs] = useState<string[]>([]);

  const currentPC = newPCs[currentPCIndex];
  const currentConfig = configs[currentPC.owner] || {
    ipAddress: '',
    subnetMask: '',
    gateway: '',
    dns: '',
  };

  // Get appropriate IP options for current PC
  const getIPOptions = () => {
    if (currentPC.owner === 'scooter') {
      return ['192.168.1.14', '192.168.1.11', '192.168.2.14', '10.0.0.14'];
    } else {
      return ['192.168.1.15', '192.168.1.14', '192.168.2.15', '10.0.0.15'];
    }
  };

  const handleIPSelect = (ip: string) => {
    setConfigs({
      ...configs,
      [currentPC.owner]: { ...currentConfig, ipAddress: ip },
    });
    setError(null);
  };

  const handleApply = () => {
    const config = configs[currentPC.owner];

    if (!config || !config.ipAddress) {
      setError('Please select an IP address.');
      return;
    }

    // Check for duplicate IP
    if (currentPC.owner === 'wayne' && config.ipAddress === '192.168.1.14') {
      setError('IP CONFLICT! That\'s the same IP you just gave Scooter. Every device needs a UNIQUE IP address - it\'s like two houses with the same street address!');
      return;
    }

    // Check for wrong subnet
    if (config.ipAddress.startsWith('192.168.2') || config.ipAddress.startsWith('10.0.0')) {
      const wrongSubnet = config.ipAddress.split('.').slice(0, 3).join('.');
      setError(`Wrong subnet! ${wrongSubnet}.x is a different network than 192.168.1.x. The new PC won't be able to talk to the router or other computers.`);
      return;
    }

    // Check for using existing PC's IP
    if (config.ipAddress === '192.168.1.11') {
      setError('IP CONFLICT! That IP belongs to Earl\'s PC. Every device needs a UNIQUE address.');
      return;
    }

    // Success - auto-fill other fields (simplified for this mission)
    const fullConfig = {
      ipAddress: config.ipAddress,
      subnetMask: '255.255.255.0',
      gateway: '192.168.1.1',
      dns: '192.168.1.1',
    };

    setConfigs({
      ...configs,
      [currentPC.owner]: fullConfig,
    });

    setCompletedPCs([...completedPCs, currentPC.owner]);

    if (currentPCIndex < newPCs.length - 1) {
      // Move to next PC
      setCurrentPCIndex(currentPCIndex + 1);
      setError(null);
    } else {
      // All done
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Windows-style title bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#0a246a] to-[#a6caf0]">
        <div className="w-4 h-4 bg-[#6bcb77] border border-[#56a260] rounded-sm" />
        <h1 className="text-white ml-2">New PC Configuration - {currentPC.name}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* PC List Sidebar */}
        <div className="w-48 bg-[#ece9d8] p-4 border-r-2 border-[#aca899]">
          <h3 className="text-[10px] text-[#003399] mb-4">NEW COMPUTERS</h3>
          {newPCs.map((pc, index) => {
            const isCompleted = completedPCs.includes(pc.owner);
            const savedConfig = configs[pc.owner];
            return (
              <div
                key={pc.owner}
                className={`flex items-center gap-2 p-2 mb-1 border-2 ${
                  index === currentPCIndex
                    ? 'bg-[#316ac5] border-[#316ac5] text-white'
                    : isCompleted
                    ? 'bg-[#c1e2c1] border-[#a1c2a1]'
                    : 'bg-white border-[#aca899]'
                }`}
              >
                <DevicePlaceholder type="pc" name={pc.name} size="sm" />
                <div className="flex-1 text-[8px]">
                  <div className="font-bold">{pc.name}</div>
                  <div className={index === currentPCIndex ? 'text-white/80' : 'text-[#666]'}>
                    {isCompleted && savedConfig ? `OK ${savedConfig.ipAddress}` : 'Not configured'}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-4 pt-4 border-t-2 border-[#aca899]">
            <h3 className="text-[10px] text-[#003399] mb-2">EXISTING PCs</h3>
            <div className="text-[8px] text-[#666] space-y-1">
              <div>Bubba's PC: 192.168.1.10</div>
              <div>Earl's PC: 192.168.1.11</div>
              <div>Darlene's PC: 192.168.1.12</div>
              <div>Accountant: 192.168.1.13</div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#f5f5f5]">
          <div className="max-w-lg mx-auto">
            {/* Reference Card */}
            <div className="info-box mb-6">
              <p className="font-bold text-[10px] mb-2 text-[var(--color-bg-dark)]">
                Quick Reference
              </p>
              <div className="text-[8px] text-[var(--color-bg-dark)] space-y-1">
                <div>Network: 192.168.1.x</div>
                <div>Router/Gateway: 192.168.1.1</div>
                <div>Existing IPs: .10, .11, .12, .13 (already taken)</div>
                <div>Available IPs: .14, .15, .16, etc.</div>
              </div>
            </div>

            {/* IP Address Selection */}
            <div className="bg-white border-2 border-[#aca899] p-4 mb-4">
              <h2 className="text-sm text-[#003399] mb-4 border-b border-[#aca899] pb-2">
                Select IP Address for {currentPC.name}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {getIPOptions().map((ip) => (
                  <button
                    key={ip}
                    className={`p-3 border-2 text-left transition-colors ${
                      currentConfig.ipAddress === ip
                        ? 'bg-[#316ac5] border-[#316ac5] text-white'
                        : 'bg-white border-[#aca899] hover:bg-[#e8e8e8]'
                    }`}
                    onClick={() => handleIPSelect(ip)}
                  >
                    <div className="font-mono text-sm">{ip}</div>
                    <div className={`text-[8px] mt-1 ${
                      currentConfig.ipAddress === ip ? 'text-white/70' : 'text-[#666]'
                    }`}>
                      {ip === correctConfigs[currentPC.owner as keyof typeof correctConfigs].ipAddress
                        ? 'Next available IP'
                        : ip.startsWith('192.168.1.11')
                        ? 'Earl\'s IP address'
                        : ip.startsWith('192.168.2')
                        ? 'Different subnet'
                        : ip.startsWith('10.0.0')
                        ? 'Class A private range'
                        : currentPC.owner === 'wayne' && ip === '192.168.1.14'
                        ? 'Scooter\'s IP'
                        : 'Available IP'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-fill notice */}
            <div className="bg-[#ffffd0] border-2 border-[#c0c080] p-3 mb-4 text-[10px]">
              <strong>Note:</strong> Subnet mask (255.255.255.0), gateway (192.168.1.1), and DNS will be configured automatically.
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-[#ffcccc] border-2 border-[#cc0000] p-3 mb-4">
                <div className="text-[#cc0000] font-bold text-[10px] mb-1">Configuration Error</div>
                <div className="text-[10px]">{error}</div>
              </div>
            )}

            {/* Apply Button */}
            <div className="text-center">
              <PixelButton
                variant="primary"
                onClick={handleApply}
                disabled={!currentConfig.ipAddress}
              >
                Apply Configuration
              </PixelButton>
            </div>

            <div className="mt-4 text-center text-[8px] text-[var(--color-text-secondary)]">
              Configuring PC {currentPCIndex + 1} of {newPCs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
