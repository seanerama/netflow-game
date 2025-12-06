import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PixelButton, PixelPanel } from '../ui';
import { DialogueManager } from '../dialogue/DialogueManager';
import {
  switchStoreItems,
  wrongPurchaseDialogue,
  correctPurchaseDialogue,
} from '../../data/mission1-5';

interface SwitchStoreProps {
  onComplete: () => void;
}

export function SwitchStore({ onComplete }: SwitchStoreProps) {
  const budget = useGameStore((state) => state.budget);
  const setBudget = useGameStore((state) => state.setBudget);
  const addDialogue = useGameStore((state) => state.addDialogue);
  const dialogueQueue = useGameStore((state) => state.dialogueQueue);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [purchased, setPurchased] = useState(false);

  const getCartTotal = () => {
    return cart.reduce((total, itemId) => {
      const item = switchStoreItems.find((i) => i.id === itemId);
      return total + (item?.price || 0);
    }, 0);
  };

  const hasSwitch = () => {
    return cart.some((itemId) => itemId.startsWith('switch-'));
  };

  const hasOnlyHub = () => {
    return cart.some((itemId) => itemId.startsWith('hub-')) && !hasSwitch();
  };

  const handleAddToCart = (itemId: string) => {
    const item = switchStoreItems.find((i) => i.id === itemId);
    if (!item) return;

    if (getCartTotal() + item.price > budget) {
      return; // Can't afford
    }

    // Only allow one switch or hub
    if (itemId.startsWith('switch-') || itemId.startsWith('hub-')) {
      // Remove any existing switch/hub from cart
      const filteredCart = cart.filter(
        (id) => !id.startsWith('switch-') && !id.startsWith('hub-')
      );
      setCart([...filteredCart, itemId]);
    } else {
      setCart([...cart, itemId]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    const index = cart.indexOf(itemId);
    if (index > -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const handlePurchase = () => {
    if (hasOnlyHub()) {
      addDialogue(wrongPurchaseDialogue);
      return;
    }

    if (!hasSwitch()) {
      return; // Need to select a switch
    }

    const total = getCartTotal();
    setBudget(budget - total);
    setPurchased(true);
    addDialogue(correctPurchaseDialogue);
  };

  const handleDialogueComplete = () => {
    if (purchased) {
      onComplete();
    }
  };

  const selectedItemData = selectedItem
    ? switchStoreItems.find((i) => i.id === selectedItem)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d1b00] via-[#4a2c00] to-[#2d1b00] p-3 border-b-4 border-[#8b4513]">
        <div className="flex items-center justify-between">
          <div className="text-[var(--color-accent-yellow)] text-lg font-bold">
            Hank's Hardware & Electronics
          </div>
          <div className="text-[var(--color-accent-green)]">
            Budget: ${budget}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Store Items */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-sm text-[var(--color-accent-blue)] mb-4">
            NETWORK EQUIPMENT
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {switchStoreItems.map((item) => {
              const inCart = cart.includes(item.id);
              const canAfford = getCartTotal() + item.price <= budget || inCart;
              const isSwitch = item.id.startsWith('switch-');
              const isHub = item.id.startsWith('hub-');

              return (
                <div
                  key={item.id}
                  className={`p-4 border-4 cursor-pointer transition-all ${
                    selectedItem === item.id
                      ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/20'
                      : inCart
                      ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)]/10'
                      : canAfford
                      ? 'border-[var(--color-border)] bg-[var(--color-bg-medium)] hover:border-[var(--color-accent-blue)]'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-dark)] opacity-50'
                  }`}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 flex items-center justify-center border-2 text-xs font-bold ${
                        isSwitch
                          ? 'bg-[var(--color-accent-green)] border-[var(--color-accent-green)]'
                          : isHub
                          ? 'bg-[var(--color-accent-red)] border-[var(--color-accent-red)]'
                          : 'bg-[var(--color-bg-dark)] border-[var(--color-border)]'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold">{item.name}</div>
                      <div className="text-[8px] text-[var(--color-text-secondary)]">
                        {item.description}
                      </div>
                      <div className="text-[10px] text-[var(--color-accent-yellow)] mt-1">
                        ${item.price}
                      </div>
                    </div>
                    {inCart && (
                      <span className="text-[var(--color-accent-green)] text-lg">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Item Details & Cart */}
        <div className="w-72 p-4 border-l-4 border-[var(--color-border)] bg-[var(--color-bg-dark)] flex flex-col">
          {/* Item Details */}
          {selectedItemData ? (
            <PixelPanel title="Item Details" className="mb-4">
              <div className="text-[10px] font-bold mb-2">
                {selectedItemData.name}
              </div>
              <div className="text-[8px] text-[var(--color-text-secondary)] mb-3">
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
                    disabled={
                      getCartTotal() + selectedItemData.price > budget
                    }
                  >
                    Add to Cart
                  </PixelButton>
                )}
              </div>
            </PixelPanel>
          ) : (
            <div className="text-center text-[var(--color-text-muted)] text-[10px] mb-4">
              Select an item to see details
            </div>
          )}

          {/* Cart */}
          <PixelPanel title="Shopping Cart" className="flex-1">
            {cart.length === 0 ? (
              <div className="text-[8px] text-[var(--color-text-muted)]">
                Cart is empty
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((itemId, index) => {
                  const item = switchStoreItems.find((i) => i.id === itemId);
                  if (!item) return null;
                  return (
                    <div
                      key={`${itemId}-${index}`}
                      className="flex items-center justify-between text-[8px]"
                    >
                      <span>{item.name}</span>
                      <span className="text-[var(--color-accent-yellow)]">
                        ${item.price}
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-[var(--color-border)] pt-2 mt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>Total:</span>
                    <span className="text-[var(--color-accent-green)]">
                      ${getCartTotal()}
                    </span>
                  </div>
                  <div className="text-[8px] text-[var(--color-text-secondary)]">
                    Remaining: ${budget - getCartTotal()}
                  </div>
                </div>
              </div>
            )}
          </PixelPanel>

          {/* Purchase Button */}
          <div className="mt-4">
            {!hasSwitch() && (
              <div className="text-[8px] text-[var(--color-accent-yellow)] mb-2 text-center">
                You need to select a switch!
              </div>
            )}
            <PixelButton
              variant="primary"
              onClick={handlePurchase}
              disabled={!hasSwitch() || purchased}
              className="w-full"
            >
              Purchase
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Dialogue overlay */}
      {dialogueQueue.length > 0 && (
        <DialogueManager onComplete={handleDialogueComplete} />
      )}
    </div>
  );
}
