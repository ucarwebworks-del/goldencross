'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BankAccount {
    id: string;
    bankName: string;
    accountHolder: string;
    iban: string;
    branchCode?: string;
    accountNumber?: string;
    isActive: boolean;
}

const defaultAccounts: BankAccount[] = [
    {
        id: '1',
        bankName: 'Garanti BBVA',
        accountHolder: 'Golden Glass 777 Ltd. Şti.',
        iban: 'TR00 0000 0000 0000 0000 0000 00',
        isActive: true
    }
];

interface BankContextType {
    accounts: BankAccount[];
    addAccount: (account: Omit<BankAccount, 'id'>) => void;
    updateAccount: (id: string, updates: Partial<BankAccount>) => void;
    deleteAccount: (id: string) => void;
    isLoading: boolean;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<BankAccount[]>(defaultAccounts);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('bankAccounts');
        if (saved) {
            try {
                setAccounts(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse bank accounts', e);
            }
        }
        setIsLoading(false);
    }, []);

    const saveAccounts = (newAccounts: BankAccount[]) => {
        setAccounts(newAccounts);
        localStorage.setItem('bankAccounts', JSON.stringify(newAccounts));
    };

    const addAccount = (accountData: Omit<BankAccount, 'id'>) => {
        const newAccount: BankAccount = {
            ...accountData,
            id: Date.now().toString(),
        };
        saveAccounts([...accounts, newAccount]);
    };

    const updateAccount = (id: string, updates: Partial<BankAccount>) => {
        const newAccounts = accounts.map(acc =>
            acc.id === id ? { ...acc, ...updates } : acc
        );
        saveAccounts(newAccounts);
    };

    const deleteAccount = (id: string) => {
        const newAccounts = accounts.filter(acc => acc.id !== id);
        saveAccounts(newAccounts);
    };

    return (
        <BankContext.Provider value={{ accounts, addAccount, updateAccount, deleteAccount, isLoading }}>
            {children}
        </BankContext.Provider>
    );
}

export function useBankAccounts() {
    const context = useContext(BankContext);
    if (context === undefined) {
        throw new Error('useBankAccounts must be used within a BankProvider');
    }
    return context;
}
