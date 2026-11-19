import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { AppHeader } from '@/components/common/AppHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/common/CategoryCard';
import { ProductCard } from '@/components/common/ProductCard';
import { useCategoriesQuery, useProductsQuery } from '@/hooks/useCatalog';
import { useCartStore } from '@/store/useCartStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { Product } from '@/types';

export function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-all');

  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery({
    categoryId: selectedCategoryId,
    searchQuery,
  });

  const addItem = useCartStore((state) => state.addItem);

  const featuredProduct = products.find((p) => p.isBestseller) || products[0];
  const gridProducts = products.filter((p) => p.id !== featuredProduct?.id);

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
      {/* Top Header (matching reference UI) */}
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sleek Pill Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search food, chicken, burgers..."
          onFilterPress={() => router.push('/menu' as any)}
        />

        {/* Hero Editorial Card ("Flavor Crafted With Love") */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            <View style={styles.heroTag}>
              <Sparkles size={11} color={colors.white} />
              <Text style={styles.heroTagText}>CHEF SPECIAL</Text>
            </View>
            <Text style={styles.heroTitle}>
              Flavor Crafted{'\n'}With Love
            </Text>
            <Text style={styles.heroSubtitle}>
              Authentic secret recipe chicken freshly prepared for you.
            </Text>
            <Pressable
              onPress={() => router.push('/menu' as any)}
              style={({ pressed }) => [styles.heroBtn, pressed && styles.heroBtnPressed]}
              accessibilityRole="button"
            >
              <Text style={styles.heroBtnText}>Order Now</Text>
              <View style={styles.heroBtnCircle}>
                <ArrowRight size={13} color={colors.primary} strokeWidth={2.5} />
              </View>
            </Pressable>
          </View>

          <View style={styles.heroDishCircle}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
              }}
              style={styles.heroDishImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Categories Section with Serif Title & See All */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Pressable onPress={() => router.push('/menu' as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        {isLoadingCategories ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategoryId === cat.id}
                onSelect={() => setSelectedCategoryId(cat.id)}
              />
            ))}
          </ScrollView>
        )}

        {/* Popular Food Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Food</Text>
          <Pressable onPress={() => router.push('/menu' as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        {isLoadingProducts ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 24 }} />
        ) : (
          <View style={styles.productsArea}>
            {/* Featured Wide Card (matching reference UI) */}
            {featuredProduct && (
              <ProductCard
                product={featuredProduct}
                variant="featured"
                onPress={() => router.push(`/product/${featuredProduct.id}` as any)}
                onQuickAdd={() => handleQuickAdd(featuredProduct)}
              />
            )}

            {/* Circular Plate Product Grid */}
            <View style={styles.productGrid}>
              {gridProducts.slice(0, 6).map((product) => (
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
          </View>
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
  scrollContent: {
    paddingBottom: 110,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.base,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    overflow: 'hidden',
    minHeight: 180,
    ...shadows.dish,
  },
  heroTextCol: {
    flex: 1.1,
    justifyContent: 'center',
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  heroTagText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.heavy,
    color: colors.white,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.white,
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 16,
    marginBottom: 14,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    ...shadows.subtle,
  },
  heroBtnPressed: {
    opacity: 0.9,
  },
  heroBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  heroBtnCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDishCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: colors.white,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...shadows.dish,
  },
  heroDishImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  productsArea: {
    paddingHorizontal: spacing.base,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCol: {
    width: '48.5%',
    marginBottom: spacing.xs,
  },
});
