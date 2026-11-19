import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Category } from '@/types';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}

export function CategoryCard({ category, isSelected, onSelect }: CategoryCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`Category ${category.name}`}
    >
      <View
        style={[
          styles.imageCircle,
          isSelected && styles.imageCircleSelected,
        ]}
      >
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text
        style={[styles.name, isSelected && styles.nameSelected]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: 74,
    marginRight: spacing.sm,
    paddingVertical: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
  },
  imageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...shadows.dish,
  },
  imageCircleSelected: {
    borderColor: colors.primary,
    borderWidth: 2.5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  name: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
