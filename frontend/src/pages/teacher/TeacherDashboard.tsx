import React, { useState } from 'react';
import { StatsCard } from '../../components/StatsCard';
import { PerformanceChart } from '../../components/charts/PerformanceChart';
import { AttendanceHeatmap } from '../../components/charts/Heatmap';
import { DataTable, type Column } from '../../components/Table/DataTable';
import { Users, AlertTriangle, TrendingUp, CheckCircle, Table, Calendar, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const TeacherDashboard: React.FC = () => {
    // const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'gradebook' | 'attendance'>('overview');

    // Mock Attendance Data
    const attendanceData = Array.from({ length: 90 }, (_, i) => ({
        date: `2023-09-${(i % 30) + 1}`,
        value: Math.random() > 0.8 ? 0 : Math.random() > 0.9 ? 2 : 1 // Mainly present
    }));

    // Mock Gradebook Data
    const gradebookData = [
        { id: 1, name: "John Doe", assignment1: 85, midTerm: 78, final: 82, total: 81.6 },
        { id: 2, name: "Jane Smith", assignment1: 92, midTerm: 88, final: 95, total: 91.6 },
        { id: 3, name: "Mike Johnson", assignment1: 65, midTerm: 58, final: 70, total: 64.3 },
        { id: 4, name: "Sarah Williams", assignment1: 88, midTerm: 85, final: 90, total: 87.6 },
        { id: 5, name: "David Brown", assignment1: 72, midTerm: 75, final: 78, total: 75.0 },
    ];

    const gradebookColumns: Column<any>[] = [
        { key: 'name', label: 'Student Name', sortable: true },
        { key: 'assignment1', label: 'Assignment 1 (20%)', sortable: true },
        { key: 'midTerm', label: 'Mid-Term (30%)', sortable: true },
        { key: 'final', label: 'Final Exam (50%)', sortable: true },
        { key: 'total', label: 'Total (%)', sortable: true },
    ];

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Teacher Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage your classes, track performance, and grade assignments.</p>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {['overview', 'gradebook', 'attendance'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all capitalize",
                                activeTab === tab
                                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Stats Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard label="Total Students" value="42" icon={Users} color="blue" trend={{ value: 12, isPositive: true }} delay={0} />
                            <StatsCard label="Avg Class Attendance" value="85%" icon={CheckCircle} color="green" trend={{ value: 5, isPositive: true }} delay={0.1} />
                            <StatsCard label="At Risk Students" value="3" icon={AlertTriangle} color="red" trend={{ value: 2, isPositive: false }} delay={0.2} />
                            <StatsCard label="Class Performance" value="Good" icon={TrendingUp} color="purple" delay={0.3} />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                            <div className="lg:col-span-2 bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm flex flex-col">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Class Performance Trend</h2>
                                <div className="flex-1 min-h-0">
                                    <PerformanceChart />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Attendance Heatmap (Today)</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Visual snapshot of recent patterns.</p>
                                <AttendanceHeatmap data={attendanceData.slice(-14)} /> {/* Showing last 2 weeks here small */}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'gradebook' && (
                    <motion.div
                        key="gradebook"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Table size={20} className="text-blue-600" />
                                Interactive Gradebook
                            </h2>
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Export CSV
                            </button>
                        </div>
                        <DataTable columns={gradebookColumns} data={gradebookData} />
                    </motion.div>
                )}

                {activeTab === 'attendance' && (
                    <motion.div
                        key="attendance"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-green-600" />
                            Semester Attendance Heatmap
                        </h2>
                        <AttendanceHeatmap data={attendanceData} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
