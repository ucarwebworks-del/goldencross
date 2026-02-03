'use client';
import Sidebar from '@/components/admin/Sidebar';
import AdminLoginPage from '@/components/admin/AdminLoginPage';
import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import '../../globals.css';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAdminAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLoginPage />;
    }

    return (
        <ConfirmDialogProvider>
            <div className="flex min-h-screen bg-gray-50 text-gray-900" style={{
                '--primary': '#ffffff',
                '--text-primary': '#111111',
                '--text-secondary': '#6b7280',
                '--bg-primary': '#f9fafb',
                '--input-bg': '#ffffff',
                '--border-color': '#e5e7eb'
            } as React.CSSProperties}>
                <Sidebar />
                <div className="flex-1 flex flex-col lg:ml-64">
                    {/* Top Header */}
                    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                        <h2 className="font-semibold text-gray-700 ml-12 lg:ml-0">Dashboard</h2>
                        <div className="flex items-center gap-2 lg:gap-4">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user?.username?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">{user?.username || 'Admin'}</span>
                        </div>
                    </header>
                    <main className="p-4 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ConfirmDialogProvider>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthProvider>
    );
}
