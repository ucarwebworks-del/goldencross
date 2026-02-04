'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    parent_id?: string;
    order: number;
}

const defaultCategories: Category[] = [
    { id: '1', name: 'Modern Art', slug: 'modern', image: 'https://images.unsplash.com/photo-1549887552-93f8efb87228?auto=format&fit=crop&q=80&w=300', order: 0 },
    { id: '2', name: 'Nature', slug: 'nature', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=300', order: 1 },
    { id: '3', name: 'Doğa', slug: 'doga', image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800', order: 2 },
    { id: '4', name: 'Manzara', slug: 'manzara', parent_id: '3', order: 0 },
    { id: '5', name: 'Hayvanlar', slug: 'hayvanlar', parent_id: '3', order: 1 },
    { id: '6', name: 'Soyut Sanat', slug: 'soyut-sanat', parent_id: '2', order: 0 }
];

const STORAGE_KEY = 'goldenglass_categories';

interface CategoryContextType {
    categories: Category[];
    addCategory: (category: Omit<Category, 'id' | 'order'>) => Promise<void>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    reorderCategory: (id: string, direction: 'up' | 'down' | 'left' | 'right') => Promise<void>;
    isLoading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

function ensureOrder(cats: Category[]): Category[] {
    const grouped: Record<string, Category[]> = {};
    cats.forEach(c => {
        const key = c.parent_id || 'root';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(c);
    });

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchData<Category[]>(STORAGE_KEY, defaultCategories);
                const ordered = ensureOrder(data.length > 0 ? data : defaultCategories);
                setCategories(ordered);
                
                if (data.length === 0) {
                    await saveData(STORAGE_KEY, defaultCategories);
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                setCategories(defaultCategories);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadCategories();
    }, []);

    const persistCategories = useCallback(async (newCategories: Category[]) => {
        const ordered = ensureOrder(newCategories);
        setCategories(ordered);
        await saveData(STORAGE_KEY, ordered);
    }, []);

    const addCategory = async (categoryData: Omit<Category, 'id' | 'order'>) => {
        const siblings = categories.filter(c => c.parent_id === categoryData.parent_id);
        const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.order ?? 0)) + 1 : 0;
        const newCategory: Category = {
            ...categoryData,
            id: Date.now().toString(),
            order: maxOrder
        };
        await persistCategories([...categories, newCategory]);
    };

    const updateCategory = async (id: string, updates: Partial<Category>) => {
        const updatedCategories = categories.map(c => 
            c.id === id ? { ...c, ...updates } : c
        );
        await persistCategories(updatedCategories);
    };

    const deleteCategory = async (id: string) => {
        // Delete category and its children
        const idsToDelete = new Set([id]);
        categories.filter(c => c.parent_id === id).forEach(child => idsToDelete.add(child.id));
        const filteredCategories = categories.filter(c => !idsToDelete.has(c.id));
        await persistCategories(filteredCategories);
    };

    const reorderCategory = async (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
        const category = categories.find(c => c.id === id);
        if (!category) return;

        const isNext = direction === 'down' || direction === 'right';
        const siblings = categories
            .filter(c => c.parent_id === category.parent_id)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const currentIndex = siblings.findIndex(c => c.id === id);
        const targetIndex = isNext ? currentIndex + 1 : currentIndex - 1;

        if (targetIndex < 0 || targetIndex >= siblings.length) return;

        const currentCat = siblings[currentIndex];
        const targetCat = siblings[targetIndex];

        const updatedCategories = categories.map(c => {
            if (c.id === currentCat.id) return { ...c, order: targetIndex };
            if (c.id === targetCat.id) return { ...c, order: currentIndex };
            return c;
        });

        await persistCategories(updatedCategories);
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
