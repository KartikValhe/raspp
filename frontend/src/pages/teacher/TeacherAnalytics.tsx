import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BookOpen, Award, AlertCircle } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

export const TeacherAnalytics: React.FC = () => {
    // Mock Data for Teacher View
    const classPerformanceData = [
        { name: 'Unit 1', avg: 72, top: 94 },
        { name: 'Unit 2', avg: 78, top: 96 },
        { name: 'Mid-Term', avg: 75, top: 92 },
        { name: 'Unit 3', avg: 82, top: 98 },
        { name: 'Project', avg: 85, top: 99 },
    ];

    const attendanceTrend = [
        { day: 'Mon', present: 92, absent: 8 },
        { day: 'Tue', present: 88, absent: 12 },
        { day: 'Wed', present: 95, absent: 5 },
        { day: 'Thu', present: 85, absent: 15 },
        { day: 'Fri', present: 90, absent: 10 },
    ];

    const stats = [
        { label: 'Total Students', value: '142', icon: Users, color: 'blue', change: '+12 this sem' },
        { label: 'Class Average', value: '78.4%', icon: TrendingUp, color: 'emerald', change: '+2.1%' },
        { label: 'Classes Taken', value: '48', icon: BookOpen, color: 'purple', change: 'On Track' },
        { label: 'Top Performers', value: '12', icon: Award, color: 'amber', change: 'Top 10%' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Class Analytics</h1>
                        <p className="text-slate-500 dark:text-slate-400">Detailed insights into your classes performance.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>All Classes</option>
                        <option>CSA - Sem 4</option>
                        <option>CSA - Sem 6</option>
                        <option>ECE - Sem 2</option>
                    </select>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none relative group overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-${stat.color}-500`}>
                            <stat.icon size={80} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Performance Trend</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Avg</span>
                            <span className="flex items-center gap-1 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Top</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={classPerformanceData}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                                <Area type="monotone" dataKey="top" stroke="#10b981" strokeWidth={3} fill="none" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Attendance Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Week Attendance</h3>
                        <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View Report</button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceTrend} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="present" name="Present %" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={20} />
                                <Bar dataKey="absent" name="Absent %" fill="#ef4444" radius={[4, 4, 4, 4]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Alerts / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="col-span-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Upcoming Exam Schedule</h3>
                            <p className="text-indigo-100 max-w-sm">Mid-term evaluations for Semester 4 start next week. Ensure all internal marks are updated.</p>
                        </div>
                        <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all transform hover:-translate-y-0.5">
                            Update Marks
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm"
                >
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={20} />
                        Attention Needed
                    </h3>
                    <div className="space-y-4">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-white">Low Attendance Alert</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">3 students in CSA-B</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
