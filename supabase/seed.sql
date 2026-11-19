-- Seed Data for KFC Sri Lanka Mobile Application

INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
('cat-fried-chicken', 'Fried Chicken', 'fried-chicken', 'Crispy, golden, secret recipe chicken', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', 1),
('cat-burgers', 'Burgers', 'burgers', 'Handcrafted signature chicken burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', 2),
('cat-pizza', 'Pizza', 'pizza', 'Crispy crust loaded with chicken toppings', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', 3),
('cat-wraps', 'Wraps', 'wraps', 'Warm toasted tortillas filled with tender chicken', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80', 4),
('cat-sides', 'Fries & Sides', 'fries-sides', 'Crispy golden fries, coleslaw, and dips', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80', 5),
('cat-beverages', 'Beverages', 'beverages', 'Chilled soft drinks and refreshing teas', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', 6),
('cat-family', 'Family Meals', 'family-meals', 'Bumper value chicken feasts for the whole family', 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=400&q=80', 7),
('cat-desserts', 'Desserts', 'desserts', 'Sweet treats, sundaes, and chocolate lava cakes', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, category_id, name, description, price, original_price, image_url, rating, review_count, is_bestseller, is_spicy, calories, prep_time_minutes) VALUES
('prod-orig-chicken-4pc', 'cat-fried-chicken', 'Original Recipe Chicken (4 Pcs)', 'Four pieces of succulent chicken marinated in secret herbs and spices.', 2150.00, 2400.00, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', 4.8, 342, TRUE, FALSE, 780, 15),
('prod-hot-crispy-bucket', 'cat-fried-chicken', 'Hot & Crispy Chicken Bucket (8 Pcs)', 'Eight generous pieces with crunchy fiery spicy coating.', 4350.00, 4800.00, 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=600&q=80', 4.9, 512, TRUE, TRUE, 1580, 20),
('prod-zinger-burger', 'cat-burgers', 'Super Zinger Burger', 'Whole chicken breast fillet in spicy seasoning with crisp lettuce and mayo.', 1350.00, 1500.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 4.9, 680, TRUE, TRUE, 520, 12),
('prod-chicken-pizza', 'cat-pizza', 'Crispy Chicken Supreme Pizza', 'Stone-baked hand-stretched crust topped with chicken chunks and mozzarella.', 2450.00, 2800.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 4.7, 195, FALSE, FALSE, 1150, 18),
('prod-twister-wrap', 'cat-wraps', 'Spicy Chicken Twister Wrap', 'Two crispy chicken tenders wrapped in warm toasted tortilla with pepper mayo.', 1150.00, NULL, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80', 4.6, 178, FALSE, TRUE, 460, 10),
('prod-french-fries', 'cat-sides', 'Golden French Fries', 'Crispy skin-on potatoes seasoned with fine sea salt.', 650.00, NULL, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', 4.5, 420, FALSE, FALSE, 320, 8),
('prod-family-feast', 'cat-family', 'Super Family Feast (10 Pcs Combo)', '10 pieces chicken, 2 Large Fries, 2 Coleslaws, 4 Rolls, 1.5L Pepsi.', 6850.00, 7750.00, 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=600&q=80', 4.9, 410, TRUE, FALSE, 3200, 25)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.promotions (id, title, subtitle, description, code, discount_type, discount_value, min_order_amount, max_discount, banner_image, category_tag, valid_until) VALUES
('offer-welcome', 'Welcome First Order', 'Get 20% OFF on your very first order', 'Save 20% up to LKR 1,000 on first order.', 'WELCOME20', 'percentage', 20.00, 2000.00, 1000.00, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80', 'First Order', '2026-12-31 23:59:59+00'),
('offer-bucket500', 'Bucket Bonanza', 'Flat LKR 500 OFF on 8-Piece Buckets', 'Apply coupon during checkout for buckets.', 'BUCKET500', 'fixed', 500.00, 4000.00, NULL, 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=800&q=80', 'Family', '2026-11-30 23:59:59+00')
ON CONFLICT (id) DO NOTHING;
