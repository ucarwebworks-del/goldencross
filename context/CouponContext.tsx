'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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
    addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => Promise<void>;
    updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
    deleteCoupon: (id: string) => Promise<void>;
    validateCoupon: (code: string, orderTotal: number) => { valid: boolean; error?: string; coupon?: Coupon };
    applyCoupon: (code: string) => Promise<void>;
    isLoading: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const couponsRef = collection(db, 'coupons');

        const unsubscribe = onSnapshot(couponsRef, (snapshot) => {
            const couponsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Coupon[];
            setCoupons(couponsData);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching coupons:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => {
        try {
            await addDoc(collection(db, 'coupons'), {
                ...couponData,
                usedCount: 0,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error adding coupon:', error);
        }
    };

    const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
        try {
            const couponRef = doc(db, 'coupons', id);
            await updateDoc(couponRef, updates);
        } catch (error) {
            console.error('Error updating coupon:', error);
        }
    };

    const deleteCoupon = async (id: string) => {
        try {
            const couponRef = doc(db, 'coupons', id);
            await deleteDoc(couponRef);
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
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

    const applyCoupon = async (code: string) => {
        const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
        if (coupon) {
            await updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
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
