'use client';
import { useState } from 'react';
import { useBanners, Banner } from '@/context/BannerContext';
import { useCategories } from '@/context/CategoryContext';
import { usePages } from '@/context/PageContext';
import { useSettings } from '@/context/SettingsContext';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, ChevronUp, ChevronDown, Megaphone } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function BannerManagement() {
    const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useBanners();
    const { categories } = useCategories();
    const { pages } = usePages();
    const { settings, updateSettings } = useSettings();
    const { confirm } = useConfirm();
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});

    const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

    // Only parent categories for the dropdown
    const parentCategories = categories.filter(c => !c.parent_id).sort((a, b) => a.order - b.order);

    // Build link options
    const linkOptions = [
        { value: '/', label: 'Ana Sayfa', group: 'Genel' },
        { value: '/shop', label: 'Tüm Ürünler', group: 'Genel' },
        ...parentCategories.map(cat => ({
            value: `/collections/${cat.slug}`,
            label: cat.name,
            group: 'Kategoriler'
        })),
        ...pages.filter(p => p.group === 'corporate').map(page => ({
            value: `/${page.slug}`,
            label: page.title,
            group: 'Sayfalar'
        }))
    ];

    const handleAddClick = () => {
        setCurrentBanner({ isActive: true, order: banners.length, link: '/' });
        setIsEditing(true);
    };

    const handleEditClick = (banner: Banner) => {
        setCurrentBanner(banner);
        setIsEditing(true);
    };

    const handleDeleteClick = async (id: string) => {
        const confirmed = await confirm('Bu banner\'ı silmek istediğinize emin misiniz?', 'Banner Sil');
        if (confirmed) {
            deleteBanner(id);
            toast.success('Banner silindi');
        }
    };

    const handleToggleActive = (banner: Banner) => {
        updateBanner(banner.id, { isActive: !banner.isActive });
        toast.success(banner.isActive ? 'Banner gizlendi' : 'Banner aktifleştirildi');
    };

    const handleReorder = (id: string, direction: 'up' | 'down') => {
        const currentIndex = sortedBanners.findIndex(b => b.id === id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= sortedBanners.length) return;

        const targetBanner = sortedBanners[targetIndex];
        const currentBannerItem = sortedBanners[currentIndex];

        const newBanners = banners.map(b => {
            if (b.id === currentBannerItem.id) {
                return { ...b, order: targetBanner.order };
            }
            if (b.id === targetBanner.id) {
                return { ...b, order: currentBannerItem.order };
            }
            return b;
        });

        reorderBanners(newBanners);
        toast.success('Sıralama güncellendi');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBanner.title || !currentBanner.image) {
            toast.error('Başlık ve görsel zorunludur');
            return;
        }

        if (currentBanner.id) {
            updateBanner(currentBanner.id, currentBanner);
            toast.success('Banner güncellendi');
        } else {
            addBanner({
                title: currentBanner.title,
                subtitle: currentBanner.subtitle || '',
                cta: currentBanner.cta || 'Keşfet',
                link: currentBanner.link || '/',
                image: currentBanner.image,
                isActive: currentBanner.isActive ?? true,
                order: currentBanner.order ?? banners.length
            });
            toast.success('Banner eklendi');
        }
        setIsEditing(false);
    };

    // Group options for rendering
    const groupedOptions = linkOptions.reduce((acc, opt) => {
        if (!acc[opt.group]) acc[opt.group] = [];
        acc[opt.group].push(opt);
        return acc;
    }, {} as Record<string, typeof linkOptions>);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Banner Yönetimi</h1>
                    <p className="text-gray-500 text-sm mt-1">Duyuru bandı ve ana sayfa slider görselleri</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
                >
                    <Plus size={20} /> Yeni Banner Ekle
                </button>
            </div>

            {/* Announcement Bar Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Megaphone size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">Duyuru Bandı (Üst Banner)</h2>
                        <p className="text-sm text-gray-600">Sayfanın en üstünde görünen kayan metin</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative w-14 h-8 rounded-full transition-colors ${settings.announcementBarActive !== false ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${settings.announcementBarActive !== false ? 'left-7' : 'left-1'}`} />
                            <input
                                type="checkbox"
                                checked={settings.announcementBarActive !== false}
                                onChange={(e) => updateSettings({ announcementBarActive: e.target.checked })}
                                className="sr-only"
                            />
                        </div>
                        <span className="text-sm font-medium">{settings.announcementBarActive !== false ? 'Aktif' : 'Kapalı'}</span>
                    </label>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={settings.announcementBarText || ''}
                        onChange={(e) => updateSettings({ announcementBarText: e.target.value })}
                        className="flex-1 p-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        placeholder="Örn: 1000 TL ve Üzeri Ücretsiz Kargo | Yeni Sezon Koleksiyonu Yayında"
                    />
                </div>
            </div>

            {/* Slider Title */}
            <h2 className="text-xl font-bold mb-4">Ana Sayfa Slider</h2>

            {/* Banner List */}
            <div className="space-y-4">
                {sortedBanners.map((banner, idx) => (
                    <div
                        key={banner.id}
                        className={`bg-white rounded-xl shadow-sm border overflow-hidden flex ${!banner.isActive ? 'opacity-60' : ''}`}
                    >
                        {/* Order Arrows */}
                        <div className="bg-gray-50 p-2 flex flex-col items-center justify-center gap-1 border-r">
                            <button
                                onClick={() => handleReorder(banner.id, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 rounded bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Yukarı Taşı"
                            >
                                <ChevronUp size={18} />
                            </button>
                            <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                            <button
                                onClick={() => handleReorder(banner.id, 'down')}
                                disabled={idx === sortedBanners.length - 1}
                                className="p-1.5 rounded bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Aşağı Taşı"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        {/* Image Preview */}
                        <div className="w-48 h-32 bg-gray-100 flex-shrink-0">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">{banner.title}</h3>
                                    <p className="text-sm text-gray-500">{banner.subtitle}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                        <span>Buton: {banner.cta}</span>
                                        <span>Link: {banner.link}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleActive(banner)}
                                        className={`p-2 rounded-full ${banner.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                        title={banner.isActive ? 'Gizle' : 'Aktifleştir'}
                                    >
                                        {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(banner)}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(banner.id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 mb-4">Henüz banner eklenmemiş.</p>
                        <button onClick={handleAddClick} className="text-black font-bold underline">İlk Banner'ı Ekle</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{currentBanner.id ? 'Banner Düzenle' : 'Yeni Banner'}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Başlık *</label>
                                <input
                                    type="text"
                                    value={currentBanner.title || ''}
                                    onChange={e => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                    placeholder="Örn: Yeni Sezon Koleksiyonu"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Alt Başlık</label>
                                <input
                                    type="text"
                                    value={currentBanner.subtitle || ''}
                                    onChange={e => setCurrentBanner({ ...currentBanner, subtitle: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                    placeholder="Kısa açıklama..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Buton Metni</label>
                                    <input
                                        type="text"
                                        value={currentBanner.cta || ''}
                                        onChange={e => setCurrentBanner({ ...currentBanner, cta: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                        placeholder="Keşfet"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Buton Linki</label>
                                    <select
                                        value={currentBanner.link || '/'}
                                        onChange={e => setCurrentBanner({ ...currentBanner, link: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none cursor-pointer"
                                    >
                                        {Object.entries(groupedOptions).map(([group, options]) => (
                                            <optgroup key={group} label={group}>
                                                {options.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Görsel *</label>
                                <ImageUploader
                                    images={currentBanner.image ? [currentBanner.image] : []}
                                    onChange={imgs => setCurrentBanner({ ...currentBanner, image: imgs[0] || '' })}
                                    maxImages={1}
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={currentBanner.isActive ?? true}
                                    onChange={e => setCurrentBanner({ ...currentBanner, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-black"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Banner aktif ve sitede görünsün</label>
                            </div>

                            <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                <Save size={20} /> Kaydet
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
