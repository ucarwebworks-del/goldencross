'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './ProductContext';

export interface CartItem extends Product {
    quantity: number;
    selectedFormat?: string; // e.g. "50x70"
    selectedFrame?: string;  // e.g. "Black"
    variant?: string; // For backward compatibility if needed, or constructed from format/frame
    customerImage?: string; // Müşteri yüklediği fotoğraf
    customerNote?: string;  // Müşteri notu
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number, format?: string, frame?: string, customerImage?: string, customerNote?: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    subtotal: number; // Alias for cartTotal
    itemCount: number;
    isOpen: boolean;    // Match Header usage
    openCart: () => void; // Match Header usage
    closeCart: () => void; // Match Header usage
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Persist cart
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: Product, quantity: number, format?: string, frame?: string, customerImage?: string, customerNote?: string) => {
        setItems(prev => {
            // Check if item exists with same options
            const existing = prev.find(item =>
                item.id === product.id &&
                item.selectedFormat === format &&
                item.selectedFrame === frame &&
                item.customerImage === customerImage &&
                item.customerNote === customerNote
            );

            if (existing) {
                return prev.map(item =>
                    item === existing
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, {
                ...product,
                quantity,
                selectedFormat: format,
                selectedFrame: frame,
                customerImage,
                customerNote,
                variant: `${format}, ${frame}`
            }];
        });
        setIsOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const clearCart = () => setItems([]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen(!isOpen);

    // Calculate Total
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            subtotal: cartTotal,
            itemCount,
            isOpen,
            openCart,
            closeCart,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
