'use client';

import { use, useEffect, useState } from 'react';
import { Truck, Package, CreditCard, User, Mail, Phone, Calendar, ChevronDown, Check, Image, FileText, MessageSquare, Download, X, ZoomIn } from 'lucide-react';
import { useOrders, Order } from '@/context/OrderContext';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

export default function OrderDetailPageClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getOrder, updateOrderStatus } = useOrders();
    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const o = getOrder(id);
        if (o) setOrder(o);
    }, [id, getOrder]);

    // Close lightbox on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxImage(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (!order) {
        return (
            <div className="p-8 text-center">
                <p>Sipariş yükleniyor veya bulunamadı...</p>
                <button onClick={() => router.push('/admin/orders')} className="mt-4 underline">Siparişlere Dön</button>
            </div>
        );
    }

    const handleStatusUpdate = (status: Order['status']) => {
        updateOrderStatus(order.id, status);
        setOrder({ ...order, status });
        setIsStatusOpen(false);
        alert(`Sipariş durumu güncellendi: ${status}`);
    };

    const STATUS_OPTIONS: Order['status'][] = ['Beklemede', 'Onaylandı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi'];

    // PDF Generation - Professional Design
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let y = margin;

        // Turkish character transliteration for PDF (jsPDF doesn't support Unicode by default)
        const tr = (text: string): string => {
            const map: Record<string, string> = {
                'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ğ': 'g', 'Ğ': 'G',
                'ü': 'u', 'Ü': 'U', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C'
            };
            return text.replace(/[şŞıİğĞüÜöÖçÇ]/g, char => map[char] || char);
        };

        // Helper function to draw a box
        const drawBox = (startY: number, height: number) => {
            doc.setDrawColor(230, 230, 230);
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(margin, startY, pageWidth - 2 * margin, height, 3, 3, 'FD');
        };

        // ========== HEADER ==========
        doc.setFillColor(17, 17, 17);
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('GOLDEN GLASS 777', margin, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Cam Tablolar', margin, 33);

        // Order number on right
        doc.setFontSize(12);
        doc.setTextColor(255, 193, 7);
        doc.text(`#${order.orderNumber || order.id}`, pageWidth - margin, 25, { align: 'right' });
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.text(order.date, pageWidth - margin, 33, { align: 'right' });

        y = 55;
        doc.setTextColor(0, 0, 0);

        // ========== ORDER INFO & STATUS ==========
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('SIPARIS BILGILERI', margin, y);
        y += 8;

        drawBox(y, 25);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.text(tr(`Durum: ${order.status}`), margin + 5, y);
        doc.text(tr(`Odeme: ${order.paymentMethod === 'Bank Transfer' ? 'Havale/EFT' : 'Kredi Karti'}`), margin + 70, y);
        y += 10;
        doc.text(tr(`Tarih: ${order.date}`), margin + 5, y);
        y += 20;

        // ========== CUSTOMER INFO ==========
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('MUSTERI BILGILERI', margin, y);
        y += 8;

        drawBox(y, 40);
        y += 10;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(11);
        doc.text(tr(`${order.customer.firstName} ${order.customer.lastName}`), margin + 5, y);
        y += 7;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(tr(`Tel: ${order.customer.phone}`), margin + 5, y);
        doc.text(tr(`E-posta: ${order.customer.email}`), margin + 70, y);
        y += 7;
        doc.text(tr(`Adres: ${order.customer.address}`), margin + 5, y);
        y += 7;
        doc.text(tr(`Sehir: ${order.customer.city}`), margin + 5, y);
        y += 25;

        // ========== ORDER ITEMS ==========
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('SIPARIS KALEMLERI', margin, y);
        y += 8;

        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text('Urun', margin + 5, y + 7);
        doc.text('Format', margin + 90, y + 7);
        doc.text('Adet', margin + 125, y + 7);
        doc.text('Fiyat', pageWidth - margin - 5, y + 7, { align: 'right' });
        y += 12;

        // Table rows
        doc.setFont('helvetica', 'normal');
        order.items.forEach((item) => {
            if (y > pageHeight - 60) {
                doc.addPage();
                y = margin;
            }

            doc.setDrawColor(240, 240, 240);
            doc.line(margin, y + 8, pageWidth - margin, y + 8);

            doc.setFontSize(9);
            doc.setTextColor(30, 30, 30);
            const itemName = item.name.length > 35 ? item.name.substring(0, 35) + '...' : item.name;
            doc.text(tr(itemName), margin + 5, y + 5);
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text(tr(`${item.selectedFormat}`), margin + 90, y + 5);
            doc.text(`${item.quantity}`, margin + 125, y + 5);
            doc.setTextColor(30, 30, 30);
            doc.setFontSize(9);
            doc.text(`${(item.price * item.quantity).toLocaleString('tr-TR')} TL`, pageWidth - margin - 5, y + 5, { align: 'right' });
            y += 12;
        });

        y += 5;

        // ========== TOTALS ==========
        const totalsX = pageWidth - margin - 80;
        doc.setDrawColor(200, 200, 200);
        doc.line(totalsX, y, pageWidth - margin, y);
        y += 8;

        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text('Ara Toplam:', totalsX, y);
        doc.text(`${subtotal.toLocaleString('tr-TR')} TL`, pageWidth - margin, y, { align: 'right' });
        y += 7;

        doc.text('Kargo:', totalsX, y);
        doc.text(order.shippingCost ? `${order.shippingCost} TL` : tr('Ucretsiz'), pageWidth - margin, y, { align: 'right' });
        y += 7;

        if (order.couponCode) {
            doc.setTextColor(0, 150, 0);
            doc.text(`Kupon (${order.couponCode}):`, totalsX, y);
            doc.text(`-${order.couponDiscount?.toLocaleString('tr-TR')} TL`, pageWidth - margin, y, { align: 'right' });
            y += 7;
        }

        doc.setDrawColor(30, 30, 30);
        doc.line(totalsX, y, pageWidth - margin, y);
        y += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 17, 17);
        doc.text('TOPLAM:', totalsX, y);
        doc.text(`${order.total.toLocaleString('tr-TR')} TL`, pageWidth - margin, y, { align: 'right' });

        // ========== ORDER NOTE ==========
        if (order.note) {
            y += 20;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 100, 100);
            doc.text('SIPARIS NOTU', margin, y);
            y += 8;

            doc.setFillColor(255, 251, 235);
            doc.setDrawColor(251, 191, 36);
            const noteHeight = Math.ceil(order.note.length / 80) * 6 + 10;
            doc.roundedRect(margin, y, pageWidth - 2 * margin, noteHeight, 2, 2, 'FD');
            y += 8;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(80, 60, 20);
            const splitNote = doc.splitTextToSize(tr(order.note), pageWidth - 2 * margin - 10);
            doc.text(splitNote, margin + 5, y);
        }

        // ========== FOOTER ==========
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Bu belge Golden Glass 777 tarafindan olusturulmustur.', pageWidth / 2, pageHeight - 10, { align: 'center' });

        // Save PDF
        doc.save(`Siparis_${order.orderNumber || order.id}.pdf`);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Image Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Müşteri Görseli"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold">Sipariş #{order.orderNumber || order.id}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'Kargoya Verildi' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'Teslim Edildi' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                            }`}>{order.status}</span>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Calendar size={14} /> {order.date}
                        {order.paymentMethod === 'Bank Transfer' && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Havale Bekleniyor</span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3 relative">
                    <button
                        onClick={generatePDF}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <Download size={16} /> PDF İndir
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            Durum Güncelle <ChevronDown size={14} />
                        </button>

                        {isStatusOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
                                {STATUS_OPTIONS.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex justify-between items-center"
                                    >
                                        {status}
                                        {order.status === status && <Check size={14} className="text-green-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Order Items & Status */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 font-bold flex items-center gap-2">
                            <Package size={18} /> Sipariş Kalemleri
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, i) => (
                                <div key={i} className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                            {item.images[0] && <img src={item.images[0]} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.selectedFormat} - {item.selectedFrame}</p>
                                            <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">{item.price.toLocaleString('tr-TR')} TL</p>
                                            <p className="text-xs text-gray-500">x{item.quantity} Adet</p>
                                        </div>
                                    </div>

                                    {/* Customer Image - Clickable */}
                                    {item.customerImage && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
                                                    <Image size={12} /> Müşteri Görseli
                                                </p>
                                                <a
                                                    href={item.customerImage}
                                                    download={`musteri-gorseli-${order.orderNumber}-${i + 1}.jpg`}
                                                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Download size={12} /> İndir
                                                </a>
                                            </div>
                                            <div
                                                className="relative group cursor-pointer inline-block"
                                                onClick={() => setLightboxImage(item.customerImage!)}
                                            >
                                                <img
                                                    src={item.customerImage}
                                                    alt="Müşteri yükledi"
                                                    className="max-w-[200px] h-auto rounded-lg border shadow-sm group-hover:opacity-80 transition-opacity"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-black/60 rounded-full p-2">
                                                        <ZoomIn size={20} className="text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Customer Note */}
                                    {item.customerNote && (
                                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                            <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                                                <FileText size={12} /> Müşteri Notu
                                            </p>
                                            <p className="text-sm text-amber-900">{item.customerNote}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-2 text-sm text-right">
                            <div className="flex justify-between"><span>Ara Toplam</span><span>{order.total.toLocaleString('tr-TR')} TL</span></div>
                            <div className="flex justify-between text-green-600"><span>Kargo</span><span>{order.shippingCost ? `${order.shippingCost} TL` : 'Ücretsiz'}</span></div>
                            {order.couponCode && (
                                <div className="flex justify-between text-purple-600"><span>Kupon ({order.couponCode})</span><span>-{order.couponDiscount?.toLocaleString('tr-TR')} TL</span></div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Genel Toplam</span><span>{order.total.toLocaleString('tr-TR')} TL</span></div>
                        </div>
                    </div>

                    {/* Order Note */}
                    {order.note && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><MessageSquare size={18} /> Sipariş Notu</h3>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{order.note}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold mb-6 flex items-center gap-2"><Truck size={18} /> Sipariş Geçmişi</h3>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pl-8 pb-2">
                            <div className="relative">
                                <div className="absolute -left-[39px] w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                                <p className="font-bold text-sm">Sipariş Oluşturuldu</p>
                                <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${order.status !== 'Beklemede' && order.status !== 'İptal Edildi' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <p className="font-bold text-sm">Durum: {order.status}</p>
                                <p className="text-xs text-gray-500">Güncel</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><User size={18} /> Müşteri Bilgileri</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold">
                                    {order.customer.firstName.charAt(0)}{order.customer.lastName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold">{order.customer.firstName} {order.customer.lastName}</p>
                                    <p className="text-gray-500">Misafir / Üye</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center text-gray-600">
                                <Mail size={16} /> {order.customer.email}
                            </div>
                            <div className="flex gap-2 items-center text-gray-600">
                                <Phone size={16} /> {order.customer.phone}
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Teslimat Adresi</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {order.customer.address} <br />
                                {order.customer.city}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard size={18} /> Ödeme Detayları</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Yöntem:</span>
                                <span className="font-bold">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Durum:</span>
                                <span className="text-green-600 font-bold">Ödendi / Bekleniyor</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
