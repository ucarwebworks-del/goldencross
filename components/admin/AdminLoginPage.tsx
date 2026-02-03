'use client';
import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginPage() {
    const { login } = useAdminAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLocked) {
            setError('Çok fazla başarısız deneme. Lütfen 30 saniye bekleyin.');
            return;
        }

        if (!username || !password) {
            setError('Kullanıcı adı ve şifre gereklidir.');
            return;
        }

        setIsLoading(true);

        // Simulate network delay for security
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(username, password);

        if (success) {
            // Redirect will happen via layout check
            window.location.reload();
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 5) {
                setIsLocked(true);
                setError('Çok fazla başarısız deneme. 30 saniye beklemeniz gerekiyor.');
                setTimeout(() => {
                    setIsLocked(false);
                    setAttempts(0);
                }, 30000);
            } else {
                setError(`Kullanıcı adı veya şifre hatalı. (${5 - newAttempts} deneme kaldı)`);
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-4">
                        <Shield size={32} className="text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        glass<span className="text-amber-400">panel</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Yönetim Paneli Girişi</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                    placeholder="admin"
                                    autoComplete="username"
                                    disabled={isLocked}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    disabled={isLocked}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isLocked}
                        className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Giriş yapılıyor...
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                Giriş Yap
                            </>
                        )}
                    </button>
                </form>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        🔒 Bu sayfa güvenlik amacıyla korunmaktadır.
                    </p>
                </div>
            </div>
        </div>
    );
}
