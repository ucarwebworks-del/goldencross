'use client';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useBlog } from '@/context/BlogContext';

export default function Footer() {
    const { settings } = useSettings();
    const { blogEnabled } = useBlog();

    return (
        <footer className="bg-primary text-white pt-16 pb-8 border-t border-white/10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold mb-4">{settings.siteTitle}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {settings.description}
                        </p>
                        <div className="flex gap-4">
                            {settings.instagramActive && (
                                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            )}
                            {settings.facebookActive && (
                                <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            )}
                            {settings.twitterActive && (
                                <a href={`https://twitter.com/${settings.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-200">Mağaza</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">Tüm Ürünler</Link></li>
                            <li><Link href="/collections/new" className="hover:text-white transition-colors">Yeni Gelenler</Link></li>
                            <li><Link href="/order-track" className="hover:text-white transition-colors">Sipariş Takibi</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-200">Kurumsal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">İletişim</Link></li>
                            {blogEnabled && (
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            )}
                        </ul>
                    </div>

                    {/* Legal / Contact */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-gray-200">Yasal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/legal/terms-of-service" className="hover:text-white transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Çerez Politikası</Link></li>
                            <li><Link href="/legal/return-policy" className="hover:text-white transition-colors">İade Politikası</Link></li>
                            <li><Link href="/legal/kvkk" className="hover:text-white transition-colors">KVKK</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p>© 2026 {settings.siteTitle}. Tüm hakları saklıdır. ETBIS Doğrulanmış.</p>
                        <span className="hidden md:inline">•</span>
                        <a href="https://www.srndijital.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            Designed by <span className="font-medium">SRN Dijital</span>
                        </a>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        {/* Payment Icons Placeholder */}
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>Troy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
