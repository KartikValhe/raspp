import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, X, Loader2, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AICareerAdvisorProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
}

export const AICareerAdvisor: React.FC<AICareerAdvisorProps> = ({ isOpen, onClose, studentId }) => {
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && !advice && !loading) {
            fetchAdvice();
        }
    }, [isOpen]);

    const fetchAdvice = async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('token') || '';
            const response = await fetch(`http://localhost:8000/api/v1/advisor/generate/${studentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate advice.');
            }

            const data = await response.json();
            setAdvice(data.advice);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto z-50 w-full max-w-3xl max-h-[85vh] h-fit bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg shadow-violet-500/30">
                                    <Bot size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        AI Career Advisor
                                        <Sparkles size={16} className="text-yellow-400" />
                                    </h2>
                                    <p className="text-sm text-slate-400">Powered by Gemini AI & RASPP Predictive Engine</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-slate-200">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <Loader2 size={48} className="text-violet-500 animate-spin" />
                                    <p className="text-lg font-medium animate-pulse text-violet-300">
                                        Analyzing your profile & generating insights...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                                    {error}
                                </div>
                            ) : advice ? (
                                <div className="prose prose-invert prose-violet max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-lg font-bold text-violet-300 mt-6 mb-3 flex items-center gap-2"><ChevronRight size={18}/> {children}</h3>,
                                            p: ({ children }) => <p className="leading-relaxed mb-4 text-slate-300">{children}</p>,
                                            ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
                                            li: ({ children }) => <li className="flex items-start gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" /><span>{children}</span></li>,
                                            strong: ({ children }) => <strong className="font-bold text-white bg-violet-500/10 px-1 rounded">{children}</strong>
                                        }}
                                    >
                                        {advice}
                                    </ReactMarkdown>
                                </div>
                            ) : null}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                            <p className="text-xs text-slate-500">
                                This plan is uniquely generated based on your ML placement probability and feature metrics.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
