'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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

export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const reviewsRef = collection(db, 'reviews');

        const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Review[];
            setReviews(reviewsData);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching reviews:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addReview = async (reviewData: Omit<Review, 'id' | 'isApproved' | 'createdAt'>) => {
        try {
            await addDoc(collection(db, 'reviews'), {
                ...reviewData,
                isApproved: false,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    const approveReview = async (id: string) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await updateDoc(reviewRef, { isApproved: true });
        } catch (error) {
            console.error('Error approving review:', error);
        }
    };

    const rejectReview = async (id: string) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await updateDoc(reviewRef, { isApproved: false });
        } catch (error) {
            console.error('Error rejecting review:', error);
        }
    };

    const deleteReview = async (id: string) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await deleteDoc(reviewRef);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
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
