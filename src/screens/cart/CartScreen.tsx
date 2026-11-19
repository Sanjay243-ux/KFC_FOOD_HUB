import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Truck,
  Store,
  Tag,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowRight,
} from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { CartItemRow } from '@/components/common/CartItemRow';
import { EmptyState } from '@/components/common/EmptyState';
import { PrimaryButton } from '@/components/common/PrimaryButton';

export function CartScreen() {
  const router = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    items,
    appliedPromo,
    deliveryType,
    deliveryFee,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromo,
    removePromo,
    setDeliveryType,
    getSubtotal,
    getDiscountAmount,
    getTotal,
  } = useCartStore();

  const selectedAddress = useUserStore((state) => state.selectedAddress);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoFeedback({ type: 'success', message: res.message });
      setPromoInput('');
    } else {
      setPromoFeedback({ type: 'error', message: res.message });
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before proceeding.');
      return;
    }
    router.push('/checkout' as any);
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.circleBtn}>
            <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.topBarTitle}>My Cart</Text>
          <View style={{ width: 42 }} />
        </View>

        <EmptyState
          type="cart"
          title="Your Cart is Empty"
          description="Looks like you haven't added anything yet. Discover our fresh meals!"
          actionTitle="Explore Menu"
          onAction={() => router.push('/menu' as any)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar (matching reference My Cart) */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.circleBtn}>
          <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.topBarTitle}>My Cart</Text>

        <Pressable
          onPress={() =>
            Alert.alert('Clear Cart', 'Remove all items from your cart?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ])
          }
          style={styles.circleBtn}
          accessibilityLabel="Clear cart"
        >
          <Trash2 size={18} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery / Pickup Toggle */}
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setDeliveryType('delivery')}
            style={[
              styles.toggleBtn,
              deliveryType === 'delivery' && styles.toggleBtnActive,
            ]}
          >
            <Truck
              size={16}
              color={deliveryType === 'delivery' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.toggleText,
                deliveryType === 'delivery' && styles.toggleTextActive,
              ]}
            >
              Delivery ({formatLKR(deliveryFee)})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setDeliveryType('pickup')}
            style={[
              styles.toggleBtn,
              deliveryType === 'pickup' && styles.toggleBtnActive,
            ]}
          >
            <Store
              size={16}
              color={deliveryType === 'pickup' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.toggleText,
                deliveryType === 'pickup' && styles.toggleTextActive,
              ]}
            >
              Pickup (Free)
            </Text>
          </Pressable>
        </View>

        {/* Selected Address Banner */}
        {deliveryType === 'delivery' && selectedAddress && (
          <Pressable
            onPress={() => router.push('/profile/addresses' as any)}
            style={styles.addressPill}
          >
            <View style={styles.addressTextCol}>
              <Text style={styles.addressLabel}>
                Deliver to: {selectedAddress.label}
              </Text>
              <Text style={styles.addressDetail} numberOfLines={1}>
                {selectedAddress.streetAddress}, {selectedAddress.city}
              </Text>
            </View>
            <Text style={styles.addressChangeText}>Change</Text>
          </Pressable>
        )}

        {/* Cart Items List */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={(q) => updateQuantity(item.id, q)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </View>

        {/* Coupon Code Section */}
        <View style={styles.promoCard}>
          {appliedPromo ? (
            <View style={styles.appliedPromoRow}>
              <View style={styles.appliedLeft}>
                <CheckCircle size={18} color={colors.success} strokeWidth={2.5} />
                <View>
                  <Text style={styles.appliedCode}>{appliedPromo.code}</Text>
                  <Text style={styles.appliedDesc}>
                    {appliedPromo.discountType === 'percentage'
                      ? `${appliedPromo.discountValue}% discount applied`
                      : `Flat ${formatLKR(appliedPromo.discountValue)} discount`}
                  </Text>
                </View>
              </View>
              <Pressable onPress={removePromo} style={styles.removePromoBtn}>
                <Text style={styles.removePromoText}>Remove</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.promoInputRow}>
              <View style={styles.promoInputWrapper}>
                <Tag size={16} color={colors.textSecondary} />
                <TextInput
                  value={promoInput}
                  onChangeText={(t) => {
                    setPromoInput(t);
                    setPromoFeedback(null);
                  }}
                  placeholder="Promo code (e.g. WELCOME20)"
                  placeholderTextColor={colors.textMuted}
                  style={styles.promoInput}
                  autoCapitalize="characters"
                />
              </View>
              <Pressable
                onPress={handleApplyPromo}
                style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </Pressable>
            </View>
          )}

          {promoFeedback && (
            <View style={styles.feedbackRow}>
              {promoFeedback.type === 'error' ? (
                <XCircle size={13} color={colors.error} />
              ) : (
                <CheckCircle size={13} color={colors.success} />
              )}
              <Text
                style={[
                  styles.feedbackText,
                  { color: promoFeedback.type === 'error' ? colors.error : colors.success },
                ]}
              >
                {promoFeedback.message}
              </Text>
            </View>
          )}
        </View>

        {/* Order Summary Bill */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatLKR(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {deliveryType === 'delivery' ? formatLKR(deliveryFee) : 'FREE'}
            </Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>
                Discount ({appliedPromo?.code})
              </Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                -{formatLKR(discount)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>{formatLKR(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <Text style={styles.bottomPriceValue}>{formatLKR(total)}</Text>
        </View>

        <View style={styles.bottomBtnCol}>
          <PrimaryButton
            title="Place Your Order"
            onPress={handleCheckout}
            size="lg"
            icon={<ArrowRight size={16} color={colors.white} strokeWidth={2.5} />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: 46,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  topBarTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 120,
    gap: spacing.base,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryBackground,
    padding: 3,
    borderRadius: borderRadius.full,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
  },
  toggleBtnActive: {
    backgroundColor: colors.card,
    ...shadows.subtle,
  },
  toggleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  addressTextCol: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  addressDetail: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  addressChangeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  itemsList: {
    gap: spacing.xs,
  },
  promoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  promoInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  promoInput: {
    flex: 1,
    fontSize: typography.fontSize.xs + 1,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  appliedPromoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appliedCode: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  appliedDesc: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  removePromoBtn: {
    padding: 4,
  },
  removePromoText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  feedbackText: {
    fontSize: 11,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  summaryTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.card,
  },
  bottomPriceCol: {
    marginRight: spacing.md,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  bottomPriceValue: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  bottomBtnCol: {
    flex: 1,
  },
});
