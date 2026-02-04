'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    publishedAt: string;
    isPublished: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    category?: string;
    tags?: string[];
    views?: number;
}

interface BlogSettings {
    enabled: boolean;
    title: string;
}

interface BlogContextType {
    posts: BlogPost[];
    addPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
    updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    getPost: (id: string) => BlogPost | undefined;
    getPostBySlug: (slug: string) => BlogPost | undefined;
    getPublishedPosts: () => BlogPost[];
    isLoading: boolean;
    blogEnabled: boolean;
    setBlogEnabled: (enabled: boolean) => Promise<void>;
    blogTitle: string;
    setBlogTitle: (title: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const STORAGE_KEY = 'goldenglass_blog';
const SETTINGS_KEY = 'goldenglass_blog_settings';

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

const defaultSettings: BlogSettings = { enabled: true, title: 'Blog' };

export function BlogProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blogEnabled, setBlogEnabledState] = useState(true);
    const [blogTitle, setBlogTitleState] = useState('Blog');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [postsData, settingsData] = await Promise.all([
                    fetchData<BlogPost[]>(STORAGE_KEY, defaultPosts),
                    fetchData<BlogSettings>(SETTINGS_KEY, defaultSettings)
                ]);
                
                const sortedPosts = [...(postsData.length > 0 ? postsData : defaultPosts)]
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
                setPosts(sortedPosts);
                
                setBlogEnabledState(settingsData.enabled ?? true);
                setBlogTitleState(settingsData.title ?? 'Blog');
                
                if (postsData.length === 0) {
                    await saveData(STORAGE_KEY, defaultPosts);
                }
            } catch (error) {
                console.error('Error loading blog:', error);
                setPosts(defaultPosts);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    const persistPosts = useCallback(async (newPosts: BlogPost[]) => {
        const sorted = [...newPosts].sort((a, b) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setPosts(sorted);
        await saveData(STORAGE_KEY, sorted);
    }, []);

    const addPost = async (post: Omit<BlogPost, 'id'>) => {
        const newPost: BlogPost = {
            ...post,
            id: Date.now().toString(),
            views: 0
        };
        await persistPosts([...posts, newPost]);
    };

    const updatePost = async (id: string, data: Partial<BlogPost>) => {
        const updatedPosts = posts.map(p => 
            p.id === id ? { ...p, ...data } : p
        );
        await persistPosts(updatedPosts);
    };

    const deletePost = async (id: string) => {
        const filteredPosts = posts.filter(p => p.id !== id);
        await persistPosts(filteredPosts);
    };

    const getPost = (id: string) => posts.find(p => p.id === id);
    const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);
    const getPublishedPosts = () => posts.filter(p => p.isPublished);

    const setBlogEnabled = async (enabled: boolean) => {
        setBlogEnabledState(enabled);
        await saveData(SETTINGS_KEY, { enabled, title: blogTitle });
    };

    const setBlogTitle = async (title: string) => {
        setBlogTitleState(title);
        await saveData(SETTINGS_KEY, { enabled: blogEnabled, title });
    };

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
