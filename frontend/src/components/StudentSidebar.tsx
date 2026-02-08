import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, BookOpen, LogOut, Briefcase, Rocket, Moon, Sun, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const StudentSidebar: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },

        { to: '/student/results', icon: BookOpen, label: 'Performance' },
        { to: '/student/resume', icon: FileText, label: 'Resume Builder' },
        { to: '/student/placements', icon: Briefcase, label: 'Placements' },
        { to: '/student/internships', icon: Rocket, label: 'Internships' },
        { to: '/student/profile', icon: CreditCard, label: 'My Digital ID' },
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/95 dark:bg-black/95 backdrop-blur-xl text-slate-800 dark:text-white w-20 lg:w-64 min-h-screen flex flex-col font-sans border-r border-slate-200 dark:border-white/10 transition-colors duration-300"
        >
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                        <LayoutDashboard size={24} className="text-white" />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">RASPP</h1>
                        <p className="text-slate-500 dark:text-gray-500 text-xs font-medium">Student Portal</p>
                    </div>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                </button>
            </div>

            <div className="px-3 lg:px-6 py-8 flex-1">
                <p className="hidden lg:block text-xs uppercase tracking-wider text-slate-400 dark:text-gray-500 font-bold mb-4 ml-1">Menu</p>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-violet-50 dark:bg-white/10 text-violet-700 dark:text-white shadow-sm dark:shadow-lg border border-violet-100 dark:border-white/5"
                                    : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={clsx(
                                        "absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0 transition-opacity duration-300",
                                        isActive && "opacity-10 dark:opacity-100"
                                    )} />
                                    <link.icon size={20} className={clsx(
                                        "relative z-10 transition-transform duration-300",
                                        isActive ? "text-violet-600 dark:text-indigo-400 scale-110" : "group-hover:scale-110"
                                    )} />
                                    <span className="hidden lg:block font-medium text-sm relative z-10">{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 w-1 h-8 bg-violet-600 dark:bg-indigo-500 rounded-r-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40">
                <div className="flex items-center gap-3 mb-4 px-2 justify-center lg:justify-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold ring-2 ring-white text-white shadow-lg">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-sm font-semibold text-slate-700 dark:text-white truncate w-32">Student</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 truncate w-32">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 rounded-xl w-full transition-all text-sm font-medium justify-center lg:justify-start"
                >
                    <LogOut size={18} />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </motion.div>
    );
};
