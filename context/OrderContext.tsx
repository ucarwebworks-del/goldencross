'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
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
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status'> & { orderNumber?: string }) => Promise<Order>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    getOrder: (id: string) => Order | undefined;
    isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const ordersRef = collection(db, 'orders');

        const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            // Sort by date descending
            ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(ordersData);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching orders:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'> & { orderNumber?: string }): Promise<Order> => {
        const orderNum = orderData.orderNumber || `GG-${Date.now()}`;
        const newOrderData = {
            ...orderData,
            orderNumber: orderNum,
            date: new Date().toLocaleString('tr-TR'),
            status: 'Hazırlanıyor' as const
        };

        try {
            const docRef = await addDoc(collection(db, 'orders'), newOrderData);
            const newOrder: Order = {
                ...newOrderData,
                id: docRef.id
            };
            return newOrder;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            const orderRef = doc(db, 'orders', id);
            await updateDoc(orderRef, { status });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getOrder = (id: string) => orders.find(o => o.id === id || o.orderNumber === id);

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
