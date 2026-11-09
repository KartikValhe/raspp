import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, DollarSign, Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';

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
        <div className="page-wrap">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <PageHeader
                    icon={Briefcase}
                    title="Job Opportunities"
                    subtitle="Explore campus opportunities, review eligibility, and apply directly"
                    iconClass="bg-primary-500"
                    actions={
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search role or company..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="input pl-9 text-sm"
                            />
                        </div>
                    }
                />

                {/* Job Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <AnimatePresence>
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="card p-5 sm:p-6 flex flex-col justify-between hover:shadow-glass hover:border-primary-500/40 transition-all duration-200 group"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-xl font-bold shadow-primary">
                                                {job.company_name[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    {job.job_role}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company_name}</p>
                                            </div>
                                        </div>
                                        <span className={`badge ${job.is_active ? 'badge-success' : 'badge-neutral'}`}>
                                            {job.is_active ? 'Active' : 'Closed'}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="badge badge-neutral text-xs py-1 px-2.5">
                                            <DollarSign size={14} className="text-emerald-500 mr-0.5" />
                                            {job.package_range} LPA
                                        </span>
                                        <span className="badge badge-neutral text-xs py-1 px-2.5">
                                            <Calendar size={14} className="text-amber-500 mr-0.5" />
                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                        </span>
                                        <span className="badge badge-neutral text-xs py-1 px-2.5">
                                            <MapPin size={14} className="text-rose-500 mr-0.5" />
                                            On-Campus
                                        </span>
                                    </div>

                                    {job.requirements && (
                                        <div className="mb-4">
                                            <p className="section-label text-[10px] mb-1.5">Required Skills</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                {job.requirements}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                                    <button
                                        disabled={!job.is_active}
                                        className="btn-primary flex-1 text-xs"
                                    >
                                        <span>Apply for Drive</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {!loading && filteredJobs.length === 0 && (
                    <div className="card text-center py-16 border-dashed">
                        <div className="bg-slate-100 dark:bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Briefcase size={28} className="text-slate-400" />
                        </div>
                        <h3 className="text-base font-bold mb-1 text-slate-800 dark:text-white">No Jobs Found</h3>
                        <p className="text-xs text-slate-500">Try adjusting your search criteria or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobListings;
