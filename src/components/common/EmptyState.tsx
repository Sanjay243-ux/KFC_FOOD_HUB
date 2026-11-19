import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingBag, Search, AlertCircle } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  title: string;
  description: string;
  type?: 'cart' | 'search' | 'orders' | 'general';
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  type = 'general',
  actionTitle,
  onAction,
}: EmptyStateProps) {
  const renderIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag size={48} color={colors.primary} strokeWidth={1.5} />;
      case 'search':
        return <Search size={48} color={colors.textSecondary} strokeWidth={1.5} />;
      default:
        return <AlertCircle size={48} color={colors.textMuted} strokeWidth={1.5} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>{renderIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <View style={styles.actionContainer}>
          <PrimaryButton
            title={actionTitle}
            onPress={onAction}
            size="md"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginVertical: spacing.lg,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actionContainer: {
    minWidth: 180,
  },
});
