import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useProductsQuery(params?: {
  categoryId?: string;
  searchQuery?: string;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating';
}) {
  return useQuery({
    queryKey: ['products', params?.categoryId, params?.searchQuery, params?.sortBy],
    queryFn: () => api.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProductQuery(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.getProductById(productId),
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useOffersQuery() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: () => api.getOffers(),
    staleTime: 1000 * 60 * 10,
  });
}
