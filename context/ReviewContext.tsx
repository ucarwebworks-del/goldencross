'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

export interface Review {
    id: string;
    productId: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
}

interface ReviewContextType {
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => Promise<void>;
    approveReview: (id: string) => Promise<void>;
    rejectReview: (id: string) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
    getProductReviews: (productId: string) => Review[];
    getProductRating: (productId: string) => { average: number; count: number };
    pendingCount: number;
    isLoading: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const STORAGE_KEY = 'goldenglass_reviews';

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await fetchData<Review[]>(STORAGE_KEY, []);
                setReviews(data);
            } catch (error) {
                console.error('Error loading reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadReviews();
    }, []);

    const persistReviews = useCallback(async (newReviews: Review[]) => {
        setReviews(newReviews);
        await saveData(STORAGE_KEY, newReviews);
    }, []);

    const addReview = async (reviewData: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => {
        const newReview: Review = {
            ...reviewData,
            id: Date.now().toString(),
            isApproved: false,
            createdAt: new Date().toISOString()
        };
        await persistReviews([...reviews, newReview]);
    };

    const approveReview = async (id: string) => {
        const updatedReviews = reviews.map(r => 
            r.id === id ? { ...r, isApproved: true } : r
        );
        await persistReviews(updatedReviews);
    };

    const rejectReview = async (id: string) => {
        const updatedReviews = reviews.map(r => 
            r.id === id ? { ...r, isApproved: false } : r
        );
        await persistReviews(updatedReviews);
    };

    const deleteReview = async (id: string) => {
        const filteredReviews = reviews.filter(r => r.id !== id);
        await persistReviews(filteredReviews);
    };

    const getProductReviews = (productId: string): Review[] => {
        return reviews.filter(r => r.productId === productId && r.isApproved);
    };

    const getProductRating = (productId: string): { average: number; count: number } => {
        const productReviews = getProductReviews(productId);
        if (productReviews.length === 0) return { average: 0, count: 0 };

        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
            average: Math.round((sum / productReviews.length) * 10) / 10,
            count: productReviews.length
        };
    };

    const pendingCount = reviews.filter(r => !r.isApproved).length;

    return (
        <ReviewContext.Provider value={{
            reviews,
            addReview,
            approveReview,
            rejectReview,
            deleteReview,
            getProductReviews,
            getProductRating,
            pendingCount,
            isLoading
        }}>
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews() {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
}
