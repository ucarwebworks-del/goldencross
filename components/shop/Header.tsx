'use client';
import Link from 'next/link';
import { Search, ShoppingBag, User, Heart, Menu as MenuIcon, ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { useCategories } from '@/context/CategoryContext';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
    const { openCart, items } = useCart();
    const { settings } = useSettings();
    const { categories } = useCategories();
    const { blogEnabled } = useBlog();
    const { user } = useAuth();


    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileCollectionsOpen(false);
    };

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#111111]/90 backdrop-blur-md shadow-sm border-b border-white/5' : 'bg-[#111111] border-b border-white/10'}`}>
                {/* Announcement Bar */}
                {settings.announcementBarActive !== false && settings.announcementBarText && (
                    <div className="bg-[#1a1a1a] text-white text-xs py-2 text-center font-medium tracking-wide border-b border-white/5">
                        {settings.announcementBarText}
                    </div>
                )}

                <div className="container h-16 lg:h-20 flex items-center justify-between">
                    {/* Mobile Menu & Search - Left */}
                    <div className="flex items-center gap-2 lg:gap-4 flex-1">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-full text-white"
                        >
                            <MenuIcon size={24} />
                        </button>
                        <div className="hidden lg:flex items-center bg-[#1a1a1a] rounded-full px-4 py-2 w-64 ring-1 ring-white/10 focus-within:ring-white/20 transition-all">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Tablo ara..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500 text-white"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/search?q=${e.currentTarget.value}`;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Logo - Center */}
                    <div className="flex-1 text-center flex justify-center">
                        <Link href="/" className="inline-block relative">
                            {settings.logo ? (
                                <img
                                    src={settings.logo}
                                    alt={settings.siteTitle}
                                    className="h-10 lg:h-12 w-auto object-contain"
                                />
                            ) : (
                                <span className="text-xl lg:text-2xl font-bold tracking-tight text-white">{settings.siteTitle}</span>
                            )}
                        </Link>
                    </div>

                    {/* Actions - Right */}
                    <div className="flex items-center justify-end gap-1 lg:gap-2 flex-1 text-white">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
                            <Heart size={22} strokeWidth={1.5} />
                        </button>
                        <Link href={user ? "/account" : "/login"} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:flex items-center gap-2">
                            <User size={22} strokeWidth={1.5} />
                            {user && <span className="text-sm font-medium hidden md:block">{user.displayName?.split(' ')[0] || 'Hesabım'}</span>}
                        </Link>
                        <div className="relative">
                            <button
                                onClick={openCart}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
                            >
                                <ShoppingBag size={22} strokeWidth={1.5} />
                            </button>
                            {items.length > 0 && (
                                <span className="absolute top-0 right-0 bg-accent text-primary text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation - Bottom (Desktop) */}
                <nav className="hidden lg:flex justify-center border-t border-white/10 py-3">
                    <ul className="flex gap-8 text-sm font-medium uppercase tracking-wide text-gray-300 items-center">
                        <li><Link href="/" className="hover:text-white transition-colors block py-2">Anasayfa</Link></li>
                        <li className="group relative">
                            <button className="hover:text-white transition-colors flex items-center gap-1 py-2">
                                Koleksiyonlar <ChevronDown size={16} />
                            </button>
                            {/* Dynamic Mega Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-[#1a1a1a] shadow-xl rounded-2xl border border-white/10 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-40">
                                <div className="grid grid-cols-4 gap-8">
                                    {categories.filter(c => !c.parent_id).map(parent => {
                                        const children = categories.filter(c => c.parent_id === parent.id);
                                        return (
                                            <div key={parent.id}>
                                                <Link href={`/collections/${parent.slug}`} className="font-bold mb-4 block hover:text-accent flex items-center gap-2 text-white">
                                                    {parent.image && <img src={parent.image} alt={parent.name} className="w-6 h-6 rounded object-cover" />}
                                                    {parent.name}
                                                </Link>

                                                {children.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {children.map(child => (
                                                            <li key={child.id}>
                                                                <Link href={`/collections/${child.slug}`} className="text-gray-400 hover:text-white text-sm block">
                                                                    {child.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-gray-500">Alt kategori yok</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                    <Link href="/products" className="inline-flex items-center gap-2 font-bold text-sm text-white hover:text-accent transition-colors">
                                        Tüm Ürünleri İncele →
                                    </Link>
                                </div>
                            </div>
                        </li>
                        <li><Link href="/collections/new" className="hover:text-white transition-colors block py-2">Yeni Gelenler</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors block py-2">Neden Biz?</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors block py-2">İletişim</Link></li>
                        <li><Link href="/order-track" className="hover:text-white transition-colors block py-2">Sipariş Takibi</Link></li>
                        {blogEnabled && (
                            <li><Link href="/blog" className="hover:text-white transition-colors block py-2">Blog</Link></li>
                        )}
                    </ul>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={closeMobileMenu} />
            )}

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#111111] z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <span className="text-lg font-bold text-white">{settings.siteTitle}</span>
                        <button onClick={closeMobileMenu} className="p-2 text-white hover:bg-white/10 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center bg-white/5 rounded-full px-4 py-3 ring-1 ring-white/10">
                            <Search size={18} className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500 text-white"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        closeMobileMenu();
                                        window.location.href = `/search?q=${e.currentTarget.value}`;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-4">
                            <li>
                                <Link href="/" onClick={closeMobileMenu} className="block py-3 text-white font-medium hover:text-accent transition-colors">
                                    Anasayfa
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                                    className="w-full flex items-center justify-between py-3 text-white font-medium hover:text-accent transition-colors"
                                >
                                    Koleksiyonlar
                                    <ChevronDown size={20} className={`transition-transform ${mobileCollectionsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileCollectionsOpen && (
                                    <ul className="pl-4 space-y-1 pb-2">
                                        {categories.filter(c => !c.parent_id).map(cat => (
                                            <li key={cat.id}>
                                                <Link
                                                    href={`/collections/${cat.slug}`}
                                                    onClick={closeMobileMenu}
                                                    className="block py-2 text-gray-400 hover:text-white transition-colors text-sm"
                                                >
                                                    {cat.name}
                                                </Link>
                                            </li>
                                        ))}
                                        <li>
                                            <Link
                                                href="/products"
                                                onClick={closeMobileMenu}
                                                className="block py-2 text-accent font-medium text-sm"
                                            >
                                                Tüm Ürünler →
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <Link href="/collections/new" onClick={closeMobileMenu} className="block py-3 text-white font-medium hover:text-accent transition-colors">
                                    Yeni Gelenler
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" onClick={closeMobileMenu} className="block py-3 text-white font-medium hover:text-accent transition-colors">
                                    Neden Biz?
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" onClick={closeMobileMenu} className="block py-3 text-white font-medium hover:text-accent transition-colors">
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link href="/order-track" onClick={closeMobileMenu} className="block py-3 text-white font-medium hover:text-accent transition-colors">
                                    Sipariş Takibi
                                </Link>
                            </li>
                            {blogEnabled && (
                                <li>
                                    <Link href="/blog" onClick={closeMobileMenu} className="block py-3 text-white font-medium hover:text-accent transition-colors">
                                        Blog
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex gap-4">
                            <Link href="/favorites" onClick={closeMobileMenu} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors">
                                <Heart size={18} /> Favoriler
                            </Link>
                            <Link href="/account" onClick={closeMobileMenu} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors">
                                <User size={18} /> Hesap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
