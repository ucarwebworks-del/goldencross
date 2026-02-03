'use client';
import Link from 'next/link';
import { FileText, Image, Layout, Settings } from 'lucide-react';

export default function CMSPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">İçerik Yönetim Sistemi (CMS)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pages */}
                <Link href="/admin/cms/pages" className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Layout size={24} />
                    </div>
                    <h2 className="font-bold text-xl mb-2 group-hover:text-purple-600 transition-colors">Sayfa Yönetimi</h2>
                    <p className="text-gray-500">Hakkımızda, Gizlilik ve diğer içerik sayfalarını düzenleyin.</p>
                </Link>

                {/* Banners */}
                <Link href="/admin/cms/banners" className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Image size={24} />
                    </div>
                    <h2 className="font-bold text-xl mb-2 group-hover:text-green-600 transition-colors">Banner & Görseller</h2>
                    <p className="text-gray-500">Slider ve kampanya görsellerini yönetin.</p>
                </Link>
            </div>
        </div>
    );
}
