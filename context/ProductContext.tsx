'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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

    useEffect(() => {
        const productsRef = collection(db, 'products');

        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
            if (snapshot.empty) {
                // Initialize with default products if collection is empty
                defaultProducts.forEach(async (product) => {
                    const { id, ...productData } = product;
                    await addDoc(productsRef, { ...productData, originalId: id });
                });
                setProducts(defaultProducts);
            } else {
                const productsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(productsData);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching products:', error);
            setProducts(defaultProducts);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            await addDoc(collection(db, 'products'), productData);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updates);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const productRef = doc(db, 'products', id);
            await deleteDoc(productRef);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const getProduct = (id: string) => products.find(p => p.id === id);

    const getProductsByCategory = (categorySlug: string) =>
        products.filter(p => p.category === categorySlug);

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
