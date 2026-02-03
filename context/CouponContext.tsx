'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
}

interface CouponContextType {
    coupons: Coupon[];
    addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => void;
    updateCoupon: (id: string, updates: Partial<Coupon>) => void;
    deleteCoupon: (id: string) => void;
    validateCoupon: (code: string, orderTotal: number) => { valid: boolean; error?: string; coupon?: Coupon };
    applyCoupon: (code: string) => void;
    isLoading: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('coupons');
        if (saved) {
            try {
                setCoupons(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse coupons', e);
            }
        }
        setIsLoading(false);
    }, []);

    const saveCoupons = (newCoupons: Coupon[]) => {
        setCoupons(newCoupons);
        localStorage.setItem('coupons', JSON.stringify(newCoupons));
    };

    const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => {
        const newCoupon: Coupon = {
            ...couponData,
            id: Date.now().toString(),
            usedCount: 0,
            createdAt: new Date().toISOString()
        };
        saveCoupons([...coupons, newCoupon]);
    };

    const updateCoupon = (id: string, updates: Partial<Coupon>) => {
        const newCoupons = coupons.map(c => c.id === id ? { ...c, ...updates } : c);
        saveCoupons(newCoupons);
    };

    const deleteCoupon = (id: string) => {
        const newCoupons = coupons.filter(c => c.id !== id);
        saveCoupons(newCoupons);
    };

    const validateCoupon = (code: string, orderTotal: number): { valid: boolean; error?: string; coupon?: Coupon } => {
        const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());

        if (!coupon) {
            return { valid: false, error: 'Kupon kodu bulunamadı' };
        }

        if (!coupon.isActive) {
            return { valid: false, error: 'Bu kupon artık geçerli değil' };
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return { valid: false, error: 'Kuponun süresi dolmuş' };
        }

        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
            return { valid: false, error: 'Kupon kullanım limiti doldu' };
        }

        if (orderTotal < coupon.minOrderAmount) {
            return { valid: false, error: `Minimum sipariş tutarı ${coupon.minOrderAmount} TL` };
        }

        return { valid: true, coupon };
    };

    const applyCoupon = (code: string) => {
        const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
        if (coupon) {
            updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
        }
    };

    return (
        <CouponContext.Provider value={{
            coupons,
            addCoupon,
            updateCoupon,
            deleteCoupon,
            validateCoupon,
            applyCoupon,
            isLoading
        }}>
            {children}
        </CouponContext.Provider>
    );
}

export function useCoupons() {
    const context = useContext(CouponContext);
    if (context === undefined) {
        throw new Error('useCoupons must be used within a CouponProvider');
    }
    return context;
}
