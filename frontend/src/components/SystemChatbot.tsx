import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Bot, X, Send, RotateCcw,
    ChevronDown, ChevronRight, ExternalLink, Copy, Check, Compass
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    suggestedQuestions?: string[];
}

const getContextualStarterPrompts = (pathname: string, role?: string) => {
    if (pathname.includes('/placement/prediction')) {
        return [
            { label: "🎯 Model Accuracy", prompt: "How accurate is the Random Forest placement prediction model?" },
            { label: "📈 Boost Probability", prompt: "What are the most effective steps to improve my placement score?" },
            { label: "💡 SHAP Factors", prompt: "How does the system calculate which factors impact my prediction?" },
            { label: "💼 Matching Jobs", prompt: "Where can I view campus job listings matching my profile?" }
        ];
    }
    if (pathname.includes('/transcript')) {
        return [
            { label: "📄 SGPA & CGPA Formula", prompt: "How are SGPA and CGPA calculated on this transcript?" },
            { label: "🖨️ Print Transcript", prompt: "How can I download or print this official academic transcript?" },
            { label: "📊 Subject Breakdown", prompt: "Where can I view semester-wise marks breakdown?" },
            { label: "🏆 Merit Status", prompt: "How does my performance rank against the branch merit list?" }
        ];
    }
    if (pathname.includes('/resume')) {
        return [
            { label: "✨ ATS Resume Score", prompt: "How does the ATS Resume Analyzer evaluate my resume?" },
            { label: "💼 Key Projects", prompt: "What projects and technical skills should I include for campus drives?" },
            { label: "📥 PDF Export", prompt: "Can I download my resume directly as a PDF?" },
            { label: "🎯 Placement Prediction", prompt: "How does my resume impact my placement probability score?" }
        ];
    }
    if (pathname.includes('/placement')) {
        return [
            { label: "🏢 Campus Drives", prompt: "What companies are currently hiring and what packages are offered?" },
            { label: "🎯 Check Eligibility", prompt: "How do I check if I meet eligibility criteria for campus drives?" },
            { label: "📈 Placement Stats", prompt: "What are the department placement rates and statistics?" },
            { label: "🔮 My Prediction", prompt: "How can I predict my chances before applying to jobs?" }
        ];
    }
    if (pathname.includes('/teacher')) {
        return [
            { label: "✏️ Grading Hub", prompt: "How do teachers enter and update internal and end-sem marks?" },
            { label: "📅 Take Attendance", prompt: "How does the attendance tracking tool work?" },
            { label: "🏆 Merit List", prompt: "Where can I view class toppers and grade distribution?" },
            { label: "🔮 At-Risk Students", prompt: "How can AI predictions help identify students needing academic help?" }
        ];
    }
    if (role === 'admin' || pathname.includes('/students') || pathname.includes('/branches')) {
        return [
            { label: "👥 Manage Students", prompt: "How do I add, import, or manage student accounts?" },
            { label: "🏫 Branch & Subjects", prompt: "How to configure branches, course subjects, and credits?" },
            { label: "📊 University Analytics", prompt: "Where can I view campus-wide performance and placement stats?" },
            { label: "📜 Publish Results", prompt: "How do administrators verify and publish official semester results?" }
        ];
    }
    return [
        { label: "🎯 Placement Prediction", prompt: "How does the placement probability model work?" },
        { label: "📄 Transcript & CGPA", prompt: "Where can I view and download my official academic transcript?" },
        { label: "💼 ATS Resume Builder", prompt: "How does the built-in Resume Builder help with placements?" },
        { label: "👩‍🏫 Teacher Grading Hub", prompt: "How do teachers enter and manage student marks?" }
    ];
};

const getPageLabel = (pathname: string): string => {
    if (pathname.includes('/placement/prediction')) return "Placement Checker";
    if (pathname.includes('/transcript')) return "Official Transcript";
    if (pathname.includes('/resume')) return "Resume Builder";
    if (pathname.includes('/placement/jobs')) return "Job Listings";
    if (pathname.includes('/placement')) return "Placement Portal";
    if (pathname.includes('/teacher/marks')) return "Grading Hub";
    if (pathname.includes('/teacher/attendance')) return "Attendance";
    if (pathname.includes('/teacher/merit')) return "Merit List";
    if (pathname.includes('/student/results')) return "Performance";
    if (pathname.includes('/student/dashboard')) return "Student Dashboard";
    if (pathname.includes('/dashboard')) return "Main Dashboard";
    return "System Guide";
};

