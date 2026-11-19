import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Phone,
  RotateCw,
  Home,
  MapPin,
  CreditCard,
  ShoppingBag,
} from 'lucide-react-native';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { OrderStatusTimeline } from '@/components/common/OrderStatusTimeline';
import { PrimaryButton } from '@/components/common/PrimaryButton';

interface OrderTrackingScreenProps {
  orderId: string;
}

export function OrderTrackingScreen({ orderId }: OrderTrackingScreenProps) {
  const router = useRouter();
  const order = useOrderStore((state) => state.getOrderById(orderId));
  const advanceDemoOrderStatus = useOrderStore((state) => state.advanceDemoOrderStatus);
  const addItem = useCartStore((state) => state.addItem);

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/' as any)} style={styles.backBtn}>
            <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Order Not Found</Text>
          <Text style={styles.notFoundDesc}>
            We could not find an order with ID #{orderId}.
          </Text>
          <PrimaryButton
            title="Return to Home"
            onPress={() => router.replace('/' as any)}
            size="md"
          />
        </View>
      </View>
    );
  }

  const handleAdvanceStatus = () => {
    const nextStatus = advanceDemoOrderStatus(order.id);
    if (nextStatus) {
      Alert.alert('Status Updated', `Order progressed to: ${nextStatus.replace(/_/g, ' ')}`);
    }
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem({
        product: item.product,
        selectedSize: item.selectedSize,
        selectedAddons: item.selectedAddons,
        specialInstructions: item.specialInstructions,
        quantity: item.quantity,
      });
    });
    router.push('/cart' as any);
  };

  const handleCallStore = () => {
    Linking.openURL('tel:+94115532532').catch(() => {
      Alert.alert('Customer Care', 'KFC Sri Lanka Hotline: +94 11 553 2532');
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/' as any)} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>Order #{order.orderNumber}</Text>
        <Pressable onPress={handleCallStore} style={styles.phoneBtn}>
          <Phone size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Banner */}
        <View style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={32} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Estimated arrival in {order.estimatedArrivalMinutes} minutes ({order.estimatedDeliveryTime})
          </Text>
        </View>

        {/* Real-time Order Status Timeline */}
        <OrderStatusTimeline status={order.status} />

        {/* Demo Advance Button for testing */}
        <Pressable
          onPress={handleAdvanceStatus}
          style={({ pressed }) => [styles.demoButton, pressed && { opacity: 0.8 }]}
        >
          <RotateCw size={14} color={colors.primary} />
          <Text style={styles.demoButtonText}>Simulate Next Kitchen/Delivery Stage</Text>
        </Pressable>

        {/* Delivery Details Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>Fulfillment Details</Text>
          </View>
          <View style={styles.detailsBody}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>
              {order.deliveryType === 'delivery' ? 'Home Delivery' : 'In-store Pickup'}
            </Text>
          </View>

          {order.deliveryAddress && (
            <View style={styles.detailsBody}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>
                {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}
              </Text>
            </View>
          )}

          <View style={styles.detailsBody}>
            <Text style={styles.detailLabel}>Recipient:</Text>
            <Text style={styles.detailValue}>
              {order.contactName} ({order.contactPhone})
            </Text>
          </View>

          <View style={styles.detailsBody}>
            <Text style={styles.detailLabel}>Payment:</Text>
            <Text style={styles.detailValue}>
              {order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Items Summary */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <ShoppingBag size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>Ordered Items ({order.items.length})</Text>
          </View>

          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                {item.selectedSize && (
                  <Text style={styles.itemSub}>Size: {item.selectedSize.name}</Text>
                )}
                {item.selectedAddons.length > 0 && (
                  <Text style={styles.itemSub}>
                    Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                  </Text>
                )}
              </View>
              <Text style={styles.itemPrice}>{formatLKR(item.totalPrice)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>{formatLKR(order.subtotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>{formatLKR(order.deliveryFee)}</Text>
          </View>
          {order.discountAmount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.success }]}>Discount</Text>
              <Text style={[styles.billValue, { color: colors.success }]}>
                -{formatLKR(order.discountAmount)}
              </Text>
            </View>
          )}
          <View style={styles.billRow}>
            <Text style={styles.billTotalLabel}>Total Paid (LKR)</Text>
            <Text style={styles.billTotalValue}>{formatLKR(order.total)}</Text>
          </View>
        </View>

        {/* Actions: Reorder and Return Home */}
        <View style={styles.actionsContainer}>
          <PrimaryButton
            title="Reorder All Items"
            onPress={handleReorder}
            variant="secondary"
            size="md"
          />
          <PrimaryButton
            title="Return to Home"
            onPress={() => router.replace('/' as any)}
            variant="primary"
            size="md"
            icon={<Home size={18} color={colors.white} />}
            iconPosition="left"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: 46,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  phoneBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  headerTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 40,
    gap: spacing.base,
  },
  successCard: {
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  demoButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  detailsBody: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    width: 80,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  detailValue: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  itemQty: {
    width: 28,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  itemMeta: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  itemSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  billLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  billTotalLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  billTotalValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
    marginTop: 4,
  },
  actionsContainer: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  notFoundContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  notFoundDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
