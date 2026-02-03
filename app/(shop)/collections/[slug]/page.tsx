import CategoryPageClient from './CategoryPageClient';

export const dynamic = 'force-dynamic';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    return <CategoryPageClient params={params} />;
}
