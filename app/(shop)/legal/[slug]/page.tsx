'use client';
import { useParams } from 'next/navigation';
import { usePages } from '@/context/PageContext';

export default function LegalPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { getPage } = usePages();
    const page = getPage(slug);

    if (!page) {
        return <div className="container py-20 text-center">Böyle bir sayfa bulunamadı.</div>;
    }

    return (
        <div className="bg-[#111111] min-h-screen py-12">
            <div className="container max-w-4xl">
                <div className="bg-[#1a1a1a] p-8 md:p-12 rounded-2xl shadow-sm border border-white/10">
                    <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-white/10 text-white">
                        {page.title}
                    </h1>

                    <div
                        className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-[#00E676] prose-strong:text-white text-gray-300"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </div>
    );
}
