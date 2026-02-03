'use client';

import { Save, Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';

export default function ContactSettingsPageClient() {
    const { settings, updateSettings, isLoading } = useSettings();
    const [formData, setFormData] = useState<SiteSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setFormData(settings);
        }
    }, [settings, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsSaving(true);
        updateSettings(formData);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('İletişim ayarları güncellendi!');
        }, 500);
    };

    if (isLoading) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">İletişim Ayarları</h1>
                    <p className="text-gray-500 text-sm mt-1">Telefon, WhatsApp ve sosyal medya bilgileri</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                    <Save size={18} /> {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div className="space-y-8">
                {/* Contact Info */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                        <Phone size={20} /> İletişim Bilgileri
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">E-posta</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Telefon</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">Adres</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* WhatsApp */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                        <MessageCircle size={20} className="text-green-500" /> WhatsApp Butonu
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">WhatsApp Numarası</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="+90 5XX XXX XX XX"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer bg-gray-50 p-4 rounded-lg w-full">
                                <input
                                    type="checkbox"
                                    checked={formData.whatsappActive}
                                    onChange={e => setFormData({ ...formData, whatsappActive: e.target.checked })}
                                    className="w-5 h-5 accent-green-500"
                                />
                                <div>
                                    <span className="font-bold block">WhatsApp Butonu</span>
                                    <span className="text-xs text-gray-500">{formData.whatsappActive ? 'Sitede görünür' : 'Gizli'}</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Social Media */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">Sosyal Medya Hesapları</h2>
                    <div className="space-y-4">
                        {/* Instagram */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={formData.instagramActive}
                                onChange={e => setFormData({ ...formData, instagramActive: e.target.checked })}
                                className="w-5 h-5 accent-pink-500"
                            />
                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-1">Instagram</label>
                                <div className="flex items-center">
                                    <span className="bg-white p-2 border border-r-0 rounded-l-lg text-gray-500">@</span>
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-r-lg bg-white"
                                        placeholder="kullanici_adi"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Facebook */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={formData.facebookActive}
                                onChange={e => setFormData({ ...formData, facebookActive: e.target.checked })}
                                className="w-5 h-5 accent-blue-600"
                            />
                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-1">Facebook</label>
                                <div className="flex items-center">
                                    <span className="bg-white p-2 border border-r-0 rounded-l-lg text-gray-500">facebook.com/</span>
                                    <input
                                        type="text"
                                        name="facebook"
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-r-lg bg-white"
                                        placeholder="sayfa_adi"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Twitter */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={formData.twitterActive}
                                onChange={e => setFormData({ ...formData, twitterActive: e.target.checked })}
                                className="w-5 h-5 accent-black"
                            />
                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-1">Twitter (X)</label>
                                <div className="flex items-center">
                                    <span className="bg-white p-2 border border-r-0 rounded-l-lg text-gray-500">@</span>
                                    <input
                                        type="text"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-r-lg bg-white"
                                        placeholder="kullanici_adi"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
