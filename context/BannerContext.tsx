'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    cta: string;
    link: string;
    image: string;
    isActive: boolean;
    order: number;
}

interface BannerContextType {
    banners: Banner[];
    addBanner: (banner: Omit<Banner, 'id'>) => void;
    updateBanner: (id: string, updates: Partial<Banner>) => void;
    deleteBanner: (id: string) => void;
    reorderBanners: (newOrder: Banner[]) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const defaultBanners: Banner[] = [
    {
        id: '1',
        title: 'Modern Cam Duvar Sanatı',
        subtitle: 'Evinizin havasını değiştirecek premium tasarımlar',
        cta: 'Koleksiyonu Keşfet',
        link: '/collections/modern',
        image: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&q=80&w=2000',
        isActive: true,
        order: 0
    },
    {
        id: '2',
        title: 'Doğanın Renkleri',
        subtitle: 'Canlı ve kırılmaz cam baskı teknolojisi',
        cta: 'Doğa Koleksiyonu',
        link: '/collections/nature',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2000',
        isActive: true,
        order: 1
    }
];

export function BannerProvider({ children }: { children: ReactNode }) {
    const [banners, setBanners] = useState<Banner[]>(defaultBanners);

    useEffect(() => {
        const saved = localStorage.getItem('banners');
        if (saved) {
            try {
                setBanners(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse banners', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('banners', JSON.stringify(banners));
    }, [banners]);

    const addBanner = (banner: Omit<Banner, 'id'>) => {
        const newBanner: Banner = {
            ...banner,
            id: Date.now().toString()
        };
        setBanners(prev => [...prev, newBanner]);
    };

    const updateBanner = (id: string, updates: Partial<Banner>) => {
        setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const deleteBanner = (id: string) => {
        setBanners(prev => prev.filter(b => b.id !== id));
    };

    const reorderBanners = (newOrder: Banner[]) => {
        setBanners(newOrder);
    };

    return (
        <BannerContext.Provider value={{ banners, addBanner, updateBanner, deleteBanner, reorderBanners }}>
            {children}
        </BannerContext.Provider>
    );
}

export function useBanners() {
    const context = useContext(BannerContext);
    if (context === undefined) {
        throw new Error('useBanners must be used within a BannerProvider');
    }
    return context;
}
