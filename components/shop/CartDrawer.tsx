'use client';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal } = useCart();

    // Prevent background scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity" onClick={closeCart} />
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1a1a1a] z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Sepetim ({items.length})</h2>
                    <button onClick={closeCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <p>Sepetiniz şu an boş.</p>
                            <button onClick={closeCart} className="mt-4 text-white font-bold underline hover:text-accent">Alışverişe Başla</button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-24 bg-[#222] rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                                    {item.images && item.images[0] ? (
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#333] flex items-center justify-center text-xs text-gray-500">No Image</div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-sm mb-1 text-white">{item.name}</h3>
                                        <p className="text-xs text-gray-400">{item.selectedFormat} - {item.selectedFrame}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-white/20 rounded-full px-2 py-1 gap-3">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white"><Minus size={14} /></button>
                                            <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white"><Plus size={14} /></button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-white">{item.price.toLocaleString('tr-TR')} TL</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 underline mt-1 hover:text-red-400">Sil</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-white/5">
                        <div className="flex justify-between mb-4 text-white">
                            <span className="text-gray-400">Ara Toplam</span>
                            <span className="font-bold text-lg">{subtotal.toLocaleString('tr-TR')} TL</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 text-center">Kargo ve vergiler ödeme adımında hesaplanır.</p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-accent text-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all uppercase tracking-widest text-sm shadow-lg hover:shadow-accent/20"
                        >
                            Ödemeye Geç <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
