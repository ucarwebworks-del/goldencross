'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterSidebar() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        size: true,
        price: true,
        theme: false
    });

    const toggle = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <aside className="w-64 flex-shrink-0 hidden lg:block pr-8 border-r border-white/10">
            <div className="sticky top-24 space-y-6">
                <h3 className="font-bold text-lg mb-4 text-white">Filtreler</h3>

                {/* Size Filter */}
                <div className="border-b border-white/10 pb-4">
                    <button
                        onClick={() => toggle('size')}
                        className="flex items-center justify-between w-full font-semibold mb-3 text-white hover:text-accent transition-colors"
                    >
                        <span>Ölçü</span>
                        {openSections.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {openSections.size && (
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {['30x40 cm', '40x60 cm', '50x70 cm', '70x100 cm', '100x150 cm'].map(size => (
                                <label key={size} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded checked:bg-white checked:border-white transition-colors bg-transparent" />
                                        <svg className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{size}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Filter */}
                <div className="border-b border-white/10 pb-4">
                    <button
                        onClick={() => toggle('price')}
                        className="flex items-center justify-between w-full font-semibold mb-3 text-white hover:text-accent transition-colors"
                    >
                        <span>Fiyat</span>
                        {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {openSections.price && (
                        <div className="space-y-4">
                            <div className="flex gap-2 items-center">
                                <input type="number" placeholder="Min" className="w-full bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-600 rounded px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="Max" className="w-full bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-600 rounded px-2 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme/Collection Filter */}
                <div className="border-b border-white/10 pb-4">
                    <button
                        onClick={() => toggle('theme')}
                        className="flex items-center justify-between w-full font-semibold mb-3 text-white hover:text-accent transition-colors"
                    >
                        <span>Tema</span>
                        {openSections.theme ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {openSections.theme && (
                        <div className="space-y-2">
                            {['Doğa', 'Soyut', 'Şehir', 'Hayvanlar', 'Pop Art', 'Minimal'].map(theme => (
                                <label key={theme} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer appearance-none w-4 h-4 border border-white/20 rounded checked:bg-white checked:border-white transition-colors bg-transparent" />
                                        <svg className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{theme} (12)</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
