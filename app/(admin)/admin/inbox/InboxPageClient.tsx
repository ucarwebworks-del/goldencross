'use client';

import { useState } from 'react';
import { useMessages } from '@/context/MessageContext';
import { Mail, MailOpen, Trash2, Search, Clock, User, ChevronDown, ChevronUp, X } from 'lucide-react';
import { toast } from 'sonner';

export default function InboxPageClient() {
    const { messages, markAsRead, deleteMessage, unreadCount, isLoading } = useMessages();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredMessages = messages
        .filter(m => {
            if (filter === 'unread') return !m.isRead;
            if (filter === 'read') return m.isRead;
            return true;
        })
        .filter(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.message.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
        const message = messages.find(m => m.id === id);
        if (message && !message.isRead) {
            markAsRead(id);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteMessage(id);
        toast.success('Mesaj silindi');
        if (expandedId === id) setExpandedId(null);
    };

    if (isLoading) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mesajlar</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        İletişim formundan gelen mesajlar • {unreadCount > 0 && <span className="text-blue-600 font-medium">{unreadCount} okunmamış</span>}
                    </p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Mesajlarda ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-black transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'unread', 'read'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : 'Okunan'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Henüz mesaj yok</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMessages.map(message => (
                        <div
                            key={message.id}
                            className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer ${!message.isRead
                                    ? 'border-blue-200 bg-blue-50/30'
                                    : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {/* Header */}
                            <div
                                onClick={() => handleExpand(message.id)}
                                className="p-4 flex items-center gap-4"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.isRead ? 'bg-gray-100' : 'bg-blue-100'
                                    }`}>
                                    {message.isRead ? (
                                        <MailOpen size={18} className="text-gray-500" />
                                    ) : (
                                        <Mail size={18} className="text-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium truncate ${!message.isRead && 'font-bold'}`}>
                                            {message.name}
                                        </p>
                                        {!message.isRead && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                                                YENİ
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{message.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(message.date).toLocaleDateString('tr-TR', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <button
                                        onClick={(e) => handleDelete(message.id, e)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {expandedId === message.id ? (
                                        <ChevronUp size={18} className="text-gray-400" />
                                    ) : (
                                        <ChevronDown size={18} className="text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedId === message.id && (
                                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.message}</p>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            E-posta ile Yanıtla
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
