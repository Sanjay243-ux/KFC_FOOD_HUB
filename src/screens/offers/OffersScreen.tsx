import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Tag, Copy, Check, Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useOffersQuery } from '@/hooks/useCatalog';
import { useCartStore } from '@/store/useCartStore';
import { colors, spacing, borderRadius, typography, serifFont, shadows } from '@/theme';
import { formatLKR } from '@/utils/formatters';
import { Offer } from '@/types';

export function OffersScreen() {
  const router = useRouter();
  const { data: offers = [] } = useOffersQuery();
  const applyPromo = useCartStore((state) => state.applyPromo);
  const appliedPromo = useCartStore((state) => state.appliedPromo);

  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApplyOffer = (offer: Offer) => {
    const res = applyPromo(offer.code);
    if (res.success) {
      setCopiedCode(offer.code);
      Alert.alert(
        'Offer Applied!',
        `Coupon code "${offer.code}" has been applied to your cart.`,
        [
          { text: 'View Cart', onPress: () => router.push('/cart' as any) },
          { text: 'Continue Browsing', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Coupon Saved',
        `Code: ${offer.code}\n${res.message}\nWe have copied the code for you to use when your cart qualifies.`
      );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOfferId(expandedOfferId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deals & Offers</Text>
        <Text style={styles.headerSubtitle}>
          Save more on your favourite chicken meals & combos
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {offers.map((offer) => {
          const isApplied = appliedPromo?.code === offer.code;
          const isExpanded = expandedOfferId === offer.id;

          return (
            <View key={offer.id} style={styles.offerCard}>
              {/* Banner Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: offer.bannerImage }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                {offer.categoryTag && (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{offer.categoryTag}</Text>
                  </View>
                )}
              </View>

              {/* Offer Details */}
              <View style={styles.content}>
                <Text style={styles.title}>{offer.title}</Text>
                <Text style={styles.subtitle}>{offer.subtitle}</Text>
                <Text style={styles.description}>{offer.description}</Text>

                {/* Expiry Date */}
                <View style={styles.expiryRow}>
                  <Calendar size={13} color={colors.textSecondary} />
                  <Text style={styles.expiryText}>
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </Text>
                </View>

                {/* Coupon Code Strip */}
                <View style={styles.couponStrip}>
                  <View style={styles.couponLeft}>
                    <Tag size={16} color={colors.primary} />
                    <Text style={styles.couponCode}>{offer.code}</Text>
                  </View>

                  <Pressable
                    onPress={() => handleApplyOffer(offer)}
                    style={[
                      styles.applyBtn,
                      isApplied && styles.applyBtnApplied,
                    ]}
                  >
                    {isApplied ? (
                      <>
                        <Check size={14} color={colors.white} strokeWidth={2.5} />
                        <Text style={styles.applyBtnText}>Applied</Text>
                      </>
                    ) : (
                      <>
                        <Copy size={13} color={colors.white} />
                        <Text style={styles.applyBtnText}>Apply</Text>
                      </>
                    )}
                  </Pressable>
                </View>

                {/* Terms Collapsible */}
                {offer.terms && offer.terms.length > 0 && (
                  <View style={styles.termsContainer}>
                    <Pressable
                      onPress={() => toggleExpand(offer.id)}
                      style={styles.termsToggle}
                    >
                      <Text style={styles.termsToggleText}>Terms & Conditions</Text>
                      {isExpanded ? (
                        <ChevronUp size={14} color={colors.textSecondary} />
                      ) : (
                        <ChevronDown size={14} color={colors.textSecondary} />
                      )}
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.termsList}>
                        {offer.terms.map((t, idx) => (
                          <Text key={idx} style={styles.termItem}>
                            • {t}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: 48,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: serifFont,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 110,
    gap: spacing.base,
  },
  offerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: colors.secondaryBackground,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  tagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    padding: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  expiryText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  couponStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.md,
    paddingRight: 4,
    paddingVertical: 4,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  couponCode: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  applyBtnApplied: {
    backgroundColor: colors.success,
  },
  applyBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  termsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  termsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  termsToggleText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  termsList: {
    marginTop: 6,
    gap: 4,
  },
  termItem: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
