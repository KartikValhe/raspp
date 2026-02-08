import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Upload,
    FileText,
    TrendingUp,
    Users,
    Building2,
    Calendar,
    ArrowUpRight,
    ArrowRight,
    Sun,
    Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                <Icon size={24} />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center gap-1 text-emerald-500 text-xs font-medium">
                <ArrowUpRight size={14} />
                <span>{trend} vs last year</span>
            </div>
        )}
    </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, to, color }: any) => (
    <Link to={to}>
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group h-full p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300"
        >
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{description}</p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <span>Access Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    </Link>
);

const CoordinatorDashboard: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [stats, setStats] = useState({
        total_students: 0,
        total_placed: 0,
        placement_percentage: 0,
        average_package: 0,
        highest_package: 0,
        total_companies: 0,
        active_jobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/v1/placement/statistics');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                            Placement Overview
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Track and manage campus placements effectively.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Session</p>
                            <p className="text-xl font-bold">2025-2026</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Placement Rate"
                        value={`${stats.placement_percentage.toFixed(1)}%`}
                        icon={TrendingUp}
                        color="emerald"
                        trend="+12%"
                    />
                    <StatCard
                        title="Avg. Package"
                        value={`₹${stats.average_package.toFixed(2)} LPA`}
                        icon={Briefcase}
                        color="blue"
                        trend="+2.5 LPA"
                    />
                    <StatCard
                        title="Highest Package"
                        value={`₹${stats.highest_package} LPA`}
                        icon={Building2}
                        color="amber"
                        trend="New Record"
                    />
                    <StatCard
                        title="Total Placed"
                        value={`${stats.total_placed} / ${stats.total_students}`}
                        icon={Users}
                        color="indigo"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickActionCard
                        title="Manage Jobs"
                        description="Post new opportunities, update status, and track applications."
                        icon={Briefcase}
                        to="/placement/jobs"
                        color="blue"
                    />
                    <QuickActionCard
                        title="Bulk Predictions"
                        description="Upload CSV student data for AI-powered placement probability analysis."
                        icon={Upload}
                        to="/placement/bulk-prediction"
                        color="purple"
                    />
                    <QuickActionCard
                        title="Placement Records"
                        description="View and manage detailed placement records for all students."
                        icon={FileText}
                        to="/placement/records"
                        color="emerald"
                    />
                </div>

                {/* Recent Activities Section Placeholder */}
                <div className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Recent Activities</h2>
                        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800 dark:text-white">New Job Posted: Software Engineer at Google</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">posted 2 hours ago</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default CoordinatorDashboard;
