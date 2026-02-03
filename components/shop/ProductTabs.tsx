'use client';
import { useState } from 'react';

const TABS = [
    { id: 'desc', label: 'Ürün Açıklaması' },
    { id: 'tech', label: 'Teknik Özellikler' },
    { id: 'ship', label: 'Teslimat & İade' },
];

export default function ProductTabs({ description, technicalSpecs }: { description?: string, technicalSpecs?: string }) {
    const [active, setActive] = useState('desc');

    return (
        <div className="mt-20">
            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActive(tab.id)}
                        className={`px-8 py-4 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${active === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="py-8 text-gray-600 leading-loose max-w-4xl">
                {active === 'desc' && (
                    <div className="space-y-4 whitespace-pre-line">
                        {description || 'Ürün açıklaması bulunmuyor.'}
                    </div>
                )}
                {active === 'tech' && (
                    <div className="space-y-2 whitespace-pre-line">
                        {technicalSpecs || 'Teknik özellik bilgisi bulunmuyor.'}
                    </div>
                )}
                {active === 'ship' && (
                    <div className="space-y-4">
                        <p className="font-bold text-black">Kargo Süreci</p>
                        <p>Siparişleriniz özel korumalı ambalajlarda gönderilir. Kargoda oluşabilecek herhangi bir hasara karşı %100 sigortalıdır. Kırık gelmesi durumunda sorgusuz sualsiz yenisi gönderilir.</p>
                        <p className="font-bold text-black mt-4">İade Koşulları</p>
                        <p>Standart ölçüdeki ürünleri 14 gün içinde iade edebilirsiniz. Kişiye özel üretilen ("Özel Ölçü" veya "Kendi Görselini Yükle") siparişlerde iade kabul edilmemektedir.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
