'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AdminUser {
    username: string;
    passwordHash: string; // We store a simple hash for demo purposes
    createdAt: string;
    lastLogin?: string;
}

interface AdminAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AdminUser | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    changePassword: (currentPassword: string, newPassword: string) => boolean;
    updateUsername: (newUsername: string, password: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Simple hash function for demo (in production use bcrypt or similar)
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

// Default admin credentials
const DEFAULT_ADMIN: AdminUser = {
    username: 'admin',
    passwordHash: simpleHash('admin123'), // Default password: admin123
    createdAt: new Date().toISOString()
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        // Check if user is authenticated (session)
        const session = localStorage.getItem('adminSession');
        const savedUser = localStorage.getItem('adminUser');

        if (!savedUser) {
            // First time - create default admin
            localStorage.setItem('adminUser', JSON.stringify(DEFAULT_ADMIN));
            setUser(DEFAULT_ADMIN);
        } else {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse admin user', e);
                setUser(DEFAULT_ADMIN);
            }
        }

        if (session) {
            const sessionData = JSON.parse(session);
            // Check if session is still valid (24 hour expiry)
            if (new Date().getTime() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('adminSession');
            }
        }

        setIsLoading(false);
    }, []);

    const login = (username: string, password: string): boolean => {
        const savedUser = localStorage.getItem('adminUser');
        if (!savedUser) return false;

        try {
            const adminUser: AdminUser = JSON.parse(savedUser);
            const passwordHash = simpleHash(password);

            if (adminUser.username === username && adminUser.passwordHash === passwordHash) {
                // Update last login
                adminUser.lastLogin = new Date().toISOString();
                localStorage.setItem('adminUser', JSON.stringify(adminUser));

                // Create session
                localStorage.setItem('adminSession', JSON.stringify({
                    timestamp: new Date().getTime(),
                    username: username
                }));

                setUser(adminUser);
                setIsAuthenticated(true);
                return true;
            }
        } catch (e) {
            console.error('Login error', e);
        }

        return false;
    };

    const logout = () => {
        localStorage.removeItem('adminSession');
        setIsAuthenticated(false);
    };

    const changePassword = (currentPassword: string, newPassword: string): boolean => {
        const savedUser = localStorage.getItem('adminUser');
        if (!savedUser) return false;

        try {
            const adminUser: AdminUser = JSON.parse(savedUser);
            const currentHash = simpleHash(currentPassword);

            if (adminUser.passwordHash === currentHash) {
                adminUser.passwordHash = simpleHash(newPassword);
                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                setUser(adminUser);
                return true;
            }
        } catch (e) {
            console.error('Password change error', e);
        }

        return false;
    };

    const updateUsername = (newUsername: string, password: string): boolean => {
        const savedUser = localStorage.getItem('adminUser');
        if (!savedUser) return false;

        try {
            const adminUser: AdminUser = JSON.parse(savedUser);
            const passwordHash = simpleHash(password);

            if (adminUser.passwordHash === passwordHash) {
                adminUser.username = newUsername;
                localStorage.setItem('adminUser', JSON.stringify(adminUser));
                setUser(adminUser);
                return true;
            }
        } catch (e) {
            console.error('Username update error', e);
        }

        return false;
    };

    return (
        <AdminAuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            user,
            login,
            logout,
            changePassword,
            updateUsername
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
