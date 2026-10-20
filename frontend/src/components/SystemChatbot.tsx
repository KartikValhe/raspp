import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Bot, X, Send, RotateCcw,
    ChevronDown, ExternalLink, HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

const STARTER_PROMPTS = [
    { label: "🎯 Placement Prediction", prompt: "How does the placement probability model work?" },
    { label: "📄 Transcript & CGPA", prompt: "Where can I view and download my official academic transcript?" },
    { label: "💼 ATS Resume Builder", prompt: "How does the built-in Resume Builder help with placements?" },
    { label: "👩‍🏫 Teacher Grading Hub", prompt: "How do teachers enter and manage student marks?" }
];

export const SystemChatbot: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const initialMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `👋 **Welcome to RASPP!** I'm your **Gen AI System Assistant**.

I'm here to help you understand every part of the platform:
* **ML Predictions**: How our 95% accurate Random Forest model evaluates placement chances ([Check Prediction](/student/placement/prediction)).
* **Academics**: SGPA/CGPA calculations, results, and [Official Transcripts](/student/transcript).
* **Portals**: Navigating Student, Teacher, Admin, and Coordinator workflows.

Ask me any question, or choose a topic below to get started!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const [messages, setMessages] = useState<Message[]>([initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setHasUnread(false);
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen, messages]);

    const handleSend = async (customPrompt?: string) => {
        const textToSend = (customPrompt || input).trim();
        if (!textToSend || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInput('');
        setLoading(true);

        try {
            // Send conversation history to backend endpoint
            const payload = {
                messages: updatedHistory
                    .filter(m => m.id !== 'welcome')
                    .map(m => ({ role: m.role, content: m.content })),
                user_role: user?.role || 'student',
                current_page: window.location.pathname
            };

            const response = await api.post('/api/v1/chatbot/message', payload);
            const replyText = response.data?.reply || "I couldn't process that response. Please try again.";

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, assistantMsg]);
            if (!isOpen) setHasUnread(true);
        } catch (error: any) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `⚠️ **Unable to connect to AI Assistant**: ${error.response?.data?.detail || error.message || "Please check your network connection."}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([initialMessage]);
    };

    // Markdown link interceptor: internal links navigate with react-router
    const MarkdownLink = ({ href, children }: any) => {
        if (href && href.startsWith('/')) {
            return (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(href);
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer bg-primary-500/10 px-1.5 py-0.5 rounded text-xs transition-colors"
                >
                    {children}
                    <ExternalLink size={11} className="inline opacity-70" />
                </button>
            );
        }
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-primary-500 hover:underline font-medium"
            >
                {children}
            </a>
        );
    };

    return (
        <aside aria-label="System AI Assistant Chatbot" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
            {/* Expanded Chatbot Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[430px] h-[580px] max-h-[82vh]
                                   bg-white/95 dark:bg-[#0c0d12]/95 backdrop-blur-2xl
                                   border border-slate-200/80 dark:border-white/10 rounded-3xl
                                   shadow-2xl shadow-indigo-950/20 dark:shadow-black/70
                                   flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3.5 border-b border-slate-200/80 dark:border-white/10
                                        bg-gradient-to-r from-primary-500/10 via-indigo-500/10 to-accent-500/10
                                        flex items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/30">
                                        <Bot size={18} />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-surface-950" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">RASPP Assistant</h3>
                                        <span className="px-1.5 py-0.2 rounded-md bg-primary-500/15 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-wider">
                                            Gen AI
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Online • Gemini 1.5 System Guide
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleClearChat}
                                    title="Reset conversation"
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
                                >
                                    <RotateCcw size={15} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    title="Close Assistant"
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
                                >
                                    <ChevronDown size={17} />
                                </button>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                            {/* Starter Chips */}
                            {messages.length <= 2 && (
                                <div className="space-y-1.5 mb-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                                        Suggested Questions
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {STARTER_PROMPTS.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(item.prompt)}
                                                className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-primary-50 dark:hover:bg-primary-500/15
                                                           text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-300
                                                           border border-slate-200/80 dark:border-white/[0.08] transition-all duration-150 text-left cursor-pointer"
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chat Messages */}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-primary-600/20 max-w-[85%]'
                                                : 'bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 rounded-tl-none max-w-[92%]'
                                        }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div className="prose prose-xs dark:prose-invert max-w-none text-xs sm:text-sm [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:pl-4 [&>ul>li]:list-disc">
                                                <ReactMarkdown components={{ a: MarkdownLink }}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                                        {msg.timestamp}
                                    </span>
                                </div>
                            ))}

                            {/* Loading Animation */}
                            {loading && (
                                <div className="flex items-start gap-2">
                                    <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
                                        <Sparkles size={14} className="animate-spin text-primary-500" />
                                        <span>Thinking...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="p-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]"
                        >
                            <div className="relative flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything about RASPP..."
                                    className="w-full pl-3.5 pr-11 py-2.5 text-xs sm:text-sm rounded-xl
                                               bg-white dark:bg-surface-900
                                               border border-slate-200 dark:border-white/10
                                               text-slate-800 dark:text-white
                                               placeholder-slate-400 dark:placeholder-slate-500
                                               focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-1.5 p-1.5 rounded-lg
                                               bg-primary-600 hover:bg-primary-500 disabled:opacity-30
                                               text-white transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
                                Powered by Google Gemini Gen AI • System Knowledge Guide
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Launcher Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full
                           bg-gradient-to-r from-primary-600 via-indigo-600 to-accent-600
                           text-white font-semibold text-sm shadow-xl shadow-primary-600/35 hover:shadow-primary-600/50
                           border border-white/20 transition-all duration-200 cursor-pointer"
                aria-label="Toggle Gen AI System Assistant"
            >
                {/* Glowing ring animation */}
                <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-40 blur group-hover:opacity-75 transition duration-300 -z-10" />

                {isOpen ? (
                    <X size={20} className="text-white" />
                ) : (
                    <>
                        <div className="relative">
                            <Sparkles size={18} className="text-amber-300 animate-pulse" />
                            {hasUnread && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                            )}
                        </div>
                        <span className="hidden sm:inline-block tracking-wide font-medium">
                            Ask AI Assistant
                        </span>
                    </>
                )}
            </motion.button>
        </aside>
    );
};
