import { create } from 'zustand';
import { safeStorage } from '@/utils/safeStorage';
import { CartItem, Product, ProductSize, ProductAddonOption, Offer } from '@/types';
import { OFFERS } from '@/constants/mockData';

interface CartState {
  items: CartItem[];
  appliedPromo: Offer | null;
  deliveryType: 'delivery' | 'pickup';
  deliveryFee: number;
  deliveryAddressId: string | null;

  // Actions
  addItem: (params: {
    product: Product;
    selectedSize?: ProductSize;
    selectedAddons?: ProductAddonOption[];
    specialInstructions?: string;
    quantity?: number;
  }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  setDeliveryAddressId: (addressId: string) => void;

  // Calculations
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

const STORAGE_KEY = '@kfc_cart_v1';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  appliedPromo: null,
  deliveryType: 'delivery',
  deliveryFee: 350, // Standard delivery fee LKR 350.00
  deliveryAddressId: 'addr-1',

  addItem: ({ product, selectedSize, selectedAddons = [], specialInstructions, quantity = 1 }) => {
    // Calculate unit price: product base + size modifier + addons
    const sizeModifier = selectedSize?.priceModifier || 0;
    const addonsCost = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = product.price + sizeModifier + addonsCost;

    // Create unique key based on product + size + sorted addon ids
    const addonKey = selectedAddons
      .map((a) => a.id)
      .sort()
      .join('-');
    const sizeKey = selectedSize?.id || 'default';
    const itemId = `${product.id}-${sizeKey}-${addonKey}-${specialInstructions || ''}`;

    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((i) => i.id === itemId);

    let updatedItems: CartItem[];
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      const newQty = updatedItems[existingIndex].quantity + quantity;
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQty,
        totalPrice: newQty * unitPrice,
      };
    } else {
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        product,
        selectedSize,
        selectedAddons,
        specialInstructions,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
      updatedItems = [...currentItems, newItem];
    }

    set({ items: updatedItems });
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems)).catch(() => {});
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const updated = get().items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    });
    set({ items: updated });
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  removeItem: (itemId) => {
    const updated = get().items.filter((item) => item.id !== itemId);
    set({ items: updated });
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  clearCart: () => {
    set({ items: [], appliedPromo: null });
    safeStorage.removeItem(STORAGE_KEY).catch(() => {});
  },

  applyPromo: (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const offer = OFFERS.find((o) => o.code.toUpperCase() === cleanCode);
    if (!offer) {
      return { success: false, message: 'Invalid coupon code. Please try again.' };
    }

    const subtotal = get().getSubtotal();
    if (subtotal < offer.minOrderAmount) {
      return {
        success: false,
        message: `Requires minimum order of LKR ${offer.minOrderAmount.toLocaleString()}.`,
      };
    }

    set({ appliedPromo: offer });
    return { success: true, message: `Promo code "${offer.code}" applied successfully!` };
  },

  removePromo: () => {
    set({ appliedPromo: null });
  },

  setDeliveryType: (type) => {
    set({ deliveryType: type });
  },

  setDeliveryAddressId: (addressId) => {
    set({ deliveryAddressId: addressId });
  },

  getItemCount: () => {
    return get().items.reduce((acc, curr) => acc + curr.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  },

  getDiscountAmount: () => {
    const { appliedPromo } = get();
    if (!appliedPromo) return 0;
    const subtotal = get().getSubtotal();
    if (subtotal < appliedPromo.minOrderAmount) return 0;

    let discount = 0;
    if (appliedPromo.discountType === 'percentage') {
      discount = (subtotal * appliedPromo.discountValue) / 100;
      if (appliedPromo.maxDiscount && discount > appliedPromo.maxDiscount) {
        discount = appliedPromo.maxDiscount;
      }
    } else {
      discount = appliedPromo.discountValue;
    }
    return Math.min(discount, subtotal);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const discount = get().getDiscountAmount();
    const delivery = get().deliveryType === 'delivery' ? get().deliveryFee : 0;
    return Math.max(0, subtotal - discount + delivery);
  },
}));

// Hydrate stored cart on client
if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
  safeStorage.getItem(STORAGE_KEY).then((data) => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          useCartStore.setState({ items: parsed });
        }
      } catch {}
    }
  });
}
