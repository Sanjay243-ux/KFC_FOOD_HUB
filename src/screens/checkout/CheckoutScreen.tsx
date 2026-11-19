import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  MoreVertical,
  Check,
} from 'lucide-react-native';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useOrderStore } from '@/store/useOrderStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { PaymentMethod } from '@/types';
import { PrimaryButton } from '@/components/common/PrimaryButton';

export function CheckoutScreen() {
  const router = useRouter();

  const {
    items,
    appliedPromo,
    deliveryType,
    deliveryFee,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    clearCart,
  } = useCartStore();

  const user = useUserStore((state) => state.user);
  const selectedAddress = useUserStore((state) => state.selectedAddress);
  const { createOrder, isSubmitting } = useOrderStore();

  const [contactName, setContactName] = useState(
    selectedAddress?.contactName || user?.fullName || 'Nimal Perera'
  );
  const [contactPhone, setContactPhone] = useState(
    selectedAddress?.contactPhone || user?.phone || '+94 77 123 4567'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handlePlaceOrder = async () => {
    if (!contactName.trim()) {
      Alert.alert('Required Field', 'Please provide a contact name.');
      return;
    }
    if (!contactPhone.trim()) {
      Alert.alert('Required Field', 'Please enter a valid phone number.');
      return;
    }
    if (deliveryType === 'delivery' && !selectedAddress) {
      Alert.alert('Address Required', 'Please select or add a delivery address.');
      return;
    }

    try {
      const order = await createOrder({
        items,
        subtotal,
        deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
        discountAmount: discount,
        taxAmount: 0,
        total,
        appliedPromoCode: appliedPromo?.code,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? selectedAddress || undefined : undefined,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        paymentMethod,
      });

      clearCart();
      router.replace(`/orders/${order.id}` as any);
    } catch {
      Alert.alert('Order Failed', 'Could not submit your order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar (matching reference Checkout) */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.circleBtn}>
          <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.topBarTitle}>Checkout</Text>

        <View style={styles.circleBtn}>
          <MoreVertical size={18} color={colors.textSecondary} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Method Section (Matching reference UI) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Pressable onPress={() => Alert.alert('Payment Methods', 'Select your preferred payment provider.')}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.paymentList}>
          {/* Cash on Delivery */}
          <Pressable
            onPress={() => setPaymentMethod('cod')}
            style={[
              styles.paymentCard,
              paymentMethod === 'cod' && styles.paymentCardActive,
            ]}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconCircle}>
                <Banknote size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSub}>Pay upon delivery</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                paymentMethod === 'cod' && styles.radioOuterActive,
              ]}
            >
              {paymentMethod === 'cod' && <View style={styles.radioInner} />}
            </View>
          </Pressable>

          {/* Credit / Debit Card */}
          <Pressable
            onPress={() => setPaymentMethod('card')}
            style={[
              styles.paymentCard,
              paymentMethod === 'card' && styles.paymentCardActive,
            ]}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconCircle}>
                <CreditCard size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Credit / Debit Card</Text>
                <Text style={styles.paymentSub}>Visa, Mastercard, LankaPay</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                paymentMethod === 'card' && styles.radioOuterActive,
              ]}
            >
              {paymentMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </Pressable>

          {/* Koko Sri Lanka BNPL */}
          <Pressable
            onPress={() => setPaymentMethod('koko')}
            style={[
              styles.paymentCard,
              paymentMethod === 'koko' && styles.paymentCardActive,
            ]}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconCircle}>
                <Smartphone size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Koko Pay in 3</Text>
                <Text style={styles.paymentSub}>3 interest-free installments</Text>
              </View>
            </View>
            <View
              style={[
                styles.radioOuter,
                paymentMethod === 'koko' && styles.radioOuterActive,
              ]}
            >
              {paymentMethod === 'koko' && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        </View>

        {/* Delivery Address Card with Map Preview (Matching reference UI) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Pressable onPress={() => router.push('/profile/addresses' as any)}>
            <Text style={styles.seeAllText}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.addressCard}>
          {/* Map Preview Graphic */}
          <View style={styles.mapGraphicWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
              }}
              style={styles.mapImage}
            />
            <View style={styles.mapPinOverlay}>
              <View style={styles.pinCircle}>
                <MapPin size={18} color={colors.white} />
              </View>
            </View>
          </View>

          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>
              {selectedAddress ? `${selectedAddress.label} (${selectedAddress.contactName})` : 'Home'}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {selectedAddress
                ? `${selectedAddress.streetAddress}, ${selectedAddress.city}`
                : 'No. 45/2, Galle Road, Colombo 03'}
            </Text>
            <Text style={styles.phoneText}>
              Phone: {selectedAddress?.contactPhone || contactPhone}
            </Text>
          </View>
        </View>

        {/* Order Summary Bill (Matching reference UI) */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

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

      {/* Floating Bottom Bar (Matching reference UI) */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <Text style={styles.bottomPriceValue}>{formatLKR(total)}</Text>
        </View>

        <View style={styles.bottomBtnCol}>
          <PrimaryButton
            title="Place Your Order"
            onPress={handlePlaceOrder}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.md + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  paymentList: {
    gap: spacing.sm,
  },
  paymentCard: {
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
  paymentCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paymentIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addressCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  mapGraphicWrapper: {
    width: '100%',
    height: 100,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.dish,
  },
  addressInfo: {
    padding: spacing.md,
  },
  addressLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
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
