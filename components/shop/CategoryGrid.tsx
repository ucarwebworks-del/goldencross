'use client';
import Link from 'next/link';
import { useCategories } from '@/context/CategoryContext';
import { useSettings } from '@/context/SettingsContext';
import { useProducts } from '@/context/ProductContext';

export default function CategoryGrid() {
    const { categories } = useCategories();
    const { settings } = useSettings();
    const { products } = useProducts();

    // Get only parent categories, sorted by order
    const parentCategories = categories
        .filter(c => !c.parent_id)
        .sort((a, b) => a.order - b.order);

    // Get product count per category
    const getProductCount = (categorySlug: string) => {
        return products.filter(p => p.category === categorySlug).length;
    };

    // Section title from settings or default
    const sectionTitle = settings?.homepageCategoryTitle || 'Kategoriler';
    const sectionSubtitle = settings?.homepageCategorySubtitle || 'Koleksiyonlarımızı keşfedin';

    if (parentCategories.length === 0) return null;

    return (
        <section className="section">
            <div className="container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-white">{sectionTitle}</h2>
                        <p className="text-gray-400">{sectionSubtitle}</p>
                    </div>
                    <Link href="/collections" className="font-semibold border-b-2 border-white pb-1 text-white hover:text-accent hover:border-accent transition-colors">
                        Tümünü Gör
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll, Desktop: Grid */}
                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
                    {parentCategories.slice(0, 6).map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/collections/${cat.slug}`}
                            className="group block relative aspect-[3/4] overflow-hidden rounded-lg bg-[#1a1a1a] shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[45vw] md:w-auto snap-start"
                        >
                            {cat.image ? (
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#222] to-[#333] group-hover:scale-105 transition-transform duration-500" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                <h3 className="font-bold text-lg leading-none mb-1">{cat.name}</h3>
                                <span className="text-xs opacity-70">{getProductCount(cat.slug)} Ürün</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
