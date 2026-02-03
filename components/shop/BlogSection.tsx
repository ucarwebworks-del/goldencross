'use client';
import Link from 'next/link';
import { useBlog } from '@/context/BlogContext';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogSection() {
    const { getPublishedPosts, blogEnabled, blogTitle, isLoading } = useBlog();

    if (isLoading) return null;
    if (!blogEnabled) return null;

    const posts = getPublishedPosts().slice(0, 3);

    if (posts.length === 0) return null;

    return (
        <section className="section">
            <div className="container">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-white">{blogTitle}</h2>
                        <p className="text-gray-400">En son yazılarımız ve ipuçları</p>
                    </div>
                    <Link
                        href="/blog"
                        className="font-semibold border-b-2 border-white pb-1 text-white hover:text-accent hover:border-accent transition-colors flex items-center gap-2"
                    >
                        Tümünü Gör <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-white/5 hover:border-white/20"
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
                                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-accent transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
