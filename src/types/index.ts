export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'card' | 'koko' | 'mintpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface ProductSize {
  id: string;
  name: string; // e.g., 'Regular', 'Large', 'Bucket (8 Pcs)'
  priceModifier: number; // e.g. 0 for regular, +500 for large
  isDefault?: boolean;
}

export interface ProductAddonOption {
  id: string;
  name: string;
  price: number; // In LKR
  isDefault?: boolean;
}

export interface ProductAddonGroup {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  minSelections: number;
  maxSelections: number;
  options: ProductAddonOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // Base price in LKR
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  calories?: number;
  prepTimeMinutes?: number;
  allergens?: string[];
  availableSizes?: ProductSize[];
  addonGroups?: ProductAddonGroup[];
}

export interface CartItem {
  id: string; // unique cart item id (product + size + addon combo)
  productId: string;
  product: Product;
  selectedSize?: ProductSize;
  selectedAddons: ProductAddonOption[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number; // calculated unit price including size and addons
  totalPrice: number; // unitPrice * quantity
}

export interface Address {
  id: string;
  userId?: string;
  label: 'Home' | 'Work' | 'Other';
  contactName: string;
  contactPhone: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  district: string;
  postalCode?: string;
  deliveryNotes?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
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
  paymentStatus: PaymentStatus;
  createdAt: string;
  estimatedArrivalMinutes: number;
  estimatedDeliveryTime: string;
  specialInstructions?: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 500 for LKR 500
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  terms: string[];
  bannerImage: string;
  categoryTag?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  addresses: Address[];
  favoriteProductIds: string[];
  savedPaymentMethods?: {
    id: string;
    brand: string;
    last4: string;
    expiry: string;
  }[];
}
