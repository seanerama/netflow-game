import { useState } from 'react';
import { PixelButton, PixelPanel } from '../ui';
import {
  defaultFirewallRules,
  firewallErrors,
  commonPorts,
} from '../../data/mission1-2';
import type { FirewallRule } from '../../data/mission1-2';

interface FirewallConfigPanelProps {
  onComplete: (success: boolean) => void;
}

export function FirewallConfigPanel({ onComplete }: FirewallConfigPanelProps) {
  const [rules, setRules] = useState<FirewallRule[]>(defaultFirewallRules);
  const [error, setError] = useState<{ title: string; explanation: string; detail: string } | null>(null);
  const [showPortScan, setShowPortScan] = useState(false);
  const [scanningPort, setScanningPort] = useState<number | null>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [firewallEnabled, setFirewallEnabled] = useState(false);

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const validateConfig = (): { valid: boolean; errorType?: keyof typeof firewallErrors } => {
    const blockInbound = rules.find(r => r.id === 'block-inbound')?.enabled;
    const allowEstablished = rules.find(r => r.id === 'allow-established')?.enabled;

    // All off = wide open
    if (!blockInbound && !allowEstablished) {
      return { valid: false, errorType: 'allOff' };
    }

    // Block inbound but no established = no internet
    if (blockInbound && !allowEstablished) {
      return { valid: false, errorType: 'noInboundNoEstablished' };
    }

    // Only established, no block = partial
    if (!blockInbound && allowEstablished) {
      return { valid: false, errorType: 'partialProtection' };
    }

    return { valid: true };
  };

  const handleApply = () => {
    const validation = validateConfig();

    if (!validation.valid && validation.errorType) {
      setError(firewallErrors[validation.errorType]);
      return;
    }

    // Success - show port scan comparison
    setFirewallEnabled(true);
    setShowPortScan(true);
    runPortScan();
  };

  const runPortScan = async () => {
    setScanComplete(false);
    for (const portInfo of commonPorts) {
      setScanningPort(portInfo.port);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setScanningPort(null);
    setScanComplete(true);
  };

  const handleContinue = () => {
    onComplete(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Linksys-style header */}
      <div className="bg-gradient-to-r from-[#003399] via-[#0044cc] to-[#003399] p-3">
        <div className="flex items-center gap-4">
          <div className="text-white text-xs">
            <span className="font-bold">LINKSYS</span>
            <span className="ml-2 text-white/70">BEFSR41</span>
          </div>
          <div className="flex-1" />
          <div className="text-white/80 text-[10px]">
            Firewall Configuration
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Configuration Panel */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#f0f0f0]">
          <div className="max-w-2xl mx-auto">
            {/* Info Box */}
            <div className="info-box mb-6">
              <p className="font-bold text-[10px] mb-2 text-[var(--color-bg-dark)]">
                Firewall Settings
              </p>
              <p className="text-[8px] text-[var(--color-bg-dark)]">
                Configure your firewall rules to protect the network from unauthorized access.
                The firewall acts as a barrier between your internal network and the internet.
              </p>
            </div>

            {/* Firewall Rules */}
            <div className="bg-white border-2 border-[#aca899] p-4 mb-4">
              <h2 className="text-sm text-[#003399] mb-4 border-b border-[#aca899] pb-2">
                Security Rules
              </h2>

              <div className="space-y-4">
                {rules.map(rule => (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-4 p-3 border-2 cursor-pointer transition-colors ${
                      rule.enabled
                        ? 'bg-[#c1e2c1] border-[#7ec850]'
                        : 'bg-[#f5f5f5] border-[#ccc] hover:bg-[#e8e8e8]'
                    }`}
                    onClick={() => toggleRule(rule.id)}
                  >
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${
                      rule.enabled ? 'bg-[#7ec850]' : 'bg-[#999]'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        rule.enabled ? 'right-1' : 'left-1'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[10px]">{rule.name}</div>
                      <div className="text-[8px] text-[#666]">{rule.description}</div>
                    </div>
                    <div className={`text-xs font-bold ${rule.enabled ? 'text-[#7ec850]' : 'text-[#999]'}`}>
                      {rule.enabled ? 'ON' : 'OFF'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            {!showPortScan && (
              <div className="text-center">
                <PixelButton variant="primary" onClick={handleApply}>
                  Apply Firewall Rules
                </PixelButton>
              </div>
            )}

            {/* Port Scan Visualization */}
            {showPortScan && (
              <div className="bg-black p-4 border-2 border-[#333]">
                <div className="text-[var(--color-accent-green)] font-mono text-[10px] mb-4">
                  <span className="text-[var(--color-accent-red)]">root@hacker:~#</span> nmap -sS 203.45.67.89
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Before Firewall */}
                  <div>
                    <div className="text-[var(--color-accent-yellow)] text-[8px] mb-2">
                      BEFORE FIREWALL:
                    </div>
                    <div className="space-y-1">
                      {commonPorts.map(portInfo => (
                        <div
                          key={`before-${portInfo.port}`}
                          className={`text-[8px] font-mono flex justify-between ${
                            portInfo.danger === 'high'
                              ? 'text-[var(--color-accent-red)]'
                              : portInfo.danger === 'medium'
                              ? 'text-[var(--color-accent-yellow)]'
                              : 'text-[var(--color-accent-green)]'
                          }`}
                        >
                          <span>{portInfo.port}/{portInfo.name}</span>
                          <span>OPEN</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* After Firewall */}
                  <div>
                    <div className="text-[var(--color-accent-green)] text-[8px] mb-2">
                      AFTER FIREWALL:
                    </div>
                    <div className="space-y-1">
                      {commonPorts.map(portInfo => {
                        const isScanning = scanningPort === portInfo.port;
                        const wasScanned = scanningPort === null || scanningPort > portInfo.port;

                        return (
                          <div
                            key={`after-${portInfo.port}`}
                            className={`text-[8px] font-mono flex justify-between ${
                              isScanning
                                ? 'text-[var(--color-accent-yellow)]'
                                : wasScanned
                                ? 'text-[var(--color-text-muted)]'
                                : 'text-[var(--color-text-muted)] opacity-30'
                            }`}
                          >
                            <span>{portInfo.port}/{portInfo.name}</span>
                            <span>
                              {isScanning ? 'scanning...' : wasScanned ? 'filtered' : '...'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {scanComplete && (
                  <div className="mt-4 pt-4 border-t border-[#333]">
                    <div className="text-[var(--color-accent-green)] text-[10px] font-mono">
                      Nmap scan report for 203.45.67.89
                    </div>
                    <div className="text-[var(--color-text-muted)] text-[8px] font-mono mt-1">
                      Host seems down or all ports filtered.
                    </div>
                    <div className="text-[var(--color-accent-green)] text-[8px] font-mono mt-2">
                      ✓ Your network is now invisible to basic port scans!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            {scanComplete && (
              <div className="text-center mt-6">
                <PixelButton variant="primary" onClick={handleContinue}>
                  Continue
                </PixelButton>
              </div>
            )}
          </div>
        </div>

        {/* Status Sidebar */}
        <div className="w-56 p-4 border-l-4 border-[var(--color-border)] bg-[var(--color-bg-medium)]">
          <h3 className="text-xs text-[var(--color-accent-blue)] mb-4">STATUS</h3>

          <div className="space-y-3 text-[8px]">
            <div className="flex items-center gap-2">
              <span className={`status-dot ${firewallEnabled ? 'status-connected' : 'status-offline'}`} />
              <span>Firewall {firewallEnabled ? 'Active' : 'Disabled'}</span>
            </div>

            {rules.map(rule => (
              <div key={rule.id} className="flex items-center gap-2">
                <span className={`status-dot ${rule.enabled ? 'status-connected' : 'status-warning'}`} />
                <span className={rule.enabled ? '' : 'text-[var(--color-text-muted)]'}>
                  {rule.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-[var(--color-bg-dark)] text-[8px]">
            <div className="text-[var(--color-accent-yellow)] mb-2">Tips:</div>
            <ul className="space-y-1 text-[var(--color-text-secondary)]">
              <li>• Block inbound to stop attacks</li>
              <li>• Allow established for responses</li>
              <li>• Block ICMP to hide from scans</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <PixelPanel title={error.title} className="max-w-md">
            <div className="mb-4">{error.explanation}</div>
            <div className="text-[8px] text-[var(--color-text-secondary)] italic mb-4">
              {error.detail}
            </div>
            <PixelButton onClick={() => setError(null)}>Try Again</PixelButton>
          </PixelPanel>
        </div>
      )}
    </div>
  );
}
