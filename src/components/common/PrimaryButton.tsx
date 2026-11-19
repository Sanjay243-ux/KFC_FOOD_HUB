import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  PressableStateCallbackType,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  style,
  textStyle,
  fullWidth = true,
}: PrimaryButtonProps) {
  const getContainerStyles = ({ pressed }: PressableStateCallbackType) => {
    let baseBg = colors.primary;
    let baseBorder = colors.primary;

    if (variant === 'secondary') {
      baseBg = colors.card;
      baseBorder = colors.border;
    } else if (variant === 'outline') {
      baseBg = 'transparent';
      baseBorder = colors.primary;
    } else if (variant === 'ghost') {
      baseBg = 'transparent';
      baseBorder = 'transparent';
    }

    if (pressed && !disabled && !loading) {
      if (variant === 'primary') baseBg = colors.primaryDark;
      if (variant === 'secondary') baseBg = colors.secondaryBackground;
      if (variant === 'outline') baseBg = colors.primaryLight;
      if (variant === 'ghost') baseBg = colors.secondaryBackground;
    }

    if (disabled) {
      baseBg = variant === 'outline' ? 'transparent' : colors.border;
      baseBorder = colors.border;
    }

    const sizePadding = {
      sm: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 40 },
      md: { paddingVertical: 14, paddingHorizontal: 22, minHeight: 52 },
      lg: { paddingVertical: 16, paddingHorizontal: 26, minHeight: 56 },
    }[size];

    return [
      styles.button,
      sizePadding,
      {
        backgroundColor: baseBg,
        borderColor: baseBorder,
        borderWidth: variant === 'outline' || variant === 'secondary' ? 1.5 : 0,
        width: (fullWidth ? '100%' : 'auto') as any,
      },
      variant === 'primary' && !disabled ? shadows.subtle : null,
      style,
    ] as any;
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (variant === 'primary') return colors.white;
    if (variant === 'secondary') return colors.textPrimary;
    if (variant === 'outline') return colors.primary;
    if (variant === 'ghost') return colors.primary;
    return colors.white;
  };

  const getTextSize = () => {
    if (size === 'sm') return typography.fontSize.sm;
    if (size === 'lg') return typography.fontSize.md;
    return typography.fontSize.base;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyles}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' ? (
            <View style={styles.iconWrapper}>{icon}</View>
          ) : null}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getTextSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' ? (
            <View style={styles.iconCircleRight}>{icon}</View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  text: {
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleRight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
