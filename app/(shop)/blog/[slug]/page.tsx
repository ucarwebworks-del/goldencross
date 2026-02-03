import BlogDetailPageClient from './BlogDetailPageClient';

export const dynamic = 'force-dynamic';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    return <BlogDetailPageClient params={params} />;
}
