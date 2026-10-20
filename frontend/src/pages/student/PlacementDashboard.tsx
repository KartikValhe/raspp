import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, TrendingUp, ArrowRight, CheckCircle, XCircle, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';

const StatCard = ({ title, value, icon: Icon, color, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`}>
                <Icon size={24} />
            </div>
            {value && <span className="text-2xl font-bold">{value}</span>}
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 font-medium">{title}</h3>
    </motion.div>
);

const JobCard = ({ job }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl font-bold">
                {job.company_name[0]}
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                {job.package_range}
            </span>
        </div>
        <h3 className="font-bold text-lg mb-1">{job.job_role}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{job.company_name}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
            <Link to="/student/placement/jobs" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                View Details
            </Link>
        </div>
    </motion.div>
);

const PlacementDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>({
        total_companies: 0,
        avg_package: 0,
        placement_rate: 0
    });
    const [jobs, setJobs] = useState<any[]>([]);
    const [prediction, setPrediction] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock data for now until endpoints are fully integrated
                setStats({
                    total_companies: 15,
                    avg_package: "6.5 LPA",
                    placement_rate: "85%"
                });

                // Fetch recent jobs
                const jobsRes = await api.get('/api/v1/placement/jobs');
                setJobs(jobsRes.data.slice(0, 3)); // Show top 3

                // Fetch prediction
                const predRes = await api.get('/api/v1/placement/my-prediction');
                setPrediction(predRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-full p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                <PageHeader
                    icon={LayoutDashboard}
                    title="Placement Dashboard"
                    subtitle="Explore opportunities, track your progress, and get AI-powered insights"
                    iconClass="bg-violet-500"
                    actions={
                        <div className="flex gap-3">
                            <Link to="/student/placement/jobs" className="btn-primary">Browse Jobs</Link>
                            <Link to="/student/placement/prediction" className="btn-outline">Check Prediction</Link>
                        </div>
                    }
                />

                {/* Prediction Teaser */}
                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 rounded-3xl p-5 sm:p-8 border border-white/10 relative overflow-hidden text-white"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">AI Placement Prediction</h2>
                                <p className="text-slate-300">Based on your academic performance and skills profile.</p>
                            </div>
                            <div className="flex items-center gap-6 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                                <div className="text-center">
                                    <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold mb-1">Probability</p>
                                    <p className="text-4xl font-extrabold text-emerald-400">{(prediction.confidence * 100).toFixed(0)}%</p>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${prediction.prediction === 'Placed' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                    {prediction.prediction === 'Placed' ? <CheckCircle size={32} /> : <XCircle size={32} />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <StatCard
                        title="Active Companies"
                        value={stats.total_companies}
                        icon={Briefcase}
                        color="blue"
                        index={1}
                    />
                    <StatCard
                        title="Average Package"
                        value={stats.avg_package}
                        icon={TrendingUp}
                        color="emerald"
                        index={2}
                    />
                    <StatCard
                        title="Placement Rate"
                        value={stats.placement_rate}
                        icon={Target}
                        color="violet"
                        index={3}
                    />
                </div>

                {/* Recent Jobs */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Recent Opportunities</h2>
                        <Link to="/student/placement/jobs" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>
                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {jobs.map((job, idx) => (
                                <JobCard key={idx} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                            <p className="text-slate-500">No active job postings at the moment.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PlacementDashboard;
