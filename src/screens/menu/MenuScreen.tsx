import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpDown, ShoppingBag } from 'lucide-react-native';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCard } from '@/components/common/ProductCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useCategoriesQuery, useProductsQuery } from '@/hooks/useCatalog';
import { useCartStore } from '@/store/useCartStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { Product } from '@/types';

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'rating';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'popular', label: 'Bestsellers' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
];

export function MenuScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { data: categories = [] } = useCategoriesQuery();
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useProductsQuery({
    categoryId: selectedCategoryId,
    searchQuery,
    sortBy,
  });

  const addItem = useCartStore((state) => state.addItem);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const handleQuickAdd = (product: Product) => {
    const hasRequiredOptions = product.addonGroups?.some((g) => g.required);
    if (hasRequiredOptions) {
      router.push(`/product/${product.id}` as any);
      return;
    }

    const defaultSize = product.availableSizes?.find((s) => s.isDefault);
    addItem({
      product,
      selectedSize: defaultSize,
      quantity: 1,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Food</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search delicious dishes..."
        />
      </View>

      {/* Category Pills Strip */}
      <View style={styles.categoryStripContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryStrip}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter and Sorting Subheader */}
      <View style={styles.subHeader}>
        <Text style={styles.resultCount}>
          {products.length} {products.length === 1 ? 'dish' : 'dishes'} available
        </Text>

        <Pressable
          onPress={() => setShowSortMenu(!showSortMenu)}
          style={styles.sortButton}
          accessibilityLabel="Sort products"
        >
          <ArrowUpDown size={13} color={colors.textPrimary} />
          <Text style={styles.sortButtonText}>
            {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
          </Text>
        </Pressable>
      </View>

      {/* Sort Dropdown */}
      {showSortMenu && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => {
                setSortBy(opt.id);
                setShowSortMenu(false);
              }}
              style={[
                styles.sortDropdownItem,
                sortBy === opt.id && styles.sortDropdownItemSelected,
              ]}
            >
              <Text
                style={[
                  styles.sortDropdownText,
                  sortBy === opt.id && styles.sortDropdownTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Circular Dish Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching menu...</Text>
          </View>
        ) : isError ? (
          <EmptyState
            title="Failed to Load Menu"
            description="We could not retrieve items. Please check your network and try again."
            actionTitle="Retry"
            onAction={refetch}
          />
        ) : products.length === 0 ? (
          <EmptyState
            type="search"
            title="No Items Found"
            description={`We couldn't find anything matching "${searchQuery}".`}
            actionTitle="Reset Filter"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategoryId('cat-all');
            }}
          />
        ) : (
          <View style={styles.grid}>
            {products.map((product) => (
              <View key={product.id} style={styles.gridCol}>
                <ProductCard
                  product={product}
                  variant="grid"
                  onPress={() => router.push(`/product/${product.id}` as any)}
                  onQuickAdd={() => handleQuickAdd(product)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <Pressable
          onPress={() => router.push('/cart' as any)}
          style={({ pressed }) => [styles.floatingCart, pressed && styles.floatingCartPressed]}
          accessibilityLabel={`View Cart with ${cartItemCount} items`}
        >
          <View style={styles.floatingCartLeft}>
            <View style={styles.cartCountCircle}>
              <Text style={styles.cartCountText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.floatingCartLabel}>View Cart</Text>
          </View>
          <ShoppingBag size={18} color={colors.white} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 46,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  },
  categoryStripContainer: {
    backgroundColor: colors.background,
  },
  categoryStrip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  categoryPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  categoryPillTextSelected: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  resultCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },
  sortButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  sortDropdown: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 4,
    ...shadows.card,
  },
  sortDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
  },
  sortDropdownItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  sortDropdownText: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  sortDropdownTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  scrollList: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: 110,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCol: {
    width: '48.5%',
    marginBottom: spacing.xs,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 24,
    left: spacing.base,
    right: spacing.base,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    ...shadows.dish,
  },
  floatingCartPressed: {
    backgroundColor: colors.primaryDark,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartCountCircle: {
    backgroundColor: colors.white,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  floatingCartLabel: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
