'use client';
import { use, useEffect } from 'react';
import Link from 'next/link';
import { useBlog } from '@/context/BlogContext';
import { Calendar, ArrowLeft, User, Tag } from 'lucide-react';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { getPostBySlug, updatePost, blogEnabled, isLoading } = useBlog();

    const post = getPostBySlug(slug);

    // Increment view count
    useEffect(() => {
        if (post && post.id) {
            updatePost(post.id, { views: (post.views || 0) + 1 });
        }
    }, [post?.id]);

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

    if (!post) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Yazı bulunamadı</h1>
                <Link href="/blog" className="text-accent underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Blog'a Dön
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* SEO Meta - handled by Next.js metadata in production */}
            <div className="container py-12">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-white transition-colors">Anasayfa</Link>
                    {' / '}
                    <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                    {' / '}
                    <span className="text-white font-medium">{post.title}</span>
                </div>

                <article className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        {post.category && (
                            <span className="inline-block bg-[#00E676]/10 text-[#00E676] px-3 py-1 rounded-full text-sm font-medium mb-4">
                                {post.category}
                            </span>
                        )}
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white">{post.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <User size={14} />
                                {post.author}
                            </span>
                            {post.views !== undefined && (
                                <span>{post.views} görüntülenme</span>
                            )}
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.image && (
                        <div className="aspect-video rounded-xl overflow-hidden mb-8">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-lg text-gray-300 mb-8 pb-8 border-b border-white/10 italic">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg text-gray-300 dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-[#00E676] prose-strong:text-white prose-blockquote:text-gray-400 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-8 pt-8 border-t border-white/10">
                            <Tag size={16} className="text-gray-400" />
                            {post.tags.map((tag, i) => (
                                <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Back Link */}
                    <div className="mt-12">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-[#00E676] font-bold hover:underline"
                        >
                            <ArrowLeft size={16} /> Tüm Yazılar
                        </Link>
                    </div>
                </article>
            </div>
        </>
    );
}
