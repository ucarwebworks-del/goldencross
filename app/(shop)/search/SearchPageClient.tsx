'use client';

import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/shop/ProductCard';
import { Suspense, useMemo } from 'react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { products } = useProducts();

    const results = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery)
        );
    }, [query, products]);

    return (
        <div className="container py-12 min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-8">
                "{query}" için arama sonuçları
            </h1>

            {results.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map(p => (
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
            )}
        </div>
    );
}

export default function SearchPageClient() {
    return (
        <Suspense fallback={<div className="container py-20 text-center">Yükleniyor...</div>}>
            <SearchResults />
        </Suspense>
    );
}
