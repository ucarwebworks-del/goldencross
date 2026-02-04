'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { fetchData, saveData } from '@/lib/dataService';

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

const STORAGE_KEY = 'goldenglass_messages';

export function MessageProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await fetchData<Message[]>(STORAGE_KEY, []);
                const sorted = [...data].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setMessages(sorted);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, []);

    const persistMessages = useCallback(async (newMessages: Message[]) => {
        const sorted = [...newMessages].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMessages(sorted);
        await saveData(STORAGE_KEY, sorted);
    }, []);

    const addMessage = async (messageData: Omit<Message, 'id' | 'date' | 'isRead'>) => {
        const newMessage: Message = {
            ...messageData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            isRead: false
        };
        await persistMessages([...messages, newMessage]);
    };

    const markAsRead = async (id: string) => {
        const updatedMessages = messages.map(m =>
            m.id === id ? { ...m, isRead: true } : m
        );
        await persistMessages(updatedMessages);
    };

    const deleteMessage = async (id: string) => {
        const filteredMessages = messages.filter(m => m.id !== id);
        await persistMessages(filteredMessages);
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
