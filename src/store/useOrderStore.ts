import { create } from 'zustand';
import { safeStorage } from '@/utils/safeStorage';
import { Order, OrderStatus, CartItem, Address, PaymentMethod } from '@/types';
import { PRODUCTS, SAMPLE_ADDRESSES } from '@/constants/mockData';

interface OrderState {
  orders: Order[];
  isSubmitting: boolean;
  activeOrderId: string | null;

  // Actions
  createOrder: (params: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
    appliedPromoCode?: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: Address;
    contactName: string;
    contactPhone: string;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
  }) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceDemoOrderStatus: (orderId: string) => OrderStatus | null;
}

const ORDERS_STORAGE_KEY = '@kfc_orders_v1';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'KFC-LK-7819',
    status: 'out_for_delivery',
    items: [
      {
        id: 'ord-item-1',
        productId: 'prod-orig-chicken-4pc',
        product: PRODUCTS[0],
        quantity: 1,
        unitPrice: 2150,
        totalPrice: 2150,
        selectedSize: PRODUCTS[0].availableSizes?.[0],
        selectedAddons: [],
      },
      {
        id: 'ord-item-2',
        productId: 'prod-zinger-burger',
        product: PRODUCTS[2],
        quantity: 2,
        unitPrice: 1350,
        totalPrice: 2700,
        selectedAddons: [],
      },
    ],
    subtotal: 4850,
    deliveryFee: 350,
    discountAmount: 500,
    taxAmount: 0,
    total: 4700,
    appliedPromoCode: 'BUCKET500',
    deliveryType: 'delivery',
    deliveryAddress: SAMPLE_ADDRESSES[0],
    contactName: 'Nimal Perera',
    contactPhone: '+94 77 123 4567',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedArrivalMinutes: 15,
    estimatedDeliveryTime: '35 - 45 mins',
  },
  {
    id: 'ord-102',
    orderNumber: 'KFC-LK-6430',
    status: 'delivered',
    items: [
      {
        id: 'ord-item-3',
        productId: 'prod-hot-crispy-bucket',
        product: PRODUCTS[1],
        quantity: 1,
        unitPrice: 4350,
        totalPrice: 4350,
        selectedSize: PRODUCTS[1].availableSizes?.[0],
        selectedAddons: [],
      },
    ],
    subtotal: 4350,
    deliveryFee: 350,
    discountAmount: 0,
    taxAmount: 0,
    total: 4700,
    deliveryType: 'delivery',
    deliveryAddress: SAMPLE_ADDRESSES[0],
    contactName: 'Nimal Perera',
    contactPhone: '+94 77 123 4567',
    paymentMethod: 'cod',
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedArrivalMinutes: 0,
    estimatedDeliveryTime: 'Delivered',
  },
];

const ORDER_FLOW: OrderStatus[] = [
  'placed',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
];

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: SAMPLE_ORDERS,
  isSubmitting: false,
  activeOrderId: SAMPLE_ORDERS[0].id,

  createOrder: async (params) => {
    set({ isSubmitting: true });

    // Simulate network delay / safe submission
    await new Promise((resolve) => setTimeout(resolve, 800));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `KFC-LK-${randomSuffix}`,
      status: 'placed',
      items: params.items,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      discountAmount: params.discountAmount,
      taxAmount: params.taxAmount,
      total: params.total,
      appliedPromoCode: params.appliedPromoCode,
      deliveryType: params.deliveryType,
      deliveryAddress: params.deliveryAddress,
      contactName: params.contactName,
      contactPhone: params.contactPhone,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'card' ? 'completed' : 'pending',
      createdAt: new Date().toISOString(),
      estimatedArrivalMinutes: 35,
      estimatedDeliveryTime: '30 - 40 mins',
      specialInstructions: params.specialInstructions,
    };

    const updated = [newOrder, ...get().orders];
    set({
      orders: updated,
      isSubmitting: false,
      activeOrderId: newOrder.id,
    });

    safeStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
    return newOrder;
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((o) => o.id === orderId);
  },

  updateOrderStatus: (orderId, status) => {
    const updated = get().orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    set({ orders: updated });
    safeStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  advanceDemoOrderStatus: (orderId: string) => {
    const order = get().getOrderById(orderId);
    if (!order) return null;

    const currentIndex = ORDER_FLOW.indexOf(order.status);
    if (currentIndex > -1 && currentIndex < ORDER_FLOW.length - 1) {
      const nextStatus = ORDER_FLOW[currentIndex + 1];
      get().updateOrderStatus(orderId, nextStatus);
      return nextStatus;
    }
    return order.status;
  },
}));

// Hydrate stored orders on client
if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
  safeStorage.getItem(ORDERS_STORAGE_KEY).then((data) => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          useOrderStore.setState({ orders: parsed, activeOrderId: parsed[0]?.id || null });
        }
      } catch {}
    }
  });
}
