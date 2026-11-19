import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, ArrowRight, RotateCw, ChevronRight } from 'lucide-react-native';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { formatLKR, getOrderStatusMeta } from '@/utils/formatters';
import { EmptyState } from '@/components/common/EmptyState';
import { Order } from '@/types';

export function OrdersScreen() {
  const router = useRouter();
  const orders = useOrderStore((state) => state.orders);
  const addItem = useCartStore((state) => state.addItem);
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const displayOrders = activeTab === 'active' ? activeOrders : orders;

  const handleReorder = (order: Order) => {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>

        <View style={styles.tabToggle}>
          <Pressable
            onPress={() => setActiveTab('all')}
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All Orders ({orders.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('active')}
            style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({activeOrders.length})
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayOrders.length === 0 ? (
          <EmptyState
            title={activeTab === 'active' ? 'No Active Orders' : 'No Past Orders'}
            description="You don't have any ongoing deliveries right now. Check out our menu for fresh meals!"
            actionTitle="Order Now"
            onAction={() => router.push('/menu' as any)}
          />
        ) : (
          displayOrders.map((order) => {
            const meta = getOrderStatusMeta(order.status);
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Top: Order #, Status badge, Date */}
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{dateStr}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: meta.badgeBg }]}>
                    <Text style={[styles.statusText, { color: meta.textColor }]}>
                      {meta.label}
                    </Text>
                  </View>
                </View>

                {/* Items preview */}
                <View style={styles.itemsPreview}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {order.items.map((it) => (
                      <View key={it.id} style={styles.thumbnailWrapper}>
                        <Image
                          source={{ uri: it.product.image }}
                          style={styles.thumbnail}
                        />
                        {it.quantity > 1 && (
                          <View style={styles.qtyBadge}>
                            <Text style={styles.qtyBadgeText}>x{it.quantity}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </ScrollView>

                  <Text style={styles.itemSummaryText} numberOfLines={1}>
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </Text>
                </View>

                {/* Bottom Row: Total & Actions */}
                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.footerLabel}>Total Amount</Text>
                    <Text style={styles.footerAmount}>{formatLKR(order.total)}</Text>
                  </View>

                  <View style={styles.footerActions}>
                    <Pressable
                      onPress={() => handleReorder(order)}
                      style={styles.reorderBtn}
                      accessibilityLabel="Reorder items"
                    >
                      <RotateCw size={14} color={colors.textPrimary} />
                      <Text style={styles.reorderText}>Reorder</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => router.push(`/orders/${order.id}` as any)}
                      style={styles.trackBtn}
                      accessibilityLabel="Track order"
                    >
                      <Text style={styles.trackText}>Track</Text>
                      <ChevronRight size={14} color={colors.white} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })
        )}
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
    paddingHorizontal: spacing.base,
    paddingTop: 48,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryBackground,
    padding: 3,
    borderRadius: borderRadius.full,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  tabBtnActive: {
    backgroundColor: colors.card,
    ...shadows.subtle,
  },
  tabText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 110,
    gap: spacing.base,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.base,
    ...shadows.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  itemsPreview: {
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  thumbnailWrapper: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondaryBackground,
  },
  qtyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.textPrimary,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  qtyBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  itemSummaryText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  footerLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  footerAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondaryBackground,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  reorderText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  trackText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});
