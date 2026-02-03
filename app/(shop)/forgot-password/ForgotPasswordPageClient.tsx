'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPageClient() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await resetPassword(email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'E-posta gönderilemedi');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] bg-[#111111] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Şifremi Unuttum</h1>
                    <p className="text-gray-400">E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz</p>
                </div>

                {/* Form */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 sm:p-8">
                    {success ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-[#00E676]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-[#00E676]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">E-posta Gönderildi!</h3>
                            <p className="text-gray-400 mb-6">
                                <strong className="text-white">{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
                                Lütfen e-postanızı kontrol edin.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-[#00E676] hover:underline"
                            >
                                <ArrowLeft size={18} />
                                Giriş Sayfasına Dön
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">E-posta Adresi</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all outline-none"
                                        placeholder="ornek@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#00E676] text-black font-bold rounded-xl hover:bg-[#00c853] disabled:bg-gray-600 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    'Şifre Sıfırlama Bağlantısı Gönder'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Back Link */}
                    {!success && (
                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
                                <ArrowLeft size={18} />
                                Giriş Sayfasına Dön
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
