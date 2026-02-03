'use client';
import { use, useEffect, useState } from 'react';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductInfo from '@/components/shop/ProductInfo';
import ProductTabs from '@/components/shop/ProductTabs';
import ProductCard from '@/components/shop/ProductCard';
import ProductReviews from '@/components/shop/ProductReviews';
import { useProducts, Product } from '@/context/ProductContext';
import { notFound } from 'next/navigation';

export default function ProductDetailPageClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getProduct, products } = useProducts();
    const [product, setProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        setProduct(getProduct(id));
    }, [id, getProduct]);

    if (!product && products.length > 0) {
        // If products are loaded but product not found, maybe show loader or notfound
        // Using local persistence so it should be fast
        // For now just return null until loaded or 404
        // Logic: if products array is empty, it might be loading. if not empty and product not found -> 404
        return <div className="container py-20 text-center">Yükleniyor...</div>;
    }

    if (!product) {
        return <div className="container py-20 text-center">Yükleniyor...</div>;
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div className="container py-12">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400 mb-8">
                Anasayfa / Koleksiyonlar / {product.category} / <span className="text-white font-medium">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <ProductGallery images={product.images} />
                <ProductInfo product={product} />
            </div>

            <ProductTabs description={product.description} technicalSpecs={product.technicalSpecs} />

            {/* Customer Reviews */}
            <ProductReviews productId={product.id} productName={product.name} />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-24 pt-12 border-t border-white/10">
                    <h2 className="text-2xl font-bold mb-8 text-white">Bunları da Beğenebilirsiniz</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
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
                </section>
            )}
        </div>
    );
}

