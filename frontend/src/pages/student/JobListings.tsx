import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, DollarSign, Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../../services/api';

const JobListings: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/api/v1/placement/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.job_role.toLowerCase().includes(filter.toLowerCase()) ||
        job.company_name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
                        <p className="text-slate-500 dark:text-slate-400">Discover and apply for roles matching your profile.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search role or company..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-white shadow-inner">
                                            {job.company_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.job_role}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">{job.company_name}</p>
                                        </div>
                                    </div>
                                    {job.is_active ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                                            Apply Now
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400">
                                            Closed
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 mb-6 relative z-10">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-medium">
                                        <DollarSign size={16} className="text-emerald-500" />
                                        {job.package_range}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-medium">
                                        <Calendar size={16} className="text-blue-500" />
                                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-medium">
                                        <MapPin size={16} className="text-rose-500" />
                                        On-Site
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6 relative z-10">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Requirements</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Extract technical words from logic or mock data */}
                                            {['Java', 'Python', 'Problem Solving'].map(skill => (
                                                <span key={skill} className="px-2 py-1 rounded-md bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 relative z-10">
                                    <button className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        Apply for Role <ArrowRight size={16} />
                                    </button>
                                    <button className="p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-500">
                                        <ExternalLink size={20} />
                                    </button>
                                </div>

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-24">
                        <div className="bg-slate-100 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase size={40} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Jobs Found</h3>
                        <p className="text-slate-500">Try adjusting your search criteria or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobListings;
