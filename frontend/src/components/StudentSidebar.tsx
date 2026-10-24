import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Trophy, FileText, Briefcase, Search,
    Target, BarChart2, LogOut, Moon, Sun, UserCircle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface StudentSidebarProps {
    onClose?: () => void;
    isMobile?: boolean;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ onClose }) => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/student/results', icon: Trophy, label: 'Performance', end: true },
        { to: '/student/transcript', icon: FileText, label: 'Transcript', end: true },
        { to: '/student/resume', icon: FileText, label: 'Resume Builder', end: true },
        { to: '/student/placement', icon: Briefcase, label: 'Placement Portal', end: true },
        { to: '/student/placement/jobs', icon: Search, label: 'Job Listings', end: true },
        { to: '/student/placement/prediction', icon: Target, label: 'My Prediction', end: true },
        { to: '/student/placement/stats', icon: BarChart2, label: 'Placement Stats', end: true },
        { to: '/student/profile', icon: UserCircle, label: 'My Profile', end: true },
    ];

    const initial = user?.email?.[0]?.toUpperCase() ?? 'S';
    const userName = user?.email?.split('@')[0] ?? 'Student';

    return (
        <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="sidebar-root"
        >
            {/* Brand */}
            <div className="px-4 py-4 border-b border-slate-200 dark:border-white/[0.07] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shadow-primary">
                        <LayoutDashboard size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-md font-bold text-gradient-dark leading-tight">RASPP</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Student Portal
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark'
                            ? <Sun size={15} className="text-amber-400" />
                            : <Moon size={15} />
                        }
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
                            aria-label="Close Navigation Menu"
                        >
                            <X size={17} />
                        </button>
                    )}
                </div>
            </div>

            {/* Nav */}
            <nav className="px-3 py-4 flex-1 overflow-y-auto scrollbar-none">
                <p className="section-label px-2 mb-2">Menu</p>
                <div className="space-y-0.5">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end ?? true}
                            onClick={() => onClose?.()}
                            className={({ isActive }) =>
                                isActive
                                    ? 'sidebar-nav-item-active'
                                    : 'sidebar-nav-item-default'
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="student-sidebar-pill"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-r-full"
                                        />
                                    )}
                                    <link.icon
                                        size={16}
                                        strokeWidth={isActive ? 2.2 : 1.8}
                                        className={`relative z-10 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}
                                    />
                                    <span className="relative z-10">{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* User Footer */}
            <div className="px-3 py-3 border-t border-slate-200 dark:border-white/[0.07]">
                <div className="flex items-center gap-2.5 px-2 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                    flex items-center justify-center text-xs font-bold text-white shrink-0
                                    ring-2 ring-white dark:ring-surface-950">
                        {initial}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{userName}</p>
                            {user?.can_modify === false && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                                    Demo
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                            student {user?.can_modify === false ? '• View Only' : ''}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl
                               text-sm font-medium text-danger-500 dark:text-danger-400
                               hover:bg-danger-50 dark:hover:bg-danger-500/10
                               hover:text-danger-600 dark:hover:text-danger-300
                               transition-all duration-150"
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </motion.div>
    );
};
