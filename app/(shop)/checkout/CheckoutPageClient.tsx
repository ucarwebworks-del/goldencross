'use client';
import { useState, useEffect } from 'react';
import { useBankAccounts } from '@/context/BankContext';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useSettings } from '@/context/SettingsContext';
import { useCoupons } from '@/context/CouponContext';
import { useRouter } from 'next/navigation';
import { getCities, getDistricts, getNeighborhoods } from '@/data/turkeyLocations';
import {
    CheckCircle, CreditCard, Building2, Truck, Tag, X,
    ChevronRight, ShieldCheck, MapPin, User, Phone, Mail,
    Home, Loader2, Check, AlertCircle, Copy
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CheckoutPageClient() {
    const { accounts } = useBankAccounts();
    const { items, cartTotal, clearCart } = useCart();
    const { addOrder } = useOrders();
    const { settings } = useSettings();
    const { validateCoupon, applyCoupon } = useCoupons();
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        neighborhood: '',
        address: '',
        note: ''
    });

    // Location dropdowns
    const [cities] = useState(getCities());
    const [districts, setDistricts] = useState<string[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<string[]>([]);

    // Coupon
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    // Pre-generated order number for bank transfer display
    const [preOrderNumber] = useState(() => `GG-${Date.now()}`);

    // Active bank accounts only
    const activeBankAccounts = accounts.filter(acc => acc.isActive);

    // Update districts when city changes
    useEffect(() => {
        if (formData.city) {
            setDistricts(getDistricts(formData.city));
            setFormData(prev => ({ ...prev, district: '', neighborhood: '' }));
        }
    }, [formData.city]);

    // Update neighborhoods when district changes
    useEffect(() => {
        if (formData.district) {
            setNeighborhoods(getNeighborhoods(formData.district));
            setFormData(prev => ({ ...prev, neighborhood: '' }));
        }
    }, [formData.district]);

    // Calculate totals
    const subtotal = cartTotal;
    const shippingCost = subtotal >= settings.freeShippingLimit ? 0 : (settings.shippingCost || 49);
    const couponDiscount = appliedCoupon?.discount || 0;
    const total = subtotal + shippingCost - couponDiscount;

    // Handle coupon application
    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;

        setCouponLoading(true);
        setCouponError('');

        setTimeout(() => {
            const result = validateCoupon(couponCode, subtotal);

            if (result.valid && result.coupon) {
                const discount = result.coupon.discountType === 'percentage'
                    ? (subtotal * result.coupon.discountValue / 100)
                    : result.coupon.discountValue;

                setAppliedCoupon({
                    code: result.coupon.code,
                    discount: Math.min(discount, subtotal)
                });
                setCouponCode('');
            } else {
                setCouponError(result.error || 'Geçersiz kupon');
            }
            setCouponLoading(false);
        }, 500);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    // Form validation
    const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.phone;
    const isStep2Valid = formData.city && formData.district && formData.address;

    // Handle submit
    const handleSubmit = async () => {
        setIsSubmitting(true);

        const newOrder = {
            orderNumber: preOrderNumber, // Use pre-generated order number
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.neighborhood ? formData.neighborhood + ', ' : ''}${formData.address}`,
                city: `${formData.city} / ${formData.district}`
            },
            items: items,
            total: total,
            paymentMethod: (paymentMethod === 'credit_card' ? 'Credit Card' : 'Bank Transfer') as 'Credit Card' | 'Bank Transfer',
            shippingCost: shippingCost,
            couponCode: appliedCoupon?.code,
            couponDiscount: appliedCoupon?.discount,
            note: formData.note
        };

        // Apply coupon usage
        if (appliedCoupon) {
            applyCoupon(appliedCoupon.code);
        }

        try {
            const createdOrder = await addOrder(newOrder);

            // Send order confirmation email
            try {
                await fetch('/api/send-order-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderNumber: preOrderNumber,
                        customer: newOrder.customer,
                        items: items.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            selectedFormat: item.selectedFormat,
                            selectedFrame: item.selectedFrame
                        })),
                        total: total,
                        shippingCost: shippingCost,
                        paymentMethod: newOrder.paymentMethod
                    })
                });
            } catch (emailError) {
                console.error('Email send failed:', emailError);
                // Continue even if email fails
            }

            clearCart();

            setTimeout(() => {
                if (createdOrder?.id) {
                    router.push(`/order-success/${createdOrder.id}`);
                } else {
                    router.push('/');
                }
            }, 1000);
        } catch (error) {
            console.error('Error creating order:', error);
            setIsSubmitting(false);
        }
    };

    // Empty cart check
    if (items.length === 0 && step === 1) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Truck size={40} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold mb-3">Sepetiniz Boş</h1>
                <p className="text-gray-500 mb-8">Henüz sepetinize ürün eklemediniz.</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                    Alışverişe Başla
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111111]">
            {/* Header */}
            <div className="bg-[#1a1a1a] border-b border-white/10 sticky top-0 z-30">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white">Güvenli Ödeme</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <ShieldCheck size={18} className="text-[#00E676]" />
                            <span>256-bit SSL Şifreleme</span>
                        </div>
                    </div>
                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-white text-black' : 'bg-white/10 text-gray-500'}`}>
                                {step > 1 ? <Check size={16} /> : '1'}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">Bilgiler</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-white text-black' : 'bg-white/10 text-gray-500'}`}>
                                {step > 2 ? <Check size={16} /> : '2'}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">Adres</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-white text-black' : 'bg-white/10 text-gray-500'}`}>
                                3
                            </div>
                            <span className="text-sm font-medium hidden sm:block">Ödeme</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Personal Info */}
                        <div className={`bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 overflow-hidden ${step !== 1 && 'opacity-60'}`}>
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step >= 1 ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white">Kişisel Bilgiler</h2>
                                        {step > 1 && <p className="text-sm text-gray-400">{formData.firstName} {formData.lastName}</p>}
                                    </div>
                                </div>
                                {step > 1 && (
                                    <button onClick={() => setStep(1)} className="text-sm text-[#00E676] hover:underline">
                                        Düzenle
                                    </button>
                                )}
                            </div>

                            {step === 1 && (
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white">Ad *</label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none"
                                                    placeholder="Adınız"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white">Soyad *</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none"
                                                placeholder="Soyadınız"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">E-posta *</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none"
                                                placeholder="ornek@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Telefon *</label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none"
                                                placeholder="05XX XXX XX XX"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!isStep1Valid}
                                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        Devam Et <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Address */}
                        <div className={`bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 overflow-hidden ${step < 2 && 'opacity-40 pointer-events-none'} ${step > 2 && 'opacity-60'}`}>
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step >= 2 ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white">Teslimat Adresi</h2>
                                        {step > 2 && <p className="text-sm text-gray-400">{formData.city} / {formData.district}</p>}
                                    </div>
                                </div>
                                {step > 2 && (
                                    <button onClick={() => setStep(2)} className="text-sm text-[#00E676] hover:underline">
                                        Düzenle
                                    </button>
                                )}
                            </div>

                            {step === 2 && (
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white">İl *</label>
                                            <select
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white transition-all outline-none appearance-none [&>option]:bg-[#111111]"
                                                required
                                            >
                                                <option value="">İl Seçin</option>
                                                {cities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white">İlçe *</label>
                                            <select
                                                value={formData.district}
                                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white transition-all outline-none appearance-none [&>option]:bg-[#111111]"
                                                disabled={!formData.city}
                                                required
                                            >
                                                <option value="">İlçe Seçin</option>
                                                {districts.map(district => (
                                                    <option key={district} value={district}>{district}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white">Mahalle</label>
                                            <input
                                                type="text"
                                                value={formData.neighborhood}
                                                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none"
                                                placeholder="Mahalle adı"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Açık Adres *</label>
                                        <div className="relative">
                                            <Home size={18} className="absolute left-4 top-4 text-gray-400" />
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none resize-none h-24"
                                                placeholder="Sokak, Cadde, Bina No, Daire No..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Sipariş Notu (Opsiyonel)</label>
                                        <textarea
                                            value={formData.note}
                                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none resize-none h-20"
                                            placeholder="Teslimat için özel notunuz..."
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-4 border border-white/10 rounded-xl font-medium text-white hover:bg-white/5 transition-colors"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            disabled={!isStep2Valid}
                                            className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                        >
                                            Devam Et <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Payment */}
                        <div className={`bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 overflow-hidden ${step < 3 && 'opacity-40 pointer-events-none'}`}>
                            <div className="p-5 border-b border-white/10 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step >= 3 ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>
                                    <CreditCard size={20} />
                                </div>
                                <h2 className="font-bold text-white">Ödeme Yöntemi</h2>
                            </div>

                            {step === 3 && (
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label
                                            className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'credit_card' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/20'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={paymentMethod === 'credit_card'}
                                                onChange={() => setPaymentMethod('credit_card')}
                                                className="w-5 h-5 text-white accent-white"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={20} className="text-[#00E676]" />
                                                    <span className="font-bold text-white">Kredi Kartı</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">Tüm kartlarla güvenle ödeme</p>
                                            </div>
                                        </label>

                                        {activeBankAccounts.length > 0 && (
                                            <label
                                                className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/20'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === 'bank_transfer'}
                                                    onChange={() => setPaymentMethod('bank_transfer')}
                                                    className="w-5 h-5 text-white accent-white"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 size={20} className="text-[#00E676]" />
                                                        <span className="font-bold text-white">Havale / EFT</span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">Banka havalesi ile ödeme</p>
                                                </div>
                                            </label>
                                        )}
                                    </div>

                                    {/* Bank Account Details */}
                                    {paymentMethod === 'bank_transfer' && activeBankAccounts.length > 0 && (
                                        <div className="bg-[#00E676]/5 border border-[#00E676]/20 rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4">
                                            {/* Order Number Display */}
                                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                                                <p className="text-sm text-white font-medium mb-2">Sipariş Numaranız</p>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <span className="font-mono font-bold text-lg sm:text-xl text-[#00E676] break-all">{preOrderNumber}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(preOrderNumber);
                                                            toast.success('Sipariş no kopyalandı!');
                                                        }}
                                                        className="w-full sm:w-auto px-3 py-2 bg-[#00E676] text-black text-sm font-medium rounded-lg hover:bg-[#00c853] transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <Copy size={14} /> Kopyala
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2 flex items-start gap-1">
                                                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                                    <span>Havale açıklamasına bu numarayı yazmayı unutmayın!</span>
                                                </p>
                                            </div>

                                            <p className="text-sm text-white font-medium">Aşağıdaki hesaplardan birine havale yapabilirsiniz:</p>
                                            {activeBankAccounts.map(account => (
                                                <div key={account.id} className="bg-[#1a1a1a] rounded-lg p-3 sm:p-4 border border-white/10 space-y-3">
                                                    <p className="font-bold text-white">{account.bankName}</p>

                                                    {/* Account Holder with Copy */}
                                                    <div className="space-y-1">
                                                        <span className="text-sm text-gray-400">Hesap Sahibi:</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-white text-sm flex-1">{account.accountHolder}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(account.accountHolder);
                                                                    toast.success('Hesap sahibi kopyalandı!');
                                                                }}
                                                                className="px-2 py-1.5 bg-white/10 text-white text-xs font-medium rounded hover:bg-white/20 transition-colors flex items-center gap-1 flex-shrink-0"
                                                            >
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* IBAN with Copy */}
                                                    <div className="space-y-1">
                                                        <span className="text-sm text-gray-400">IBAN:</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs sm:text-sm bg-white/5 text-gray-300 p-2 rounded flex-1 break-all">{account.iban}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(account.iban);
                                                                    toast.success('IBAN kopyalandı!');
                                                                }}
                                                                className="px-2 py-1.5 bg-[#00E676] text-black text-xs font-medium rounded hover:bg-[#00c853] transition-colors flex items-center gap-1 flex-shrink-0"
                                                            >
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Credit Card Info Notice */}
                                    {paymentMethod === 'credit_card' && (
                                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
                                            <div className="flex items-start gap-3">
                                                <ShieldCheck size={24} className="text-blue-400 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-blue-300">Güvenli Ödeme</p>
                                                    <p className="text-sm text-blue-400 mt-1">
                                                        Siparişi tamamladıktan sonra güvenli ödeme sayfasına yönlendirileceksiniz.
                                                        Tüm kart bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-6 py-4 border border-white/10 rounded-xl font-medium text-white hover:bg-white/5 transition-colors"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="flex-1 py-4 bg-[#00E676] text-black font-bold rounded-xl hover:bg-[#00c853] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>İşleniyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={18} />
                                                    <span>Tamamla ({total.toLocaleString('tr-TR')} TL)</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6 order-first lg:order-last">
                        {/* Order Items */}
                        <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 p-4 md:p-5 lg:sticky lg:top-32">
                            <h3 className="font-bold mb-4 text-white">Sipariş Özeti</h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto mb-4 custom-scrollbar">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {item.images && item.images.length > 0 ? (
                                                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/10" />
                                            )}
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate text-white">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.selectedFormat} {item.selectedFrame && `• ${item.selectedFrame}`}</p>
                                            <p className="text-sm font-bold mt-1 text-white">{(item.price * item.quantity).toLocaleString('tr-TR')} TL</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Input */}
                            <div className="border-t border-white/10 pt-4 mb-4">
                                <label className="block text-sm font-medium mb-2 text-white">İndirim Kuponu</label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-[#00E676]/5 border border-[#00E676]/20 rounded-xl p-3">
                                        <div className="flex items-center gap-2">
                                            <Tag size={18} className="text-[#00E676]" />
                                            <span className="font-mono font-bold text-[#00E676]">{appliedCoupon.code}</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-red-500 hover:text-red-400">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    placeholder="Kupon kodu"
                                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:ring-2 focus:ring-white/10 text-white placeholder:text-gray-600 transition-all outline-none font-mono uppercase"
                                                />
                                            </div>
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode.trim() || couponLoading}
                                                className="px-4 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {couponLoading ? <Loader2 size={18} className="animate-spin" /> : 'Uygula'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} /> {couponError}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-white/10 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Ara Toplam</span>
                                    <span className="text-white">{subtotal.toLocaleString('tr-TR')} TL</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-[#00E676]">
                                        <span>Kupon İndirimi</span>
                                        <span>-{appliedCoupon.discount.toLocaleString('tr-TR')} TL</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Kargo</span>
                                    {shippingCost === 0 ? (
                                        <span className="text-[#00E676] font-medium">Ücretsiz</span>
                                    ) : (
                                        <span className="text-white">{shippingCost.toLocaleString('tr-TR')} TL</span>
                                    )}
                                </div>

                                {shippingCost > 0 && (
                                    <p className="text-xs text-amber-300/80 bg-amber-900/20 p-2 rounded-lg border border-amber-500/20">
                                        {settings.freeShippingLimit.toLocaleString('tr-TR')} TL üzeri siparişlerde kargo ücretsiz!
                                    </p>
                                )}

                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                                    <span className="text-white">Toplam</span>
                                    <span className="text-white">{total.toLocaleString('tr-TR')} TL</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-white/10 p-5">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="space-y-2">
                                    <ShieldCheck size={28} className="mx-auto text-[#00E676]" />
                                    <p className="text-xs font-medium text-white">Güvenli Ödeme</p>
                                </div>
                                <div className="space-y-2">
                                    <Truck size={28} className="mx-auto text-blue-400" />
                                    <p className="text-xs font-medium text-white">Hızlı Teslimat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
