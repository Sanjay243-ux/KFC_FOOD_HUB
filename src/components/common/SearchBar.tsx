import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search chicken, burgers, meals...',
  onFilterPress,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={18} color={colors.textSecondary} strokeWidth={2.2} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoFocus={autoFocus}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            style={styles.clearBtn}
            accessibilityLabel="Clear search text"
          >
            <X size={16} color={colors.textSecondary} strokeWidth={2.2} />
          </Pressable>
        )}
      </View>

      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={({ pressed }) => [styles.filterBtn, pressed && styles.filterBtnPressed]}
          accessibilityLabel="Open filters"
        >
          <SlidersHorizontal size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    height: 50,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
    ...shadows.subtle,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  filterBtnPressed: {
    backgroundColor: colors.secondaryBackground,
  },
});
