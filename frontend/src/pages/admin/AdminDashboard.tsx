import React from 'react';
import api from '../../services/api';
import { Users, GraduationCap, School, Server, ArrowUpRight, Clock, Activity, LayoutDashboard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────
interface DashboardStats {
    student_count: number;
    teacher_count: number;
    user_count: number;
    ml_service: 'Active' | 'Offline' | string;
}

// ─── Stat Card ───────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    change: string;
    colorClass: string;
    delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, change, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.35, ease: 'easeOut' }}
        className="stat-card group cursor-default hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
        {/* Background watermark icon */}
        <div className={`absolute top-0 right-0 p-4 opacity-[0.07] transition-all duration-300 group-hover:opacity-[0.12] group-hover:scale-110 ${colorClass}`}>
            <Icon size={64} strokeWidth={1.5} />
        </div>

        <div className="relative z-10">
            <div className={`stat-card-icon ${colorClass.replace('text-', 'bg-').replace('-600', '-50').replace('-400', '-500/10')} ${colorClass}`}>
                <Icon size={22} strokeWidth={2} />
            </div>
            <p className="stat-card-label">{label}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <h3 className="stat-card-value">{value}</h3>
                <span className="text-success-600 dark:text-success-500 text-xs font-semibold flex items-center gap-0.5">
                    <ArrowUpRight size={12} />
                    {change}
                </span>
            </div>
        </div>
    </motion.div>
);

// ─── Activity Item ────────────────────────────────────────────
interface ActivityItemProps {
    title: string;
    meta: string;
    time: string;
    index: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, meta, time, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
        className="activity-item"
    >
        <div className="activity-icon">
            <Clock size={16} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{meta}</p>
        </div>
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">{time}</span>
    </motion.div>
);

// ─── Main Dashboard ───────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = React.useState<DashboardStats>({
        student_count: 0,
        teacher_count: 0,
        user_count: 0,
        ml_service: 'Offline',
    });

    React.useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/v1/analytics/admin-dashboard');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        }
    };

    const isOnline = stats.ml_service === 'Active';

    const statCards = [
        { label: 'Total Students', value: stats.student_count, icon: GraduationCap, change: '+12%', colorClass: 'text-primary-600 dark:text-primary-400' },
        { label: 'Total Teachers', value: stats.teacher_count, icon: School, change: '+4%', colorClass: 'text-violet-600 dark:text-violet-400' },
        { label: 'System Users', value: stats.user_count, icon: Users, change: '+8%', colorClass: 'text-accent-600 dark:text-accent-400' },
        { label: 'ML Service', value: stats.ml_service, icon: Server, change: '99.9%', colorClass: 'text-success-600 dark:text-success-500' },
    ];

    const activities = [
        { title: 'System settings updated', meta: 'by admin@raspp.edu', time: '2 mins ago' },
        { title: 'New student registered', meta: 'CS-2024 batch', time: '14 mins ago' },
        { title: 'ML model retrained', meta: 'Accuracy: 94.2%', time: '1 hr ago' },
    ];

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8 animate-fade-in">

            {/* ── Page Header ── */}
            <div className="page-header">
                <div className="page-title-group">
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="page-icon"
                    >
                        <LayoutDashboard size={24} />
                    </motion.div>
                    <div>
                        <h1 className="page-title">Admin Overview</h1>
                        <p className="page-subtitle">System status and institution-wide metrics</p>
                    </div>
                </div>

                {/* System status pill */}
                <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="info-pill"
                >
                    <span className={isOnline ? 'status-online' : 'status-offline'} />
                    System {isOnline ? 'Online' : 'Offline'}
                </motion.div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card, i) => (
                    <StatCard key={card.label} {...card} delay={i * 0.08} />
                ))}
            </div>

            {/* ── Main Content Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Activity Feed — 2/3 width */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.35 }}
                    className="card-p lg:col-span-2"
                >
                    <div className="section-header">
                        <h2 className="section-title">
                            <Activity size={18} className="text-primary-500" />
                            Recent System Activity
                        </h2>
                        <button className="btn-link">View All</button>
                    </div>
                    <div className="space-y-1">
                        {activities.map((item, i) => (
                            <ActivityItem key={i} index={i} {...item} />
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions — 1/3 width */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="card-p flex flex-col"
                >
                    <h2 className="section-title mb-5">Quick Actions</h2>

                    <div className="space-y-2.5">
                        <button className="quick-action group">
                            <div className="quick-action-icon bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                                <Users size={16} />
                            </div>
                            <span className="flex-1 text-left">Generate Reports</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </button>

                        <button className="quick-action group">
                            <div className="quick-action-icon bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <Server size={16} />
                            </div>
                            <span className="flex-1 text-left">System Health Check</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </button>

                        <button className="quick-action group">
                            <div className="quick-action-icon bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400">
                                <GraduationCap size={16} />
                            </div>
                            <span className="flex-1 text-left">Export Student Data</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </button>
                    </div>

                    {/* Version info */}
                    <div className="mt-auto pt-6 divider">
                        <div className="mt-4 flex items-center justify-between">
                            <p className="section-label">System Version</p>
                            <span className="badge badge-neutral font-mono">v2.4.0</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
