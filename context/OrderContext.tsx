'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';
import { CartItem } from './CartContext';

export interface Order {
    id: string;
    orderNumber: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    };
    items: CartItem[];
    total: number;
    paymentMethod: 'Credit Card' | 'Bank Transfer';
    status: 'Beklemede' | 'Onaylandı' | 'Hazırlanıyor' | 'Kargoya Verildi' | 'Teslim Edildi' | 'İptal Edildi';
    date: string;
    createdAt: string;
    shippingCost?: number;
    couponCode?: string;
    couponDiscount?: number;
    note?: string;
    trackingNumber?: string;
}

const STORAGE_KEY = 'goldenglass_orders';

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'createdAt'> & { orderNumber?: string }) => Promise<Order>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
    getOrder: (id: string) => Order | undefined;
    isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchData<Order[]>(STORAGE_KEY, []);
                // Sort by date descending
                const sorted = [...data].sort((a, b) => 
                    new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
                );
                setOrders(sorted);
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadOrders();
    }, []);

    const persistOrders = useCallback(async (newOrders: Order[]) => {
        setOrders(newOrders);
        await saveData(STORAGE_KEY, newOrders);
    }, []);

    const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status' | 'createdAt'> & { orderNumber?: string }): Promise<Order> => {
        const orderNum = orderData.orderNumber || `GG-${Date.now()}`;
        const now = new Date();
        const newOrder: Order = {
            ...orderData,
            id: Date.now().toString(),
            orderNumber: orderNum,
            date: now.toLocaleString('tr-TR'),
            createdAt: now.toISOString(),
            status: 'Beklemede'
        };

        await persistOrders([newOrder, ...orders]);
        return newOrder;
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        const updatedOrders = orders.map(o => 
            o.id === id ? { ...o, status } : o
        );
        await persistOrders(updatedOrders);
    };

    const updateOrder = async (id: string, updates: Partial<Order>) => {
        const updatedOrders = orders.map(o => 
            o.id === id ? { ...o, ...updates } : o
        );
        await persistOrders(updatedOrders);
    };

    const getOrder = (id: string) => orders.find(o => o.id === id || o.orderNumber === id);

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateOrder, getOrder, isLoading }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
