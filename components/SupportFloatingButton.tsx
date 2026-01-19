'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SupportFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [issue, setIssue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ticketData, setTicketData] = useState<{ url?: string, channel_name?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !issue) return;

        setLoading(true);
        try {
            const res = await fetch('/api/support/ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, reason: issue }),
            });

            const data = await res.json();

            if (res.ok) {
                setTicketData(data);
                setIsSuccess(true);
                toast.success('Ticket created successfully!');
                setUsername('');
                setIssue('');
            } else {
                toast.error(data.error || 'Failed to create ticket');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetModal = () => {
        setIsOpen(false);
        // Delay reset slightly to allow exit animation
        setTimeout(() => {
            setIsSuccess(false);
            setTicketData(null);
        }, 300);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#007AFF] text-white shadow-lg shadow-blue-900/20 hover:bg-[#0066CC] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare size={24} />
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={resetModal}
                        />

                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F0F0F]">
                                <h3 className="text-lg font-semibold text-white">
                                    {isSuccess ? 'Ticket Created' : 'Contact Support'}
                                </h3>
                                <button
                                    onClick={resetModal}
                                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center space-y-4"
                                        >
                                            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                                <CheckCircle2 size={32} className="text-green-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-2">Request Received!</h4>
                                                <p className="text-gray-400 text-sm">
                                                    We've created a private channel for you in our Discord server.
                                                </p>
                                            </div>

                                            {ticketData?.url && (
                                                <a
                                                    href={ticketData.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg py-3 font-medium transition-colors"
                                                >
                                                    Open Discord Ticket
                                                </a>
                                            )}

                                            <button
                                                onClick={resetModal}
                                                className="w-full bg-[#151515] hover:bg-[#202020] text-gray-300 rounded-lg py-3 font-medium transition-colors"
                                            >
                                                Close
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                                    Discord Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="e.g. User#1234 or User"
                                                    className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 placeholder:text-gray-600"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                                    Issue Description
                                                </label>
                                                <textarea
                                                    value={issue}
                                                    onChange={(e) => setIssue(e.target.value)}
                                                    placeholder="Briefly describe your issue..."
                                                    rows={4}
                                                    className="w-full bg-[#151515] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 placeholder:text-gray-600 resize-none"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#0066CC] disabled:opacity-50 text-white rounded-lg py-3 font-medium transition-colors"
                                                >
                                                    {loading ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Send size={18} />
                                                            Open Ticket
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-center text-xs text-gray-500 mt-3">
                                                    A staff member will create a private channel for you in Discord.
                                                </p>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
