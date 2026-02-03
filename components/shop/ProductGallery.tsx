'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images }: { images: string[] }) {
    const [selected, setSelected] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                Görsel Yok
            </div>
        );
    }

    const handleSwipe = (direction: 'left' | 'right') => {
        if (direction === 'left' && selected < images.length - 1) {
            setSelected(selected + 1);
        } else if (direction === 'right' && selected > 0) {
            setSelected(selected - 1);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image - Swipeable on mobile */}
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

                {/* Navigation arrows for mobile */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => handleSwipe('right')}
                            disabled={selected === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => handleSwipe('left')}
                            disabled={selected === images.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-black/70 transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Dots indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelected(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${selected === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails - Horizontal scroll */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
            >
                {images.map((img, idx) => {
                    const isVideo = img.startsWith('data:video') || img.match(/\.(mp4|webm|ogg)$/i);
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${selected === idx ? 'border-[#00E676]' : 'border-transparent hover:border-gray-200'
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
        </div>
    );
}
