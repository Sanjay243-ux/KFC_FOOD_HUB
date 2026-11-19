import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useProductQuery } from '@/hooks/useCatalog';
import { ProductDetailsScreen } from '@/screens/product/ProductDetailsScreen';
import { colors } from '@/theme';

export default function ProductDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProductQuery(id as string);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Product not found</Text>
      </View>
    );
  }

  return <ProductDetailsScreen product={product} />;
}
