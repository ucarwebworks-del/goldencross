'use client';

import { useState } from 'react';
import { useBankAccounts, BankAccount } from '@/context/BankContext';
import { Plus, Pencil, Trash2, Save, X, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BankTransferPageClient() {
    const { accounts, addAccount, updateAccount, deleteAccount, isLoading } = useBankAccounts();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Omit<BankAccount, 'id'>>({
        bankName: '',
        accountHolder: '',
        iban: '',
        branchCode: '',
        accountNumber: '',
        isActive: true
    });

    const resetForm = () => {
        setFormData({
            bankName: '',
            accountHolder: '',
            iban: '',
            branchCode: '',
            accountNumber: '',
            isActive: true
        });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEdit = (account: BankAccount) => {
        setFormData({
            bankName: account.bankName,
            accountHolder: account.accountHolder,
            iban: account.iban,
            branchCode: account.branchCode || '',
            accountNumber: account.accountNumber || '',
            isActive: account.isActive
        });
        setEditingId(account.id);
        setIsAdding(false);
    };

    const handleSave = () => {
        if (!formData.bankName || !formData.accountHolder || !formData.iban) {
            toast.error('Lütfen zorunlu alanları doldurun');
            return;
        }

        if (editingId) {
            updateAccount(editingId, formData);
            toast.success('Hesap güncellendi');
        } else {
            addAccount(formData);
            toast.success('Yeni hesap eklendi');
        }
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu hesabı silmek istediğinizden emin misiniz?')) {
            deleteAccount(id);
            toast.success('Hesap silindi');
        }
    };

    const handleToggleActive = (account: BankAccount) => {
        updateAccount(account.id, { isActive: !account.isActive });
        toast.success(account.isActive ? 'Hesap pasif yapıldı' : 'Hesap aktif yapıldı');
    };

    if (isLoading) {
        return <div className="p-8">Yükleniyor...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Havale / EFT Ayarları</h1>
                    <p className="text-gray-500 text-sm mt-1">Banka hesaplarınızı yönetin</p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
                    >
                        <Plus size={18} /> Yeni Hesap Ekle
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100">
                        {editingId ? 'Hesabı Düzenle' : 'Yeni Hesap Ekle'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Banka Adı *</label>
                            <input
                                type="text"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Örn: Garanti BBVA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Hesap Sahibi *</label>
                            <input
                                type="text"
                                value={formData.accountHolder}
                                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Firma veya kişi adı"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">IBAN *</label>
                            <input
                                type="text"
                                value={formData.iban}
                                onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none font-mono"
                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Şube Kodu (Opsiyonel)</label>
                            <input
                                type="text"
                                value={formData.branchCode}
                                onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Şube kodu"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Hesap No (Opsiyonel)</label>
                            <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Hesap numarası"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300"
                                />
                                <span className="font-medium">Aktif (Ödeme sayfasında göster)</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
                        >
                            <Save size={18} /> Kaydet
                        </button>
                        <button
                            onClick={resetForm}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
                        >
                            <X size={18} /> İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Accounts List */}
            <div className="space-y-4">
                {accounts.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-12 text-center">
                        <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Henüz banka hesabı eklenmemiş.</p>
                    </div>
                ) : (
                    accounts.map((account) => (
                        <div
                            key={account.id}
                            className={`bg-white p-6 rounded-xl shadow-sm border ${account.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Building2 size={24} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            {account.bankName}
                                            {!account.isActive && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                    Pasif
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{account.accountHolder}</p>
                                        <p className="font-mono text-sm mt-2 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                                            {account.iban}
                                        </p>
                                        {(account.branchCode || account.accountNumber) && (
                                            <p className="text-gray-500 text-xs mt-2">
                                                {account.branchCode && `Şube: ${account.branchCode}`}
                                                {account.branchCode && account.accountNumber && ' • '}
                                                {account.accountNumber && `Hesap No: ${account.accountNumber}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleActive(account)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${account.isActive
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {account.isActive ? 'Aktif' : 'Pasif'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(account)}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(account.id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700 mt-6">
                💡 <strong>Not:</strong> Aktif olan hesaplar, ödeme sayfasındaki &quot;Havale / EFT&quot; seçeneğinde müşterilere gösterilecektir.
            </div>
        </div>
    );
}
