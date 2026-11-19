import { CATEGORIES, PRODUCTS, OFFERS } from '@/constants/mockData';
import { Category, Product, Offer } from '@/types';
import { supabase, isSupabaseConfigured } from '../supabase';

export const api = {
  /**
   * Fetch all menu categories
   */
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            description: d.description || '',
            image: d.image_url,
            itemCount: 0,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch categories fallback to mock:', err);
      }
    }
    // Mock simulation
    await new Promise((resolve) => setTimeout(resolve, 150));
    return CATEGORIES;
  },

  /**
   * Fetch products with optional category, search keyword, and sorting
   */
  async getProducts(params?: {
    categoryId?: string;
    searchQuery?: string;
    sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating';
  }): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('products').select('*').eq('is_available', true);
        if (params?.categoryId && params.categoryId !== 'cat-all') {
          query = query.eq('category_id', params.categoryId);
        }
        if (params?.searchQuery) {
          query = query.ilike('name', `%${params.searchQuery}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            categoryId: d.category_id,
            name: d.name,
            description: d.description,
            price: Number(d.price),
            originalPrice: d.original_price ? Number(d.original_price) : undefined,
            image: d.image_url,
            rating: Number(d.rating || 4.5),
            reviewCount: d.review_count || 10,
            isBestseller: d.is_bestseller,
            isSpicy: d.is_spicy,
            calories: d.calories,
            prepTimeMinutes: d.prep_time_minutes,
            allergens: d.allergens || [],
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch products fallback to mock:', err);
      }
    }

    // Mock fallback with full filtering & search
    await new Promise((resolve) => setTimeout(resolve, 200));
    let list = [...PRODUCTS];

    if (params?.categoryId && params.categoryId !== 'cat-all') {
      list = list.filter((p) => p.categoryId === params.categoryId);
    }

    if (params?.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryId.toLowerCase().includes(q)
      );
    }

    if (params?.sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default: bestsellers first
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  },

  /**
   * Get single product by id
   */
  async getProductById(id: string): Promise<Product | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return PRODUCTS.find((p) => p.id === id);
  },

  /**
   * Fetch active promotions & deals
   */
  async getOffers(): Promise<Offer[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return OFFERS;
  },
};
