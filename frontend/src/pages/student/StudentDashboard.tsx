import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { TrendingUp, BookOpen, Clock, AlertCircle, Calendar, Trophy, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { AttendanceHeatmap } from '../../components/charts/Heatmap';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();

    // Mock Data (Replace with API later)
    const stats = {
        attendance: 87,
        cgpa: 8.4,
        backlogs: 0,
        credits: 92
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-full overflow-y-auto p-8 space-y-8"
        >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Student Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Welcome back, <span className="font-semibold text-violet-600 dark:text-violet-400">{user?.email?.split('@')[0] || 'Student'}</span>! Here is your daily academic overview.
                        </p>
                    </div>
                </div>


                <div className="text-right hidden md:block">
                    <p className="text-gray-900 dark:text-white font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-gray-500 text-sm">Fall Semester 2024</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Attendance Card */}
                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={60} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Attendance</p>
                        <div className="flex items-end gap-2">
                            <h3 className={`text-4xl font-bold ${stats.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stats.attendance}%
                            </h3>
                            <span className="text-gray-500 text-xs mb-2">overall</span>
                        </div>
                        <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full ${stats.attendance >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ width: `${stats.attendance}%` }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* CGPA Card */}
                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={60} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">CGPA</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-bold text-violet-400">{stats.cgpa}</h3>
                            <span className="text-emerald-400 text-xs mb-2 flex items-center gap-0.5">
                                <TrendingUp size={12} /> +0.2
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">Last semester: 8.2</p>
                    </div>
                </motion.div>

                {/* Backlogs Card */}
                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={60} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Backlogs</p>
                        <h3 className={`text-4xl font-bold ${stats.backlogs === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stats.backlogs}
                        </h3>
                        <p className="text-xs text-gray-500 mt-4">
                            {stats.backlogs === 0 ? "You're all clear! 🎉" : "Action required"}
                        </p>
                    </div>
                </motion.div>

                {/* Credits Card */}
                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BookOpen size={60} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Credits</p>
                        <h3 className="text-4xl font-bold text-blue-400">{stats.credits}</h3>
                        <p className="text-xs text-gray-500 mt-4">160 required for graduation</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Attendance Heatmap Section */}
            <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock size={20} className="text-emerald-500" />
                        Attendance Overview
                    </h2>
                    <select className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-700 dark:text-gray-300">
                        <option>Fall 2024</option>
                        <option>Spring 2024</option>
                    </select>
                </div>

                <AttendanceHeatmap data={React.useMemo(() => {
                    const data = [];
                    const today = new Date();
                    for (let i = 120; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(today.getDate() - i);
                        // Skip weekends
                        if (date.getDay() === 0 || date.getDay() === 6) continue;

                        const dateStr = date.toISOString().split('T')[0];
                        // Random attendance: 85% present (1), 10% absent (0), 5% late (2)
                        const rand = Math.random();
                        let value = 1;
                        if (rand > 0.95) value = 2; // Late
                        else if (rand > 0.85) value = 0; // Absent

                        data.push({ date: dateStr, value });
                    }
                    return data;
                }, [])} />
            </motion.div>

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-indigo-400" />
                        Upcoming Events
                    </h2>

                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5">
                                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <span className="text-xs text-red-400 font-bold uppercase">DEC</span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{25 + i}</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 dark:text-white font-medium">Internal Assessment - {i + 1}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Computer Science Dept • 10:00 AM</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Academic</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Important</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 border border-indigo-500/30 relative overflow-hidden shadow-xl"
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Trophy size={20} className="text-yellow-400" />
                                    Exam Results Out!
                                </h2>
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-1 rounded-full animate-pulse">
                                    Live Now
                                </span>
                            </div>

                            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                                The results for the <span className="text-white font-medium">Nov/Dec 2024 End Semester Examinations</span> have been officially declared.
                            </p>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                                    <p className="text-[10px] text-indigo-300 uppercase font-bold">Session</p>
                                    <p className="text-sm font-medium text-white">Fall 2024</p>
                                </div>
                                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                                    <p className="text-[10px] text-indigo-300 uppercase font-bold">Published</p>
                                    <p className="text-sm font-medium text-white">Dec 24, 2024</p>
                                </div>
                                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                                    <p className="text-[10px] text-indigo-300 uppercase font-bold">Type</p>
                                    <p className="text-sm font-medium text-white">Regular</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.href = '/student/check-result'}
                            className="w-full py-3.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 group"
                        >
                            <span>Check Results Now</span>
                            <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full" />
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Trophy size={100} />
                    </div>
                </motion.div>
            </div>
        </motion.div >
    );
};
