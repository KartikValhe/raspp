import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StudentSidebar } from '../components/StudentSidebar';
import { Menu, GraduationCap, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import { DemoModeBanner } from '../components/DemoModeBanner';

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Reset scroll to top on page/route change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    return (
        <div className="flex h-screen h-[100dvh] max-h-[100dvh] bg-surface-50 dark:bg-[#0a0a0c] overflow-hidden selection:bg-primary-500/30 transition-colors duration-300">
            {/* Desktop Sidebar (visible on md screens and wider) */}
            <aside className="hidden md:flex h-full shrink-0">
                <StudentSidebar />
            </aside>

            {/* Mobile Drawer Backdrop & Sliding Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 md:hidden shadow-2xl bg-white dark:bg-surface-950 flex flex-col"
                        >
                            <StudentSidebar isMobile onClose={() => setSidebarOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-0 h-full overflow-hidden relative">
                {/* Mobile Top Header (visible on mobile only) */}
                <header className="md:hidden sticky top-0 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-surface-950/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.07] shrink-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-1 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                            aria-label="Open Navigation Menu"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm">
                                <GraduationCap size={15} className="text-white" />
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">RASPP</span>
                                <span className="block text-[10px] text-slate-400 capitalize -mt-0.5">Student Hub</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </button>
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                            {user?.email?.[0]?.toUpperCase() || 'S'}
                        </div>
                    </div>
                </header>

                {/* Demo Mode Notification & Action Restriction Alert */}
                <DemoModeBanner />

                {/* Background ambient effects */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] opacity-30" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-600/20 rounded-full blur-[120px] opacity-20" />
                </div>

                {/* Main Scrollable Viewport with Touch Pan and Momentum */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 w-full min-h-0 overflow-y-auto overscroll-y-contain relative z-10 [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
                >
                    {children}
                </div>
            </main>
        </div>
    );
};
