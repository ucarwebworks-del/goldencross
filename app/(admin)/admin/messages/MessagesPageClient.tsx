'use client';

import { useMessages } from '@/context/MessageContext';
import { Mail, MailOpen, Trash2, Clock, CheckCircle } from 'lucide-react';

export default function MessagesPageClient() {
    const { messages, markAsRead, deleteMessage } = useMessages();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gelen Kutusu</h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-bold text-sm">
                    Toplam: {messages.length} Mesaj
                </div>
            </div>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Henüz hiç mesajınız yok.</p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${message.isRead ? 'border-gray-100 opacity-75' : 'border-l-4 border-l-black border-gray-100'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${message.isRead ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'}`}>
                                        {message.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{message.name}</h3>
                                        <a href={`mailto:${message.email}`} className="text-sm text-gray-500 hover:text-blue-600 hover:underline">{message.email}</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Clock size={14} />
                                    {formatDate(message.date)}
                                </div>
                            </div>

                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4 text-sm leading-relaxed whitespace-pre-wrap">
                                {message.message}
                            </p>

                            <div className="flex justify-end gap-3">
                                {!message.isRead && (
                                    <button
                                        onClick={() => markAsRead(message.id)}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50"
                                    >
                                        <CheckCircle size={16} /> Okundu Olarak İşaretle
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteMessage(message.id)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={16} /> Sil
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
