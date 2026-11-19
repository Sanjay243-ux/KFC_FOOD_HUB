import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, Bell, ShoppingBag } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';

interface AppHeaderProps {
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
}

export function AppHeader({ onLocationPress, onNotificationPress }: AppHeaderProps) {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useUserStore((state) => state.user);
  const selectedAddress = useUserStore((state) => state.selectedAddress);

  const locationText = selectedAddress
    ? `${selectedAddress.city}`
    : 'Colombo 03, Kollupitiya';

  return (
    <View style={styles.container}>
      {/* Left: Circular User Profile Avatar */}
      <Pressable
        onPress={() => router.push('/profile' as any)}
        style={styles.avatarButton}
        accessibilityLabel="Open Profile"
      >
        {user?.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>
              {user?.fullName?.charAt(0) || 'K'}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Center: Delivery Location (as in reference UI) */}
      <Pressable
        onPress={onLocationPress || (() => router.push('/profile/addresses' as any))}
        style={({ pressed }) => [styles.locationCol, pressed && { opacity: 0.7 }]}
        accessibilityLabel={`Delivery Location: ${locationText}`}
      >
        <Text style={styles.locationLabel}>Delivery Location</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationText} numberOfLines={1}>
            {locationText}
          </Text>
          <ChevronDown size={14} color={colors.textPrimary} strokeWidth={2.2} />
        </View>
      </Pressable>

      {/* Right: Notifications & Cart */}
      <View style={styles.rightActions}>
        <Pressable
          onPress={onNotificationPress || (() => router.push('/offers' as any))}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          accessibilityLabel="Notifications"
        >
          <Bell size={18} color={colors.textPrimary} strokeWidth={2} />
          <View style={styles.notificationDot} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/cart' as any)}
          style={({ pressed }) => [styles.iconBtn, styles.cartBtn, pressed && styles.cartBtnPressed]}
          accessibilityLabel={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingBag size={18} color={colors.white} strokeWidth={2.2} />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {itemCount > 99 ? '99+' : itemCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: 46,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  avatarButton: {
    borderRadius: borderRadius.full,
    ...shadows.subtle,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatarInitial: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  },
  locationCol: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  locationLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    maxWidth: 170,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.subtle,
  },
  iconBtnPressed: {
    backgroundColor: colors.secondaryBackground,
  },
  cartBtn: {
    backgroundColor: colors.primary,
  },
  cartBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
});
