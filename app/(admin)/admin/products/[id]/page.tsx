import EditProductPageClient from './EditProductPageClient';

export const dynamic = 'force-dynamic';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    return <EditProductPageClient params={params} />;
}
