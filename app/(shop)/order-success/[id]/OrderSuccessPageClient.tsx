'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders, Order } from '@/context/OrderContext';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPageClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getOrder } = useOrders();
    const router = useRouter();
    const [order, setOrder] = useState<Order | undefined>(undefined);

    useEffect(() => {
        // Allow a small delay for context to update if needed, though strictly sync usually
        const foundOrder = getOrder(id);
        if (foundOrder) {
            setOrder(foundOrder);
        }
    }, [id, getOrder]);

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-xl font-bold mb-2">Sipariş Yükleniyor...</h2>
                <p className="text-gray-500 mb-6">Sipariş detaylarınız getiriliyor.</p>
                <Link href="/" className="underline text-sm">Anasayfaya Dön</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Success Header */}
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-green-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Siparişiniz Alındı!</h1>
                    <p className="text-gray-500">Teşekkürler, siparişiniz başarıyla oluşturuldu.</p>
                    <div className="mt-6 inline-block bg-gray-100 px-6 py-2 rounded-full font-mono font-bold text-gray-700">
                        Sipariş No: #{order.id}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <ShoppingBag size={20} /> Sipariş Özeti
                        </h2>
                        <span className="text-sm text-gray-500">{order.date}</span>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                                        {(item.selectedFormat || item.selectedFrame) && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {[item.selectedFormat, item.selectedFrame].filter(Boolean).join(' - ')}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-sm text-gray-600">{item.quantity} Adet</span>
                                            <span className="font-bold text-gray-900">{item.price.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Toplam Tutar</span>
                            <span className="text-2xl">{order.total.toLocaleString('tr-TR')} TL</span>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 text-gray-900">Teslimat Bilgileri</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-black">{order.customer.firstName} {order.customer.lastName}</p>
                            <p>{order.customer.address}</p>
                            <p>{order.customer.city}</p>
                            <p>{order.customer.phone}</p>
                            <p>{order.customer.email}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 text-gray-900">Ödeme Bilgileri</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p className="flex justify-between">
                                <span>Ödeme Yöntemi:</span>
                                <span className="font-medium text-black">{order.paymentMethod}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Ödeme Durumu:</span>
                                <span className="font-medium text-yellow-600">Ödeme Bekleniyor (Havale)</span>
                            </p>
                            <div className="bg-blue-50 p-3 rounded-lg mt-2 text-xs text-blue-700">
                                Lütfen havale açıklama kısmına <strong>sipariş numaranızı</strong> yazmayı unutmayınız.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <Link
                        href="/"
                        className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                        <Home size={20} /> Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        </div>
    );
}
