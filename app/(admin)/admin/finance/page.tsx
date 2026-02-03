'use client';
import { useState } from 'react';
import { useBankAccounts, BankAccount } from '@/context/BankContext';
import { Plus, Edit2, Trash2, Save, X, CreditCard } from 'lucide-react';

export default function FinancePage() {
    const { accounts, addAccount, updateAccount, deleteAccount } = useBankAccounts();
    const [isEditing, setIsEditing] = useState(false);
    const [currentAccount, setCurrentAccount] = useState<Partial<BankAccount>>({});

    const handleAddClick = () => {
        setCurrentAccount({ isActive: true });
        setIsEditing(true);
    };

    const handleEditClick = (account: BankAccount) => {
        setCurrentAccount(account);
        setIsEditing(true);
    };

    const handleDeleteClick = (id: string) => {
        if (confirm('Bu banka hesabını silmek istediğinize emin misiniz?')) {
            deleteAccount(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentAccount.bankName || !currentAccount.iban || !currentAccount.accountHolder) return;

        if (currentAccount.id) {
            updateAccount(currentAccount.id, currentAccount);
        } else {
            addAccount({
                bankName: currentAccount.bankName,
                accountHolder: currentAccount.accountHolder,
                iban: currentAccount.iban,
                isActive: currentAccount.isActive ?? true,
                branchCode: currentAccount.branchCode,
                accountNumber: currentAccount.accountNumber
            });
        }
        setIsEditing(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Finans ve Ödeme Ayarları</h1>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
                >
                    <Plus size={20} /> Yeni Hesap Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map(account => (
                    <div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-all">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(account)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDeleteClick(account.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={18} /></button>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-gray-100 p-3 rounded-full">
                                <CreditCard size={24} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{account.bankName}</h3>
                                <p className="text-sm text-gray-500 mb-4">{account.accountHolder}</p>

                                <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm tracking-wide text-gray-700 break-all border border-gray-200">
                                    {account.iban}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${account.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                    <span className="text-xs font-medium text-gray-500">{account.isActive ? 'Aktif' : 'Pasif'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{currentAccount.id ? 'Hesabı Düzenle' : 'Yeni Banka Hesabı'}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-black"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Banka Adı</label>
                                <input
                                    type="text"
                                    value={currentAccount.bankName || ''}
                                    onChange={e => setCurrentAccount({ ...currentAccount, bankName: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                    placeholder="Örn: Garanti BBVA"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Hesap Sahibi</label>
                                <input
                                    type="text"
                                    value={currentAccount.accountHolder || ''}
                                    onChange={e => setCurrentAccount({ ...currentAccount, accountHolder: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                    placeholder="Şirket Adı veya Ad Soyad"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">IBAN</label>
                                <input
                                    type="text"
                                    value={currentAccount.iban || ''}
                                    onChange={e => setCurrentAccount({ ...currentAccount, iban: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none font-mono"
                                    placeholder="TR..."
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={currentAccount.isActive ?? true}
                                    onChange={e => setCurrentAccount({ ...currentAccount, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-black"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Bu hesap aktif ve ödeme sayfasında görünsün</label>
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
