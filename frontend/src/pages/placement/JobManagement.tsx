import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Calendar,
    DollarSign,
    X,
    Edit,
    Trash2,
    Building2,
} from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';

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
        <div className="page-wrap">
            <div className="max-w-7xl mx-auto space-y-6">

                <PageHeader
                    icon={Briefcase}
                    title="Job Postings"
                    subtitle="Manage campus placement opportunities and student recruitment drives"
                    iconClass="bg-primary-500"
                    actions={
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="btn-primary"
                        >
                            <Plus size={16} />
                            Post New Job
                        </button>
                    }
                />

                {/* Filters */}
                <div className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            className="input pl-10"
                        />
                    </div>
                    <button className="btn-secondary">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="card p-6 h-64 animate-pulse bg-slate-100 dark:bg-white/[0.03]" />
                        ))
                    ) : jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-5 sm:p-6 flex flex-col justify-between hover:shadow-glass hover:border-primary-500/40 transition-all duration-200 group"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-primary">
                                        {job.company_name[0]}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(job)}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-primary-600 dark:text-primary-400 transition-colors"
                                            title="Edit Posting"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="p-1.5 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg text-danger-500 transition-colors"
                                            title="Delete Posting"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{job.job_role}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    <Building2 size={14} />
                                    <span className="font-medium">{job.company_name}</span>
                                </div>

                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign size={15} className="text-emerald-500" />
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{job.package_range} LPA</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <Calendar size={14} className="text-amber-500" />
                                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3.5 border-t border-slate-100 dark:border-white/[0.06]">
                                <span className={`badge ${job.is_active ? 'badge-success' : 'badge-neutral'}`}>
                                    {job.is_active ? 'Active' : 'Closed'}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                    Posted {new Date(job.created_at).toLocaleDateString()}
                                </span>
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
                                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                                onClick={() => setShowModal(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-white dark:bg-surface-950 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10"
                            >
                                <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/[0.07] flex justify-between items-center sticky top-0 bg-white/95 dark:bg-surface-950/95 backdrop-blur-md z-10">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {editingJob ? 'Edit Job Posting' : 'Post New Campus Job'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">Company Name</label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                required
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="e.g. Google"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Job Role</label>
                                            <input
                                                type="text"
                                                name="job_role"
                                                required
                                                value={formData.job_role}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="e.g. Software Engineer"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">Package Range (LPA)</label>
                                            <input
                                                type="text"
                                                name="package_range"
                                                value={formData.package_range}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="e.g. 12-15"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Application Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Description</label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Detailed job description..."
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Requirements</label>
                                        <textarea
                                            name="requirements"
                                            rows={2}
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Skills required (e.g. Python, React, SQL)"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <h3 className="section-label mb-3">Eligibility Criteria</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="input-label">Minimum CGPA</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    name="criteria_cgpa"
                                                    value={formData.eligibility_criteria.cgpa}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                />
                                            </div>
                                            <div>
                                                <label className="input-label">Max Allowed Backlogs</label>
                                                <input
                                                    type="number"
                                                    name="criteria_backlogs"
                                                    value={formData.eligibility_criteria.backlogs}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-primary flex-1"
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
