import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Plus, Star, Heart } from 'lucide-react-native';
import { Product } from '@/types';
import { colors, spacing, borderRadius, typography, shadows, serifFont } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { useUserStore } from '@/store/useUserStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onQuickAdd: () => void;
  variant?: 'grid' | 'featured';
}

export function ProductCard({
  product,
  onPress,
  onQuickAdd,
  variant = 'grid',
}: ProductCardProps) {
  const isFav = useUserStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useUserStore((state) => state.toggleFavorite);

  if (variant === 'featured') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.featuredCard, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, ${formatLKR(product.price)}`}
      >
        <Image source={{ uri: product.image }} style={styles.featuredImage} />
        <Pressable
          onPress={() => toggleFavorite(product.id)}
          style={styles.featuredFavBtn}
          hitSlop={8}
        >
          <Heart
            size={16}
            color={isFav ? colors.primary : colors.textPrimary}
            fill={isFav ? colors.primary : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>

        <View style={styles.featuredContent}>
          <View style={styles.featuredRow}>
            <Text style={styles.featuredTitle} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.featuredPrice}>{formatLKR(product.price)}</Text>
          </View>
          <View style={styles.featuredSubRow}>
            <View style={styles.ratingRow}>
              <Star size={12} color="#D97706" fill="#D97706" />
              <Text style={styles.ratingText}>{product.rating?.toFixed(1) || '4.8'}</Text>
              {product.calories && (
                <Text style={styles.calorieText}>• {product.calories} kcal</Text>
              )}
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              style={styles.featuredAddBtn}
            >
              <Plus size={16} color={colors.white} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  // Grid Card (Circular dish plate styling from reference UI)
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatLKR(product.price)}`}
    >
      {/* Favorite Button */}
      <Pressable
        onPress={() => toggleFavorite(product.id)}
        style={styles.favoriteButton}
        hitSlop={8}
        accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={15}
          color={isFav ? colors.primary : colors.textSecondary}
          fill={isFav ? colors.primary : 'transparent'}
          strokeWidth={2}
        />
      </Pressable>

      {/* Circular Food Plate Photo */}
      <View style={styles.dishPlateContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.dishPlateImage}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.subMetaRow}>
          <View style={styles.ratingRow}>
            <Star size={11} color="#D97706" fill="#D97706" />
            <Text style={styles.ratingText}>{product.rating?.toFixed(1) || '4.8'}</Text>
          </View>
          {product.calories && (
            <Text style={styles.calorieText}>{product.calories} kcal</Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>{formatLKR(product.price)}</Text>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            hitSlop={8}
            accessibilityLabel={`Add ${product.name} to cart`}
          >
            <Plus size={16} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dishPlateContainer: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: spacing.sm,
    ...shadows.dish,
  },
  dishPlateImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  content: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
    width: '100%',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  calorieText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 2,
  },
  priceText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryDark,
  },

  // Featured Card
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
    marginBottom: spacing.base,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredFavBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  featuredContent: {
    padding: spacing.md,
  },
  featuredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  featuredTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  featuredPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  featuredSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
