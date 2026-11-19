import { create } from 'zustand';
import { safeStorage } from '@/utils/safeStorage';
import { Address, UserProfile } from '@/types';
import { SAMPLE_ADDRESSES } from '@/constants/mockData';

interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  selectedAddress: Address | null;
  favoriteProductIds: string[];

  // Actions
  signIn: (email: string, fullName?: string, phone?: string) => void;
  signUp: (email: string, fullName: string, phone: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (address: Address) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const USER_STORAGE_KEY = '@kfc_user_v1';
const FAVS_STORAGE_KEY = '@kfc_favorites_v1';

const DEFAULT_USER: UserProfile = {
  id: 'usr-default-1',
  email: 'nimal.perera@example.lk',
  fullName: 'Nimal Perera',
  phone: '+94 77 123 4567',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  addresses: SAMPLE_ADDRESSES,
  favoriteProductIds: ['prod-orig-chicken-4pc', 'prod-zinger-burger'],
};

export const useUserStore = create<UserState>((set, get) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,
  isGuest: false,
  selectedAddress: SAMPLE_ADDRESSES[0],
  favoriteProductIds: ['prod-orig-chicken-4pc', 'prod-zinger-burger'],

  signIn: (email, fullName = 'Nimal Perera', phone = '+94 77 123 4567') => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      phone,
      addresses: get().user?.addresses || SAMPLE_ADDRESSES,
      favoriteProductIds: get().favoriteProductIds,
    };
    set({ user, isAuthenticated: true, isGuest: false });
    safeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)).catch(() => {});
  },

  signUp: (email, fullName, phone) => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      phone,
      addresses: SAMPLE_ADDRESSES,
      favoriteProductIds: [],
    };
    set({ user, isAuthenticated: true, isGuest: false });
    safeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)).catch(() => {});
  },

  continueAsGuest: () => {
    set({ isAuthenticated: false, isGuest: true });
  },

  signOut: () => {
    set({
      user: null,
      isAuthenticated: false,
      isGuest: true,
    });
    safeStorage.removeItem(USER_STORAGE_KEY).catch(() => {});
  },

  addAddress: (addressData) => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const currentAddresses = get().user?.addresses || [];
    const updated = [newAddress, ...currentAddresses];

    if (newAddress.isDefault || currentAddresses.length === 0) {
      updated.forEach((a) => {
        a.isDefault = a.id === newAddress.id;
      });
      set({ selectedAddress: newAddress });
    }

    if (get().user) {
      set({ user: { ...get().user!, addresses: updated } });
    }
    return newAddress;
  },

  updateAddress: (address) => {
    const currentAddresses = get().user?.addresses || [];
    const updated = currentAddresses.map((a) => (a.id === address.id ? address : a));
    if (get().user) {
      set({ user: { ...get().user!, addresses: updated } });
    }
    if (get().selectedAddress?.id === address.id) {
      set({ selectedAddress: address });
    }
  },

  deleteAddress: (id) => {
    const currentAddresses = get().user?.addresses || [];
    const updated = currentAddresses.filter((a) => a.id !== id);
    if (get().user) {
      set({ user: { ...get().user!, addresses: updated } });
    }
    if (get().selectedAddress?.id === id) {
      set({ selectedAddress: updated[0] || null });
    }
  },

  setSelectedAddress: (address) => {
    set({ selectedAddress: address });
  },

  toggleFavorite: (productId) => {
    const current = get().favoriteProductIds;
    const exists = current.includes(productId);
    const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
    set({ favoriteProductIds: updated });
    safeStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  isFavorite: (productId) => {
    return get().favoriteProductIds.includes(productId);
  },
}));

// Hydrate stored user on client
if (typeof window !== 'undefined' || typeof navigator !== 'undefined') {
  safeStorage.getItem(USER_STORAGE_KEY).then((data) => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.email) {
          useUserStore.setState({ user: parsed, isAuthenticated: true, isGuest: false });
          if (parsed.addresses && parsed.addresses.length > 0) {
            useUserStore.setState({ selectedAddress: parsed.addresses[0] });
          }
        }
      } catch {}
    }
  });
}
