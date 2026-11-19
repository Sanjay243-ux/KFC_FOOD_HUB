import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  Check,
  Flame,
  Clock,
} from 'lucide-react-native';
import { Product, ProductSize, ProductAddonOption } from '@/types';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { QuantitySelector } from '@/components/common/QuantitySelector';

interface ProductDetailsScreenProps {
  product: Product;
}

export function ProductDetailsScreen({ product }: ProductDetailsScreenProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const isFav = useUserStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useUserStore((state) => state.toggleFavorite);

  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    product.availableSizes?.find((s) => s.isDefault) || product.availableSizes?.[0]
  );

  const [selectedAddons, setSelectedAddons] = useState<ProductAddonOption[]>(() => {
    const defaults: ProductAddonOption[] = [];
    product.addonGroups?.forEach((group) => {
      group.options.forEach((opt) => {
        if (opt.isDefault) defaults.push(opt);
      });
    });
    return defaults;
  });

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Dynamic price calculation
  const sizeCost = selectedSize?.priceModifier || 0;
  const addonsCost = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = product.price + sizeCost + addonsCost;
  const totalPrice = unitPrice * quantity;

  // Nutrition breakdown (simulated realistic macro values based on calories)
  const calories = product.calories || 520;
  const protein = Math.round((calories * 0.25) / 4);
  const carbs = Math.round((calories * 0.45) / 4);
  const fat = Math.round((calories * 0.3) / 9);

  const handleToggleAddon = (
    groupId: string,
    option: ProductAddonOption,
    required: boolean,
    maxSelections: number
  ) => {
    const isAlreadySelected = selectedAddons.some((a) => a.id === option.id);

    if (maxSelections === 1) {
      const group = product.addonGroups?.find((g) => g.id === groupId);
      const groupOptionIds = group?.options.map((o) => o.id) || [];
      const filtered = selectedAddons.filter((a) => !groupOptionIds.includes(a.id));
      setSelectedAddons([...filtered, option]);
    } else {
      if (isAlreadySelected) {
        setSelectedAddons(selectedAddons.filter((a) => a.id !== option.id));
      } else {
        const group = product.addonGroups?.find((g) => g.id === groupId);
        const groupOptionIds = group?.options.map((o) => o.id) || [];
        const currentGroupSelections = selectedAddons.filter((a) =>
          groupOptionIds.includes(a.id)
        );

        if (currentGroupSelections.length >= maxSelections) {
          Alert.alert(
            'Maximum selections reached',
            `You can choose a maximum of ${maxSelections} options for this group.`
          );
          return;
        }
        setSelectedAddons([...selectedAddons, option]);
      }
    }
  };

  const handleAddToCart = () => {
    if (product.addonGroups) {
      for (const group of product.addonGroups) {
        if (group.required) {
          const groupOptionIds = group.options.map((o) => o.id);
          const selectionsInGroup = selectedAddons.filter((a) =>
            groupOptionIds.includes(a.id)
          );
          if (selectionsInGroup.length < group.minSelections) {
            Alert.alert(
              'Required Selection',
              `Please select at least ${group.minSelections} option for "${group.name}".`
            );
            return;
          }
        }
      }
    }

    addItem({
      product,
      selectedSize,
      selectedAddons,
      specialInstructions: specialInstructions.trim() || undefined,
      quantity,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Serif Title and Round Buttons */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.topBarTitle}>Food Details</Text>

        <Pressable
          onPress={() => toggleFavorite(product.id)}
          style={styles.circleBtn}
          accessibilityLabel="Save Favorite"
        >
          <Heart
            size={18}
            color={isFav ? colors.primary : colors.textPrimary}
            fill={isFav ? colors.primary : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Large Circular Food Dish Plate (matching reference UI) */}
        <View style={styles.plateSection}>
          <View style={styles.dishPlateContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.dishPlateImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsBody}>
          {/* Title Row with Inline Stepper */}
          <View style={styles.titleRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>

            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              size="md"
              variant="peach"
            />
          </View>

          {/* Ingredients / Description Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Ingredients</Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={showFullDesc ? undefined : 3}
            >
              {product.description}
            </Text>
            {product.description.length > 90 && (
              <Pressable onPress={() => setShowFullDesc(!showFullDesc)}>
                <Text style={styles.seeMoreLink}>
                  {showFullDesc ? 'Show Less' : 'See More...'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Nutrition Badges Row (as shown in reference design: Cal, Fat, Protein, Carb) */}
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionBadge}>
              <Text style={styles.nutritionLabel}>Cal</Text>
              <Text style={styles.nutritionValue}>{calories} cal</Text>
            </View>

            <View style={styles.nutritionBadge}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{fat} gr</Text>
            </View>

            <View style={styles.nutritionBadge}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{protein} gr</Text>
            </View>

            <View style={styles.nutritionBadge}>
              <Text style={styles.nutritionLabel}>Carb</Text>
              <Text style={styles.nutritionValue}>{carbs} gr</Text>
            </View>
          </View>

          {/* Available Sizes Selection */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <View style={styles.customSection}>
              <Text style={styles.sectionHeading}>Choose Size</Text>
              <View style={styles.sizeOptions}>
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <Pressable
                      key={size.id}
                      onPress={() => setSelectedSize(size)}
                      style={[
                        styles.sizePill,
                        isSelected && styles.sizePillSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sizePillText,
                          isSelected && styles.sizePillTextSelected,
                        ]}
                      >
                        {size.name}
                      </Text>
                      {size.priceModifier > 0 && (
                        <Text
                          style={[
                            styles.sizePriceMod,
                            isSelected && styles.sizePriceModSelected,
                          ]}
                        >
                          +{formatLKR(size.priceModifier)}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Add-on Groups */}
          {product.addonGroups?.map((group) => (
            <View key={group.id} style={styles.customSection}>
              <View style={styles.groupHeader}>
                <Text style={styles.sectionHeading}>{group.name}</Text>
                <Text style={styles.reqBadge}>
                  {group.required ? 'REQUIRED' : 'OPTIONAL'}
                </Text>
              </View>

              <View style={styles.addonList}>
                {group.options.map((option) => {
                  const isChecked = selectedAddons.some((a) => a.id === option.id);
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() =>
                        handleToggleAddon(
                          group.id,
                          option,
                          group.required,
                          group.maxSelections
                        )
                      }
                      style={[
                        styles.addonItem,
                        isChecked && styles.addonItemSelected,
                      ]}
                    >
                      <View style={styles.addonLeft}>
                        <View
                          style={[
                            styles.checkCircle,
                            isChecked && styles.checkCircleChecked,
                          ]}
                        >
                          {isChecked && (
                            <Check size={11} color={colors.white} strokeWidth={3} />
                          )}
                        </View>
                        <Text style={styles.addonName}>{option.name}</Text>
                      </View>
                      <Text style={styles.addonPrice}>
                        {option.price === 0 ? 'Free' : `+${formatLKR(option.price)}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Special Instructions Note */}
          <View style={styles.customSection}>
            <Text style={styles.sectionHeading}>Special Note</Text>
            <TextInput
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="e.g. Extra hot sauce, dressings on the side..."
              placeholderTextColor={colors.textMuted}
              style={styles.instructionInput}
              multiline
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar with Price on Left and Add To Cart Button on Right (Matching Reference UI) */}
      <View style={styles.bottomBar}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.totalPriceText}>{formatLKR(totalPrice)}</Text>
        </View>

        <View style={styles.btnCol}>
          <PrimaryButton
            title="Add To Cart"
            onPress={handleAddToCart}
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: 46,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  topBarTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  plateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  dishPlateContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.card,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.card,
    ...shadows.dish,
  },
  dishPlateImage: {
    width: '100%',
    height: '100%',
  },
  detailsBody: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.base,
    minHeight: 400,
    ...shadows.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  productName: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    flex: 1,
  },
  sectionBlock: {
    marginBottom: spacing.base,
  },
  sectionHeading: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  seeMoreLink: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  nutritionBadge: {
    flex: 1,
    backgroundColor: colors.accentPeach,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  customSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  reqBadge: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: 4,
  },
  sizePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  sizePillSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sizePillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  sizePillTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  sizePriceMod: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sizePriceModSelected: {
    color: colors.primary,
  },
  addonList: {
    gap: spacing.xs,
    marginTop: 4,
  },
  addonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  addonItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  addonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checkCircleChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addonName: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textPrimary,
  },
  addonPrice: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  instructionInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    fontSize: typography.fontSize.xs + 1,
    color: colors.textPrimary,
    minHeight: 70,
    textAlignVertical: 'top',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.card,
  },
  priceCol: {
    marginRight: spacing.md,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  totalPriceText: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  btnCol: {
    flex: 1,
  },
});
