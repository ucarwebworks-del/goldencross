'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string; // Kısa açıklama
    content: string; // HTML içerik
    image: string; // Kapak görseli
    author: string;
    publishedAt: string; // ISO date string
    isPublished: boolean;
    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    // Kategoriler
    category?: string;
    tags?: string[];
    // İstatistik
    views?: number;
}

interface BlogContextType {
    posts: BlogPost[];
    addPost: (post: Omit<BlogPost, 'id'>) => void;
    updatePost: (id: string, post: Partial<BlogPost>) => void;
    deletePost: (id: string) => void;
    getPost: (id: string) => BlogPost | undefined;
    getPostBySlug: (slug: string) => BlogPost | undefined;
    getPublishedPosts: () => BlogPost[];
    isLoading: boolean;
    // Blog ayarları
    blogEnabled: boolean;
    setBlogEnabled: (enabled: boolean) => void;
    blogTitle: string;
    setBlogTitle: (title: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const defaultPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Cam Tablo Seçerken Dikkat Edilmesi Gerekenler',
        slug: 'cam-tablo-secerken-dikkat-edilmesi-gerekenler',
        excerpt: 'Evinize en uygun cam tabloyu seçerken bilmeniz gereken ipuçları ve öneriler.',
        content: '<p>Cam tablolar, modern ev dekorasyonunun vazgeçilmez parçalarından biridir...</p>',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
        author: 'Golden Glass',
        publishedAt: new Date().toISOString(),
        isPublished: true,
        metaTitle: 'Cam Tablo Seçerken Dikkat Edilmesi Gerekenler | Golden Glass 777',
        metaDescription: 'Evinize en uygun cam tabloyu seçerken bilmeniz gereken ipuçları ve öneriler.',
        category: 'Rehber',
        views: 245
    },
    {
        id: '2',
        title: '2024 Yılının En Popüler Duvar Dekorasyonu Trendleri',
        slug: '2024-duvar-dekorasyonu-trendleri',
        excerpt: 'Bu yıl evlerinizi süsleyecek en popüler duvar dekorasyonu trendlerini keşfedin.',
        content: '<p>2024 yılı, duvar dekorasyonunda cesur ve yaratıcı tasarımların öne çıktığı bir yıl...</p>',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        author: 'Golden Glass',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        isPublished: true,
        metaTitle: '2024 Duvar Dekorasyonu Trendleri | Golden Glass 777',
        metaDescription: 'Bu yıl evlerinizi süsleyecek en popüler duvar dekorasyonu trendlerini keşfedin.',
        category: 'Trend',
        views: 189
    }
];

export function BlogProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blogEnabled, setBlogEnabledState] = useState(true);
    const [blogTitle, setBlogTitleState] = useState('Blog');

    // Load from localStorage
    useEffect(() => {
        const savedPosts = localStorage.getItem('blogPosts');
        const savedSettings = localStorage.getItem('blogSettings');

        if (savedPosts) {
            try {
                setPosts(JSON.parse(savedPosts));
            } catch (e) {
                setPosts(defaultPosts);
            }
        } else {
            setPosts(defaultPosts);
        }

        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                setBlogEnabledState(settings.enabled ?? true);
                setBlogTitleState(settings.title ?? 'Blog');
            } catch (e) {
                // Use defaults
            }
        }

        setIsLoading(false);
    }, []);

    // Persist posts
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('blogPosts', JSON.stringify(posts));
        }
    }, [posts, isLoading]);

    // Persist settings
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('blogSettings', JSON.stringify({
                enabled: blogEnabled,
                title: blogTitle
            }));
        }
    }, [blogEnabled, blogTitle, isLoading]);

    const addPost = (post: Omit<BlogPost, 'id'>) => {
        const newPost: BlogPost = {
            ...post,
            id: Date.now().toString(),
            views: 0
        };
        setPosts(prev => [newPost, ...prev]);
    };

    const updatePost = (id: string, data: Partial<BlogPost>) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const deletePost = (id: string) => {
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const getPost = (id: string) => posts.find(p => p.id === id);

    const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);

    const getPublishedPosts = () => posts.filter(p => p.isPublished).sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const setBlogEnabled = (enabled: boolean) => setBlogEnabledState(enabled);
    const setBlogTitle = (title: string) => setBlogTitleState(title);

    return (
        <BlogContext.Provider value={{
            posts,
            addPost,
            updatePost,
            deletePost,
            getPost,
            getPostBySlug,
            getPublishedPosts,
            isLoading,
            blogEnabled,
            setBlogEnabled,
            blogTitle,
            setBlogTitle
        }}>
            {children}
        </BlogContext.Provider>
    );
}

export function useBlog() {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}
