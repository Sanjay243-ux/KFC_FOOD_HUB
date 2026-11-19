import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { CartItem } from '@/types';
import { colors, spacing, borderRadius, typography, shadows, serifFont } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { QuantitySelector } from './QuantitySelector';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const customSummary = [
    item.selectedSize?.name ? `Size: ${item.selectedSize.name}` : null,
    item.selectedAddons.length > 0
      ? `Add-ons: ${item.selectedAddons.map((a) => a.name).join(', ')}`
      : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <View style={styles.card}>
      {/* Circular Food Thumbnail (matching reference design) */}
      <View style={styles.thumbnailCircle}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>

      {/* Item Info */}
      <View style={styles.infoCol}>
        <Text style={styles.title} numberOfLines={1}>
          {item.product.name}
        </Text>

        {customSummary ? (
          <Text style={styles.customizations} numberOfLines={1}>
            {customSummary}
          </Text>
        ) : null}

        <Text style={styles.price}>{formatLKR(item.totalPrice)}</Text>
      </View>

      {/* Right: Quantity Stepper in Soft Peach Pill */}
      <View style={styles.stepperCol}>
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => onUpdateQuantity(item.quantity + 1)}
          onDecrease={() => onUpdateQuantity(item.quantity - 1)}
          size="sm"
          variant="peach"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.card,
  },
  thumbnailCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  customizations: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  stepperCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
