'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

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

const STORAGE_KEY = 'goldenglass_settings';

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
        const loadSettings = async () => {
            try {
                const data = await fetchData<SiteSettings>(STORAGE_KEY, defaultSettings);
                setSettings({ ...defaultSettings, ...data });
                
                // Initialize if empty
                if (!data || Object.keys(data).length === 0) {
                    await saveData(STORAGE_KEY, defaultSettings);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
                setSettings(defaultSettings);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadSettings();
    }, []);

    const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await saveData(STORAGE_KEY, updated);
    }, [settings]);

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
