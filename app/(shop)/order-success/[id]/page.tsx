import OrderSuccessPageClient from './OrderSuccessPageClient';

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    return <OrderSuccessPageClient params={params} />;
}
