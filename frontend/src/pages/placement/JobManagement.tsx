import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Calendar,
    DollarSign,
    CheckCircle,
    X,
    Edit,
    Trash2,
    Building2,
    Clock
} from 'lucide-react';
import api from '../../services/api';

interface JobPosting {
    id: number;
    company_name: string;
    job_role: string;
    description: string;
    requirements: string;
    package_range: string;
    eligibility_criteria: any;
    deadline: string;
    is_active: boolean;
    posted_by: number;
    created_at: string;
}

const JobManagement: React.FC = () => {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
    const [formData, setFormData] = useState({
        company_name: '',
        job_role: '',
        description: '',
        requirements: '',
        package_range: '',
        eligibility_criteria: { cgpa: 0, backlogs: 0 },
        deadline: '',
        is_active: true
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/api/v1/placement/jobs?active_only=false');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('criteria_')) {
            const criteriaField = name.replace('criteria_', '');
            setFormData(prev => ({
                ...prev,
                eligibility_criteria: {
                    ...prev.eligibility_criteria,
                    [criteriaField]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingJob) {
                await api.put(`/api/v1/placement/jobs/${editingJob.id}`, formData);
            } else {
                await api.post('/api/v1/placement/jobs', formData);
            }
            setShowModal(false);
            fetchJobs();
            resetForm();
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await api.delete(`/api/v1/placement/jobs/${id}`);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    const handleEdit = (job: JobPosting) => {
        setEditingJob(job);
        setFormData({
            company_name: job.company_name,
            job_role: job.job_role,
            description: job.description,
            requirements: job.requirements,
            package_range: job.package_range,
            eligibility_criteria: job.eligibility_criteria || { cgpa: 0, backlogs: 0 },
            deadline: job.deadline ? job.deadline.split('T')[0] : '',
            is_active: job.is_active
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingJob(null);
        setFormData({
            company_name: '',
            job_role: '',
            description: '',
            requirements: '',
            package_range: '',
            eligibility_criteria: { cgpa: 0, backlogs: 0 },
            deadline: '',
            is_active: true
        });
    };

    return (
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Job Postings</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage placement opportunities for students</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={20} />
                        Post New Job
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 flex items-center gap-2">
                        <Filter size={20} />
                        Filters
                    </button>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
                        ))
                    ) : jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                    {job.company_name[0]}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(job)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-blue-500">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-1">{job.job_role}</h3>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4">
                                <Building2 size={16} />
                                <span>{job.company_name}</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign size={16} className="text-green-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{job.package_range} LPA</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={16} className="text-orange-500" />
                                    <span className="text-slate-600 dark:text-slate-400">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/10">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.is_active ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                    {job.is_active ? 'Active' : 'Closed'}
                                </span>
                                <span className="text-xs text-slate-400">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowModal(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            >
                                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <h2 className="text-2xl font-bold">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Company Name</label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                required
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="e.g. Google"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Job Role</label>
                                            <input
                                                type="text"
                                                name="job_role"
                                                required
                                                value={formData.job_role}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Package Range (LPA)</label>
                                            <input
                                                type="text"
                                                name="package_range"
                                                value={formData.package_range}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="e.g. 12-15"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Application Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Detailed job description..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Requirements</label>
                                        <textarea
                                            name="requirements"
                                            rows={3}
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Skills required (e.g. Python, React, SQL)"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Eligibility Criteria</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Minimum CGPA</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    name="criteria_cgpa"
                                                    value={formData.eligibility_criteria.cgpa}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Max Backlogs</label>
                                                <input
                                                    type="number"
                                                    name="criteria_backlogs"
                                                    value={formData.eligibility_criteria.backlogs}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all"
                                        >
                                            {editingJob ? 'Update Job' : 'Post Job'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JobManagement;
