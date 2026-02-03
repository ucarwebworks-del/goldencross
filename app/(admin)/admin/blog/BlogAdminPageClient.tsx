'use client';

import { useState } from 'react';
import { useBlog, BlogPost } from '@/context/BlogContext';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Calendar, Save, X, Settings, BarChart3, FileText, Image, Globe, ArrowUpRight, MoreVertical } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Link from 'next/link';
import { toast } from 'sonner';

export default function BlogAdminPageClient() {
    const { posts, addPost, updatePost, deletePost, blogEnabled, setBlogEnabled, blogTitle, setBlogTitle, isLoading } = useBlog();
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'Golden Glass',
        isPublished: true,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        category: '',
        tags: []
    });

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image: '',
            author: 'Golden Glass',
            isPublished: true,
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            category: '',
            tags: []
        });
        setEditingPost(null);
        setShowForm(false);
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData(post);
        setShowForm(true);
        setActiveMenu(null);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error('Başlık ve içerik zorunludur.');
            return;
        }

        const slug = formData.slug || generateSlug(formData.title);
        const postData = {
            ...formData,
            slug,
            publishedAt: editingPost?.publishedAt || new Date().toISOString()
        } as Omit<BlogPost, 'id'>;

        if (editingPost) {
            updatePost(editingPost.id, postData);
            toast.success('Blog yazısı güncellendi!');
        } else {
            addPost(postData);
            toast.success('Blog yazısı eklendi!');
        }

        resetForm();
    };

    const handleDelete = (id: string) => {
        deletePost(id);
        toast.success('Blog yazısı silindi!');
        setDeleteConfirm(null);
        setActiveMenu(null);
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const publishedCount = posts.filter(p => p.isPublished).length;
    const draftCount = posts.filter(p => !p.isPublished).length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    if (isLoading) return <div className="p-6">Yükleniyor...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Blog Yönetimi</h1>
                    <p className="text-gray-500 text-sm">İçeriklerinizi oluşturun ve yönetin</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${showSettings ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Settings size={18} /> Ayarlar
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
                    >
                        <Plus size={18} /> Yeni Yazı
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-3">
                        <FileText size={24} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Toplam</span>
                    </div>
                    <p className="text-3xl font-bold">{posts.length}</p>
                    <p className="text-sm opacity-80">Yazı</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-3">
                        <Globe size={24} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Yayında</span>
                    </div>
                    <p className="text-3xl font-bold">{publishedCount}</p>
                    <p className="text-sm opacity-80">Yazı</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-3">
                        <Edit2 size={24} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Taslak</span>
                    </div>
                    <p className="text-3xl font-bold">{draftCount}</p>
                    <p className="text-sm opacity-80">Yazı</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-3">
                        <BarChart3 size={24} className="opacity-80" />
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Görüntülenme</span>
                    </div>
                    <p className="text-3xl font-bold">{totalViews.toLocaleString('tr-TR')}</p>
                    <p className="text-sm opacity-80">Toplam</p>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Settings size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Blog Ayarları</h2>
                            <p className="text-sm text-gray-500">Genel blog yapılandırması</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="flex items-center gap-4 cursor-pointer">
                                <div className={`relative w-14 h-8 rounded-full transition-colors ${blogEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${blogEnabled ? 'left-7' : 'left-1'}`} />
                                    <input
                                        type="checkbox"
                                        checked={blogEnabled}
                                        onChange={(e) => setBlogEnabled(e.target.checked)}
                                        className="sr-only"
                                    />
                                </div>
                                <div>
                                    <span className="font-bold block">Blog Aktif</span>
                                    <span className="text-xs text-gray-500">Kapatıldığında blog sayfaları görünmez</span>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Blog Başlığı</label>
                            <input
                                type="text"
                                value={blogTitle}
                                onChange={(e) => setBlogTitle(e.target.value)}
                                className="w-full p-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                placeholder="Blog"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Blog yazısı ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
                {blogEnabled && (
                    <Link
                        href="/blog"
                        target="_blank"
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                    >
                        <Eye size={18} /> Siteyi Gör <ArrowUpRight size={14} />
                    </Link>
                )}
            </div>

            {/* Posts Grid */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPosts.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="font-medium">Henüz blog yazısı yok</p>
                            <p className="text-sm mt-1">İlk yazınızı oluşturmak için "Yeni Yazı" butonuna tıklayın</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <div
                                key={post.id}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                            <Image size={40} className="text-gray-300" />
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        {post.isPublished ? (
                                            <span className="text-xs font-bold bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                                                Yayında
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold bg-gray-700 text-white px-3 py-1.5 rounded-full shadow-lg">
                                                Taslak
                                            </span>
                                        )}
                                    </div>
                                    {/* Menu Button */}
                                    <div className="absolute top-3 right-3">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                                            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-colors"
                                        >
                                            <MoreVertical size={16} className="text-gray-700" />
                                        </button>
                                        {activeMenu === post.id && (
                                            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[160px] z-10 animate-in fade-in zoom-in-95">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Edit2 size={14} /> Düzenle
                                                </button>
                                                <button
                                                    onClick={() => { updatePost(post.id, { isPublished: !post.isPublished }); setActiveMenu(null); }}
                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    {post.isPublished ? <><EyeOff size={14} /> Taslağa Al</> : <><Eye size={14} /> Yayınla</>}
                                                </button>
                                                <hr className="my-1 border-gray-100" />
                                                <button
                                                    onClick={() => { setDeleteConfirm(post.id); setActiveMenu(null); }}
                                                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Sil
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                        <Calendar size={12} />
                                        <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleEdit(post)}>
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            {post.category && (
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Eye size={12} />
                                            <span>{post.views || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-4 z-10">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                {editingPost ? <Edit2 size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
                            </div>
                            {editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                        </h2>
                        <div className="flex gap-3">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
                            >
                                <Save size={18} /> {editingPost ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Left Side */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Başlık *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-lg"
                                        placeholder="Blog yazısı başlığı"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Kısa Açıklama</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none h-24"
                                        placeholder="Blog yazısının kısa özeti"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <FileText size={18} className="text-gray-400" />
                                    İçerik *
                                </h3>
                                <RichTextEditor
                                    value={formData.content || ''}
                                    onChange={(val) => setFormData({ ...formData, content: val })}
                                    placeholder="Blog yazısı içeriği..."
                                />
                            </div>

                            {/* SEO */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Globe size={18} className="text-gray-400" />
                                    SEO Ayarları
                                </h3>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Meta Başlık</label>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        className="w-full p-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        placeholder="Arama motorlarında görünecek başlık"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Meta Açıklama</label>
                                    <textarea
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        className="w-full p-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none h-24"
                                        placeholder="Arama motorlarında görünecek açıklama (max 160 karakter)"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{(formData.metaDescription || '').length}/160 karakter</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Anahtar Kelimeler</label>
                                    <input
                                        type="text"
                                        value={formData.metaKeywords}
                                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                                        className="w-full p-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        placeholder="Virgülle ayrılmış anahtar kelimeler"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right Side */}
                        <div className="space-y-6">
                            {/* Publish Status */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold mb-4">Yayın Durumu</h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${formData.isPublished ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="publishStatus"
                                            checked={formData.isPublished === true}
                                            onChange={() => setFormData({ ...formData, isPublished: true })}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <div>
                                            <span className="font-bold block">Yayınla</span>
                                            <span className="text-xs text-gray-500">Herkese açık olacak</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${!formData.isPublished ? 'border-gray-700 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="publishStatus"
                                            checked={formData.isPublished === false}
                                            onChange={() => setFormData({ ...formData, isPublished: false })}
                                            className="w-4 h-4 text-gray-600"
                                        />
                                        <div>
                                            <span className="font-bold block">Taslak</span>
                                            <span className="text-xs text-gray-500">Sadece sen görebilirsin</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Category & Slug */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Kategori</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        placeholder="Örn: Rehber, Trend"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">URL (Slug)</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full p-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        placeholder="Otomatik oluşturulur"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Boş bırakırsanız başlıktan oluşturulur</p>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Image size={18} className="text-gray-400" />
                                    Kapak Görseli
                                </h3>
                                <ImageUploader
                                    images={formData.image ? [formData.image] : []}
                                    onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || '' })}
                                    maxImages={1}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Click outside to close menu */}
            {activeMenu && (
                <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Blog Yazısını Sil"
                message="Bu yazıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </div>
    );
}
