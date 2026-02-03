'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    status: 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal';
    date: string;
    shippingCost?: number;
    couponCode?: string;
    couponDiscount?: number;
    note?: string;
}

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status'> & { orderNumber?: string }) => Order;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    getOrder: (id: string) => Order | undefined;
    isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('orders');
        if (saved) {
            try {
                setOrders(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse orders', e);
            }
        }
        setIsLoading(false);
    }, []);

    const saveOrders = (newOrders: Order[]) => {
        setOrders(newOrders);
        localStorage.setItem('orders', JSON.stringify(newOrders));
    };

    const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'> & { orderNumber?: string }) => {
        const orderNum = orderData.orderNumber || `GG-${Date.now()}`;
        const newOrder: Order = {
            ...orderData,
            id: orderNum,
            orderNumber: orderNum,
            date: new Date().toLocaleString('tr-TR'),
            status: 'Hazırlanıyor'
        };
        saveOrders([newOrder, ...orders]);
        return newOrder;
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        const newOrders = orders.map(o =>
            o.id === id ? { ...o, status } : o
        );
        saveOrders(newOrders);
    };

    const getOrder = (id: string) => orders.find(o => o.id === id);

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrder, isLoading }}>
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
