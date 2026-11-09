import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, TrendingUp, ArrowRight, CheckCircle, XCircle, LayoutDashboard, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';
import { StatsCard } from '../../components/StatsCard';

const PlacementDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>({
        total_companies: 15,
        avg_package: 6.5,
        placement_rate: 85
    });
    const [jobs, setJobs] = useState<any[]>([]);
    const [prediction, setPrediction] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recent jobs
                const jobsRes = await api.get('/api/v1/placement/jobs');
                if (jobsRes.data) {
                    setJobs(jobsRes.data.slice(0, 3));
                }

                // Fetch prediction
                const predRes = await api.get('/api/v1/placement/my-prediction');
                if (predRes.data) {
                    setPrediction(predRes.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="page-wrap">
            <div className="max-w-7xl mx-auto space-y-6">

                <PageHeader
                    icon={LayoutDashboard}
                    title="Placement Dashboard"
                    subtitle="Explore campus opportunities, monitor your readiness, and view AI predictions"
                    iconClass="bg-primary-500"
                    actions={
                        <div className="flex items-center gap-2.5">
                            <Link to="/student/placement/jobs" className="btn-primary">Browse Jobs</Link>
                            <Link to="/student/placement/prediction" className="btn-secondary">Check Prediction</Link>
                        </div>
                    }
                />

                {/* Prediction Teaser Card */}
                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-5 sm:p-6 bg-gradient-to-r from-primary-900/40 via-surface-900/60 to-surface-950/80 border-primary-500/30 text-white relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                            <div>
                                <span className="badge badge-primary mb-2">AI Telemetry</span>
                                <h2 className="text-xl sm:text-2xl font-bold">Campus Placement Probability</h2>
                                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Based on your academic performance, coding assessments, and skill evaluations.</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 dark:bg-white/[0.06] rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Probability</p>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{(prediction.confidence * 100).toFixed(0)}%</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${prediction.prediction === 'Placed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-amber-500 text-white'}`}>
                                    {prediction.prediction === 'Placed' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Centralized KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <StatsCard
                        label="Active Companies"
                        value={stats.total_companies}
                        icon={Building2}
                        iconBg="bg-blue-50 dark:bg-blue-500/10"
                        iconColor="text-blue-600 dark:text-blue-400"
                        watermarkColor="text-blue-500"
                        delay={0}
                    />
                    <StatsCard
                        label="Average Package"
                        value={`₹${stats.avg_package} LPA`}
                        icon={TrendingUp}
                        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        watermarkColor="text-emerald-500"
                        delay={0.05}
                    />
                    <StatsCard
                        label="Placement Rate"
                        value={`${stats.placement_rate}%`}
                        icon={Target}
                        iconBg="bg-violet-50 dark:bg-violet-500/10"
                        iconColor="text-violet-600 dark:text-violet-400"
                        watermarkColor="text-violet-500"
                        delay={0.1}
                    />
                </div>

                {/* Recent Jobs */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Opportunities</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Latest active campus recruiting drives</p>
                        </div>
                        <Link to="/student/placement/jobs" className="btn-link inline-flex items-center gap-1 text-xs">
                            <span>View All</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {jobs.map((job, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -3 }}
                                    className="card p-5 flex flex-col justify-between hover:shadow-glass hover:border-primary-500/40 transition-all duration-200"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-base shadow-sm">
                                                {job.company_name[0]}
                                            </div>
                                            <span className="badge badge-success">
                                                {job.package_range} LPA
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-0.5">{job.job_role}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{job.company_name}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs">
                                        <span className="text-slate-400">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                        <Link to="/student/placement/jobs" className="btn-link text-xs">
                                            Details →
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12 border-dashed">
                            <p className="text-sm text-slate-500 dark:text-slate-400">No active job postings at the moment.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PlacementDashboard;
