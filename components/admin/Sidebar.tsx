'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, ShoppingCart, Package, Layers, Tag, Truck,
    Image, BookOpen, FileText, Phone, Settings, Store, MessageCircle, Mail, Info, Banknote, UserCog,
    Menu, X
} from 'lucide-react';

// Menüler gruplandırılmış
const MENU_GROUPS = [
    {
        title: 'Genel',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
            { name: 'Siparişler', icon: ShoppingCart, href: '/admin/orders' },
            { name: 'Mesajlar', icon: Mail, href: '/admin/inbox' },
        ]
    },
    {
        title: 'Ürün Yönetimi',
        items: [
            { name: 'Ürünler', icon: Package, href: '/admin/products' },
            { name: 'Kategoriler', icon: Layers, href: '/admin/categories' },
            { name: 'Yorumlar', icon: MessageCircle, href: '/admin/reviews' },
        ]
    },
    {
        title: 'Satış & Pazarlama',
        items: [
            { name: 'Kuponlar', icon: Tag, href: '/admin/coupons' },
            { name: 'Kargo', icon: Truck, href: '/admin/shipping' },
            { name: 'Havale/EFT', icon: Banknote, href: '/admin/bank-transfer' },
            { name: 'Bannerlar', icon: Image, href: '/admin/cms/banners' },
        ]
    },
    {
        title: 'İçerik',
        items: [
            { name: 'Blog', icon: BookOpen, href: '/admin/blog' },
            { name: 'Sayfalar', icon: FileText, href: '/admin/cms/pages' },
            { name: 'Hakkımızda', icon: Info, href: '/admin/about' },
        ]
    },
    {
        title: 'Ayarlar',
        items: [
            { name: 'Mağaza', icon: Store, href: '/admin/contact' },
            { name: 'Genel Ayarlar', icon: Settings, href: '/admin/settings' },
            { name: 'Kullanıcı Ayarları', icon: UserCog, href: '/admin/user-settings' },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-900 text-white fixed inset-y-0 left-0 z-40 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-wide">
                        glass<span className="text-amber-400">panel</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    {MENU_GROUPS.map((group, idx) => (
                        <div key={group.title} className={idx > 0 ? 'mt-6' : ''}>
                            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                {group.title}
                            </p>
                            <div className="space-y-0.5">
                                {group.items.map(item => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/admin' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeSidebar}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-slate-800">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-medium text-slate-300">Sistem Aktif</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
