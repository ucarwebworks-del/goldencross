'use client';
import { useState } from 'react';
import { useReviews } from '@/context/ReviewContext';
import { Star, Send, User, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ProductReviewsProps {
    productId: string;
    productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
    const { getProductReviews, getProductRating, addReview } = useReviews();
    const reviews = getProductReviews(productId);
    const { average, count } = getProductRating(productId);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        rating: 5,
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.customerName || !formData.customerEmail || !formData.comment) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            addReview({
                productId,
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                rating: formData.rating,
                comment: formData.comment
            });

            toast.success('Yorumunuz gönderildi! Onaylandıktan sonra yayınlanacaktır.');
            setFormData({ customerName: '', customerEmail: '', rating: 5, comment: '' });
            setShowForm(false);
            setIsSubmitting(false);
        }, 500);
    };

    const renderStars = (rating: number, interactive = false, onSelect?: (r: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && onSelect?.(star)}
                        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
                        disabled={!interactive}
                    >
                        <Star
                            size={interactive ? 28 : 18}
                            className={star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-500 hover:text-yellow-300'}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="mt-12 pt-12 border-t border-white/10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Müşteri Yorumları</h2>
                    {count > 0 && (
                        <div className="flex items-center gap-3 mt-2">
                            {renderStars(Math.round(average))}
                            <span className="text-gray-400">
                                {average} / 5 ({count} değerlendirme)
                            </span>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Yorum Yaz
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 border border-white/10">
                    <h3 className="font-bold mb-4 text-white">Yorum Ekle</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Adınız *</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none"
                                    placeholder="Adınız Soyadınız"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">E-posta *</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={formData.customerEmail}
                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Puanınız *</label>
                        {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Yorumunuz *</label>
                        <div className="relative">
                            <MessageSquare size={18} className="absolute left-4 top-4 text-gray-500" />
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none resize-none h-32"
                                placeholder="Bu ürün hakkındaki düşüncelerinizi paylaşın..."
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-3 border border-white/20 rounded-xl font-medium text-white hover:bg-white/10 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-bold text-white">{review.customerName}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-white/10">
                    <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Henüz yorum yapılmamış.</p>
                    <p className="text-sm text-gray-500 mt-1">İlk yorumu siz yapın!</p>
                </div>
            )}
        </div>
    );
}
