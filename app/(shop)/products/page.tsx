'use client';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { ChevronDown, Filter, X } from 'lucide-react';

export default function ProductsPage() {
    const { products } = useProducts();
    const { categories } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedSize, setSelectedSize] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
    const [sortBy, setSortBy] = useState<string>('default');
    const [showFilters, setShowFilters] = useState(false);

    const activeProducts = useMemo(() => {
        return products.filter(p => p.status === 'Active');
    }, [products]);

    // Get unique sizes from products
    const sizes = useMemo(() => {
        const allSizes = new Set<string>();
        activeProducts.forEach(p => {
            p.options?.forEach(opt => {
                if (opt.name === 'Ölçü') {
                    opt.values.forEach(v => allSizes.add(v.value));
                }
            });
        });
        return Array.from(allSizes);
    }, [activeProducts]);

    // Get unique categories
    const productCategories = useMemo(() => {
        const cats = new Set(activeProducts.map(p => p.category));
        return Array.from(cats);
    }, [activeProducts]);

    // Filter products
    const filteredProducts = useMemo(() => {
        let filtered = activeProducts;

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Size filter
        if (selectedSize !== 'all') {
            filtered = filtered.filter(p => {
                return p.options?.some(opt =>
                    opt.name === 'Ölçü' && opt.values.some(v => v.value === selectedSize)
                );
            });
        }

        // Price filter
        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        // Sort
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime());
                break;
        }

        return filtered;
    }, [activeProducts, selectedCategory, selectedSize, priceRange, sortBy]);

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedSize('all');
        setPriceRange({ min: 0, max: 10000 });
        setSortBy('default');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedSize !== 'all' || priceRange.min > 0 || priceRange.max < 10000;

    return (
        <div className="min-h-screen bg-[#111111] py-8">
            <div className="container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">Tüm Ürünler</h1>
                    <p className="text-gray-400">{filteredProducts.length} ürün listeleniyor</p>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-5 sticky top-24 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white">Filtreler</h3>
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">
                                        Temizle
                                    </button>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <h4 className="font-medium mb-3 text-sm text-gray-300">Kategori</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === 'all'}
                                            onChange={() => setSelectedCategory('all')}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-400">Tümü</span>
                                    </label>
                                    {productCategories.map(cat => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-400">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            {sizes.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-3 text-sm text-gray-300">Ölçü</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="size"
                                                checked={selectedSize === 'all'}
                                                onChange={() => setSelectedSize('all')}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-400">Tümü</span>
                                        </label>
                                        {sizes.map(size => (
                                            <label key={size} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    checked={selectedSize === size}
                                                    onChange={() => setSelectedSize(size)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-gray-400">{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price Range */}
                            <div>
                                <h4 className="font-medium mb-3 text-sm text-gray-300">Fiyat Aralığı</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min || ''}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max === 10000 ? '' : priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 10000 })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Button & Sort */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded-lg text-white"
                            >
                                <Filter size={18} />
                                Filtreler
                                {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded-lg text-sm text-white [&>option]:bg-[#1a1a1a]"
                            >
                                <option value="default">Varsayılan Sıralama</option>
                                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                                <option value="name-asc">İsim: A-Z</option>
                                <option value="newest">En Yeniler</option>
                            </select>
                        </div>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="lg:hidden bg-[#1a1a1a] rounded-xl border border-white/10 p-5 mb-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-white">Filtreler</h3>
                                    <button onClick={() => setShowFilters(false)} className="text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                                {/* Category Select */}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-[#1a1a1a]"
                                >
                                    <option value="all">Tüm Kategoriler</option>
                                    {productCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {/* Size Select */}
                                {sizes.length > 0 && (
                                    <select
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white [&>option]:bg-[#1a1a1a]"
                                    >
                                        <option value="all">Tüm Ölçüler</option>
                                        {sizes.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                )}
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} className="w-full py-2 text-red-500 text-sm">
                                        Filtreleri Temizle
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                            <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-white/10">
                                <p className="text-gray-400 mb-4">Bu kriterlere uygun ürün bulunamadı.</p>
                                <button onClick={clearFilters} className="text-sm text-white underline">
                                    Filtreleri Temizle
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
