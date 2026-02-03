'use client';
import { Save, Truck, Package, MapPin, Ban } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ShippingSettings() {
    const { settings, updateSettings, isLoading } = useSettings();
    const [formData, setFormData] = useState({
        shippingCost: settings.shippingCost || 49,
        freeShippingLimit: settings.freeShippingLimit || 1000
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setFormData({
                shippingCost: settings.shippingCost || 49,
                freeShippingLimit: settings.freeShippingLimit || 1000
            });
        }
    }, [settings, isLoading]);

    const handleSave = () => {
        setIsSaving(true);
        updateSettings(formData);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Kargo ayarları güncellendi!');
        }, 500);
    };

    if (isLoading) return <div className="p-6">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Kargo Ayarları</h1>
                    <p className="text-gray-500 text-sm mt-1">Kargo ücretlendirme ve teslimat ayarları</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                    <Save size={18} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Kargo Ücretlendirme */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Truck size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Kargo Ücretlendirme</h2>
                            <p className="text-sm text-gray-500">Standart kargo ücreti ve ücretsiz kargo limiti</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl">
                            <label className="block text-sm font-bold mb-3 text-blue-900">Standart Kargo Ücreti</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.shippingCost}
                                    onChange={(e) => setFormData({ ...formData, shippingCost: Number(e.target.value) })}
                                    className="w-full p-4 bg-white border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-2xl font-bold text-center"
                                    min="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">TL</span>
                            </div>
                            <p className="text-xs text-blue-700 mt-2 text-center">Her sipariş için uygulanır</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl">
                            <label className="block text-sm font-bold mb-3 text-green-900">Ücretsiz Kargo Limiti</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.freeShippingLimit}
                                    onChange={(e) => setFormData({ ...formData, freeShippingLimit: Number(e.target.value) })}
                                    className="w-full p-4 bg-white border border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none text-2xl font-bold text-center"
                                    min="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">TL</span>
                            </div>
                            <p className="text-xs text-green-700 mt-2 text-center">Bu tutarın üzeri ücretsiz kargo</p>
                        </div>
                    </div>
                </section>

                {/* Bilgi Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Package size={20} className="text-orange-600" />
                            </div>
                            <h3 className="font-bold">Nasıl Çalışır?</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Sepet tutarı ücretsiz kargo limitinin altındaysa, standart kargo ücreti eklenir.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <MapPin size={20} className="text-purple-600" />
                            </div>
                            <h3 className="font-bold">Teslimat Süresi</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Ortalama teslimat süresi 1-3 iş günüdür. Büyük şehirlerde aynı gün teslimat mümkündür.
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <Ban size={20} className="text-red-600" />
                            </div>
                            <h3 className="font-bold">Kısıtlamalar</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Şu an için yurt içi teslimat yapılmaktadır. Yurt dışı teslimat için iletişime geçin.
                        </p>
                    </div>
                </div>

                {/* Preview */}
                <section className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl text-white">
                    <h3 className="font-bold mb-4">Müşteri Görünümü Önizleme</h3>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Ara Toplam</span>
                            <span>850 TL</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Kargo</span>
                            <span className="text-yellow-400">+{formData.shippingCost} TL</span>
                        </div>
                        <div className="border-t border-white/20 pt-3 flex justify-between font-bold">
                            <span>Toplam</span>
                            <span>{850 + formData.shippingCost} TL</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 text-center">
                        {formData.freeShippingLimit} TL ve üzeri siparişlerde kargo ücretsiz
                    </p>
                </section>
            </div>
        </div>
    );
}
