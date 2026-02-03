'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    parent_id?: string;
    order: number;
}

// Initial mock data
const defaultCategories: Category[] = [
    { id: '1', name: 'Modern Art', slug: 'modern', image: 'https://images.unsplash.com/photo-1549887552-93f8efb87228?auto=format&fit=crop&q=80&w=300', order: 0 },
    { id: '2', name: 'Nature', slug: 'nature', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=300', order: 1 },
    { id: '3', name: 'Doğa', slug: 'doga', image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800', order: 2 },
    { id: '4', name: 'Manzara', slug: 'manzara', parent_id: '3', order: 0 },
    { id: '5', name: 'Hayvanlar', slug: 'hayvanlar', parent_id: '3', order: 1 },
    { id: '6', name: 'Soyut Sanat', slug: 'soyut-sanat', parent_id: '2', order: 0 }
];

interface CategoryContextType {
    categories: Category[];
    addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
    updateCategory: (id: string, updates: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    reorderCategory: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
    isLoading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Helper to ensure all categories have order field
function ensureOrder(cats: Category[]): Category[] {
    // Group by parent_id
    const grouped: Record<string, Category[]> = {};
    cats.forEach(c => {
        const key = c.parent_id || 'root';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(c);
    });

    // Assign order if missing
    const result: Category[] = [];
    Object.values(grouped).forEach(group => {
        group.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        group.forEach((cat, idx) => {
            result.push({ ...cat, order: cat.order ?? idx });
        });
    });

    return result;
}

export function CategoryProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[]>(defaultCategories);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('categories');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const withOrder = ensureOrder(parsed);
                setCategories(withOrder);
                // Save back if we added order fields
                if (JSON.stringify(parsed) !== JSON.stringify(withOrder)) {
                    localStorage.setItem('categories', JSON.stringify(withOrder));
                }
            } catch (e) {
                console.error('Failed to parse categories', e);
            }
        }
        setIsLoading(false);
    }, []);

    const saveCategories = (newCategories: Category[]) => {
        setCategories(newCategories);
        localStorage.setItem('categories', JSON.stringify(newCategories));
    };

    const addCategory = (categoryData: Omit<Category, 'id' | 'order'>) => {
        // Calculate order for new category
        const siblings = categories.filter(c => c.parent_id === categoryData.parent_id);
        const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.order ?? 0)) + 1 : 0;

        const newCategory: Category = {
            ...categoryData,
            id: Date.now().toString(),
            order: maxOrder
        };
        saveCategories([...categories, newCategory]);
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        const newCategories = categories.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
        );
        saveCategories(newCategories);
    };

    const deleteCategory = (id: string) => {
        // Also delete children
        const newCategories = categories.filter(cat => cat.id !== id && cat.parent_id !== id);
        saveCategories(newCategories);
    };

    const reorderCategory = (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
        const category = categories.find(c => c.id === id);
        if (!category) return;

        // Map left/right to prev/next for subcategories
        const isNext = direction === 'down' || direction === 'right';

        // Get siblings (same parent_id) and sort by current order
        const siblings = categories
            .filter(c => c.parent_id === category.parent_id)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const currentIndex = siblings.findIndex(c => c.id === id);
        const targetIndex = isNext ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex < 0 || targetIndex >= siblings.length) return;

        // Normalize order values for all siblings first
        const normalizedSiblings = siblings.map((cat, idx) => ({
            ...cat,
            order: idx
        }));

        // Swap positions in the array
        const temp = normalizedSiblings[currentIndex];
        normalizedSiblings[currentIndex] = { ...normalizedSiblings[targetIndex], order: currentIndex };
        normalizedSiblings[targetIndex] = { ...temp, order: targetIndex };

        // Create new categories array with updated orders
        const updatedSiblingMap = new Map(normalizedSiblings.map(s => [s.id, s.order]));

        const newCategories = categories.map(cat => {
            if (updatedSiblingMap.has(cat.id)) {
                return { ...cat, order: updatedSiblingMap.get(cat.id)! };
            }
            return cat;
        });

        saveCategories(newCategories);
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, reorderCategory, isLoading }}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
}
