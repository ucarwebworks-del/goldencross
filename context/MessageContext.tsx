'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
    isRead: boolean;
}

interface MessageContextType {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'date' | 'isRead'>) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    unreadCount: number;
    isLoading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const messagesRef = collection(db, 'messages');

        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            // Sort by date descending
            messagesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setMessages(messagesData);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching messages:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addMessage = async (messageData: Omit<Message, 'id' | 'date' | 'isRead'>) => {
        try {
            await addDoc(collection(db, 'messages'), {
                ...messageData,
                date: new Date().toISOString(),
                isRead: false
            });
        } catch (error) {
            console.error('Error adding message:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const messageRef = doc(db, 'messages', id);
            await updateDoc(messageRef, { isRead: true });
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const messageRef = doc(db, 'messages', id);
            await deleteDoc(messageRef);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <MessageContext.Provider value={{ messages, addMessage, markAsRead, deleteMessage, unreadCount, isLoading }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessages() {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
}
