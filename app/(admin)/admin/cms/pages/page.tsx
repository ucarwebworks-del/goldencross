'use client';
import { useState, useEffect } from 'react';
import { usePages } from '@/context/PageContext';
import { Save, FileText } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { toast } from 'sonner';

export default function PagesManagement() {
    const { pages, updatePage } = usePages();

    // Only get legal pages (contracts)
    const legalPages = pages.filter(p => p.group === 'legal');

    const [selectedSlug, setSelectedSlug] = useState<string>(legalPages[0]?.slug || '');
    const [editContent, setEditContent] = useState('');

    const selectedPage = pages.find(p => p.slug === selectedSlug);

    useEffect(() => {
        if (selectedPage) {
            setEditContent(selectedPage.content || '');
        }
    }, [selectedSlug, selectedPage]);

    const handleSelect = (slug: string) => {
        setSelectedSlug(slug);
    };

    const handleSave = () => {
        if (selectedPage) {
            updatePage(selectedPage.slug, { content: editContent });
            toast.success('Sözleşme kaydedildi!');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Sözleşme Yönetimi</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar List */}
                <div className="space-y-2">
                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-3">
                        <FileText size={14} className="inline mr-2" />
                        Sözleşmeler
                    </h3>
                    <div className="space-y-1">
                        {legalPages.map(page => (
                            <button
                                key={page.slug}
                                onClick={() => handleSelect(page.slug)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${selectedSlug === page.slug
                                    ? 'bg-black text-white'
                                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-100'
                                    }`}
                            >
                                {page.title}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <p className="font-medium mb-1">💡 Bilgi</p>
                        <p>Hakkımızda sayfası için ayrı bir yönetim sayfası bulunmaktadır.</p>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-3">
                    {selectedPage ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h2 className="text-xl font-bold">{selectedPage.title}</h2>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} /> Kaydet
                                </button>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500 mb-2">İçerik</label>
                                <RichTextEditor
                                    value={editContent}
                                    onChange={(val) => setEditContent(val)}
                                    placeholder="Sözleşme içeriğini buraya girin..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-400 h-full flex flex-col justify-center items-center">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p>Düzenlemek için soldan bir sözleşme seçin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
