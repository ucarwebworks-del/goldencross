'use client';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundClient() {
    return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-[120px] sm:text-[150px] font-bold text-white/5 leading-none select-none">404</h1>
                </div>

                {/* Content */}
                <div className="relative -mt-16 sm:-mt-20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Sayfa Bulunamadı</h2>
                    <p className="text-gray-400 mb-8">
                        Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00E676] text-black font-bold rounded-xl hover:bg-[#00c853] transition-colors"
                        >
                            <Home size={20} />
                            Anasayfa
                        </Link>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <Search size={20} />
                            Ürünlere Göz At
                        </Link>
                    </div>

                    {/* Back Link */}
                    <button
                        onClick={() => typeof window !== 'undefined' && window.history.back()}
                        className="inline-flex items-center gap-2 mt-8 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Önceki Sayfaya Dön
                    </button>
                </div>
            </div>
        </div>
    );
}
