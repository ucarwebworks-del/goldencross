'use client';
import { use, useEffect, useState } from 'react';
import { useOrders, Order } from '@/context/OrderContext';
import { CheckCircle, Home, Package, Truck, CreditCard, MapPin, Phone, Mail, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPageClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getOrder } = useOrders();
    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const foundOrder = getOrder(id);
        if (foundOrder) {
            setOrder(foundOrder);
        }
    }, [id, getOrder]);

    const copyOrderId = () => {
        navigator.clipboard.writeText(order?.id || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!order) {
        return (
            <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mb-4"></div>
                <h2 className="text-xl font-bold mb-2 text-white">Sipariş Yükleniyor...</h2>
                <p className="text-gray-500 mb-6">Sipariş detaylarınız getiriliyor.</p>
                <Link href="/" className="text-accent hover:underline text-sm">Anasayfaya Dön</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111111] py-8 md:py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Success Header - Animated Gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2e1a] via-[#1a1a1a] to-[#1a1a1a] p-8 md:p-12 rounded-2xl border border-green-500/20 text-center">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse"></div>
                    
                    <div className="relative z-10">
                        {/* Animated checkmark */}
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 animate-bounce">
                            <CheckCircle size={40} strokeWidth={2} />
                        </div>
                        
                        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white">
                            Siparişiniz Alındı! 🎉
                        </h1>
                        <p className="text-gray-400 mb-6">Teşekkürler! Siparişiniz başarıyla oluşturuldu.</p>
                        
                        {/* Order ID with copy button */}
                        <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10">
                            <span className="text-gray-400 text-sm">Sipariş No:</span>
                            <span className="font-mono font-bold text-white text-lg">#{order.id}</span>
                            <button 
                                onClick={copyOrderId}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title="Kopyala"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white/5">
                        <h2 className="font-bold text-lg flex items-center gap-2 text-white">
                            <Package size={20} className="text-accent" /> Sipariş Özeti
                        </h2>
                        <span className="text-sm text-gray-500">{order.date}</span>
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-3 bg-white/5 rounded-xl">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#222] rounded-lg overflow-hidden border border-white/10 shrink-0">
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-sm md:text-base truncate">{item.name}</h3>
                                        {(item.selectedFormat || item.selectedFrame) && (
                                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                                                {[item.selectedFormat, item.selectedFrame].filter(Boolean).join(' • ')}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-xs md:text-sm text-gray-500">{item.quantity} Adet</span>
                                            <span className="font-bold text-white text-sm md:text-base">{item.price.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Toplam Tutar</span>
                                <span className="text-2xl md:text-3xl font-bold text-accent">{order.total.toLocaleString('tr-TR')} TL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] p-5 md:p-6 rounded-2xl border border-white/10">
                        <h3 className="font-bold mb-4 text-white flex items-center gap-2">
                            <Truck size={18} className="text-accent" /> Teslimat Bilgileri
                        </h3>
                        <div className="text-sm text-gray-400 space-y-2">
                            <p className="font-medium text-white">{order.customer.firstName} {order.customer.lastName}</p>
                            <p className="flex items-start gap-2">
                                <MapPin size={14} className="shrink-0 mt-0.5 text-gray-500" />
                                <span>{order.customer.address}, {order.customer.city}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-500" />
                                <span>{order.customer.phone}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-500" />
                                <span>{order.customer.email}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] p-5 md:p-6 rounded-2xl border border-white/10">
                        <h3 className="font-bold mb-4 text-white flex items-center gap-2">
                            <CreditCard size={18} className="text-accent" /> Ödeme Bilgileri
                        </h3>
                        <div className="text-sm text-gray-400 space-y-3">
                            <div className="flex justify-between">
                                <span>Ödeme Yöntemi:</span>
                                <span className="font-medium text-white">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ödeme Durumu:</span>
                                <span className="font-medium text-amber-500">Bekleniyor</span>
                            </div>
                            {order.paymentMethod === 'Havale/EFT' && (
                                <div className="bg-amber-500/10 p-3 rounded-xl text-xs text-amber-400 border border-amber-500/20">
                                    💡 Havale açıklama kısmına <strong className="text-amber-300">sipariş numaranızı</strong> yazmayı unutmayın.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Tracker */}
                <div className="bg-[#1a1a1a] p-5 md:p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold mb-6 text-white text-center">Sipariş Durumu</h3>
                    <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10">
                            <div className="h-full w-1/4 bg-green-500"></div>
                        </div>
                        
                        {/* Steps */}
                        {[
                            { icon: CheckCircle, label: 'Sipariş Alındı', active: true },
                            { icon: Package, label: 'Hazırlanıyor', active: false },
                            { icon: Truck, label: 'Kargoda', active: false },
                            { icon: Home, label: 'Teslim Edildi', active: false }
                        ].map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step.active 
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                                        : 'bg-[#222] text-gray-500 border border-white/10'
                                }`}>
                                    <step.icon size={16} />
                                </div>
                                <span className={`text-[10px] md:text-xs mt-2 text-center ${step.active ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link
                        href="/order-track"
                        className="bg-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
                    >
                        <Package size={18} /> Siparişi Takip Et
                    </Link>
                    <Link
                        href="/"
                        className="bg-accent text-black px-6 py-3 rounded-full font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        </div>
    );
}
