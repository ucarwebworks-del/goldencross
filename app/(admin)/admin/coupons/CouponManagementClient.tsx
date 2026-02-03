'use client';

import { useState } from 'react';
import { useCoupons, Coupon } from '@/context/CouponContext';
import { Plus, Edit2, Trash2, Save, X, Tag, Percent, DollarSign, Calendar, Gift, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function CouponManagementClient() {
    const { coupons, addCoupon, updateCoupon, deleteCoupon, isLoading } = useCoupons();
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Coupon>>({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        maxUses: 0,
        isActive: true,
        expiresAt: ''
    });

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: 10,
            minOrderAmount: 0,
            maxUses: 0,
            isActive: true,
            expiresAt: ''
        });
        setEditingCoupon(null);
        setShowForm(false);
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            ...coupon,
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : ''
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.discountValue) {
            toast.error('Kupon kodu ve indirim değeri zorunludur');
            return;
        }

        const couponData = {
            code: formData.code!.toUpperCase(),
            discountType: formData.discountType!,
            discountValue: formData.discountValue!,
            minOrderAmount: formData.minOrderAmount || 0,
            maxUses: formData.maxUses || 0,
            isActive: formData.isActive ?? true,
            expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined
        };

        if (editingCoupon) {
            updateCoupon(editingCoupon.id, couponData);
            toast.success('Kupon güncellendi!');
        } else {
            addCoupon(couponData);
            toast.success('Kupon oluşturuldu!');
        }

        resetForm();
    };

    const handleDelete = (id: string) => {
        deleteCoupon(id);
        toast.success('Kupon silindi!');
        setDeleteConfirm(null);
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
        toast.success('Kod kopyalandı!');
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, code });
    };

    if (isLoading) return <div className="p-6">Yükleniyor...</div>;

    const activeCoupons = coupons.filter(c => c.isActive);
    const inactiveCoupons = coupons.filter(c => !c.isActive);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Kupon Yönetimi</h1>
                    <p className="text-gray-500 text-sm mt-1">İndirim kuponlarını yönetin</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25"
                >
                    <Plus size={20} /> Yeni Kupon
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl text-white">
                    <Tag size={24} className="opacity-80 mb-2" />
                    <p className="text-3xl font-bold">{coupons.length}</p>
                    <p className="text-sm opacity-80">Toplam Kupon</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white">
                    <Gift size={24} className="opacity-80 mb-2" />
                    <p className="text-3xl font-bold">{activeCoupons.length}</p>
                    <p className="text-sm opacity-80">Aktif Kupon</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white">
                    <Percent size={24} className="opacity-80 mb-2" />
                    <p className="text-3xl font-bold">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</p>
                    <p className="text-sm opacity-80">Toplam Kullanım</p>
                </div>
            </div>

            {/* Coupon List */}
            {!showForm && (
                <div className="space-y-4">
                    {coupons.length === 0 ? (
                        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <Tag size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="font-medium">Henüz kupon yok</p>
                            <p className="text-sm mt-1">"Yeni Kupon" butonuna tıklayarak ilk kuponunuzu oluşturun</p>
                        </div>
                    ) : (
                        coupons.map(coupon => (
                            <div
                                key={coupon.id}
                                className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${!coupon.isActive ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-center">
                                    {/* Coupon Design Left */}
                                    <div className={`w-32 h-full py-6 px-4 flex flex-col items-center justify-center ${coupon.discountType === 'percentage' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-green-600'} text-white relative`}>
                                        <div className="absolute top-1/2 right-0 w-4 h-4 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                                        <p className="text-3xl font-bold">{coupon.discountValue}</p>
                                        <p className="text-sm font-medium">{coupon.discountType === 'percentage' ? '%' : 'TL'}</p>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <button
                                                onClick={() => copyCode(coupon.code)}
                                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-mono font-bold text-lg transition-colors"
                                            >
                                                {coupon.code}
                                                {copiedCode === coupon.code ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-400" />}
                                            </button>
                                            {coupon.isActive ? (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Aktif</span>
                                            ) : (
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">Pasif</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            {coupon.minOrderAmount > 0 && (
                                                <span>Min. Sipariş: {coupon.minOrderAmount} TL</span>
                                            )}
                                            {coupon.maxUses > 0 && (
                                                <span>Kullanım: {coupon.usedCount}/{coupon.maxUses}</span>
                                            )}
                                            {coupon.expiresAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(coupon.expiresAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 p-5">
                                        <button
                                            onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                                            className={`p-2 rounded-lg ${coupon.isActive ? 'text-gray-600 hover:bg-gray-100' : 'text-green-600 hover:bg-green-50'}`}
                                        >
                                            {coupon.isActive ? 'Devre Dışı' : 'Aktifleştir'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(coupon)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(coupon.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm sticky top-4 z-10">
                        <h2 className="text-xl font-bold flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Tag size={20} className="text-purple-600" />
                            </div>
                            {editingCoupon ? 'Kuponu Düzenle' : 'Yeni Kupon Oluştur'}
                        </h2>
                        <div className="flex gap-3">
                            <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold px-6 py-2 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                            >
                                <Save size={18} /> {editingCoupon ? 'Güncelle' : 'Oluştur'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Code */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                                <h3 className="font-bold">Kupon Kodu</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="flex-1 p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none font-mono text-lg uppercase"
                                        placeholder="INDIRIM20"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateRandomCode}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        Rastgele
                                    </button>
                                </div>
                            </div>

                            {/* Discount */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                                <h3 className="font-bold">İndirim</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${formData.discountType === 'percentage' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="discountType"
                                            checked={formData.discountType === 'percentage'}
                                            onChange={() => setFormData({ ...formData, discountType: 'percentage' })}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        <Percent size={20} className="text-purple-600" />
                                        <span className="font-medium">Yüzde</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${formData.discountType === 'fixed' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="discountType"
                                            checked={formData.discountType === 'fixed'}
                                            onChange={() => setFormData({ ...formData, discountType: 'fixed' })}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <DollarSign size={20} className="text-green-600" />
                                        <span className="font-medium">Sabit TL</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">İndirim Değeri</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                            className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-lg pr-12"
                                            min="0"
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                            {formData.discountType === 'percentage' ? '%' : 'TL'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Limits */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                                <h3 className="font-bold">Sınırlamalar</h3>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Minimum Sipariş Tutarı (TL)</label>
                                    <input
                                        type="number"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                        min="0"
                                        placeholder="0 = Limit yok"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Maksimum Kullanım</label>
                                    <input
                                        type="number"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                        min="0"
                                        placeholder="0 = Sınırsız"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Son Kullanım Tarihi</label>
                                    <input
                                        type="date"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div className={`relative w-14 h-8 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${formData.isActive ? 'left-7' : 'left-1'}`} />
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="sr-only"
                                        />
                                    </div>
                                    <div>
                                        <span className="font-bold block">Kupon Aktif</span>
                                        <span className="text-sm text-gray-500">Kapatıldığında kupon kullanılamaz</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Kuponu Sil"
                message="Bu kuponu silmek istediğinize emin misiniz?"
                confirmText="Sil"
                cancelText="İptal"
            />
        </div>
    );
}
