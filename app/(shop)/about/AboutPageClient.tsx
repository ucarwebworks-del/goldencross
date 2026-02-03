'use client';
import Image from 'next/image';
import { Award, ShieldCheck, Truck } from 'lucide-react';
import { usePages } from '@/context/PageContext';

export default function AboutPageClient() {
    const { getPage } = usePages();
    // Check both slugs for compatibility
    const aboutPage = getPage('hakkimizda') || getPage('about-us');

    // Try to parse JSON content (new format with media)
    let content = aboutPage?.content || '';
    let heroImage = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2000';
    let heroVideo = '';
    let mediaType = 'image';
    let galleryImages: string[] = [];

    try {
        const parsed = JSON.parse(content);
        content = parsed.content || content;
        heroImage = parsed.heroImage || heroImage;
        heroVideo = parsed.heroVideo || '';
        mediaType = parsed.mediaType || 'image';
        galleryImages = parsed.galleryImages || [];
    } catch {
        // Content is plain HTML, use as-is
    }

    return (
        <div className="bg-[#111111]">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                {mediaType === 'video' && heroVideo ? (
                    <video
                        src={heroVideo}
                        autoPlay
                        muted
                        loop
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <img
                        src={heroImage}
                        alt="About Hero"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="relative z-20 text-center text-white px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{aboutPage?.title || 'Hakkımızda'}</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Sanat ve teknolojiyi buluşturarak yaşam alanlarınıza değer katıyoruz.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="container py-12 md:py-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    <div>
                        <h2 className="text-sm text-[#00E676] font-bold uppercase tracking-wider mb-2">GOLDEN GLASS 777</h2>
                        <h3 className="text-3xl font-bold mb-6 text-white">Hikayemiz & Vizyonumuz</h3>
                        <div
                            className="space-y-4 text-gray-400 leading-relaxed prose prose-lg max-w-none prose-invert"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                    <div className="relative h-[300px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                        <img
                            src={galleryImages[0] || "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=1200"}
                            alt="Production Process"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Gallery Section - if there are gallery images */}
            {galleryImages.length > 1 && (
                <div className="container pb-12 md:pb-20 px-4">
                    <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">Galeri</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {galleryImages.slice(1).map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5">
                                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features Grid */}
            <div className="bg-[#1a1a1a] py-12 md:py-20 border-t border-white/5">
                <div className="container px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <div className="bg-[#111111] p-8 rounded-xl shadow-sm border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-14 h-14 bg-white/5 text-[#00E676] rounded-full flex items-center justify-center mb-6">
                                <Award size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-white">Premium Kalite</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                4mm kalınlığında, kırılmaya karşı güçlendirilmiş temperli cam kullanıyoruz. Kenarları rodajlıdır ve kesici özelliği yoktur.
                            </p>
                        </div>
                        <div className="bg-[#111111] p-8 rounded-xl shadow-sm border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-14 h-14 bg-white/5 text-[#00E676] rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-white">%100 Müşteri Memnuniyeti</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Üretimden teslimata kadar her aşamada kalite kontrol. Olası kargo hasarlarına karşı koşulsuz iade ve değişim garantisi.
                            </p>
                        </div>
                        <div className="bg-[#111111] p-8 rounded-xl shadow-sm border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-14 h-14 bg-white/5 text-[#00E676] rounded-full flex items-center justify-center mb-6">
                                <Truck size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-white">Hızlı ve Güvenli Kargo</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Özel korumalı ambalajlarımızla ürünlerinizi hasarsız bir şekilde kapınıza kadar ulaştırıyoruz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
