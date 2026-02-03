'use client';

import { Save, Info } from 'lucide-react';
import { usePages } from '@/context/PageContext';
import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ui/ImageUploader';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { toast } from 'sonner';

export default function AboutPageSettingsClient() {
    const { getPage, updatePage, addPage } = usePages();
    const existingPage = getPage('hakkimizda');

    const [formData, setFormData] = useState({
        title: existingPage?.title || 'Hakkımızda',
        content: existingPage?.content || '',
        heroImage: '',
        heroVideo: '',
        mediaType: 'image' as 'image' | 'video',
        galleryImages: [] as string[]
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (existingPage) {
            // Parse existing content for media if stored as JSON
            try {
                const parsed = JSON.parse(existingPage.content);
                setFormData({
                    title: existingPage.title,
                    content: parsed.content || existingPage.content,
                    heroImage: parsed.heroImage || '',
                    heroVideo: parsed.heroVideo || '',
                    mediaType: parsed.mediaType || 'image',
                    galleryImages: parsed.galleryImages || []
                });
            } catch {
                setFormData({
                    title: existingPage.title,
                    content: existingPage.content,
                    heroImage: '',
                    heroVideo: '',
                    mediaType: 'image',
                    galleryImages: []
                });
            }
        }
    }, [existingPage]);

    const handleSave = () => {
        setIsSaving(true);

        const contentData = JSON.stringify({
            content: formData.content,
            heroImage: formData.heroImage,
            heroVideo: formData.heroVideo,
            mediaType: formData.mediaType,
            galleryImages: formData.galleryImages
        });

        if (existingPage) {
            updatePage(existingPage.id, { title: formData.title, content: contentData });
        } else {
            addPage({ title: formData.title, slug: 'hakkimizda', content: contentData, isPublished: true, group: 'corporate' });
        }

        setTimeout(() => {
            setIsSaving(false);
            toast.success('Hakkımızda sayfası güncellendi!');
        }, 500);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Hakkımızda Sayfası</h1>
                    <p className="text-gray-500 text-sm mt-1">Şirket hakkında bilgiler ve medya</p>
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
                {/* Hero Media */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">Hero Görseli / Videosu</h2>

                    {/* Media Type Toggle */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.mediaType === 'image' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Görsel
                        </button>
                        <button
                            onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.mediaType === 'video' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            Video
                        </button>
                    </div>

                    {formData.mediaType === 'image' ? (
                        <div>
                            <label className="block text-sm font-bold mb-2">Hero Görseli</label>
                            <ImageUploader
                                images={formData.heroImage ? [formData.heroImage] : []}
                                onChange={imgs => setFormData({ ...formData, heroImage: imgs[0] || '' })}
                                maxImages={1}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold mb-2">Video URL veya Yükle</label>
                            <input
                                type="text"
                                value={formData.heroVideo}
                                onChange={e => setFormData({ ...formData, heroVideo: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none mb-2"
                                placeholder="https://youtube.com/... veya video URL"
                            />
                            <p className="text-xs text-gray-500">YouTube, Vimeo veya direkt video linki yapıştırın</p>
                        </div>
                    )}
                </section>

                {/* Page Content */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">Sayfa İçeriği</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Sayfa Başlığı</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">İçerik</label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={val => setFormData({ ...formData, content: val })}
                            placeholder="Şirketiniz hakkında bilgi yazın..."
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
