import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, LogOut, BookOpen, Clock,
    TrendingUp, Award, Edit, UserCircle, Trophy, Moon, Sun,
    Brain, Upload, Briefcase, FileText, Target, BarChart2, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },

        // Teacher
        ...(user?.role === 'teacher' ? [
            { to: '/teacher/marks', icon: Edit, label: 'Grading Hub' },
            { to: '/teacher/students', icon: GraduationCap, label: 'My Students' },
            { to: '/teacher/merit', icon: Award, label: 'Merit List' },
            { to: '/teacher/analytics', icon: TrendingUp, label: 'Class Analytics' },
            { to: '/teacher/predictions', icon: Brain, label: 'AI Predictions' },
            { to: '/teacher/bulk-prediction', icon: Upload, label: 'Bulk Predictions' },
            { to: '/teacher/attendance', icon: Clock, label: 'Take Attendance' },
            { to: '/teacher/profile', icon: UserCircle, label: 'My Profile' },
        ] : []),

        // Admin
        ...(user?.role === 'admin' ? [
            { to: '/students', icon: GraduationCap, label: 'Students' },
            { to: '/teachers', icon: Users, label: 'Teachers' },
            { to: '/branches', icon: BookOpen, label: 'Manage Branches' },
            { to: '/subjects', icon: BookOpen, label: 'Subjects' },
            { to: '/results', icon: Trophy, label: 'Results & Merit' },
            { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
            { to: '/predictions', icon: Brain, label: 'AI Predictions' },
        ] : []),

        // Student
        ...(user?.role === 'student' ? [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/results', icon: Trophy, label: 'Results' },
            { to: '/student/transcript', icon: FileText, label: 'Transcript' },
            { to: '/student/resume', icon: FileText, label: 'Resume Builder' },
            { to: '/student/placement', icon: Briefcase, label: 'Placement Portal' },
            { to: '/student/placement/jobs', icon: Search, label: 'Job Listings' },
            { to: '/student/placement/prediction', icon: Target, label: 'My Prediction' },
            { to: '/student/placement/stats', icon: BarChart2, label: 'Placement Stats' },
        ] : []),

        // Placement Coordinator
        ...(user?.role === 'placement_coordinator' ? [
            { to: '/placement/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/placement/jobs', icon: Briefcase, label: 'Job Management' },
            { to: '/placement/bulk-prediction', icon: Upload, label: 'AI Predictions' },
            { to: '/placement/records', icon: FileText, label: 'Records' },
        ] : []),
    ];

    const userInitial = user?.email?.[0]?.toUpperCase() ?? 'U';
    const userName = user?.email?.split('@')[0] ?? 'User';

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-surface-900 text-slate-800 dark:text-white w-64 min-h-screen flex flex-col
                       border-r border-slate-200 dark:border-white/[0.07] transition-colors duration-300"
        >
            {/* ── Logo / Brand ─────────────────────────────── */}
            <div className="px-5 py-5 border-b border-slate-200 dark:border-white/[0.07] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-primary-sm">
                        <LayoutDashboard size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight text-gradient-dark">RASPP</h1>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            {user?.role} Portal
                        </p>
                    </div>
                </div>

                <button
                    onClick={toggleTheme}
                    className="btn-ghost w-8 h-8 p-0 rounded-lg flex items-center justify-center"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark'
                        ? <Sun size={16} className="text-amber-400" />
                        : <Moon size={16} />
                    }
                </button>
            </div>

            {/* ── Navigation ───────────────────────────────── */}
            <div className="px-3 py-5 flex-1 overflow-y-auto scrollbar-thin">
                <p className="section-label px-2 mb-3">Menu</p>
                <nav className="space-y-0.5">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
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
                                            layoutId="sidebar-active-pill"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                                        />
                                    )}
                                    <link.icon
                                        size={17}
                                        strokeWidth={isActive ? 2.2 : 1.8}
                                        className={`relative z-10 transition-colors duration-200 shrink-0
                                            ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}
                                    />
                                    <span className="relative z-10 font-medium">{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* ── User Footer ──────────────────────────────── */}
            <div className="p-3 border-t border-slate-200 dark:border-white/[0.07]">
                <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                    flex items-center justify-center text-xs font-bold text-white shrink-0
                                    ring-2 ring-white dark:ring-surface-900 shadow-sm">
                        {userInitial}
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate leading-tight">
                            {userName}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium
                               text-danger-500 dark:text-danger-400
                               hover:bg-danger-50 dark:hover:bg-danger-500/10
                               hover:text-danger-600 dark:hover:text-danger-300
                               transition-all duration-200"
                >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.div>
    );
};