export const SystemChatbot: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const pageLabel = getPageLabel(location.pathname);
    const starterPrompts = getContextualStarterPrompts(location.pathname, user?.role);

    const initialMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `👋 **Welcome to RASPP!** I'm your **Gen AI System Assistant**.

I provide real-time answers tailored to your current view (**${pageLabel}**):
* **Placement Prediction**: How our 95% accurate Random Forest model evaluates placement chances ([Check Prediction](/student/placement/prediction)).
* **Academics**: SGPA/CGPA calculations, results, and [Official Transcripts](/student/transcript).
* **Portals**: Navigating Student, Teacher, Admin, and Coordinator workflows.

Ask any question, or tap a suggested topic below to get started!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: starterPrompts.map(p => p.prompt)
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
            const payload = {
                messages: updatedHistory
                    .filter(m => m.id !== 'welcome')
                    .map(m => ({ role: m.role, content: m.content })),
                user_role: user?.role || 'student',
                current_page: location.pathname
            };

            const response = await api.post('/api/v1/chatbot/message', payload);
            const replyText = response.data?.reply || "I couldn't process that response. Please try again.";
            const followUps = response.data?.suggested_questions || [];

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestedQuestions: followUps.length > 0 ? followUps : undefined
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

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
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
        <aside aria-label="System AI Assistant Chatbot" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            {/* Expanded Chatbot Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-18 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[430px] h-[590px] max-h-[82vh]
                                   bg-white/95 dark:bg-[#0c0d12]/95 backdrop-blur-2xl
                                   border border-slate-200/80 dark:border-white/10 rounded-3xl
                                   shadow-2xl shadow-indigo-950/20 dark:shadow-black/70
                                   flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-200/80 dark:border-white/10
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
                                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                        <Compass size={11} className="text-primary-500" />
                                        <span>Context: {pageLabel}</span>
                                    </div>
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
                        <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                            {/* Dynamic Page Starter Chips (Shown on fresh conversation) */}
                            {messages.length <= 1 && (
                                <div className="space-y-1.5 mb-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 flex items-center gap-1">
                                        <Sparkles size={11} className="text-primary-500" />
                                        Suggested for {pageLabel}:
                                    </p>
                                    <div className="flex flex-col gap-1.5">
                                        {starterPrompts.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSend(item.prompt)}
                                                className="text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-primary-50 dark:hover:bg-primary-500/15
                                                           text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-300
                                                           border border-slate-200/80 dark:border-white/[0.08] transition-all duration-150 text-left cursor-pointer
                                                           flex items-center justify-between group shadow-sm"
                                            >
                                                <span className="font-medium">{item.label}</span>
                                                <ChevronRight size={13} className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
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
                                                : 'bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 rounded-tl-none max-w-[94%] shadow-sm'
                                        }`}
                                    >
                                        {msg.role === 'assistant' ? (
                                            <div>
                                                <div className="prose prose-xs dark:prose-invert max-w-none text-xs sm:text-sm [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:pl-4 [&>ul>li]:list-disc">
                                                    <ReactMarkdown components={{ a: MarkdownLink }}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>

                                                {/* Dynamic Question-Responsive Follow-up Chips */}
                                                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                                                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-white/5 space-y-1.5">
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                                                            <Sparkles size={11} className="text-primary-500" />
                                                            Related follow-ups:
                                                        </p>
                                                        <div className="flex flex-col gap-1">
                                                            {msg.suggestedQuestions.map((q, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => handleSend(q)}
                                                                    className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-white/[0.04]
                                                                               border border-slate-200/80 dark:border-white/[0.08]
                                                                               hover:border-primary-400 dark:hover:border-primary-500/50
                                                                               hover:bg-primary-50/80 dark:hover:bg-primary-500/10
                                                                               text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300
                                                                               transition-all duration-150 flex items-center justify-between group cursor-pointer"
                                                                >
                                                                    <span className="line-clamp-1">{q}</span>
                                                                    <ChevronRight size={12} className="text-slate-400 group-hover:text-primary-500 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        )}
                                    </div>

                                    {/* Action row (Timestamp + Copy) */}
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                            {msg.timestamp}
                                        </span>
                                        {msg.role === 'assistant' && (
                                            <button
                                                onClick={() => handleCopy(msg.id, msg.content)}
                                                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-0.5"
                                                title="Copy answer"
                                            >
                                                {copiedId === msg.id ? (
                                                    <>
                                                        <Check size={11} className="text-emerald-500" />
                                                        <span className="text-emerald-500">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={11} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-start gap-2">
                                    <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2 shadow-sm">
                                        <Sparkles size={14} className="animate-spin text-primary-500" />
                                        <span>Analyzing and preparing tailored response...</span>
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
                                    placeholder={`Ask about ${pageLabel.toLowerCase()} or any feature...`}
                                    className="w-full pl-3.5 pr-11 py-2.5 text-xs sm:text-sm rounded-xl
                                               bg-white dark:bg-surface-900
                                               border border-slate-200 dark:border-white/10
                                               text-slate-800 dark:text-white
                                               placeholder-slate-400 dark:placeholder-slate-500
                                               focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 shadow-sm"
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
                                Gemini Gen AI • Dynamic Contextual Guidance
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
                className="relative group flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full
                           bg-gradient-to-r from-primary-600 via-indigo-600 to-accent-600
                           text-white font-semibold text-xs sm:text-sm shadow-xl shadow-primary-600/35 hover:shadow-primary-600/50
                           border border-white/20 transition-all duration-200 cursor-pointer"
                aria-label="Toggle Gen AI System Assistant"
            >
                {/* Glowing ring animation */}
                <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-40 blur group-hover:opacity-75 transition duration-300 -z-10" />

                {isOpen ? (
                    <X size={18} className="text-white" />
                ) : (
                    <>
                        <div className="relative">
                            <Sparkles size={17} className="text-amber-300 animate-pulse" />
                            {hasUnread && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                            )}
                        </div>
                        <span className="tracking-wide font-medium">
                            Ask AI Assistant
                        </span>
                    </>
                )}
            </motion.button>
        </aside>
    );
};
