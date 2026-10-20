import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { TrendingUp, BookOpen, Clock, AlertCircle, Calendar, Trophy, LayoutDashboard, Bot, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { StatsCard } from '../../components/StatsCard';
import { AttendanceHeatmap } from '../../components/charts/Heatmap';
import { AICareerAdvisor } from '../../components/AICareerAdvisor';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [isAdvisorOpen, setIsAdvisorOpen] = React.useState(false);
    const [profile, setProfile] = React.useState<any>(null);

    React.useEffect(() => {
        api.get('/api/v1/students/me')
            .then(res => setProfile(res.data))
            .catch(() => {});
    }, []);

    // Academic Stats
    const stats = {
        attendance: 91,
        cgpa: 8.8,
        backlogs: 0,
        credits: 124
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

    const studentName = profile?.full_name || (user?.email ? user.email.split('@')[0] : 'Aarav Sharma');
    const branchName = profile?.branch?.name || "Computer Science & Engineering";

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-full overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
        >
            <PageHeader
                icon={LayoutDashboard}
                title="Student Dashboard"
                subtitle={`Welcome back, ${studentName}! Semester ${profile?.current_semester || 6} • ${branchName}`}
                iconClass="bg-violet-500"
                actions={
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-slate-400">ID: {profile?.student_id || 'STU202401'}</p>
                    </div>
                }
            />

            {/* Stats Grid using shared StatsCard component */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <motion.div variants={itemVariants}>
                    <StatsCard
                        label="Attendance"
                        value={`${stats.attendance}%`}
                        icon={Clock}
                        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        watermarkColor="text-emerald-500"
                        trend={{ value: 3, isPositive: true }}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatsCard
                        label="CGPA"
                        value={stats.cgpa}
                        icon={TrendingUp}
                        iconBg="bg-violet-50 dark:bg-violet-500/10"
                        iconColor="text-violet-600 dark:text-violet-400"
                        watermarkColor="text-violet-500"
                        trend={{ value: 2, isPositive: true }}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatsCard
                        label="Active Backlogs"
                        value={stats.backlogs}
                        icon={AlertCircle}
                        iconBg="bg-red-50 dark:bg-red-500/10"
                        iconColor="text-red-600 dark:text-red-400"
                        watermarkColor="text-red-500"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatsCard
                        label="Total Credits"
                        value={stats.credits}
                        icon={BookOpen}
                        iconBg="bg-blue-50 dark:bg-blue-500/10"
                        iconColor="text-blue-600 dark:text-blue-400"
                        watermarkColor="text-blue-500"
                    />
                </motion.div>
            </motion.div>

            {/* Attendance Heatmap Section */}
            <motion.div
                variants={itemVariants}
                className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
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
                
                {/* AI Advisor Card */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-3 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/30 shadow-xl relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="p-3.5 sm:p-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg shadow-violet-500/20 shrink-0">
                                <Sparkles size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Personalized Career Plan</h2>
                                <p className="text-sm text-indigo-200">Leverage our ML engine and AI to get a tailored roadmap for your placements.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAdvisorOpen(true)}
                            className="w-full md:w-auto text-center justify-center whitespace-nowrap px-6 py-3.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            <Bot size={18} />
                            <span>Generate AI Plan</span>
                        </button>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-fuchsia-500/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-500/20 blur-[120px] rounded-full pointer-events-none" />
                </motion.div>
            </div>

            {/* AI Advisor Modal */}
            <AICareerAdvisor 
                isOpen={isAdvisorOpen} 
                onClose={() => setIsAdvisorOpen(false)} 
                studentId="CSE21001" // Using test student ID for now
            />
        </motion.div >
    );
};
