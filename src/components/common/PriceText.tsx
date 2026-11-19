import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatLKR } from '@/utils/formatters';
import { colors, typography } from '@/theme';

interface PriceTextProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export function PriceText({ price, originalPrice, size = 'md', color = colors.primary }: PriceTextProps) {
  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return typography.fontSize.sm;
      case 'lg':
        return typography.fontSize.lg;
      case 'xl':
        return typography.fontSize.xxl;
      default:
        return typography.fontSize.md;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.price, { fontSize: getFontSize(), color }]}>
        {formatLKR(price)}
      </Text>
      {originalPrice && originalPrice > price ? (
        <Text style={[styles.originalPrice, { fontSize: getFontSize() * 0.75 }]}>
          {formatLKR(originalPrice)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontWeight: typography.fontWeight.bold,
  },
  originalPrice: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    fontWeight: typography.fontWeight.regular,
  },
});
