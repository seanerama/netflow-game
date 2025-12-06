import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  printerStoreItems,
  printServerExplanation,
  configIntroDialogue,
  wrongConfigMessages,
  setupPCDialogue,
  testDialogue,
  testSuccessDialogue,
  queueExplanation,
} from '../../data/mission1-7';

type Phase = 'store' | 'config' | 'install' | 'test' | 'complete';

interface Props {
  onComplete: () => void;
}

export function PrinterSetup({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('store');
  const [cart, setCart] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [printerConfig, setPrinterConfig] = useState({
    ipAddress: '192.168.1.',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    printerName: '',
    port: '9100',
  });
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const [pcsConfigured, setPcsConfigured] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const budget = useGameStore((state) => state.budget);
  const setBudget = useGameStore((state) => state.setBudget);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);
  const addDialogue = useGameStore((state) => state.addDialogue);

  const cartTotal = cart.reduce((sum, id) => {
    const item = printerStoreItems.find((i) => i.id === id);
    return sum + (item?.price || 0);
  }, 0);

  const handleAddToCart = (itemId: string) => {
    const item = printerStoreItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.isRedHerring) {
      setShowError(item.redHerringMessage || 'This item won\'t help with the current task.');
      return;
    }

    if (!cart.includes(itemId) && cartTotal + item.price <= budget) {
      setCart([...cart, itemId]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter((id) => id !== itemId));
  };

  const handleCheckout = () => {
    const hasPrintServer = cart.includes('print-server');
    const hasCable = cart.includes('cat5-cable');

    if (!hasPrintServer) {
      setShowError('You need a print server to connect the printer to the network!');
      return;
    }

    if (!hasCable) {
      setShowError('You need a network cable to connect the print server to the switch!');
      return;
    }

    setBudget(budget - cartTotal);
    addDialogue(printServerExplanation);
    setPhase('config');
  };

  const validateConfig = (): boolean => {
    const errors: string[] = [];

    // Check IP address
    const ip = printerConfig.ipAddress;
    const usedIps = ['192.168.1.1', '192.168.1.10', '192.168.1.11', '192.168.1.12', '192.168.1.13', '192.168.1.14', '192.168.1.15'];

    if (usedIps.includes(ip)) {
      errors.push(wrongConfigMessages['duplicate-ip']);
    }
    if (!ip.startsWith('192.168.1.')) {
      errors.push(wrongConfigMessages['wrong-subnet']);
    }

    if (printerConfig.subnetMask !== '255.255.255.0') {
      errors.push(wrongConfigMessages['wrong-mask']);
    }

    if (printerConfig.gateway !== '192.168.1.1') {
      errors.push(wrongConfigMessages['wrong-gateway']);
    }

    if (printerConfig.port !== '9100') {
      errors.push(wrongConfigMessages['wrong-port']);
    }

    if (!printerConfig.printerName.trim()) {
      errors.push('Please give the printer a name.');
    }

    setConfigErrors(errors);
    return errors.length === 0;
  };

  const handleConfigSubmit = () => {
    if (validateConfig()) {
      addDialogue([...configIntroDialogue, ...setupPCDialogue]);
      setPhase('install');
    }
  };

  const pcs = [
    { id: 'bubba', name: "Bubba's PC", icon: 'B' },
    { id: 'earl', name: "Earl's PC", icon: 'E' },
    { id: 'darlene', name: "Darlene's PC", icon: 'D' },
    { id: 'mama', name: "Mama's PC", icon: 'M' },
    { id: 'scooter', name: "Scooter's PC", icon: 'S' },
    { id: 'wayne', name: "Wayne's PC", icon: 'W' },
  ];

  const handleConfigurePC = (pcId: string) => {
    if (!pcsConfigured.includes(pcId)) {
      setPcsConfigured([...pcsConfigured, pcId]);
    }
  };

  const handleStartTest = () => {
    if (pcsConfigured.length < pcs.length) {
      setShowError('Configure all PCs first!');
      return;
    }
    addDialogue(testDialogue);
    setPhase('test');
  };

  const handleTestPC = (pcId: string) => {
    // Simulate print test
    setTimeout(() => {
      setTestResults((prev) => ({ ...prev, [pcId]: true }));
    }, 500);
  };

  const handleTestComplete = () => {
    const allTested = pcs.every((pc) => testResults[pc.id]);
    if (!allTested) {
      setShowError('Test printing from all PCs!');
      return;
    }
    addDialogue([...testSuccessDialogue, ...queueExplanation]);
    setPhase('complete');
  };

  const selectedItemData = selectedItem
    ? printerStoreItems.find((i) => i.id === selectedItem)
    : null;

  // Render error modal
  const renderError = () => {
    if (!showError) return null;
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-[var(--color-bg-medium)] border-4 border-[var(--color-accent-red)] p-6 max-w-md">
          <h3 className="text-[var(--color-accent-red)] font-bold mb-4">Hmm...</h3>
          <p className="text-sm mb-4">{showError}</p>
          <PixelButton variant="primary" onClick={() => setShowError(null)}>
            Got it
          </PixelButton>
        </div>
      </div>
    );
  };

  // Store phase
  if (phase === 'store') {
    return (
      <div className="h-full flex flex-col">
        {renderError()}

        {dialogueQueue.length > 0 && <DialogueManager />}

        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Store Items */}
          <div className="flex-1 overflow-y-auto">
            <PixelPanel title="Hank's Hardware - Printer Section">
              <div className="grid grid-cols-2 gap-2">
                {printerStoreItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item.id)}
                    className={`p-3 border-2 cursor-pointer transition-all ${
                      selectedItem === item.id
                        ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10'
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent-blue)]/50'
                    } ${cart.includes(item.id) ? 'bg-[var(--color-accent-green)]/10' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold">{item.name}</div>
                        <div className="text-[var(--color-accent-yellow)] text-xs">
                          ${item.price}
                        </div>
                      </div>
                      {cart.includes(item.id) && (
                        <span className="text-[var(--color-accent-green)]">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PixelPanel>
          </div>

          {/* Item Details & Cart */}
          <div className="w-80 flex flex-col gap-4">
            {/* Item Details */}
            <PixelPanel title="Item Details" className="flex-1">
              {selectedItemData ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-4xl">{selectedItemData.icon}</span>
                    <h3 className="font-bold mt-2">{selectedItemData.name}</h3>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">
                    {selectedItemData.description}
                  </p>
                  <div className="text-[8px] bg-[var(--color-bg-dark)] p-2">
                    {selectedItemData.hint}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-accent-yellow)]">
                      ${selectedItemData.price}
                    </span>
                    {cart.includes(selectedItemData.id) ? (
                      <PixelButton
                        variant="danger"
                        onClick={() => handleRemoveFromCart(selectedItemData.id)}
                      >
                        Remove
                      </PixelButton>
                    ) : (
                      <PixelButton
                        variant="primary"
                        onClick={() => handleAddToCart(selectedItemData.id)}
                        disabled={cartTotal + selectedItemData.price > budget}
                      >
                        Add
                      </PixelButton>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-[var(--color-text-muted)] text-sm">
                  Select an item to see details
                </div>
              )}
            </PixelPanel>

            {/* Cart */}
            <PixelPanel title="Shopping Cart">
              <div className="space-y-2">
                {cart.length === 0 ? (
                  <div className="text-[var(--color-text-muted)] text-xs text-center">
                    Cart is empty
                  </div>
                ) : (
                  cart.map((itemId) => {
                    const item = printerStoreItems.find((i) => i.id === itemId);
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between text-xs"
                      >
                        <span>{item?.name}</span>
                        <span className="text-[var(--color-accent-yellow)]">
                          ${item?.price}
                        </span>
                      </div>
                    );
                  })
                )}
                <div className="border-t border-[var(--color-border)] pt-2 mt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total:</span>
                    <span className="text-[var(--color-accent-yellow)]">
                      ${cartTotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span>Budget:</span>
                    <span>${budget}</span>
                  </div>
                </div>
                {cart.length > 0 && (
                  <PixelButton
                    variant="primary"
                    onClick={handleCheckout}
                    disabled={cartTotal > budget}
                    className="w-full mt-2"
                  >
                    Checkout
                  </PixelButton>
                )}
              </div>
            </PixelPanel>
          </div>
        </div>
      </div>
    );
  }

  // Config phase
  if (phase === 'config') {
    return (
      <div className="h-full flex flex-col">
        {renderError()}

        {dialogueQueue.length > 0 && <DialogueManager />}

        <div className="flex-1 flex items-center justify-center p-4">
          <PixelPanel title="Print Server Configuration" className="w-96">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <span className="text-4xl">🖨️</span>
                <p className="text-sm mt-2">HP JetDirect 170X Setup</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">IP Address</label>
                  <input
                    type="text"
                    value={printerConfig.ipAddress}
                    onChange={(e) =>
                      setPrinterConfig({ ...printerConfig, ipAddress: e.target.value })
                    }
                    className="w-full p-2 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] text-sm"
                    placeholder="192.168.1.20"
                  />
                  <div className="text-[8px] text-[var(--color-text-muted)] mt-1">
                    Used IPs: .1 (router), .10-.15 (PCs)
                  </div>
                </div>

                <div>
                  <label className="block text-xs mb-1">Subnet Mask</label>
                  <input
                    type="text"
                    value={printerConfig.subnetMask}
                    onChange={(e) =>
                      setPrinterConfig({ ...printerConfig, subnetMask: e.target.value })
                    }
                    className="w-full p-2 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Gateway</label>
                  <input
                    type="text"
                    value={printerConfig.gateway}
                    onChange={(e) =>
                      setPrinterConfig({ ...printerConfig, gateway: e.target.value })
                    }
                    className="w-full p-2 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Printer Name</label>
                  <input
                    type="text"
                    value={printerConfig.printerName}
                    onChange={(e) =>
                      setPrinterConfig({ ...printerConfig, printerName: e.target.value })
                    }
                    className="w-full p-2 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] text-sm"
                    placeholder="Office LaserJet"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Port</label>
                  <input
                    type="text"
                    value={printerConfig.port}
                    onChange={(e) =>
                      setPrinterConfig({ ...printerConfig, port: e.target.value })
                    }
                    className="w-full p-2 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] text-sm"
                  />
                  <div className="text-[8px] text-[var(--color-text-muted)] mt-1">
                    Standard RAW printing port is 9100
                  </div>
                </div>
              </div>

              {configErrors.length > 0 && (
                <div className="bg-[var(--color-accent-red)]/20 border border-[var(--color-accent-red)] p-2">
                  {configErrors.map((error, i) => (
                    <div key={i} className="text-[10px] text-[var(--color-accent-red)]">
                      {error}
                    </div>
                  ))}
                </div>
              )}

              <PixelButton
                variant="primary"
                onClick={handleConfigSubmit}
                className="w-full"
              >
                Apply Configuration
              </PixelButton>
            </div>
          </PixelPanel>
        </div>
      </div>
    );
  }

  // Install phase - configure each PC
  if (phase === 'install') {
    return (
      <div className="h-full flex flex-col">
        {renderError()}

        {dialogueQueue.length > 0 && <DialogueManager />}

        <div className="flex-1 flex items-center justify-center p-4">
          <PixelPanel title="Add Printer to PCs" className="w-[500px]">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm">Configure each PC to use the network printer</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Printer IP: {printerConfig.ipAddress} | Port: {printerConfig.port}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {pcs.map((pc) => (
                  <div
                    key={pc.id}
                    className={`p-3 border-2 text-center ${
                      pcsConfigured.includes(pc.id)
                        ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto bg-[var(--color-pc)] border-2 border-[#758586] flex items-center justify-center text-lg font-bold mb-2">
                      {pc.icon}
                    </div>
                    <div className="text-xs mb-2">{pc.name}</div>
                    {pcsConfigured.includes(pc.id) ? (
                      <span className="text-[var(--color-accent-green)] text-xs">
                        ✓ Configured
                      </span>
                    ) : (
                      <PixelButton
                        variant="primary"
                        onClick={() => handleConfigurePC(pc.id)}
                        className="text-[10px]"
                      >
                        Add Printer
                      </PixelButton>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <PixelButton
                  variant="primary"
                  onClick={handleStartTest}
                  disabled={pcsConfigured.length < pcs.length}
                >
                  Test Printing
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>
    );
  }

  // Test phase
  if (phase === 'test') {
    return (
      <div className="h-full flex flex-col">
        {renderError()}

        {dialogueQueue.length > 0 && <DialogueManager />}

        <div className="flex-1 flex items-center justify-center p-4">
          <PixelPanel title="Test Print from Each PC" className="w-[500px]">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <span className="text-4xl">🖨️</span>
                <p className="text-sm mt-2">Send a test page from each workstation</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {pcs.map((pc) => (
                  <div
                    key={pc.id}
                    className={`p-3 border-2 text-center ${
                      testResults[pc.id]
                        ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto bg-[var(--color-pc)] border-2 border-[#758586] flex items-center justify-center text-lg font-bold mb-2">
                      {pc.icon}
                    </div>
                    <div className="text-xs mb-2">{pc.name}</div>
                    {testResults[pc.id] ? (
                      <span className="text-[var(--color-accent-green)] text-xs">
                        ✓ Success!
                      </span>
                    ) : (
                      <PixelButton
                        variant="primary"
                        onClick={() => handleTestPC(pc.id)}
                        className="text-[10px]"
                      >
                        Test Print
                      </PixelButton>
                    )}
                  </div>
                ))}
              </div>

              {/* Printer output simulation */}
              <div className="bg-white border-4 border-gray-300 p-4 text-center">
                <div className="text-gray-500 text-xs mb-2">PRINTER OUTPUT</div>
                {Object.keys(testResults).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(testResults)
                      .filter(([, success]) => success)
                      .map(([pcId]) => {
                        const pc = pcs.find((p) => p.id === pcId);
                        return (
                          <div key={pcId} className="text-black text-xs">
                            Test page from {pc?.name}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">Waiting for print jobs...</div>
                )}
              </div>

              <div className="text-center pt-4">
                <PixelButton
                  variant="primary"
                  onClick={handleTestComplete}
                  disabled={!pcs.every((pc) => testResults[pc.id])}
                >
                  Complete Setup
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>
    );
  }

  // Complete phase
  return (
    <div className="h-full flex flex-col">
      {dialogueQueue.length > 0 ? (
        <DialogueManager onComplete={onComplete} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <PixelButton variant="primary" onClick={onComplete}>
            Continue
          </PixelButton>
        </div>
      )}
    </div>
  );
}
