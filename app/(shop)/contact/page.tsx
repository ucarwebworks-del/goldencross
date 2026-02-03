'use client';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useMessages } from '@/context/MessageContext';
import { useState } from 'react';

export default function ContactPage() {
    const { settings } = useSettings();
    const { addMessage } = useMessages();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMessage(formData);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });

        // Reset success message after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
    };

    // Helper function to handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[#111111]">
            {/* Header */}
            <div className="bg-[#1a1a1a] py-12 md:py-16 text-center border-b border-white/10 px-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">İletişim</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                    Sorularınız, önerileriniz veya özel siparişleriniz için bizimle iletişime geçin.
                    Ekibimiz size en kısa sürede dönüş yapacaktır.
                </p>
            </div>

            <div className="container py-10 md:py-16 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-8 text-white">Bize Ulaşın</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <MapPin size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1 text-white">Adres</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {settings.address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <Phone size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1 text-white">Telefon</h3>
                                    <p className="text-gray-400 text-sm">
                                        {settings.phone}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Hafta içi 09:00 - 18:00
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                    <Mail size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1 text-white">E-posta</h3>
                                    <p className="text-gray-400 text-sm">
                                        {settings.email}
                                    </p>
                                </div>
                            </div>

                            {settings.whatsappActive && (
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                                        <Phone size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1 text-white">WhatsApp</h3>
                                        <p className="text-gray-400 text-sm">
                                            {settings.whatsapp}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(settings.instagramActive || settings.facebookActive || settings.twitterActive) && (
                                <div className="flex gap-4 mt-8 pt-8 border-t border-white/10">
                                    {settings.instagramActive && (
                                        <a href={`https://instagram.com/${settings.instagram}`} className="bg-white/5 p-3 rounded-xl hover:bg-white hover:text-black text-gray-400 transition-colors">
                                            <Instagram size={20} />
                                        </a>
                                    )}
                                    {settings.facebookActive && (
                                        <a href={`https://facebook.com/${settings.facebook}`} className="bg-white/5 p-3 rounded-xl hover:bg-white hover:text-black text-gray-400 transition-colors">
                                            <Facebook size={20} />
                                        </a>
                                    )}
                                    {settings.twitterActive && (
                                        <a href={`https://twitter.com/${settings.twitter}`} className="bg-white/5 p-3 rounded-xl hover:bg-white hover:text-black text-gray-400 transition-colors">
                                            <Twitter size={20} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-white">Mesaj Gönderin</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'success' && (
                                <div className="bg-green-900/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-center font-bold animate-in fade-in slide-in-from-top-2">
                                    Mesajınız başarıyla gönderildi! Size en kısa sürede dönüş yapacağız.
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold mb-2 text-white">Adınız Soyadınız</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:bg-white/10 text-white outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-white">E-posta Adresiniz</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:bg-white/10 text-white outline-none transition-all placeholder:text-gray-600"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-white">Mesajınız</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-lg focus:border-white/30 focus:bg-white/10 text-white outline-none transition-all resize-none placeholder:text-gray-600"
                                    placeholder="Sorularınız veya görüşleriniz..."
                                ></textarea>
                            </div>
                            <button className="w-full h-14 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                                Gönder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
