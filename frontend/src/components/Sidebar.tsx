import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, LogOut, BookOpen, Clock, TrendingUp, Award, Edit, UserCircle, Trophy, Moon, Sun, ChevronRight, Menu, Brain, Upload, Briefcase, FileText, Target, BarChart2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const links = [
        // Role-neutral
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },

        // Teacher Only
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

        // Admin Only
        ...(user?.role === 'admin' ? [
            { to: '/students', icon: GraduationCap, label: 'Students' },
            { to: '/teachers', icon: Users, label: 'Teachers' },
            { to: '/branches', icon: BookOpen, label: 'Manage Branches' },
            { to: '/subjects', icon: BookOpen, label: 'Subjects' },
            { to: '/results', icon: Trophy, label: 'Results & Merit' },
            { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
            { to: '/predictions', icon: TrendingUp, label: 'AI Predictions' },
        ] : []),

        // Student Only
        ...(user?.role === 'student' ? [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/results', icon: Trophy, label: 'Results' },
            { to: '/student/transcript', icon: FileText, label: 'Transcript' },
            { to: '/student/resume', icon: FileText, label: 'Resume Builder' },
            // Placement Section
            { to: '/student/placement', icon: Briefcase, label: 'Placement Portal' },
            { to: '/student/placement/jobs', icon: Search, label: 'Job Listings' },
            { to: '/student/placement/prediction', icon: Target, label: 'My Prediction' },
            { to: '/student/placement/stats', icon: BarChart2, label: 'Placement Stats' },
        ] : []),

        // Placement Coordinator Only
        ...(user?.role === 'placement_coordinator' ? [
            { to: '/placement/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/placement/jobs', icon: Briefcase, label: 'Job Management' },
            { to: '/placement/bulk-prediction', icon: Upload, label: 'AI Predictions' },
            { to: '/placement/records', icon: FileText, label: 'Records' },
        ] : []),
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/95 dark:bg-black/95 backdrop-blur-xl text-slate-800 dark:text-white w-64 min-h-screen flex flex-col font-sans border-r border-slate-200 dark:border-white/10 transition-colors duration-300"
        >
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
                        <LayoutDashboard size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">RASPP</h1>
                        <p className="text-slate-500 dark:text-gray-500 text-xs font-medium uppercase tracking-wide">{user?.role} Portal</p>
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

            <div className="px-4 py-8 flex-1 overflow-y-auto custom-scrollbar">
                <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-gray-500 font-bold mb-4 ml-1">Menu</p>
                <nav className="space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-blue-50 dark:bg-white/10 text-blue-700 dark:text-white shadow-sm dark:shadow-md border border-blue-100 dark:border-white/5"
                                    : "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={clsx(
                                        "absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 transition-opacity duration-300",
                                        isActive && "opacity-100"
                                    )} />
                                    <link.icon size={20} className={clsx(
                                        "relative z-10 transition-transform duration-300",
                                        isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "group-hover:scale-110"
                                    )} />
                                    <span className="font-medium text-sm relative z-10">{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicatorAdmin"
                                            className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold ring-2 ring-white dark:ring-white/10 text-white shadow-lg">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-700 dark:text-white truncate w-32">
                            {user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 rounded-xl w-full transition-all text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.div>
    );
};
