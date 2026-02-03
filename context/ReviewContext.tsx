'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    addReview: (review: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => void;
    approveReview: (id: string) => void;
    rejectReview: (id: string) => void;
    deleteReview: (id: string) => void;
    getProductReviews: (productId: string) => Review[];
    getProductRating: (productId: string) => { average: number; count: number };
    pendingCount: number;
    isLoading: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('reviews');
        if (saved) {
            try {
                setReviews(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse reviews', e);
            }
        }
        setIsLoading(false);
    }, []);

    const saveReviews = (newReviews: Review[]) => {
        setReviews(newReviews);
        localStorage.setItem('reviews', JSON.stringify(newReviews));
    };

    const addReview = (reviewData: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => {
        const newReview: Review = {
            ...reviewData,
            id: Date.now().toString(),
            isApproved: false,
            createdAt: new Date().toISOString()
        };
        saveReviews([...reviews, newReview]);
    };

    const approveReview = (id: string) => {
        const updated = reviews.map(r => r.id === id ? { ...r, isApproved: true } : r);
        saveReviews(updated);
    };

    const rejectReview = (id: string) => {
        const updated = reviews.map(r => r.id === id ? { ...r, isApproved: false } : r);
        saveReviews(updated);
    };

    const deleteReview = (id: string) => {
        const updated = reviews.filter(r => r.id !== id);
        saveReviews(updated);
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
