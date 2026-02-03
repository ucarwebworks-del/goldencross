'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';

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
        const bannersRef = collection(db, 'banners');

        const unsubscribe = onSnapshot(bannersRef, (snapshot) => {
            if (snapshot.empty) {
                defaultBanners.forEach(async (banner) => {
                    const { id, ...bannerData } = banner;
                    await addDoc(bannersRef, bannerData);
                });
                setBanners(defaultBanners);
            } else {
                const bannersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Banner[];
                bannersData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                setBanners(bannersData);
            }
        }, (error) => {
            console.error('Error fetching banners:', error);
            setBanners(defaultBanners);
        });

        return () => unsubscribe();
    }, []);

    const addBanner = async (banner: Omit<Banner, 'id'>) => {
        try {
            await addDoc(collection(db, 'banners'), banner);
        } catch (error) {
            console.error('Error adding banner:', error);
        }
    };

    const updateBanner = async (id: string, updates: Partial<Banner>) => {
        try {
            const bannerRef = doc(db, 'banners', id);
            await updateDoc(bannerRef, updates);
        } catch (error) {
            console.error('Error updating banner:', error);
        }
    };

    const deleteBanner = async (id: string) => {
        try {
            const bannerRef = doc(db, 'banners', id);
            await deleteDoc(bannerRef);
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    };

    const reorderBanners = async (newOrder: Banner[]) => {
        try {
            const batch = writeBatch(db);
            newOrder.forEach((banner, index) => {
                const bannerRef = doc(db, 'banners', banner.id);
                batch.update(bannerRef, { order: index });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error reordering banners:', error);
        }
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
