import ProductDetailPageClient from './ProductDetailPageClient';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <ProductDetailPageClient params={params} />;
}
