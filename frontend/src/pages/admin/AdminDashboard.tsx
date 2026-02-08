import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, GraduationCap, School, Server, ArrowUpRight, Clock, Activity, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = React.useState({
        student_count: 0,
        teacher_count: 0,
        user_count: 0,
        ml_service: 'Offline'
    });

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/v1/analytics/admin-dashboard');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 text-white">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            Admin Overview
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">System status and institution-wide metrics.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300">
                    <div className={`w-2 h-2 rounded-full ${stats.ml_service === 'Active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    System {stats.ml_service === 'Active' ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: stats.student_count, icon: GraduationCap, color: 'blue', change: '+12%' },
                    { label: 'Total Teachers', value: stats.teacher_count, icon: School, color: 'purple', change: '+4%' },
                    { label: 'System Users', value: stats.user_count, icon: Users, color: 'indigo', change: '+8%' },
                    { label: 'ML Service', value: stats.ml_service, icon: Server, color: 'green', change: '99.9%' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 text-${stat.color}-500 transform group-hover:scale-110 transition-transform`}>
                            <stat.icon size={64} />
                        </div>

                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center mb-4`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                                <span className="text-green-500 text-xs font-bold flex items-center">
                                    <ArrowUpRight size={12} /> {stat.change}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-blue-500" />
                            Recent System Activity
                        </h2>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/10">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    <Clock size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800 dark:text-white">System settings updated</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">by admin@raspp.edu</p>
                                </div>
                                <span className="text-xs font-medium text-slate-400">2 mins ago</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gradient-to-b dark:from-white/5 dark:to-white/5 dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/10">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-left text-sm font-medium transition-colors flex items-center gap-3 text-slate-700 dark:text-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Users size={16} />
                            </div>
                            Generate Reports
                        </button>
                        <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-left text-sm font-medium transition-colors flex items-center gap-3 text-slate-700 dark:text-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <Server size={16} />
                            </div>
                            System Health Check
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/10">
                        <p className="text-xs text-slate-400">System Version</p>
                        <p className="font-mono text-sm text-slate-600 dark:text-slate-300">v2.4.0-beta</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
