import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import {
    Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart as RechartsBar, Bar, Legend, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

export const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/api/v1/analytics/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load analytics data. Is the backend running?");
            });
    }, []);

    // Mock Data for Charts (since the backend endpoint for detailed history is not fully implementing history yet)
    const performanceData = [
        { name: 'Week 1', avg: 75, top: 92 },
        { name: 'Week 2', avg: 78, top: 94 },
        { name: 'Week 3', avg: 72, top: 89 },
        { name: 'Week 4', avg: 82, top: 95 },
        { name: 'Week 5', avg: 79, top: 91 },
        { name: 'Week 6', avg: 85, top: 98 },
        { name: 'Week 7', avg: 81, top: 94 },
        { name: 'Week 8', avg: 88, top: 96 },
    ];

    const attendanceData = [
        { name: 'Mon', present: 85, absent: 15 },
        { name: 'Tue', present: 88, absent: 12 },
        { name: 'Wed', present: 92, absent: 8 },
        { name: 'Thu', present: 78, absent: 22 },
        { name: 'Fri', present: 82, absent: 18 },
    ];

    if (error) return (
        <div className="p-8 flex flex-col items-center justify-center h-full text-slate-500">
            <AlertTriangle size={48} className="text-red-400 mb-4" />
            <p className="text-lg font-medium text-slate-800">Connection Error</p>
            <p className="mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">Retry</button>
        </div>
    );

    if (!stats) return (
        <div className="p-8 flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-500 font-medium">Loading analytics...</span>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                    <TrendingUp size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Institutional Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Global insights into student performance and attendance.</p>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
                <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total_students}</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Teachers</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total_teachers}</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg Attendance</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.avg_attendance}%</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform duration-300">
                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">At Risk Alerts</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.active_alerts}</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Charts Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* Performance Trend */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Academic Performance Trend</h3>
                        <select className="text-xs border-slate-200 dark:border-white/10 rounded-lg text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-2">
                            <option>This Semester</option>
                            <option>Last Semester</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" name="Class Average" />
                                <Line type="monotone" dataKey="top" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Top Performer" />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Chart */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Weekly Attendance</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar size={14} />
                            <span>This Week</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBar data={attendanceData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="present" name="Present %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="absent" name="Absent %" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            </RechartsBar>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
