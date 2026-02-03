import Link from 'next/link';

interface ProductProps {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    badge?: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    return (
        <div className="group relative bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-white/20 hover:shadow-xl transition-all duration-300">
            {/* Badge */}
            {product.badge && (
                <span className="absolute top-3 left-3 bg-accent text-primary text-[10px] font-bold px-2 py-1 rounded z-10 uppercase tracking-wide">
                    {product.badge}
                </span>
            )}

            {/* Image - Clickable */}
            <Link href={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#222] cursor-pointer">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            {/* Info */}
            <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-white mb-2 truncate hover:text-accent transition-colors">
                        {product.title}
                    </h3>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white">{product.price.toLocaleString('tr-TR')} TL</span>
                    {product.oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            {product.oldPrice.toLocaleString('tr-TR')} TL
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
