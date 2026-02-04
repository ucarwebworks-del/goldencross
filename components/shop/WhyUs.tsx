'use client';
import { useRef } from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const FEATURES = [
    {
        icon: ShieldCheck,
        title: 'Kırılmaya Dayanıklı',
        desc: '4mm temperli cam ile 10 kat daha güvenli.'
    },
    {
        icon: Award,
        title: 'UV Baskı Teknolojisi',
        desc: 'Solmayan, canlı ve gerçekçi renkler.'
    },
    {
        icon: Truck,
        title: 'Ücretsiz & Sigortalı',
        desc: 'Tüm siparişlerde ücretsiz ve sigortalı kargo.'
    },
    {
        icon: RotateCcw,
        title: 'Koşulsuz İade',
        desc: '14 gün içinde sorgusuz sualsiz iade hakkı.'
    }
];

export default function WhyUs() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 280;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="section border-t border-white/10">
            <div className="container">
                {/* Desktop: Grid layout */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="bg-white/10 text-accent p-3 rounded-lg">
                                <feature.icon size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1 text-white">{feature.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: Horizontal scroll */}
                <div className="md:hidden relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4"
                    >
                        {FEATURES.map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-44 bg-white/5 p-3 rounded-xl snap-start"
                            >
                                <div className="bg-white/10 text-accent p-2 rounded-lg w-fit mb-2">
                                    <feature.icon size={18} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-bold text-sm mb-1 text-white">{feature.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Scroll indicator dots */}
                    <div className="flex justify-center gap-2 mt-2">
                        {FEATURES.map((_, idx) => (
                            <div key={idx} className="w-2 h-2 rounded-full bg-white/20" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
