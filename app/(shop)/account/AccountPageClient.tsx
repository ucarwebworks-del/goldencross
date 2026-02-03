'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrders, Order } from '@/context/OrderContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, LogOut, User, Clock, Truck, CheckCircle, XCircle, ChevronRight, Loader2, Eye } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    'Beklemede': { label: 'Beklemede', color: 'text-yellow-400 bg-yellow-400/10', icon: Clock },
    'Onaylandı': { label: 'Onaylandı', color: 'text-blue-400 bg-blue-400/10', icon: CheckCircle },
    'Hazırlanıyor': { label: 'Hazırlanıyor', color: 'text-purple-400 bg-purple-400/10', icon: Package },
    'Kargoya Verildi': { label: 'Kargoya Verildi', color: 'text-orange-400 bg-orange-400/10', icon: Truck },
    'Teslim Edildi': { label: 'Teslim Edildi', color: 'text-[#00E676] bg-[#00E676]/10', icon: CheckCircle },
    'İptal Edildi': { label: 'İptal Edildi', color: 'text-red-400 bg-red-400/10', icon: XCircle },
};

export default function AccountPageClient() {
    const { user, logout, loading: authLoading } = useAuth();
    const { orders } = useOrders();
    const router = useRouter();
    const [userOrders, setUserOrders] = useState<Order[]>([]);

    // Filter orders by user email
    useEffect(() => {
        if (user && orders.length > 0) {
            const filtered = orders.filter(order => order.customer.email === user.email);
            // Sort by date descending
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUserOrders(filtered);
        }
    }, [user, orders]);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (authLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#00E676]" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#111111] py-8 px-4">
            <div className="container max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#00E676]/10 rounded-full flex items-center justify-center">
                                <User size={28} className="text-[#00E676]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">{user.displayName || 'Kullanıcı'}</h1>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <LogOut size={18} />
                            Çıkış Yap
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Package size={20} />
                            Siparişlerim
                        </h2>
                    </div>

                    {userOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">Henüz siparişiniz yok</h3>
                            <p className="text-gray-400 mb-6">İlk siparişinizi vermek için alışverişe başlayın!</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00E676] text-black font-bold rounded-xl hover:bg-[#00c853] transition-colors"
                            >
                                Alışverişe Başla
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {userOrders.map((order) => {
                                const statusInfo = STATUS_MAP[order.status] || STATUS_MAP['Beklemede'];
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <div key={order.id} className="p-4 sm:p-6 hover:bg-white/5 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            {/* Order Info */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="font-mono font-bold text-[#00E676]">{order.orderNumber}</span>
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                                        <StatusIcon size={12} />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-1">
                                                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.items.length} ürün
                                                </p>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-white">{order.total.toLocaleString('tr-TR')} TL</p>
                                                    <p className="text-xs text-gray-500">{order.paymentMethod === 'Bank Transfer' ? 'Havale/EFT' : 'Kredi Kartı'}</p>
                                                </div>
                                                <Link
                                                    href={`/order-success/${order.id}`}
                                                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                                >
                                                    <Eye size={18} className="text-gray-400" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Items Preview */}
                                        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
                                            {order.items.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="w-12 h-12 flex-shrink-0 rounded-lg bg-white/5 overflow-hidden">
                                                    {item.images && item.images[0] && (
                                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-xs text-gray-400">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tracking Number */}
                                        {order.trackingNumber && (
                                            <div className="mt-4 p-3 bg-[#00E676]/5 rounded-lg">
                                                <p className="text-xs text-gray-400 mb-1">Kargo Takip No</p>
                                                <p className="font-mono font-medium text-[#00E676]">{order.trackingNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
