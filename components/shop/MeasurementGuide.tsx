import { Ruler, CheckCircle, Maximize } from 'lucide-react';

const STEPS = [
    {
        icon: Ruler,
        title: '1. Duvarınızı Ölçün',
        desc: 'Tabloyu asacağınız alanı mezura ile ölçün. Mobilyalarınızla orantılı olmasına dikkat edin.'
    },
    {
        icon: Maximize,
        title: '2. Boyut Seçin',
        desc: 'Yatay (40x60) veya Dikey (50x70) formatlardan alanınıza en uygun olanı belirleyin.'
    },
    {
        icon: CheckCircle,
        title: '3. Sipariş Verin',
        desc: 'Modeli seçin, ölçüyü işaretleyin ve güvenle siparişinizi oluşturun.'
    }
];

export default function MeasurementGuide() {
    return (
        <section className="section bg-primary text-white">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Ölçü Seçimi Nasıl Yapılır?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Evinize en uygun tabloyu seçmek için bu basit adımları izleyin.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className="bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <div className="bg-accent text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <step.icon size={32} />
                            </div>
                            <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
