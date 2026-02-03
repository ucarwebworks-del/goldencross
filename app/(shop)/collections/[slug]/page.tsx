'use client';
import { use, useState, useEffect } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { getProductsByCategory } = useProducts();
    const [products, setProducts] = useState(getProductsByCategory(slug));
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortBy, setSortBy] = useState('default');

    // Filter states
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        size: true,
        price: true,
    });
    const [selectedSize, setSelectedSize] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });

    useEffect(() => {
        setProducts(getProductsByCategory(slug));
    }, [slug, getProductsByCategory]);

    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    // Get unique sizes from products
    const sizes = Array.from(new Set(
        products.flatMap(p =>
            p.options?.filter(opt => opt.name === 'Ölçü')
                .flatMap(opt => opt.values.map(v => v.value)) || []
        )
    ));

    // Apply filters
    const filteredProducts = products.filter(p => {
        // Size filter
        if (selectedSize !== 'all') {
            const hasSize = p.options?.some(opt =>
                opt.name === 'Ölçü' && opt.values.some(v => v.value === selectedSize)
            );
            if (!hasSize) return false;
        }

        // Price filter
        if (p.price < priceRange.min || p.price > priceRange.max) return false;

        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'newest': return new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime();
            default: return 0;
        }
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const hasActiveFilters = selectedSize !== 'all' || priceRange.min > 0 || priceRange.max < 10000;

    const clearFilters = () => {
        setSelectedSize('all');
        setPriceRange({ min: 0, max: 10000 });
    };

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Size Filter */}
            {sizes.length > 0 && (
                <div className="border-b border-white/10 pb-4">
                    <button
                        onClick={() => toggleSection('size')}
                        className="flex items-center justify-between w-full font-semibold mb-3 text-white hover:text-accent transition-colors"
                    >
                        <span>Ölçü</span>
                        {openSections.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {openSections.size && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="size"
                                    checked={selectedSize === 'all'}
                                    onChange={() => setSelectedSize('all')}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Tümü</span>
                            </label>
                            {sizes.map(size => (
                                <label key={size} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="size"
                                        checked={selectedSize === size}
                                        onChange={() => setSelectedSize(size)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{size}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Price Filter */}
            <div className="border-b border-white/10 pb-4">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full font-semibold mb-3 text-white hover:text-accent transition-colors"
                >
                    <span>Fiyat</span>
                    {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openSections.price && (
                    <div className="space-y-4">
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min || ''}
                                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                className="w-full bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-600 rounded px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max === 10000 ? '' : priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 10000 })}
                                className="w-full bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-600 rounded px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
                            />
                        </div>
                    </div>
                )}
            </div>

            {hasActiveFilters && (
                <button onClick={clearFilters} className="w-full py-2 text-red-500 text-sm hover:underline">
                    Filtreleri Temizle
                </button>
            )}
        </div>
    );

    return (
        <div className="container min-h-screen py-12">
            {/* Breadcrumb & Header */}
            <div className="mb-8">
                <div className="text-sm text-gray-400 mb-2">Anasayfa / Koleksiyonlar / <span className="text-white">{categoryName}</span></div>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-white">{categoryName} Tablolar</h1>
                        <p className="text-gray-400 max-w-2xl text-sm lg:text-base">
                            Modern ve şık {slug} koleksiyonumuzla duvarlarınıza hayat verin. %100 kırılmaz cam garantisi.
                        </p>
                    </div>
                    <div className="flex gap-4 items-center w-full lg:w-auto">
                        <span className="text-sm text-gray-400 whitespace-nowrap">{filteredProducts.length} Ürün</span>
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center gap-2 border border-white/20 rounded px-4 py-2 text-sm font-medium text-white"
                        >
                            <SlidersHorizontal size={16} />
                            Filtrele
                            {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border border-white/20 rounded px-3 py-2 text-sm font-medium outline-none cursor-pointer text-white hover:border-white/40 transition-colors [&>option]:bg-[#111111] [&>option]:text-white"
                        >
                            <option value="default">Sıralama: Önerilen</option>
                            <option value="price-asc">Fiyat: Artan</option>
                            <option value="price-desc">Fiyat: Azalan</option>
                            <option value="newest">En Yeni</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex gap-12">
                {/* Sidebar - Desktop */}
                <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 border-r border-white/10">
                    <div className="sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-white">Filtreler</h3>
                        <FilterContent />
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        title: product.name,
                                        price: product.price,
                                        oldPrice: product.oldPrice,
                                        image: product.images[0] || '',
                                        category: product.category,
                                        badge: product.isNew ? 'YENİ' : product.isBestseller ? 'ÇOK SATAN' : undefined
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-lg border border-white/5">
                            <p className="text-gray-400 mb-4">Bu kriterlere uygun ürün bulunamadı.</p>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-sm text-white underline">
                                    Filtreleri Temizle
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[#111111] z-50 lg:hidden p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-white">Filtreler</h3>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 text-white hover:bg-white/10 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <FilterContent />
                    </div>
                </>
            )}
        </div>
    );
}
