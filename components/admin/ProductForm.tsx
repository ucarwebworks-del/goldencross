'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, Product, ProductOption } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { Save, Plus, X, Trash2 } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';
import { toast } from 'sonner';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function ProductForm({ initialData }: { initialData?: Product }) {
    const router = useRouter();
    const { addProduct, updateProduct } = useProducts();
    const { categories } = useCategories();
    const [activeTab, setActiveTab] = useState<'info' | 'variants'>('info');

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>(initialData || {
        status: 'Active',
        isActive: true,
        images: [],
        note: '',
        options: [
            {
                id: 'opt_size',
                name: 'Ölçü',
                values: [
                    { value: '30x40', priceDiff: 0 },
                    { value: '40x60', priceDiff: 100 },
                    { value: '50x70', priceDiff: 200 }
                ]
            },
            {
                id: 'opt_frame',
                name: 'Çerçeve',
                values: [
                    { value: 'Çerçevesiz', priceDiff: 0 },
                    { value: 'Siyah', priceDiff: 50 },
                    { value: 'Gold', priceDiff: 50 },
                    { value: 'Gümüş', priceDiff: 50 }
                ]
            }
        ]
    });




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (!formData.name || !formData.price || !formData.category) {
            toast.error('Lütfen gerekli alanları doldurun.');
            return;
        }

        // Handle stock: if empty string or forgot to enter, treat as -1 (Unlimited) if desired, 
        // OR current logic says "Unlimited if not adjusted". 
        // But user asked: "if stock is not adjusted, make it unlimited".
        // We will assume "0" might be explicit out of stock, but "" or undefined is unlimited.
        // Let's modify logic: if user cleared input, it might be NaN or 0.
        // We need to check the raw input state if possible, or just assume -1 is set explicitly?
        // Let's rely on standard practice: If user inputs nothing (clears it), we map it to -1.
        // In onChange we can do this.

        const finalStock = (formData.stock === undefined || formData.stock === null) ? -1 : Number(formData.stock);

        const productData: any = {
            name: formData.name,
            sku: formData.sku || `GL-${Date.now().toString().slice(-4)}`,
            price: Number(formData.price),
            oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
            stock: finalStock,
            category: formData.category,
            description: formData.description || '',
            technicalSpecs: formData.technicalSpecs || '',
            images: formData.images || [],
            status: formData.status as 'Active' | 'Draft' | 'OutOfStock',
            isFeatured: formData.isFeatured,
            isBestseller: formData.isBestseller,
            isNew: formData.isNew,
            isActive: formData.isActive ?? true,
            note: formData.note || '',
            allowCustomerUpload: formData.allowCustomerUpload ?? false,
            allowCustomerNote: formData.allowCustomerNote ?? false,
            options: formData.options || []
        };

        if (initialData?.id) {
            updateProduct(initialData.id, productData);
            toast.success('Ürün başarıyla güncellendi!');
        } else {
            addProduct(productData);
            toast.success('Yeni ürün başarıyla eklendi!');
        }

        router.push('/admin/products');
    };



    // Variant Handlers
    const addOption = () => {
        const newOption: ProductOption = {
            id: Date.now().toString(),
            name: 'Yeni Seçenek',
            values: []
        };
        setFormData({ ...formData, options: [...(formData.options || []), newOption] });
    };

    const removeOption = (id: string) => {
        setFormData({ ...formData, options: formData.options?.filter(o => o.id !== id) });
    };

    const updateOptionName = (id: string, name: string) => {
        setFormData({ ...formData, options: formData.options?.map(o => o.id === id ? { ...o, name } : o) });
    };

    const addValueToOption = (optionId: string, valueStr: string) => {
        if (!valueStr.trim()) return;
        setFormData({
            ...formData,
            options: formData.options?.map(o => {
                if (o.id === optionId) {
                    return {
                        ...o,
                        values: [...o.values, { value: valueStr, priceDiff: 0 }]
                    };
                }
                return o;
            })
        });
    };

    const removeValueFromOption = (optionId: string, valueIndex: number) => {
        setFormData({
            ...formData,
            options: formData.options?.map(o => {
                if (o.id === optionId) {
                    const newValues = [...o.values];
                    newValues.splice(valueIndex, 1);
                    return { ...o, values: newValues };
                }
                return o;
            })
        });
    };

    const updateValuePrice = (optionId: string, valueIndex: number, priceDiff: number) => {
        setFormData({
            ...formData,
            options: formData.options?.map(o => {
                if (o.id === optionId) {
                    const newValues = [...o.values];
                    newValues[valueIndex] = { ...newValues[valueIndex], priceDiff };
                    return { ...o, values: newValues };
                }
                return o;
            })
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className={`pb-3 font-bold text-sm ${activeTab === 'info' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Temel Bilgiler & Görseller
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('variants')}
                    className={`pb-3 font-bold text-sm ${activeTab === 'variants' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Varyasyonlar & Seçenekler
                </button>
            </div>

            {activeTab === 'info' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Ürün Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="Örn: Cosmic Dreams Cam Tablo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Stok Kodu (SKU)</label>
                                <input
                                    type="text"
                                    value={formData.sku || ''}
                                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="Otomatik oluşur"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Kategori</label>
                                <select
                                    value={formData.category || ''}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="input-field w-full"
                                    required
                                >
                                    <option value="">Seçiniz</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Durum</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    className="input-field w-full"
                                >
                                    <option value="Active">Satışta (Aktif)</option>
                                    <option value="Draft">Taslak (Pasif)</option>
                                    <option value="OutOfStock">Stok Tükendi</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Açıklama</label>
                                <RichTextEditor
                                    value={formData.description || ''}
                                    onChange={(val) => setFormData({ ...formData, description: val })}
                                    placeholder="Ürün açıklaması..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2">Teknik Özellikler</label>
                                <RichTextEditor
                                    value={formData.technicalSpecs || ''}
                                    onChange={(val) => setFormData({ ...formData, technicalSpecs: val })}
                                    placeholder="Teknik özellikleri buraya yazın..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="font-bold text-xl border-b pb-4">Fiyat ve Stok</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Satış Fiyatı (TL)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price || ''}
                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="input-field w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Eski Fiyat</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.oldPrice || ''}
                                    onChange={e => setFormData({ ...formData, oldPrice: Number(e.target.value) })}
                                    className="input-field w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Stok Adedi</label>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        value={formData.stock === -1 ? '' : formData.stock}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                setFormData({ ...formData, stock: -1 });
                                            } else {
                                                setFormData({ ...formData, stock: Number(val) });
                                            }
                                        }}
                                        className="input-field w-full"
                                        placeholder="Boş = Sınırsız"
                                    />
                                    <p className="text-xs text-gray-400">Boş bırakırsanız sınırsız olur.</p>
                                </div>
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive ?? true}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-black"
                                />
                                <div>
                                    <span className="font-bold">Ürün Aktif</span>
                                    <p className="text-xs text-gray-500">Pasif ürünler sitede görünmez</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="font-bold text-xl border-b pb-4">Görseller ve Videolar (Sürükle-Bırak)</h2>
                        <ImageUploader
                            images={formData.images || []}
                            onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                            maxImages={10}
                        />
                    </div>

                    {/* Admin Note */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-xl border-b pb-4">Admin Notu</h2>
                        <p className="text-sm text-gray-500">Bu not sadece admin panelinde görünür, müşteriler göremez.</p>
                        <textarea
                            value={formData.note || ''}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                            className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:border-black resize-none h-24"
                            placeholder="Ürünle ilgili özel notlarınız (tedarikçi bilgisi, hatırlatmalar vb.)"
                        />
                    </div>

                    {/* Customer Upload Options */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-xl border-b pb-4">Müşteri Yükleme Ayarları</h2>
                        <p className="text-sm text-gray-500">Bu üründe müşterilerin fotoğraf veya not ekleyip ekleyemeyeceğini belirleyin.</p>

                        <div className="space-y-4 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.allowCustomerUpload ?? false}
                                    onChange={e => setFormData({ ...formData, allowCustomerUpload: e.target.checked })}
                                    className="w-5 h-5 accent-black"
                                />
                                <div>
                                    <span className="font-bold">Müşteri Fotoğraf Yükleyebilsin</span>
                                    <p className="text-xs text-gray-500">Ürün sayfasında fotoğraf yükleme alanı görünür</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.allowCustomerNote ?? false}
                                    onChange={e => setFormData({ ...formData, allowCustomerNote: e.target.checked })}
                                    className="w-5 h-5 accent-black"
                                />
                                <div>
                                    <span className="font-bold">Müşteri Not Ekleyebilsin</span>
                                    <p className="text-xs text-gray-500">Ürün sayfasında not alanı görünür</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'variants' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="font-bold text-xl">Ürün Seçenekleri</h2>
                                <p className="text-gray-500 text-sm">Müşterilerin seçebileceği özellikler (Ölçü, Çerçeve vb.)</p>
                            </div>
                            <button
                                type="button"
                                onClick={addOption}
                                className="bg-gray-100 text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} /> Yeni Seçenek Ekle
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.options?.map((option, idx) => (
                                <div key={option.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeOption(option.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="mb-4">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Seçenek Adı</label>
                                        <input
                                            type="text"
                                            value={option.name}
                                            onChange={(e) => updateOptionName(option.id, e.target.value)}
                                            className="font-bold text-lg bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black outline-none w-full transition-colors"
                                            placeholder="Örn: Ölçü"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Değerler</label>
                                        <div className="space-y-3 mb-3">
                                            {option.values.map((valObj, vIdx) => (
                                                <div key={vIdx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                                                    <span className="font-medium flex-1">{valObj.value}</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs text-gray-400">+</span>
                                                        <input
                                                            type="number"
                                                            value={valObj.priceDiff}
                                                            onChange={(e) => updateValuePrice(option.id, vIdx, Number(e.target.value))}
                                                            className="w-20 p-1 text-sm border rounded bg-gray-50 text-right outline-none focus:border-black"
                                                            placeholder="0"
                                                        />
                                                        <span className="text-xs text-gray-400">TL</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeValueFromOption(option.id, vIdx)}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                id={`new-val-${option.id}`}
                                                className="bg-white border px-3 py-2 rounded-lg text-sm outline-none focus:border-black flex-1"
                                                placeholder="Yeni değer ekle (Enter)"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addValueToOption(option.id, e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById(`new-val-${option.id}`) as HTMLInputElement;
                                                    addValueToOption(option.id, input.value);
                                                    input.value = '';
                                                }}
                                                className="bg-black text-white px-4 rounded-lg font-bold text-sm"
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!formData.options || formData.options.length === 0) && (
                                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    <p>Henüz bir seçenek eklenmemiş.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 sticky bottom-6 shadow-2xl z-10">
                <Save size={20} /> Kaydet
            </button>

            <style jsx>{`
                .input-field {
                    padding: 12px;
                    border: 1px solid #e5e5e5;
                    border-radius: 8px;
                    outline: none;
                }
                .input-field:focus {
                    border-color: black;
                }
            `}</style>
        </form>
    );
}
