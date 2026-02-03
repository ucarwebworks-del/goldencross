'use client';

import { DollarSign, ShoppingBag, Package, Activity } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';

export default function AdminDashboardClient() {
    const { orders } = useOrders();
    const { products } = useProducts();

    // Calculate real stats - use Turkish status values
    const pendingOrders = orders.filter(o => o.status === 'Beklemede' || o.status === 'Onaylandı' || o.status === 'Hazırlanıyor');
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

    // Low stock products (stock < 5)
    const lowStockProducts = products.filter(p => (p.stock || 0) < 5);

    // Format currency
    const formatCurrency = (val: number) => {
        return val.toLocaleString('tr-TR') + ' TL';
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'Beklemede': 'bg-yellow-100 text-yellow-700',
            'Onaylandı': 'bg-blue-100 text-blue-700',
            'Hazırlanıyor': 'bg-purple-100 text-purple-700',
            'Kargoya Verildi': 'bg-indigo-100 text-indigo-700',
            'Teslim Edildi': 'bg-green-100 text-green-700',
            'İptal Edildi': 'bg-red-100 text-red-700'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    const stats = [
        { title: 'Toplam Ciro', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { title: 'Bekleyen Sipariş', value: pendingOrders.length.toString(), icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { title: 'Toplam Sipariş', value: totalOrders.toString(), icon: Activity, color: 'bg-purple-100 text-purple-600' },
        { title: 'Toplam Ürün', value: totalProducts.toString(), icon: Package, color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Genel Bakış</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Son Siparişler</h3>
                        <Link href="/admin/orders" className="text-sm text-accent font-bold hover:underline">Tümünü Gör</Link>
                    </div>
                    {orders.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Sipariş No</th>
                                    <th className="px-6 py-3 font-medium">Müşteri</th>
                                    <th className="px-6 py-3 font-medium">Tutar</th>
                                    <th className="px-6 py-3 font-medium">Durum</th>
                                    <th className="px-6 py-3 font-medium">Tarih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold">#{order.id}</td>
                                        <td className="px-6 py-4">{order.customer?.firstName} {order.customer?.lastName}</td>
                                        <td className="px-6 py-4">{formatCurrency(order.total)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                        <td className="px-6 py-4 text-gray-400">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            Henüz sipariş bulunmuyor
                        </div>
                    )}
                </div>

                {/* Stock Alert */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg mb-4">Kritik Stok</h3>
                    {lowStockProducts.length > 0 ? (
                        <div className="space-y-4">
                            {lowStockProducts.slice(0, 5).map(product => (
                                <div key={product.id} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                        {product.images?.[0] && (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">{product.name}</h4>
                                        <p className="text-xs text-red-500 font-bold">Son {product.stock || 0} adet</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Kritik stokta ürün yok</p>
                    )}
                    <Link href="/admin/products" className="w-full mt-6 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 block text-center">Stok Raporu</Link>
                </div>
            </div>
        </div>
    );
}
