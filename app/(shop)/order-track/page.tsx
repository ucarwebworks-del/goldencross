'use client';
import { useState } from 'react';
import { useOrders } from '@/context/OrderContext';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderTrackPage() {
    const { orders } = useOrders();
    const [orderNumber, setOrderNumber] = useState('');
    const [foundOrder, setFoundOrder] = useState<any>(null);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        setError('');
        setFoundOrder(null);
        setSearched(true);

        if (!orderNumber.trim()) {
            setError('Lütfen sipariş numaranızı girin.');
            return;
        }

        const order = orders.find(o => o.orderNumber === orderNumber.trim().toUpperCase());

        if (order) {
            setFoundOrder(order);
        } else {
            setError('Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Clock className="text-yellow-500" size={24} />;
            case 'Processing':
                return <Package className="text-blue-500" size={24} />;
            case 'Shipped':
                return <Truck className="text-purple-500" size={24} />;
            case 'Delivered':
                return <CheckCircle className="text-green-500" size={24} />;
            case 'Cancelled':
                return <AlertCircle className="text-red-500" size={24} />;
            default:
                return <Clock className="text-gray-500" size={24} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Pending': return 'Onay Bekliyor';
            case 'Processing': return 'Hazırlanıyor';
            case 'Shipped': return 'Kargoya Verildi';
            case 'Delivered': return 'Teslim Edildi';
            case 'Cancelled': return 'İptal Edildi';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-[70vh] bg-[#111111] py-12">
            <div className="container max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-3 text-white">Sipariş Takibi</h1>
                    <p className="text-gray-400">Sipariş numaranızı girerek siparişinizin durumunu öğrenin.</p>
                </div>

                {/* Search Box */}
                <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 p-4 sm:p-6 mb-8">
                    <label className="block text-sm font-medium mb-2 text-white">Sipariş Numarası</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Örn: GG-1234567890"
                                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all outline-none font-mono uppercase text-base sm:text-lg"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Sorgula
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && searched && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5 text-center mb-8">
                        <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                        <p className="text-red-400 font-medium">{error}</p>
                    </div>
                )}

                {/* Order Found */}
                {foundOrder && (
                    <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 overflow-hidden">
                        {/* Order Header */}
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Sipariş Numarası</p>
                                    <p className="font-mono font-bold text-xl text-white">{foundOrder.orderNumber}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(foundOrder.status)}`}>
                                    {getStatusText(foundOrder.status)}
                                </div>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="p-4 sm:p-6 border-b border-white/10 overflow-x-auto">
                            <div className="flex items-center justify-between min-w-[400px] sm:min-w-0">
                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, idx) => {
                                    const isActive = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(foundOrder.status) >= idx;
                                    const isCurrent = foundOrder.status === status;
                                    return (
                                        <div key={status} className="flex items-center">
                                            <div className={`flex flex-col items-center ${isActive ? '' : 'opacity-40'}`}>
                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-white text-black' : isActive ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}>
                                                    {getStatusIcon(status)}
                                                </div>
                                                <p className="text-[10px] sm:text-xs mt-2 font-medium text-gray-400 text-center whitespace-nowrap">{getStatusText(status)}</p>
                                            </div>
                                            {idx < 3 && (
                                                <ChevronRight size={16} className={`mx-1 sm:mx-2 hidden sm:block ${isActive ? 'text-green-500' : 'text-gray-600'}`} />
                                            )}
                                            {idx < 3 && (
                                                <div className={`w-4 h-0.5 mx-1 sm:hidden ${isActive ? 'bg-green-500' : 'bg-gray-600'}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="p-6">
                            <h3 className="font-bold mb-4 text-white">Sipariş Detayları</h3>
                            <div className="space-y-3">
                                {foundOrder.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                                        <div>
                                            <p className="font-medium text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.size} {item.frame && `• ${item.frame}`}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-white">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</p>
                                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between font-bold text-lg text-white">
                                <span>Toplam</span>
                                <span>{foundOrder.total.toLocaleString('tr-TR')} TL</span>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="p-6 bg-white/5 border-t border-white/10">
                            <h3 className="font-bold mb-3 text-white">Teslimat Bilgileri</h3>
                            <p className="text-gray-400">{foundOrder.customer.firstName} {foundOrder.customer.lastName}</p>
                            <p className="text-gray-400">{foundOrder.customer.address}</p>
                            <p className="text-gray-400">{foundOrder.customer.city}</p>
                        </div>
                    </div>
                )}

                {/* Help Text */}
                {!foundOrder && !error && searched && (
                    <div className="text-center text-gray-500">
                        <p>Sipariş numaranızı e-posta adresinize gönderilen onay mailinde bulabilirsiniz.</p>
                    </div>
                )}

                {/* Back Link */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
