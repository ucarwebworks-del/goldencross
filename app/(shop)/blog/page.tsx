'use client';
import Link from 'next/link';
import { useBlog } from '@/context/BlogContext';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function BlogListPage() {
    const { getPublishedPosts, blogEnabled, blogTitle, isLoading } = useBlog();

    if (isLoading) {
        return (
            <div className="container py-20 text-center">
                <p>Yükleniyor...</p>
            </div>
        );
    }

    if (!blogEnabled) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Blog şu an aktif değil</h1>
                <Link href="/" className="text-accent underline">Ana Sayfaya Dön</Link>
            </div>
        );
    }

    const posts = getPublishedPosts();

    return (
        <div className="container py-12">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400 mb-8">
                <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link> / <span className="text-white font-medium">{blogTitle}</span>
            </div>

            <h1 className="text-4xl font-bold mb-8 text-white">{blogTitle}</h1>

            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p>Henüz blog yazısı yok.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-white/10"
                        >
                            {post.image && (
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                    <Calendar size={12} />
                                    <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    {post.category && (
                                        <>
                                            <span>•</span>
                                            <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">{post.category}</span>
                                        </>
                                    )}
                                </div>
                                <h2 className="font-bold text-lg mb-2 text-white group-hover:text-[#00E676] transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-gray-400 line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
