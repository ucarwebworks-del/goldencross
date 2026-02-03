'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useBanners } from '@/context/BannerContext';

export default function Hero() {
    const { banners } = useBanners();
    const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % activeBanners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeBanners.length]);

    if (activeBanners.length === 0) {
        return null; // No active banners
    }

    return (
        <section className="relative h-[600px] w-full overflow-hidden bg-[#111111]">
            {activeBanners.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Content */}
                    <div className="relative container h-full flex items-center">
                        <div className="max-w-2xl text-white px-4">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up">
                                {slide.title}
                            </h1>
                            <p className="text-xl mb-8 text-gray-200 animate-fade-in-up delay-100">
                                {slide.subtitle}
                            </p>
                            <Link
                                href={slide.link}
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-accent transition-colors animate-fade-in-up delay-200"
                            >
                                {slide.cta} <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {activeBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === current ? 'bg-white w-8' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
