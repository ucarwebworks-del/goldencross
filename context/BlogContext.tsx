'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

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

    useEffect(() => {
        const postsRef = collection(db, 'blog');
        const settingsRef = doc(db, 'settings', 'blog');

        const unsubscribePosts = onSnapshot(postsRef, (snapshot) => {
            if (snapshot.empty) {
                defaultPosts.forEach(async (post) => {
                    const { id, ...postData } = post;
                    await addDoc(postsRef, postData);
                });
                setPosts(defaultPosts);
            } else {
                const postsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as BlogPost[];
                postsData.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
                setPosts(postsData);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching blog posts:', error);
            setPosts(defaultPosts);
            setIsLoading(false);
        });

        const unsubscribeSettings = onSnapshot(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setBlogEnabledState(data.enabled ?? true);
                setBlogTitleState(data.title ?? 'Blog');
            }
        });

        return () => {
            unsubscribePosts();
            unsubscribeSettings();
        };
    }, []);

    const addPost = async (post: Omit<BlogPost, 'id'>) => {
        try {
            await addDoc(collection(db, 'blog'), { ...post, views: 0 });
        } catch (error) {
            console.error('Error adding blog post:', error);
        }
    };

    const updatePost = async (id: string, data: Partial<BlogPost>) => {
        try {
            const postRef = doc(db, 'blog', id);
            await updateDoc(postRef, data);
        } catch (error) {
            console.error('Error updating blog post:', error);
        }
    };

    const deletePost = async (id: string) => {
        try {
            const postRef = doc(db, 'blog', id);
            await deleteDoc(postRef);
        } catch (error) {
            console.error('Error deleting blog post:', error);
        }
    };

    const getPost = (id: string) => posts.find(p => p.id === id);
    const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);
    const getPublishedPosts = () => posts.filter(p => p.isPublished);

    const setBlogEnabled = async (enabled: boolean) => {
        try {
            await setDoc(doc(db, 'settings', 'blog'), { enabled, title: blogTitle }, { merge: true });
            setBlogEnabledState(enabled);
        } catch (error) {
            console.error('Error updating blog settings:', error);
        }
    };

    const setBlogTitle = async (title: string) => {
        try {
            await setDoc(doc(db, 'settings', 'blog'), { enabled: blogEnabled, title }, { merge: true });
            setBlogTitleState(title);
        } catch (error) {
            console.error('Error updating blog settings:', error);
        }
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
