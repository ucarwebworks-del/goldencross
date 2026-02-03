'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export interface Page {
    id: string;
    slug: string;
    title: string;
    content: string;
    group: 'corporate' | 'legal';
    isPublished?: boolean;
}

const defaultPages: Page[] = [
    {
        id: '1',
        slug: 'about-us',
        title: 'Hakkımızda',
        content: `<h2>Biz Kimiz?</h2><p>Golden Glass 777 olarak, camın zarafetini sanatla buluşturuyoruz...</p>`,
        group: 'corporate'
    },
    {
        id: '2',
        slug: 'contact',
        title: 'İletişim',
        content: `<p>Adres: İstanbul, Türkiye</p><p>Email: info@goldenglass777.com</p>`,
        group: 'corporate'
    },
    {
        id: '3',
        slug: 'privacy-policy',
        title: 'Gizlilik Politikası',
        content: `<h2>Gizlilik Politikası</h2><p>Kişisel verileriniz bizim için önemlidir...</p>`,
        group: 'legal'
    },
    {
        id: '4',
        slug: 'terms-of-service',
        title: 'Kullanım Koşulları',
        content: `<h2>Kullanım Koşulları</h2><p>Sitemizi kullanarak...</p>`,
        group: 'legal'
    },
    {
        id: '5',
        slug: 'cookie-policy',
        title: 'Çerez Politikası',
        content: `<h2>Çerez Politikası</h2><p>Çerezler hakkında...</p>`,
        group: 'legal'
    },
    {
        id: '6',
        slug: 'return-policy',
        title: 'İade Politikası',
        content: `<h2>İade Politikası ve Şartları</h2><p>İade süreçleri...</p>`,
        group: 'legal'
    },
    {
        id: '7',
        slug: 'kvkk',
        title: 'KVKK Aydınlatma Metni',
        content: `<h2>KVKK Hakkında</h2><p>Kişisel verileriniz...</p>`,
        group: 'legal'
    }
];

interface PageContextType {
    pages: Page[];
    updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
    addPage: (page: Omit<Page, 'id'>) => Promise<void>;
    getPage: (slug: string) => Page | undefined;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
    const [pages, setPages] = useState<Page[]>([]);

    useEffect(() => {
        const pagesRef = collection(db, 'pages');

        const unsubscribe = onSnapshot(pagesRef, (snapshot) => {
            if (snapshot.empty) {
                defaultPages.forEach(async (page) => {
                    const { id, ...pageData } = page;
                    await addDoc(pagesRef, pageData);
                });
                setPages(defaultPages);
            } else {
                const pagesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Page[];
                setPages(pagesData);
            }
        }, (error) => {
            console.error('Error fetching pages:', error);
            setPages(defaultPages);
        });

        return () => unsubscribe();
    }, []);

    const updatePage = async (id: string, updates: Partial<Page>) => {
        try {
            const pageRef = doc(db, 'pages', id);
            await updateDoc(pageRef, updates);
        } catch (error) {
            console.error('Error updating page:', error);
        }
    };

    const addPage = async (page: Omit<Page, 'id'>) => {
        try {
            await addDoc(collection(db, 'pages'), page);
        } catch (error) {
            console.error('Error adding page:', error);
        }
    };

    const getPage = (slug: string) => {
        return pages.find(p => p.slug === slug);
    };

    return (
        <PageContext.Provider value={{ pages, updatePage, addPage, getPage }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePages() {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error('usePages must be used within a PageProvider');
    }
    return context;
}
