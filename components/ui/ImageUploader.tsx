'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Move } from 'lucide-react';

interface ImageUploaderProps {
    images: string[];
    onChange: (newImages: string[]) => void;
    maxImages?: number;
    allowUrlInput?: boolean;
}

export default function ImageUploader({
    images = [],
    onChange,
    maxImages = 10,
    allowUrlInput = true
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // Handle File Drop
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        await processFiles(files);
    };

    // Handle File Selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            await processFiles(files);
        }
    };

    // Process Files to Base64
    const processFiles = async (files: File[]) => {
        const newMedia: string[] = [];

        for (const file of files) {
            // Allow images and videos
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) continue;

            const reader = new FileReader();
            newMedia.push(await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            }));
        }

        if (newMedia.length > 0) {
            const updated = [...images, ...newMedia].slice(0, maxImages);
            onChange(updated);
        }
    };

    // Handle URL Add
    const handleAddUrl = () => {
        if (!urlInput) return;
        const updated = [...images, urlInput].slice(0, maxImages);
        onChange(updated);
        setUrlInput('');
    };

    // Handle Remove
    const removeImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
    };

    // Handle Drag Sort
    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;

        const _images = [...images];
        const draggedItemContent = _images[dragItem.current];

        _images.splice(dragItem.current, 1);
        _images.splice(dragOverItem.current, 0, draggedItemContent);

        dragItem.current = null;
        dragOverItem.current = null;

        onChange(_images);
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray-100 p-3 rounded-full">
                        <Upload size={24} className="text-gray-500" />
                    </div>
                    <div>
                        <p className="font-medium">Görselleri buraya sürükleyin</p>
                        <p className="text-sm text-gray-500">veya dosya seçmek için tıklayın</p>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                        Dosya Seç
                    </label>
                </div>
            </div>

            {/* URL Input Fallback */}
            {allowUrlInput && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 p-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors"
                    />
                    <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-4 py-2 bg-gray-100 font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        URL Ekle
                    </button>
                </div>
            )}

            {/* Image List */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((mediaUrl, idx) => {
                        const isVideo = mediaUrl.startsWith('data:video') || mediaUrl.match(/\.(mp4|webm|ogg)$/i);

                        return (
                            <div
                                key={idx}
                                className="group relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 cursor-move"
                                draggable
                                onDragStart={() => dragItem.current = idx}
                                onDragEnter={() => dragOverItem.current = idx}
                                onDragEnd={handleSort}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {isVideo ? (
                                    <video src={mediaUrl} className="w-full h-full object-cover" muted />
                                ) : (
                                    <img src={mediaUrl} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                                )}

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Move className="text-white" size={20} />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="p-1 bg-white rounded-full text-red-500 hover:bg-red-50"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Index Badge */}
                                <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full backdrop-blur-sm">
                                    {idx + 1}
                                </div>
                                {isVideo && (
                                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded backdrop-blur-sm">
                                        VIDEO
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
