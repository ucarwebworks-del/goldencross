'use client';

import Link from 'next/link';
import { Plus, Search, Edit, Trash, Eye } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useState } from 'react';
import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function ProductsPageClient() {
    const { products, deleteProduct } = useProducts();
    const { confirm } = useConfirm();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        const confirmed = await confirm('Bu ürünü silmek istediğinize emin misiniz?', 'Ürünü Sil');
        if (confirmed) {
            deleteProduct(id);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
                <Link href="/admin/products/new" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-800 whitespace-nowrap">
                    <Plus size={18} /> Yeni Ürün Ekle
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Ürün ara (SKU, İsim)..."
                            className="pl-10 input-field w-full"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table - scrollable on mobile */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Ürün</th>
                                <th className="px-6 py-3 font-medium">Kategori</th>
                                <th className="px-6 py-3 font-medium">Stok</th>
                                <th className="px-6 py-3 font-medium">Fiyat</th>
                                <th className="px-6 py-3 font-medium">Durum</th>
                                <th className="px-6 py-3 font-medium">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${p.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>{p.stock} adet</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{p.price} TL</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'Active' ? 'bg-green-100 text-green-700' : p.status === 'OutOfStock' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/product/${p.id}`} target="_blank" className="p-1.5 text-gray-500 hover:text-blue-600" title="Görüntüle">
                                                <Eye size={16} />
                                            </Link>
                                            <Link href={`/admin/products/${p.id}`} className="p-1.5 text-gray-500 hover:text-black" title="Düzenle">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-600" title="Sil">
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        Ürün bulunamadı
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
