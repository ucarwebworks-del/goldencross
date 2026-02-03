'use client';
import { useState } from 'react';

export default function ProductGallery({ images }: { images: string[] }) {
    const [selected, setSelected] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                Görsel Yok
            </div>
        );
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 sticky top-24">
            {/* Thumbnails (Left on desktop, Bottom on mobile) */}
            <div className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide pb-2 lg:pb-0">
                {images.map((img, idx) => {
                    const isVideo = img.startsWith('data:video') || img.match(/\.(mp4|webm|ogg)$/i);
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={`relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${selected === idx ? 'border-black' : 'border-transparent hover:border-gray-200'
                                }`}
                        >
                            {isVideo ? (
                                <video src={img} className="w-full h-full object-cover pointer-events-none" muted />
                            ) : (
                                <img
                                    src={img}
                                    alt={`View ${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-black border-b-4 border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                {(images[selected].startsWith('data:video') || images[selected].match(/\.(mp4|webm|ogg)$/i)) ? (
                    <video
                        src={images[selected]}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={images[selected]}
                        alt="Product Detail"
                        className="w-full h-full object-cover mix-blend-multiply transition-opacity duration-300"
                    />
                )}
                <div className="absolute top-4 left-4 bg-[#00E676] text-black px-3 py-1 rounded-full text-xs font-bold">
                    %20 İndirim
                </div>
            </div>
        </div>
    );
}
