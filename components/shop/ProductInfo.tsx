'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Share2, Truck, ShieldCheck, HelpCircle, Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Product, ProductOption } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useReviews } from '@/context/ReviewContext';

export default function ProductInfo({ product }: { product: Product }) {
    // Dynamic State for Options
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const router = useRouter();
    const { getProductRating } = useReviews();

    // Customer Upload/Note State
    const [customerImage, setCustomerImage] = useState<string>('');
    const [customerNote, setCustomerNote] = useState<string>('');

    // Initialize defaults
    useEffect(() => {
        if (product.options) {
            const defaults: Record<string, string> = {};
            product.options.forEach(opt => {
                if (opt.values.length > 0) {
                    defaults[opt.name] = opt.values[0].value;
                }
            });
            setSelectedOptions(defaults);
        }
    }, [product]);

    const handleOptionSelect = (name: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [name]: value }));
    };

    // Handle customer image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomerImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Calculate Price Diff
    let additionalPrice = 0;
    product.options?.forEach(opt => {
        const selectedVal = selectedOptions[opt.name];
        if (selectedVal) {
            const valObj = opt.values.find(v => v.value === selectedVal);
            if (valObj) additionalPrice += valObj.priceDiff;
        }
    });

    const totalPrice = product.price + additionalPrice;
    const oldTotalPrice = product.oldPrice ? product.oldPrice + additionalPrice : undefined;

    const handleAddToCart = () => {
        const format = selectedOptions['Ölçü'] || selectedOptions['Size'] || '';
        const frame = selectedOptions['Çerçeve'] || selectedOptions['Frame'] || '';

        addToCart({
            ...product,
            price: totalPrice,
        }, qty, format, frame, customerImage, customerNote);
    };

    return (
        <div className="space-y-4 md:space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-white">
                    {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-3">
                    {(() => {
                        const { average, count } = getProductRating(product.id);
                        const stars = count > 0 ? Math.round(average) : 5;
                        return (
                            <>
                                <div className="flex text-yellow-500">
                                    {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                                </div>
                                <span className="text-gray-400">
                                    {count > 0 ? `${count} Değerlendirme` : 'Henüz değerlendirme yok'}
                                </span>
                            </>
                        );
                    })()}
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <span className="text-gray-400">SKU: {product.sku}</span>
                </div>

                <div className="flex items-end gap-3">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{totalPrice.toLocaleString('tr-TR')} TL</span>
                    {oldTotalPrice && (
                        <span className="text-lg sm:text-xl text-gray-500 line-through mb-1">
                            {oldTotalPrice.toLocaleString('tr-TR')} TL
                        </span>
                    )}
                </div>
                <p className="text-green-500 text-xs sm:text-sm font-medium mt-1">
                    3 gün içinde kargoda • Ücretsiz Kargo
                </p>
            </div>

            <hr className="border-white/10" />

            {/* Dynamic Variants */}
            <div className="space-y-6">
                {product.options?.map(option => (
                    <div key={option.id}>
                        <div className="flex justify-between mb-3">
                            <label className="font-bold text-sm uppercase tracking-wide text-gray-300">{option.name}</label>
                            {option.name === 'Ölçü' && (
                                <button className="text-xs text-gray-400 underline flex items-center gap-1 hover:text-white">
                                    <HelpCircle size={12} /> Ölçü Rehberi
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {option.values.map(valObj => {
                                const isSelected = selectedOptions[option.name] === valObj.value;
                                return (
                                    <button
                                        key={valObj.value}
                                        onClick={() => handleOptionSelect(option.name, valObj.value)}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all flex flex-col items-center gap-1 ${isSelected
                                            ? 'border-white bg-white text-black shadow-lg transform scale-105'
                                            : 'border-white/10 hover:border-white/30 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <span>{valObj.value}</span>
                                        {valObj.priceDiff > 0 && (
                                            <span className={`text-[10px] ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                                                +{valObj.priceDiff} TL
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Upload Section */}
            {(product.allowCustomerUpload || product.allowCustomerNote) && (
                <div className="space-y-4 bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-500 font-bold">
                        <FileText size={18} />
                        <span>Kişiselleştirme</span>
                    </div>

                    {/* Customer Image Upload */}
                    {product.allowCustomerUpload && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <ImageIcon size={14} className="inline mr-1" />
                                Fotoğrafınızı Yükleyin
                            </label>
                            {!customerImage ? (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-500/30 rounded-lg cursor-pointer bg-white/5 hover:bg-amber-900/20 transition-colors">
                                    <Upload size={24} className="text-amber-500 mb-2" />
                                    <span className="text-sm text-gray-400">Fotoğraf seçin veya sürükleyin</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                                    <img src={customerImage} alt="Yüklenen" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setCustomerImage('')}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Customer Note */}
                    {product.allowCustomerNote && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FileText size={14} className="inline mr-1" />
                                Notunuz
                            </label>
                            <textarea
                                value={customerNote}
                                onChange={(e) => setCustomerNote(e.target.value)}
                                placeholder="Özel isteklerinizi veya notunuzu buraya yazın..."
                                className="w-full p-3 border border-white/10 bg-white/5 text-white rounded-lg resize-none h-20 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none placeholder:text-gray-600"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4">
                <div className="flex gap-4 h-14">
                    <div className="flex items-center border border-white/20 rounded-full px-4 w-32 justify-between text-white">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-white/10 rounded-full"><Minus size={16} /></button>
                        <span className="font-bold font-mono text-lg">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-white/10 rounded-full"><Plus size={16} /></button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-accent text-primary rounded-full font-bold text-lg hover:bg-accent/90 transition-shadow hover:shadow-xl active:scale-95 transform duration-100"
                    >
                        Sepete Ekle
                    </button>
                </div>
                <button
                    onClick={() => {
                        handleAddToCart();
                        router.push('/checkout');
                    }}
                    className="w-full h-12 border-2 border-white rounded-full font-bold text-white hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm"
                >
                    Hemen Satın Al
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 pt-4 bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                    <Truck size={18} className="text-white" />
                    <span>Hızlı ve Ücretsiz Kargo</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-white" />
                    <span>%100 Kırılmazlık Garantisi</span>
                </div>
            </div>

        </div>
    );
}
