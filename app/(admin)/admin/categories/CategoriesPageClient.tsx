'use client';

import { useState } from 'react';
import { useCategories, Category } from '@/context/CategoryContext';
import { Plus, Edit2, Trash2, Save, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function CategoriesPageClient() {
    const { categories, addCategory, updateCategory, deleteCategory, reorderCategory } = useCategories();
    const { confirm } = useConfirm();
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});

    const parents = categories.filter(c => !c.parent_id).sort((a, b) => (a.order || 0) - (b.order || 0));
    const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId).sort((a, b) => (a.order || 0) - (b.order || 0));

    const handleAddClick = () => {
        setCurrentCategory({});
        setIsEditing(true);
    };

    const handleEditClick = (category: Category) => {
        setCurrentCategory(category);
        setIsEditing(true);
    };

    const handleDeleteClick = async (id: string) => {
        const confirmed = await confirm('Bu kategoriyi silmek istediğinize emin misiniz?', 'Kategori Sil');
        if (confirmed) {
            deleteCategory(id);
        }
    };

    const generateSlug = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ş': 's', 'Ş': 's',
            'ü': 'u', 'Ü': 'u', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o'
        };
        return text
            .split('')
            .map(char => trMap[char] || char)
            .join('')
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (name: string) => {
        const slug = generateSlug(name);
        setCurrentCategory(prev => ({ ...prev, name, slug }));
    };

    const handleAddSubcategory = (parentId: string) => {
        setCurrentCategory({ parent_id: parentId });
        setIsEditing(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory.name || !currentCategory.slug) return;

        if (currentCategory.id) {
            updateCategory(currentCategory.id, currentCategory);
        } else {
            addCategory({
                name: currentCategory.name,
                slug: currentCategory.slug,
                image: currentCategory.parent_id ? '' : (currentCategory.image || ''),
                description: currentCategory.description || '',
                parent_id: currentCategory.parent_id
            });
        }
        setIsEditing(false);
    };

    // Check if this is a subcategory being edited
    const isSubcategory = Boolean(currentCategory.parent_id);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
                >
                    <Plus size={20} /> Yeni Kategori Ekle
                </button>
            </div>

            {/* Grouped List */}
            <div className="space-y-8">
                {parents.map((parent, parentIndex) => (
                    <div key={parent.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        {/* Parent Header */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* Order Controls for Parents */}
                            <div className="flex flex-col gap-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                                <button
                                    onClick={() => reorderCategory(parent.id, 'up')}
                                    disabled={parentIndex === 0}
                                    className="p-1.5 rounded bg-gray-50 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Yukarı Taşı"
                                >
                                    <ChevronUp size={18} />
                                </button>
                                <button
                                    onClick={() => reorderCategory(parent.id, 'down')}
                                    disabled={parentIndex === parents.length - 1}
                                    className="p-1.5 rounded bg-gray-50 hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    title="Aşağı Taşı"
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>

                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                                {parent.image ? (
                                    <img src={parent.image} alt={parent.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">IMG</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{parent.name}</h3>
                                <p className="text-xs text-gray-400 uppercase">/{parent.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddSubcategory(parent.id)}
                                    className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                                >
                                    <Plus size={16} /> Alt Kategori Ekle
                                </button>
                                <button onClick={() => handleEditClick(parent)} className="p-2 bg-white rounded-full hover:bg-blue-50 text-blue-600 border border-gray-200"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteClick(parent.id)} className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 border border-gray-200"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        {/* Children Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-4 border-l-2 border-gray-200">
                            {getChildren(parent.id).map((child, childIndex) => {
                                const childrenList = getChildren(parent.id);
                                return (
                                    <div key={child.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all relative group">
                                        <div className="flex items-start gap-2">
                                            {/* Order Controls for Children - Horizontal */}
                                            <div className="flex gap-0.5 bg-gray-100 rounded p-0.5">
                                                <button
                                                    onClick={() => reorderCategory(child.id, 'left')}
                                                    disabled={childIndex === 0}
                                                    className="p-1 rounded hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Sola Taşı"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <button
                                                    onClick={() => reorderCategory(child.id, 'right')}
                                                    disabled={childIndex === childrenList.length - 1}
                                                    className="p-1 rounded hover:bg-blue-100 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Sağa Taşı"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{child.name}</h4>
                                                <p className="text-xs text-gray-400">/{child.slug}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(child)} className="text-blue-500 hover:text-blue-700"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDeleteClick(child.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                );
                            })}
                            {getChildren(parent.id).length === 0 && (
                                <div className="text-sm text-gray-400 italic p-2">Alt kategori yok.</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {currentCategory.id
                                    ? (isSubcategory ? 'Alt Kategoriyi Düzenle' : 'Kategoriyi Düzenle')
                                    : (isSubcategory ? 'Yeni Alt Kategori' : 'Yeni Kategori')
                                }
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isSubcategory && (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Üst Kategori</label>
                                    <select
                                        value={currentCategory.parent_id || ''}
                                        onChange={e => setCurrentCategory({ ...currentCategory, parent_id: e.target.value || undefined })}
                                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                    >
                                        <option value="">(Yok - Ana Kategori)</option>
                                        {parents.filter(p => p.id !== currentCategory.id).map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold mb-2">{isSubcategory ? 'Alt Kategori Adı' : 'Kategori Adı'}</label>
                                <input
                                    type="text"
                                    value={currentCategory.name || ''}
                                    onChange={e => handleNameChange(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                    placeholder={isSubcategory ? "Örn: Manzara" : "Örn: Modern Sanat"}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Slug (URL - Otomatik)</label>
                                <input
                                    type="text"
                                    value={currentCategory.slug || ''}
                                    readOnly
                                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                                    placeholder="Otomatik oluşturulur"
                                />
                            </div>

                            {/* Only show image uploader for parent categories */}
                            {!isSubcategory && (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Görsel</label>
                                    <ImageUploader
                                        images={currentCategory.image ? [currentCategory.image] : []}
                                        onChange={imgs => setCurrentCategory({ ...currentCategory, image: imgs[0] || '' })}
                                        maxImages={1}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold mb-2">Açıklama</label>
                                <textarea
                                    value={currentCategory.description || ''}
                                    onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none h-32 resize-none"
                                    placeholder="Kategori hakkında kısa açıklama..."
                                />
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
