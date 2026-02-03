'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Filter, Eye, X, FileSpreadsheet } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import * as XLSX from 'xlsx';

const STATUS_COLORS: Record<string, string> = {
    'Beklemede': 'bg-yellow-100 text-yellow-700',
    'Onaylandı': 'bg-blue-100 text-blue-700',
    'Hazırlanıyor': 'bg-purple-100 text-purple-700',
    'Kargoya Verildi': 'bg-indigo-100 text-indigo-700',
    'Teslim Edildi': 'bg-green-100 text-green-700',
    'İptal Edildi': 'bg-red-100 text-red-700',
};

const ALL_STATUSES = ['Beklemede', 'Onaylandı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi'] as const;

export default function OrderListPageClient() {
    const { orders, updateOrderStatus } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [showFilter, setShowFilter] = useState(false);

    // Filter orders
    const filteredOrders = orders.filter(o => {
        const matchesSearch = searchTerm === '' ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.orderNumber && o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.phone.includes(searchTerm);

        const matchesStatus = filterStatus === '' || o.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Excel Export Function
    const exportToExcel = () => {
        const data = orders.map(o => ({
            'Sipariş No': o.orderNumber || o.id,
            'Tarih': o.date,
            'Müşteri Adı': `${o.customer.firstName} ${o.customer.lastName}`,
            'E-posta': o.customer.email,
            'Telefon': o.customer.phone,
            'Şehir': o.customer.city,
            'Adres': o.customer.address,
            'Ürünler': o.items.map(item => `${item.name} (${item.selectedFormat}) x${item.quantity}`).join(', '),
            'Ara Toplam (TL)': o.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            'Kargo (TL)': o.shippingCost || 0,
            'Kupon': o.couponCode || '-',
            'Kupon İndirimi (TL)': o.couponDiscount || 0,
            'Toplam (TL)': o.total,
            'Ödeme Yöntemi': o.paymentMethod === 'Bank Transfer' ? 'Havale/EFT' : 'Kredi Kartı',
            'Durum': o.status,
            'Sipariş Notu': o.note || '-'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Siparisler');

        // Auto-size columns
        const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, `Siparisler_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Sipariş Yönetimi</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Sipariş no, müşteri adı veya telefon..."
                            className="pl-10 w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-black transition-colors"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium ${filterStatus ? 'border-black bg-gray-100' : ''}`}
                        >
                            <Filter size={18} />
                            {filterStatus || 'Filtrele'}
                            {filterStatus && (
                                <X
                                    size={14}
                                    className="ml-1 hover:text-red-500"
                                    onClick={(e) => { e.stopPropagation(); setFilterStatus(''); }}
                                />
                            )}
                        </button>
                        {showFilter && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
                                <button
                                    onClick={() => { setFilterStatus(''); setShowFilter(false); }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                >
                                    Tümü
                                </button>
                                {ALL_STATUSES.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilter(false); }}
                                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 text-sm ${filterStatus === status ? 'bg-gray-100 font-bold' : ''}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={exportToExcel}
                        disabled={orders.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    >
                        <FileSpreadsheet size={18} /> Excel'e Aktar
                    </button>
                    <div className="ml-auto text-sm text-gray-500">
                        {filteredOrders.length} sipariş
                    </div>
                </div>

                {/* Table - Scrollable on mobile */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Sipariş No</th>
                                <th className="px-6 py-3 font-medium">Müşteri</th>
                                <th className="px-6 py-3 font-medium">Tarih</th>
                                <th className="px-6 py-3 font-medium">Ödeme</th>
                                <th className="px-6 py-3 font-medium">Tutar</th>
                                <th className="px-6 py-3 font-medium">Durum</th>
                                <th className="px-6 py-3 font-medium">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        {orders.length === 0 ? 'Henüz sipariş bulunmuyor.' : 'Arama sonucu bulunamadı.'}
                                    </td>
                                </tr>
                            ) : filteredOrders.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold font-mono text-gray-700">#{o.orderNumber || o.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium">{o.customer.firstName} {o.customer.lastName}</p>
                                            <p className="text-xs text-gray-400">{o.customer.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{o.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${o.paymentMethod === 'Bank Transfer' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {o.paymentMethod === 'Bank Transfer' ? 'Havale' : 'Kredi Kartı'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{o.total.toLocaleString('tr-TR')} TL</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={o.status}
                                            onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                                            className={`px-2 py-1 rounded-full text-xs font-bold border-none outline-none focus:ring-2 focus:ring-black cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}
                                        >
                                            {ALL_STATUSES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/orders/${o.id}`} className="text-gray-400 hover:text-black transition-colors">
                                            <Eye size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
