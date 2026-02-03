'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our settings
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

    // Homepage category section
    homepageCategoryTitle: string;
    homepageCategorySubtitle: string;

    // Announcement bar
    announcementBarText: string;
    announcementBarActive: boolean;
}

// Default settings
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
    updateSettings: (newSettings: Partial<SiteSettings>) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('siteSettings');
        if (savedSettings) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
        setIsLoading(false);
    }, []);

    const updateSettings = (newSettings: Partial<SiteSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('siteSettings', JSON.stringify(updated));
            // Trigger a custom event for immediate updates across tabs if needed, 
            // but React state handles current tab.
            return updated;
        });
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
