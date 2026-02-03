'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    updatePage: (id: string, updates: Partial<Page>) => void;
    addPage: (page: Omit<Page, 'id'>) => void;
    getPage: (slug: string) => Page | undefined;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
    const [pages, setPages] = useState<Page[]>(defaultPages);

    useEffect(() => {
        const saved = localStorage.getItem('pages');
        if (saved) {
            try {
                const parsedPages: Page[] = JSON.parse(saved);
                // Merge new defaults if they don't exist in saved
                const mergedPages = [...parsedPages];
                let hasChanges = false;

                defaultPages.forEach(defPage => {
                    if (!parsedPages.find(p => p.slug === defPage.slug)) {
                        mergedPages.push(defPage);
                        hasChanges = true;
                    }
                });

                setPages(mergedPages);
                if (hasChanges) {
                    localStorage.setItem('pages', JSON.stringify(mergedPages));
                }
            } catch (e) {
                console.error('Failed to parse pages', e);
                setPages(defaultPages);
            }
        }
    }, []);

    const savePages = (newPages: Page[]) => {
        setPages(newPages);
        localStorage.setItem('pages', JSON.stringify(newPages));
    };

    const updatePage = (id: string, updates: Partial<Page>) => {
        const newPages = pages.map(p =>
            p.id === id ? { ...p, ...updates } : p
        );
        savePages(newPages);
    };

    const addPage = (page: Omit<Page, 'id'>) => {
        const newPage: Page = { ...page, id: Date.now().toString() };
        savePages([...pages, newPage]);
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
