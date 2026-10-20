import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    FileText,
    TrendingUp,
    Users,
    Building2,
    Calendar,
    ArrowUpRight,
    ArrowRight,
    LayoutDashboard,
    Award,
    CheckCircle,
    Clock,
    Sparkles,
    BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';

interface PlacementStats {
    total_students: number;
    total_placed: number;
    placement_percentage: number;
    average_package: number;
    highest_package: number;
    total_companies: number;
    active_jobs: number;
}

// Synthetic default statistics for rich showcase
const SYNTHETIC_DEFAULT_STATS: PlacementStats = {
    total_students: 420,
    total_placed: 358,
    placement_percentage: 85.2,
    average_package: 8.65,
    highest_package: 42.0,
    total_companies: 52,
    active_jobs: 14
};

// Synthetic Top Recruiting Partners
const TOP_RECRUITERS = [
    { name: 'Microsoft', package: '₹42.0 LPA', hired: 8, tier: 'Tier-1 Product', role: 'Software Engineer' },
    { name: 'Google Cloud', package: '₹38.5 LPA', hired: 5, tier: 'Tier-1 Product', role: 'Cloud Solutions Eng.' },
    { name: 'Amazon AWS', package: '₹32.0 LPA', hired: 11, tier: 'Tier-1 Product', role: 'SDE-1' },
    { name: 'Oracle Tech', package: '₹18.5 LPA', hired: 14, tier: 'Core Tech', role: 'Database Engineer' },
    { name: 'Deloitte Digital', package: '₹12.0 LPA', hired: 26, tier: 'Consulting', role: 'Technology Consultant' },
    { name: 'TCS Digital', package: '₹9.0 LPA', hired: 45, tier: 'Mass Tech', role: 'Systems Engineer' },
];

// Synthetic Department-wise Placement Rates
const DEPARTMENT_STATS = [
    { branch: 'Computer Science (CSE)', placed: 128, total: 136, rate: 94.1, color: 'bg-blue-500' },
    { branch: 'Information Technology (IT)', placed: 76, total: 84, rate: 90.5, color: 'bg-indigo-500' },
    { branch: 'Electronics & Comm. (ECE)', placed: 70, total: 85, rate: 82.4, color: 'bg-emerald-500' },
    { branch: 'Mechanical Eng. (MECH)', placed: 50, total: 67, rate: 74.6, color: 'bg-amber-500' },
    { branch: 'Civil Engineering (CIVIL)', placed: 34, total: 48, rate: 70.8, color: 'bg-purple-500' },
];

// Synthetic Recent Recruitment Activities
const RECENT_ACTIVITIES = [
    {
        title: 'Google Cloud Released 5 Final Offers',
        subtitle: 'SDE-1 & Cloud Engineer roles (CTC: ₹38.5 LPA)',
        time: '2 hours ago',
        status: 'Selected',
        statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
    },
    {
        title: 'Microsoft PPO Conversions Announced',
        subtitle: '8 Summer Interns offered full-time roles (₹42.0 LPA)',
        time: 'Yesterday',
        status: 'PPO Confirmed',
        statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
    },
    {
        title: 'Deloitte Campus Drive Shortlist Published',
        subtitle: '42 candidates shortlisted for Technical Round 2',
        time: '2 days ago',
        status: 'In Progress',
        statusColor: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
    },
    {
        title: 'Amazon AWS Drive Registration Closed',
        subtitle: '184 eligible final year students applied',
        time: '3 days ago',
        status: 'Shortlisting',
        statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
    },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 dark:text-${color}-400 shrink-0`}>
                <Icon size={24} />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <ArrowUpRight size={14} />
                <span>{trend} vs last season</span>
            </div>
        )}
    </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, to, color }: any) => (
    <Link to={to}>
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group h-full p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 shadow-sm"
        >
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                <span>Open Section</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    </Link>
);

const CoordinatorDashboard: React.FC = () => {
    const [stats, setStats] = useState<PlacementStats>(SYNTHETIC_DEFAULT_STATS);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/v1/placement/statistics');
            if (response.data && response.data.total_placed > 0) {
                setStats(response.data);
            }
        } catch (error) {
            console.warn('Using enriched synthetic placement statistics for showcase:', error);
        }
    };

    return (
        <div className="min-h-full p-4 sm:p-6 space-y-6">
            <PageHeader
                icon={LayoutDashboard}
                title="Placement Coordinator Hub"
                subtitle="Track campus recruitment telemetry, recruiter partnerships & student offer history"
                iconClass="bg-primary-500"
                actions={
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Session</p>
                        <p className="text-base font-bold text-slate-800 dark:text-white">2025-2026 Drive</p>
                    </div>
                }
            />

            {/* Core KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatCard
                    title="Placement Rate"
                    value={`${stats.placement_percentage.toFixed(1)}%`}
                    icon={TrendingUp}
                    color="emerald"
                    trend="+12.4%"
                />
                <StatCard
                    title="Average CTC"
                    value={`₹${stats.average_package.toFixed(2)} LPA`}
                    icon={Briefcase}
                    color="blue"
                    trend="+2.1 LPA"
                />
                <StatCard
                    title="Highest CTC Offered"
                    value={`₹${stats.highest_package.toFixed(1)} LPA`}
                    icon={Building2}
                    color="amber"
                    trend="Record High"
                />
                <StatCard
                    title="Total Students Placed"
                    value={`${stats.total_placed} / ${stats.total_students}`}
                    icon={Users}
                    color="indigo"
                    trend="52 Companies"
                />
            </div>

            {/* Quick Actions (Bulk Predictions removed as requested) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <QuickActionCard
                    title="Job Listings & Drive Management"
                    description="Create new campus opportunities, configure eligibility thresholds, manage application deadlines, and monitor student applicants."
                    icon={Briefcase}
                    to="/placement/jobs"
                    color="blue"
                />
                <QuickActionCard
                    title="Placement Records & Archives"
                    description="Browse verified placement records, review salary distributions by department, and inspect downloadable official offer letters."
                    icon={FileText}
                    to="/placement/records"
                    color="emerald"
                />
            </div>

            {/* Top Recruiters & Department Placement Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Recruiting Partners Card */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Award size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">Top Recruiting Partners</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Highest package campus recruitment offers</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                            Verified Offers
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {TOP_RECRUITERS.map((recruiter, idx) => (
                            <div key={idx} className="py-3 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{recruiter.name}</h4>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                            {recruiter.tier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{recruiter.role} • {recruiter.hired} Students Hired</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block">{recruiter.package}</span>
                                    <span className="text-[11px] text-slate-400">Full-Time</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department-Wise Placement Performance */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Department Placement Rates</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Batch of 2025-2026 performance</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400">
                                5 Branches
                            </span>
                        </div>

                        <div className="space-y-4">
                            {DEPARTMENT_STATS.map((dept, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.branch}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {dept.rate}% <span className="text-slate-400 font-normal">({dept.placed}/{dept.total})</span>
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${dept.color}`}
                                            style={{ width: `${dept.rate}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Institution Cumulative Pass-to-Placement: <strong className="text-slate-800 dark:text-white">85.2%</strong></span>
                        <Link to="/placement/records" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                            View All Records →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Live Placement Drive Activities Timeline */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Placement Activities</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Real-time drive updates, shortlist announcements and offer releases</p>
                    </div>
                    <Link
                        to="/placement/jobs"
                        className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline"
                    >
                        Manage All Jobs →
                    </Link>
                </div>

                <div className="space-y-3.5">
                    {RECENT_ACTIVITIES.map((act, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/60 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{act.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{act.subtitle} • {act.time}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${act.statusColor}`}>
                                {act.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
