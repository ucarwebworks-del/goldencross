'use client';
import { Save } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/context/SettingsContext';
import ImageUploader from '@/components/ui/ImageUploader';
import { toast } from 'sonner';

export default function SettingsClient() {
    const { settings, updateSettings, isLoading } = useSettings();
    const [formData, setFormData] = useState<SiteSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setFormData(settings);
        }
    }, [settings, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'freeShippingLimit' ? Number(value) : value
        }));
    };

    const handleLogoChange = (images: string[]) => {
        setFormData(prev => ({
            ...prev,
            logo: images[0] || ''
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        updateSettings(formData);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Ayarlar başarıyla güncellendi!');
        }, 500);
    };

    if (isLoading) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Genel Ayarlar</h1>
                    <p className="text-gray-500 text-sm mt-1">Site kimliği ve e-ticaret ayarları</p>
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
                {/* Logo & Media */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">Logo & Medya</h2>
                    <div className="space-y-4">
                        <label className="block text-sm font-bold mb-2">Site Logosu</label>
                        <ImageUploader
                            images={formData.logo ? [formData.logo] : []}
                            onChange={handleLogoChange}
                            maxImages={1}
                        />
                        <p className="text-xs text-gray-500">Önerilen boyut: 200x60px. (Sadece 1 görsel)</p>
                    </div>
                </section>

                {/* Site Identity */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">Site Kimliği</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Site Başlığı</label>
                            <input
                                type="text"
                                name="siteTitle"
                                value={formData.siteTitle}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">Açıklama (Meta)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none h-20 resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Homepage Settings */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">Ana Sayfa Ayarları</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Kategori Bölümü Başlığı</label>
                            <input
                                type="text"
                                name="homepageCategoryTitle"
                                value={formData.homepageCategoryTitle}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Kategoriler"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Kategori Bölümü Alt Başlık</label>
                            <input
                                type="text"
                                name="homepageCategorySubtitle"
                                value={formData.homepageCategorySubtitle}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Koleksiyonlarımızı keşfedin"
                            />
                        </div>
                    </div>
                </section>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                    💡 <strong>Not:</strong> İletişim bilgileri, WhatsApp butonu ve sosyal medya ayarları için <a href="/admin/contact" className="underline font-bold">İletişim Ayarları</a> sayfasını kullanın.
                </div>
            </div>
        </div>
    );
}
