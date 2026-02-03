'use client';
import { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Save, User, Lock, Eye, EyeOff, Check, X, Shield, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function UserSettingsPage() {
    const { user, changePassword, updateUsername, logout } = useAdminAuth();

    // Username change
    const [newUsername, setNewUsername] = useState('');
    const [usernamePassword, setUsernamePassword] = useState('');
    const [showUsernamePassword, setShowUsernamePassword] = useState(false);

    // Password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUsernameChange = () => {
        if (!newUsername.trim()) {
            toast.error('Yeni kullanıcı adı gereklidir');
            return;
        }
        if (!usernamePassword) {
            toast.error('Şifrenizi doğrulamanız gerekiyor');
            return;
        }
        if (newUsername.length < 3) {
            toast.error('Kullanıcı adı en az 3 karakter olmalıdır');
            return;
        }

        const success = updateUsername(newUsername, usernamePassword);
        if (success) {
            toast.success('Kullanıcı adı başarıyla güncellendi');
            setNewUsername('');
            setUsernamePassword('');
        } else {
            toast.error('Şifre hatalı');
        }
    };

    const handlePasswordChange = () => {
        if (!currentPassword) {
            toast.error('Mevcut şifrenizi girmelisiniz');
            return;
        }
        if (!newPassword) {
            toast.error('Yeni şifre gereklidir');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Yeni şifre en az 6 karakter olmalıdır');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Yeni şifreler eşleşmiyor');
            return;
        }
        if (currentPassword === newPassword) {
            toast.error('Yeni şifre mevcut şifreden farklı olmalıdır');
            return;
        }

        const success = changePassword(currentPassword, newPassword);
        if (success) {
            toast.success('Şifre başarıyla güncellendi');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast.error('Mevcut şifre hatalı');
        }
    };

    const handleLogout = () => {
        if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
            logout();
            window.location.reload();
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(newPassword);
    const strengthLabels = ['Çok Zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok Güçlü'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield size={28} /> Kullanıcı Ayarları
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Hesap güvenliği ve kimlik bilgileri</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                    <LogOut size={18} /> Çıkış Yap
                </button>
            </div>

            {/* Current User Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="font-bold text-lg mb-4 pb-2 border-b border-gray-100">Mevcut Bilgiler</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Kullanıcı Adı</p>
                        <p className="font-bold text-lg">{user?.username || 'admin'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Son Giriş</p>
                        <p className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : 'Bilinmiyor'}</p>
                    </div>
                </div>
            </div>

            {/* Change Username */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <User size={20} /> Kullanıcı Adını Değiştir
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Yeni Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                            placeholder="Yeni kullanıcı adınızı girin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Şifrenizi Doğrulayın</label>
                        <div className="relative">
                            <input
                                type={showUsernamePassword ? 'text' : 'password'}
                                value={usernamePassword}
                                onChange={(e) => setUsernamePassword(e.target.value)}
                                className="w-full p-3 pr-12 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Mevcut şifreniz"
                            />
                            <button
                                type="button"
                                onClick={() => setShowUsernamePassword(!showUsernamePassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showUsernamePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleUsernameChange}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
                    >
                        <Save size={18} /> Kullanıcı Adını Güncelle
                    </button>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <Lock size={20} /> Şifre Değiştir
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Mevcut Şifre</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-3 pr-12 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Mevcut şifreniz"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Yeni Şifre</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 pr-12 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="En az 6 karakter"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {newPassword && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Şifre gücü: <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Çok Zayıf'}</span>
                                </p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Yeni Şifre (Tekrar)</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 pr-12 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-black transition-all outline-none"
                                placeholder="Yeni şifrenizi tekrar girin"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {/* Password Match Indicator */}
                        {confirmPassword && (
                            <div className="mt-2 flex items-center gap-2">
                                {newPassword === confirmPassword ? (
                                    <>
                                        <Check size={14} className="text-green-600" />
                                        <span className="text-xs text-green-600 font-medium">Şifreler eşleşiyor</span>
                                    </>
                                ) : (
                                    <>
                                        <X size={14} className="text-red-600" />
                                        <span className="text-xs text-red-600 font-medium">Şifreler eşleşmiyor</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handlePasswordChange}
                        disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                        <Lock size={18} /> Şifreyi Güncelle
                    </button>
                </div>
            </div>

            {/* Security Tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
                🔐 <strong>Güvenlik İpuçları:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside text-amber-700">
                    <li>Güçlü bir şifre için büyük/küçük harf, rakam ve özel karakter kullanın</li>
                    <li>Şifrenizi kimseyle paylaşmayın</li>
                    <li>Düzenli olarak şifrenizi değiştirin</li>
                </ul>
            </div>
        </div>
    );
}
