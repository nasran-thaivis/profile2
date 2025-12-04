'use client';

import { useState, useEffect } from 'react';
import { contactAPI } from '@/lib/api';
import { Mail, Calendar, User, MessageSquare } from 'lucide-react';

interface ContactMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await contactAPI.getMyMessages();
        setMessages(response.data || []);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Contact Messages</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-12 text-center">
          <MessageSquare className="w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">No messages yet</p>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">
            Contact messages from visitors will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Messages ({messages.length})
            </h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedMessage?.id === message.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {message.senderName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {message.senderEmail}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                    {message.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                    Message Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Sender Name</p>
                        <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                          {selectedMessage.senderName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
                        <a
                          href={`mailto:${selectedMessage.senderEmail}`}
                          className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {selectedMessage.senderEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Date</p>
                        <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Message
                  </h3>
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <a
                    href={`mailto:${selectedMessage.senderEmail}?subject=Re: Your message`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-12 text-center">
                <MessageSquare className="w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-600 dark:text-zinc-400">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

