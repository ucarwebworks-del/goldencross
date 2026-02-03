import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

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
    return (
        <section className="section border-t border-white/10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            </div>
        </section>
    );
}
