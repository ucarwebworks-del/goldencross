'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPageClient() {
    const { signIn, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    if (user) {
        router.push('/account');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn(email, password);

        if (result.success) {
            router.push('/account');
        } else {
            setError(result.error || 'Giriş başarısız');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-[#111111] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Giriş Yap</h1>
                    <p className="text-gray-400">Siparişlerinizi takip edin ve hesabınızı yönetin</p>
                </div>

                {/* Form */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">E-posta</label>
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Şifre</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link href="/forgot-password" className="text-sm text-[#00E676] hover:underline">
                                Şifremi Unuttum
                            </Link>
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
                                    Giriş Yapılıyor...
                                </>
                            ) : (
                                <>
                                    Giriş Yap
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-gray-400">
                            Hesabınız yok mu?{' '}
                            <Link href="/register" className="text-[#00E676] font-medium hover:underline">
                                Üye Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
