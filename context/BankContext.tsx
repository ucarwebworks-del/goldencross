'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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
    addAccount: (account: Omit<BankAccount, 'id'>) => Promise<void>;
    updateAccount: (id: string, updates: Partial<BankAccount>) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;
    isLoading: boolean;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const banksRef = collection(db, 'banks');

        const unsubscribe = onSnapshot(banksRef, (snapshot) => {
            if (snapshot.empty) {
                defaultAccounts.forEach(async (account) => {
                    const { id, ...accountData } = account;
                    await addDoc(banksRef, accountData);
                });
                setAccounts(defaultAccounts);
            } else {
                const accountsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as BankAccount[];
                setAccounts(accountsData);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching bank accounts:', error);
            setAccounts(defaultAccounts);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addAccount = async (accountData: Omit<BankAccount, 'id'>) => {
        try {
            await addDoc(collection(db, 'banks'), accountData);
        } catch (error) {
            console.error('Error adding bank account:', error);
        }
    };

    const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
        try {
            const bankRef = doc(db, 'banks', id);
            await updateDoc(bankRef, updates);
        } catch (error) {
            console.error('Error updating bank account:', error);
        }
    };

    const deleteAccount = async (id: string) => {
        try {
            const bankRef = doc(db, 'banks', id);
            await deleteDoc(bankRef);
        } catch (error) {
            console.error('Error deleting bank account:', error);
        }
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
