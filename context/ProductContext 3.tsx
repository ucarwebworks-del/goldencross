'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    oldPrice?: number;
    stock: number;
    category: string;
    description: string;
    images: string[];
    status: 'Active' | 'Draft' | 'OutOfStock';
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    isActive?: boolean;
    note?: string;
    allowCustomerUpload?: boolean;
    allowCustomerNote?: boolean;
    technicalSpecs?: string;
    options?: ProductOption[];
}

export interface ProductOptionValue {
    value: string;
    priceDiff: number;
}

export interface ProductOption {
    id: string;
    name: string;
    values: ProductOptionValue[];
}

const defaultProducts: Product[] = [
    {
        id: '1',
        name: 'Cosmic Dreams Glass Art',
        sku: 'GL-8832',
        stock: 12,
        price: 1250,
        oldPrice: 1500,
        status: 'Active',
        category: 'soyut',
        description: 'Uzay temalı modern cam tablo. UV baskı teknolojisi ile üretilmiştir.',
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb39279c78?w=800'],
        isNew: true,
        options: [
            {
                id: 'opt1',
                name: 'Ölçü',
                values: [
                    { value: '30x40', priceDiff: 0 },
                    { value: '50x70', priceDiff: 200 },
                    { value: '70x100', priceDiff: 500 }
                ]
            }
        ],
        technicalSpecs: 'Malzeme: 4mm Temperli Cam\nBaskı: UV Baskı (Tersten)\nMontaj: Çelik Asma Aparatı\nKenar: Rodajlı Güvenli Kesim',
    },
    {
        id: '2',
        name: 'Golden Waves Abstract',
        sku: 'GL-9921',
        stock: 5,
        price: 2100,
        status: 'Active',
        category: 'modern',
        description: 'Altın dalgalar soyut tasarım.',
        images: ['https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800'],
        isBestseller: true,
        options: []
    },
    {
        id: '3',
        name: 'Nature Harmony Set',
        sku: 'GL-1120',
        stock: 8,
        price: 850,
        status: 'Active',
        category: 'doga',
        description: 'Doğa temalı üçlü set.',
        images: ['https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800']
    },
    {
        id: '4',
        name: 'Islamic Calligraphy',
        sku: 'GL-3342',
        stock: 2,
        price: 3500,
        status: 'Active',
        category: 'islami',
        description: 'Hat sanatı özel koleksiyon.',
        images: ['https://images.unsplash.com/photo-1584553181813-25c282650059?w=800']
    },
];

const STORAGE_KEY = 'goldenglass_products';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;
    getProductsByCategory: (categorySlug: string) => Product[];
    isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load products from Redis/localStorage
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchData<Product[]>(STORAGE_KEY, defaultProducts);
                setProducts(data.length > 0 ? data : defaultProducts);
                
                // Initialize with defaults if empty
                if (data.length === 0) {
                    await saveData(STORAGE_KEY, defaultProducts);
                }
            } catch (error) {
                console.error('Error loading products:', error);
                setProducts(defaultProducts);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadProducts();
    }, []);

    // Save products whenever they change
    const persistProducts = useCallback(async (newProducts: Product[]) => {
        setProducts(newProducts);
        await saveData(STORAGE_KEY, newProducts);
    }, []);

    const addProduct = async (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...productData,
            id: Date.now().toString(),
        };
        await persistProducts([...products, newProduct]);
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        const updatedProducts = products.map(p => 
            p.id === id ? { ...p, ...updates } : p
        );
        await persistProducts(updatedProducts);
    };

    const deleteProduct = async (id: string) => {
        const filteredProducts = products.filter(p => p.id !== id);
        await persistProducts(filteredProducts);
    };

    const getProduct = (id: string) => products.find(p => p.id === id);

    const getProductsByCategory = (categorySlug: string) =>
        products.filter(p => p.category === categorySlug && p.status === 'Active');

    return (
        <ProductContext.Provider value={{
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            getProduct,
            getProductsByCategory,
            isLoading
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
