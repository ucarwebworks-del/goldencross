'use client';
import { useState } from 'react';
import { useReviews, Review } from '@/context/ReviewContext';
import { useProducts } from '@/context/ProductContext';
import { Check, X, Trash2, Star, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
    const { reviews, approveReview, rejectReview, deleteReview, pendingCount } = useReviews();
    const { products } = useProducts();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredReviews = reviews
        .filter(r => {
            if (filter === 'pending') return !r.isApproved;
            if (filter === 'approved') return r.isApproved;
            return true;
        })
        .filter(r => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return r.customerName.toLowerCase().includes(searchLower) ||
                r.comment.toLowerCase().includes(searchLower) ||
                r.customerEmail.toLowerCase().includes(searchLower);
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const getProductName = (productId: string) => {
        const product = products.find(p => p.id === productId);
        return product?.name || 'Bilinmeyen Ürün';
    };

    const handleApprove = (id: string) => {
        approveReview(id);
        toast.success('Yorum onaylandı');
    };

    const handleReject = (id: string) => {
        rejectReview(id);
        toast.success('Yorum reddedildi');
    };

    const handleDelete = (id: string) => {
        deleteReview(id);
        setDeleteConfirm(null);
        toast.success('Yorum silindi');
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Müşteri Yorumları</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {pendingCount > 0
                            ? `${pendingCount} yorum onay bekliyor`
                            : 'Tüm yorumlar onaylandı'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Bekleyen ({reviews.filter(r => !r.isApproved).length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Onaylı ({reviews.filter(r => r.isApproved).length})
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Tümü ({reviews.length})
                    </button>
                </div>

                <div className="relative flex-1 max-w-xs">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Yorum ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-xl border p-12 text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                        {filter === 'pending'
                            ? 'Onay bekleyen yorum yok'
                            : 'Bu kriterlere uygun yorum bulunamadı'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map(review => (
                        <div
                            key={review.id}
                            className={`bg-white rounded-xl border p-5 ${!review.isApproved ? 'border-yellow-300 bg-yellow-50/50' : ''}`}
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold">{review.customerName}</p>
                                            <p className="text-sm text-gray-500">{review.customerEmail}</p>
                                        </div>
                                        <div className="text-right">
                                            {renderStars(review.rating)}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Product */}
                                    <p className="text-sm text-gray-500 mb-2">
                                        Ürün: <span className="font-medium text-black">{getProductName(review.productId)}</span>
                                    </p>

                                    {/* Comment */}
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{review.comment}</p>

                                    {/* Status Badge */}
                                    <div className="mt-3">
                                        {review.isApproved ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                <Check size={12} /> Onaylı
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                                                <AlertCircle size={12} /> Onay Bekliyor
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 md:w-32">
                                    {!review.isApproved && (
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            className="flex-1 md:w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Check size={16} /> Onayla
                                        </button>
                                    )}
                                    {review.isApproved && (
                                        <button
                                            onClick={() => handleReject(review.id)}
                                            className="flex-1 md:w-full px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <X size={16} /> Geri Al
                                        </button>
                                    )}

                                    {deleteConfirm === review.id ? (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded-lg"
                                            >
                                                Evet
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-xs rounded-lg"
                                            >
                                                Hayır
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(review.id)}
                                            className="flex-1 md:w-full px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Trash2 size={16} /> Sil
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
