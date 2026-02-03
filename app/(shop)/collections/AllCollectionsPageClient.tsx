'use client';
import { useCategories } from '@/context/CategoryContext';
import Link from 'next/link';

export default function AllCollectionsPageClient() {
    const { categories } = useCategories();
    const parentCategories = categories.filter(c => !c.parent_id);

    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-4">Tüm Koleksiyonlar</h1>
            <p className="text-gray-500 mb-12">Evinize değer katacak özel tasarım cam tablo koleksiyonlarımızı keşfedin.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parentCategories.map(category => (
                    <Link
                        key={category.id}
                        href={`/collections/${category.slug}`}
                        className="group block relative h-[300px] overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="absolute inset-0 bg-gray-200">
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Görsel Yok</div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                            <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                            <span className="text-sm font-medium border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
                                Koleksiyonu İncele &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
