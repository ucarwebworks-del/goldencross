'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

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
    addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
    updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
    deleteBanner: (id: string) => Promise<void>;
    reorderBanners: (newOrder: Banner[]) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const STORAGE_KEY = 'goldenglass_banners';

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
    const [banners, setBanners] = useState<Banner[]>([]);

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const data = await fetchData<Banner[]>(STORAGE_KEY, defaultBanners);
                const sorted = [...(data.length > 0 ? data : defaultBanners)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                setBanners(sorted);
                
                if (data.length === 0) {
                    await saveData(STORAGE_KEY, defaultBanners);
                }
            } catch (error) {
                console.error('Error loading banners:', error);
                setBanners(defaultBanners);
            }
        };
        
        loadBanners();
    }, []);

    const persistBanners = useCallback(async (newBanners: Banner[]) => {
        const sorted = [...newBanners].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setBanners(sorted);
        await saveData(STORAGE_KEY, sorted);
    }, []);

    const addBanner = async (banner: Omit<Banner, 'id'>) => {
        const newBanner: Banner = {
            ...banner,
            id: Date.now().toString()
        };
        await persistBanners([...banners, newBanner]);
    };

    const updateBanner = async (id: string, updates: Partial<Banner>) => {
        const updatedBanners = banners.map(b => 
            b.id === id ? { ...b, ...updates } : b
        );
        await persistBanners(updatedBanners);
    };

    const deleteBanner = async (id: string) => {
        const filteredBanners = banners.filter(b => b.id !== id);
        await persistBanners(filteredBanners);
    };

    const reorderBanners = async (newOrder: Banner[]) => {
        const reordered = newOrder.map((banner, index) => ({
            ...banner,
            order: index
        }));
        await persistBanners(reordered);
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
