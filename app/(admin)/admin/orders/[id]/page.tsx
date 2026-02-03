import OrderDetailPageClient from './OrderDetailPageClient';

export const dynamic = 'force-dynamic';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <OrderDetailPageClient params={params} />;
}
