import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { equipmentCatalog, getEquipmentById, validateMission11Cart } from '../../data/equipment';
import { PixelButton, PixelPanel } from '../ui';
import type { EquipmentItem } from '../../types';

interface CartItem {
  id: string;
  quantity: number;
}

export function EquipmentStore() {
  const budget = useGameStore((state) => state.budget);
  const addToInventory = useGameStore((state) => state.addToInventory);
  const spendBudget = useGameStore((state) => state.spendBudget);
  const setPhase = useGameStore((state) => state.setPhase);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showRedHerringWarning, setShowRedHerringWarning] = useState<EquipmentItem | null>(null);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const equip = getEquipmentById(item.id);
      return total + (equip?.price ?? 0) * item.quantity;
    }, 0);
  };

  const getCartQuantity = (itemId: string) => {
    return cart.find((item) => item.id === itemId)?.quantity ?? 0;
  };

  const addToCart = (item: EquipmentItem) => {
    // Check if it's a red herring
    if (item.isRedHerring) {
      setShowRedHerringWarning(item);
      return;
    }

    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { id: item.id, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find((c) => c.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((c) =>
          c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
      );
    } else {
      setCart(cart.filter((c) => c.id !== itemId));
    }
  };

  const handlePurchase = () => {
    const total = getCartTotal();
    const validation = validateMission11Cart(cart);

    if (!validation.isValid) {
      // Show validation errors
      alert(validation.errors.join('\n\n'));
      return;
    }

    if (total > budget) {
      alert('Not enough budget!');
      return;
    }

    // Process purchase
    cart.forEach((item) => {
      const equipment = getEquipmentById(item.id);
      if (equipment) {
        addToInventory(equipment, item.quantity);
      }
    });
    spendBudget(total);

    // Move to topology phase
    setPhase('topology');
  };

  const cartTotal = getCartTotal();
  const isOverBudget = cartTotal > budget;

  const groupedItems = {
    routers: equipmentCatalog.filter((e) => e.category === 'router'),
    hubs: equipmentCatalog.filter((e) => e.category === 'hub'),
    switches: equipmentCatalog.filter((e) => e.category === 'switch'),
    cables: equipmentCatalog.filter((e) => e.category === 'cable'),
    other: equipmentCatalog.filter((e) => e.category === 'other'),
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pixel-panel-header text-center">
        <h1 className="text-lg">Hank's Hardware & Electronics</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          "Your One-Stop Tech Shop in Possum Holler!"
        </p>
      </div>

      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Equipment List */}
        <div className="flex-1 overflow-y-auto pr-2">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h2 className="text-sm text-[var(--color-accent-blue)] mb-3 uppercase">
                {category}
              </h2>
              <div className="grid gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`equipment-card ${
                      item.isRedHerring ? 'red-herring' : ''
                    } ${getCartQuantity(item.id) > 0 ? 'selected' : ''}`}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => addToCart(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-xs">{item.name}</div>
                        <div className="text-[8px] text-[var(--color-text-secondary)] mt-1">
                          {item.description}
                        </div>
                        {hoveredItem === item.id && (
                          <div className="text-[8px] text-[var(--color-accent-yellow)] mt-2 italic">
                            {item.hoverDescription}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="price-tag">${item.price}</div>
                        {getCartQuantity(item.id) > 0 && (
                          <div className="text-[8px] text-[var(--color-accent-green)] mt-1">
                            x{getCartQuantity(item.id)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Panel */}
        <div className="w-72 flex flex-col">
          <PixelPanel title="Shopping Cart" className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-[var(--color-text-muted)] text-center py-4">
                  Cart is empty
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {cart.map((item) => {
                    const equip = getEquipmentById(item.id);
                    if (!equip) return null;
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-[var(--color-bg-medium)] p-2 border-2 border-[var(--color-border)]"
                      >
                        <div className="flex-1 text-[8px]">
                          <div>{equip.name}</div>
                          <div className="text-[var(--color-text-muted)]">
                            ${equip.price} x {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="w-6 h-6 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] hover:bg-[var(--color-accent-red)] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="w-6 h-6 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] hover:bg-[var(--color-accent-green)] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(equip);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div className="mt-4 pt-4 border-t-2 border-[var(--color-border)]">
              <div className="flex justify-between mb-2">
                <span>Budget:</span>
                <span className="price-tag">${budget}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span className={isOverBudget ? 'price-over-budget' : 'price-tag'}>
                  ${cartTotal}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Remaining:</span>
                <span className={isOverBudget ? 'price-over-budget' : 'text-[var(--color-text-secondary)]'}>
                  ${budget - cartTotal}
                </span>
              </div>

              <PixelButton
                variant="primary"
                className="w-full"
                onClick={handlePurchase}
                disabled={cart.length === 0 || isOverBudget}
              >
                Purchase
              </PixelButton>
            </div>
          </PixelPanel>
        </div>
      </div>

      {/* Red Herring Warning Modal */}
      {showRedHerringWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <PixelPanel title={showRedHerringWarning.redHerringFeedback?.title} className="max-w-md">
            <div className="text-sm mb-4">
              {showRedHerringWarning.redHerringFeedback?.explanation}
            </div>
            {showRedHerringWarning.redHerringFeedback?.analogy && (
              <div className="text-[8px] text-[var(--color-text-secondary)] italic mb-4">
                {showRedHerringWarning.redHerringFeedback.analogy}
              </div>
            )}
            <PixelButton onClick={() => setShowRedHerringWarning(null)}>
              Got it!
            </PixelButton>
          </PixelPanel>
        </div>
      )}
    </div>
  );
}
