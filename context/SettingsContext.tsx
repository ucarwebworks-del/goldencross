'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface SiteSettings {
    siteTitle: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    instagram: string;
    instagramActive: boolean;
    facebook: string;
    facebookActive: boolean;
    twitter: string;
    twitterActive: boolean;
    whatsappActive: boolean;
    freeShippingLimit: number;
    shippingCost: number;
    currency: string;
    logo?: string;
    icon?: string;
    homepageCategoryTitle: string;
    homepageCategorySubtitle: string;
    announcementBarText: string;
    announcementBarActive: boolean;
}

const defaultSettings: SiteSettings = {
    siteTitle: 'Golden Glass 777',
    description: "Türkiye'nin en büyük cam tablo mağazası.",
    email: 'info@goldenglass777.com.tr',
    phone: '+90 (212) 555 01 23',
    whatsapp: '+905551234567',
    whatsappActive: true,
    address: 'Maslak Mahallesi, Büyükdere Caddesi, Noramin İş Merkezi No: 237/A Sarıyer / İstanbul',
    instagram: 'goldenglass777',
    instagramActive: true,
    facebook: 'goldenglass777',
    facebookActive: true,
    twitter: 'goldenglass777',
    twitterActive: true,
    freeShippingLimit: 1000,
    shippingCost: 49,
    currency: 'TRY',
    homepageCategoryTitle: 'Kategoriler',
    homepageCategorySubtitle: 'Koleksiyonlarımızı keşfedin',
    announcementBarText: '1000 TL ve Üzeri Ücretsiz Kargo | Yeni Sezon Koleksiyonu Yayında',
    announcementBarActive: true,
};

interface SettingsContextType {
    settings: SiteSettings;
    updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'site');

        const unsubscribe = onSnapshot(settingsRef, async (snapshot) => {
            if (!snapshot.exists()) {
                await setDoc(settingsRef, defaultSettings);
                setSettings(defaultSettings);
            } else {
                setSettings({ ...defaultSettings, ...snapshot.data() } as SiteSettings);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching settings:', error);
            setSettings(defaultSettings);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateSettings = async (newSettings: Partial<SiteSettings>) => {
        try {
            const settingsRef = doc(db, 'settings', 'site');
            const updated = { ...settings, ...newSettings };
            await setDoc(settingsRef, updated);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
