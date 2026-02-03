'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
    isRead: boolean;
}

const defaultMessages: Message[] = [
    {
        id: '1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        message: 'Merhaba, özel ölçü siparişi verebiliyor muyuz?',
        date: new Date().toISOString(),
        isRead: false
    }
];

interface MessageContextType {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'date' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    deleteMessage: (id: string) => void;
    unreadCount: number;
    isLoading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>(defaultMessages);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('messages');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse messages', e);
            }
        }
        setIsLoading(false);
    }, []);

    const saveMessages = (newMessages: Message[]) => {
        setMessages(newMessages);
        localStorage.setItem('messages', JSON.stringify(newMessages));
    };

    const addMessage = (messageData: Omit<Message, 'id' | 'date' | 'isRead'>) => {
        const newMessage: Message = {
            ...messageData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
            isRead: false
        };
        saveMessages([newMessage, ...messages]);
    };

    const markAsRead = (id: string) => {
        const newMessages = messages.map(msg =>
            msg.id === id ? { ...msg, isRead: true } : msg
        );
        saveMessages(newMessages);
    };

    const deleteMessage = (id: string) => {
        const newMessages = messages.filter(msg => msg.id !== id);
        saveMessages(newMessages);
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
