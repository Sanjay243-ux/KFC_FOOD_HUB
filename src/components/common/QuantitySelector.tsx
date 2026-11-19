import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors, borderRadius, typography, spacing } from '@/theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'peach' | 'light';
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
  variant = 'peach',
}: QuantitySelectorProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const dims = {
    sm: { height: 32, buttonSize: 24, iconSize: 12, fontSize: typography.fontSize.xs, paddingH: 8 },
    md: { height: 40, buttonSize: 30, iconSize: 14, fontSize: typography.fontSize.sm, paddingH: 12 },
    lg: { height: 46, buttonSize: 34, iconSize: 16, fontSize: typography.fontSize.base, paddingH: 14 },
  }[size];

  const bgColor = variant === 'peach' ? colors.accentPeach : colors.secondaryBackground;

  return (
    <View style={[styles.container, { height: dims.height, backgroundColor: bgColor }]}>
      <Pressable
        onPress={onDecrease}
        disabled={isMin}
        style={({ pressed }) => [
          styles.button,
          { width: dims.buttonSize, height: dims.buttonSize },
          pressed && !isMin && styles.buttonPressed,
          isMin && styles.buttonDisabled,
        ]}
        hitSlop={8}
        accessibilityLabel="Decrease quantity"
      >
        <Minus
          size={dims.iconSize}
          color={isMin ? colors.textMuted : colors.textPrimary}
          strokeWidth={2.5}
        />
      </Pressable>

      <View style={[styles.numberContainer, { paddingHorizontal: dims.paddingH }]}>
        <Text style={[styles.number, { fontSize: dims.fontSize }]}>{quantity}</Text>
      </View>

      <Pressable
        onPress={onIncrease}
        disabled={isMax}
        style={({ pressed }) => [
          styles.button,
          styles.buttonAdd,
          { width: dims.buttonSize, height: dims.buttonSize },
          pressed && !isMax && styles.buttonAddPressed,
          isMax && styles.buttonDisabled,
        ]}
        hitSlop={8}
        accessibilityLabel="Increase quantity"
      >
        <Plus
          size={dims.iconSize}
          color={isMax ? colors.textMuted : colors.white}
          strokeWidth={2.5}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    padding: 3,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
  },
  buttonAdd: {
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonAddPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.35,
    backgroundColor: 'transparent',
  },
  numberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
});
