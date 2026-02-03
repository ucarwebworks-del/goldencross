'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TABS_DATA = [
    { id: 'desc', label: 'Ürün Açıklaması' },
    { id: 'tech', label: 'Teknik Özellikler' },
    { id: 'ship', label: 'Teslimat & İade' },
];

export default function ProductTabs({ description, technicalSpecs }: { description?: string, technicalSpecs?: string }) {
    const [active, setActive] = useState('desc');
    const [mobileOpen, setMobileOpen] = useState<string | null>('desc');

    const getContent = (id: string) => {
        switch (id) {
            case 'desc':
                return <div className="space-y-4 whitespace-pre-line">{description || 'Ürün açıklaması bulunmuyor.'}</div>;
            case 'tech':
                return <div className="space-y-2 whitespace-pre-line">{technicalSpecs || 'Teknik özellik bilgisi bulunmuyor.'}</div>;
            case 'ship':
                return (
                    <div className="space-y-4">
                        <p className="font-bold text-white">Kargo Süreci</p>
                        <p>Siparişleriniz özel korumalı ambalajlarda gönderilir. Kargoda oluşabilecek herhangi bir hasara karşı %100 sigortalıdır. Kırık gelmesi durumunda sorgusuz sualsiz yenisi gönderilir.</p>
                        <p className="font-bold text-white mt-4">İade Koşulları</p>
                        <p>Standart ölçüdeki ürünleri 14 gün içinde iade edebilirsiniz. Kişiye özel üretilen ("Özel Ölçü" veya "Kendi Görselini Yükle") siparişlerde iade kabul edilmemektedir.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-12 sm:mt-20">
            {/* Desktop: Horizontal Tabs */}
            <div className="hidden sm:block">
                <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
                    {TABS_DATA.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`px-8 py-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${active === tab.id ? 'border-[#00E676] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="py-8 text-gray-400 leading-loose max-w-4xl">
                    {getContent(active)}
                </div>
            </div>

            {/* Mobile: Accordion */}
            <div className="sm:hidden space-y-3">
                {TABS_DATA.map(tab => (
                    <div key={tab.id} className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
                        <button
                            onClick={() => setMobileOpen(mobileOpen === tab.id ? null : tab.id)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <span className="font-bold text-white">{tab.label}</span>
                            <ChevronDown
                                size={20}
                                className={`text-gray-400 transition-transform ${mobileOpen === tab.id ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {mobileOpen === tab.id && (
                            <div className="px-4 pb-4 text-gray-400 leading-relaxed text-sm">
                                {getContent(tab.id)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
