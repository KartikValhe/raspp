import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, AlertTriangle, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DemoModeBanner: React.FC = () => {
    const { user } = useAuth();
    const isDemo = user?.can_modify === false;

    const [blockedToast, setBlockedToast] = useState<string | null>(null);

    useEffect(() => {
        const handleDemoBlocked = (event: any) => {
            const message = event.detail?.message || 'Write operations (creating, updating, deleting) are restricted for demo accounts.';
            setBlockedToast(message);
        };

        window.addEventListener('raspp:demo-blocked', handleDemoBlocked);
        return () => {
            window.removeEventListener('raspp:demo-blocked', handleDemoBlocked);
        };
    }, []);

    // Auto dismiss blocked toast after 6 seconds
    useEffect(() => {
        if (!blockedToast) return;
        const timer = setTimeout(() => {
            setBlockedToast(null);
        }, 6000);
        return () => clearTimeout(timer);
    }, [blockedToast]);

    if (!isDemo && !blockedToast) return null;

    return (
        <>
            {/* Persistent Top Banner for Demo Accounts */}
            {isDemo && (
                <div className="w-full bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-xs shrink-0 z-20 backdrop-blur-xs">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <Lock size={13} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="truncate">
                            <strong className="font-semibold text-amber-900 dark:text-amber-200">Demo Mode (View-Only):</strong>{' '}
                            You are exploring with public demo access. Analytics & viewing are active, but data insertion, updates, and deletions are restricted for system security.
                        </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Read-Only Protected
                        </span>
                    </div>
                </div>
            )}

            {/* High-visibility Floating Alert when an action is blocked by server */}
            <AnimatePresence>
                {blockedToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-5 right-5 z-[9999] max-w-md w-[calc(100vw-40px)] bg-slate-900/95 dark:bg-surface-950/95 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white"
                        role="alert"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                                <ShieldAlert size={20} className="text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                                    <AlertTriangle size={15} /> Action Restricted (Demo Account)
                                </h4>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    {blockedToast}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                                    💡 Tip: To add, edit, or delete live records, please sign in with your permitted administrator account.
                                </p>
                            </div>
                            <button
                                onClick={() => setBlockedToast(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                                aria-label="Dismiss alert"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
