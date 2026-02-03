'use client';

import { use, useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { useProducts } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';

export default function EditProductPageClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getProduct } = useProducts();
    const router = useRouter();
    const [product, setProduct] = useState(getProduct(id));

    useEffect(() => {
        const p = getProduct(id);
        if (!p) {
            alert('Ürün bulunamadı!');
            router.push('/admin/products');
        } else {
            setProduct(p);
        }
    }, [id, getProduct, router]);

    if (!product) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Ürünü Düzenle: {product.name}</h1>
            <ProductForm initialData={product} />
        </div>
    );
}
