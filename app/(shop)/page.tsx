'use client';
import Hero from '@/components/shop/Hero';
import CategoryGrid from '@/components/shop/CategoryGrid';
import WhyUs from '@/components/shop/WhyUs';
import MeasurementGuide from '@/components/shop/MeasurementGuide';
import BlogSection from '@/components/shop/BlogSection';
import ProductCard from '@/components/shop/ProductCard';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { useBlog } from '@/context/BlogContext';
import { useState, useMemo } from 'react';

export default function ShopHome() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { blogEnabled } = useBlog();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeProducts = useMemo(() => {
    return products.filter(p => p.status === 'Active');
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return activeProducts;
    return activeProducts.filter(p => p.category === selectedCategory);
  }, [activeProducts, selectedCategory]);

  // Get unique categories from products
  const productCategories = useMemo(() => {
    const cats = new Set(activeProducts.map(p => p.category));
    return Array.from(cats);
  }, [activeProducts]);

  return (
    <>
      <Hero />

      <WhyUs />

      <CategoryGrid />

      <section className="section">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <h2 className="text-3xl font-bold text-white">Tüm Ürünler</h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
              >
                Tümü
              </button>
              {productCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    title: p.name,
                    price: p.price,
                    oldPrice: p.oldPrice,
                    image: p.images[0] || '',
                    category: p.category,
                    badge: p.isNew ? 'YENİ' : p.isBestseller ? 'ÇOK SATAN' : undefined
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Bu kategoride ürün bulunmuyor.
            </div>
          )}
        </div>
      </section>

      <MeasurementGuide />

      {blogEnabled && <BlogSection />}
    </>
  );
}
