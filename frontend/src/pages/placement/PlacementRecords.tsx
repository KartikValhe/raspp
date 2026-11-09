import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    Download,
    X,
    ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/PageHeader';

interface PlacementRecord {
    id: number;
    student_id: number;
    student: {
        full_name: string;
        student_id: string;
    };
    company_name: string;
    job_role: string;
    package: number;
    placed_date: string;
    status: string;
    offer_letter_url: string;
}

const PlacementRecords: React.FC = () => {
    const [records, setRecords] = useState<PlacementRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        company_name: '',
        job_role: '',
        package: '',
        placed_date: '',
        status: 'placed',
        offer_letter_url: ''
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await api.get('/api/v1/placement/records');
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Only create is implemented for now in backend for manual entry
            // Ideally we'd need student lookup logic here or in backend
            // For now assuming direct creation for simplicity in this demo
            await api.post('/api/v1/placement/records', {
                ...formData,
                package: parseFloat(formData.package),
                student_id: parseInt(formData.student_id) // This assumes ID is known, in real app needs search
            });
            setShowModal(false);
            fetchRecords();
            setFormData({
                student_id: '',
                company_name: '',
                job_role: '',
                package: '',
                placed_date: '',
                status: 'placed',
                offer_letter_url: ''
            });
        } catch (error) {
            console.error('Error saving record:', error);
            alert('Error saving record. Please ensure Student ID exists.');
        }
    };

    return (
        <div className="page-wrap">
            <div className="max-w-7xl mx-auto space-y-6">

                <PageHeader
                    icon={FileText}
                    title="Placement Records"
                    subtitle="Comprehensive archive of student placements, compensation, and offer letters"
                    iconClass="bg-primary-500"
                    actions={
                        <div className="flex items-center gap-2.5">
                            <button className="btn-secondary">
                                <Download size={16} />
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-primary"
                            >
                                <Plus size={16} />
                                <span>Add Record</span>
                            </button>
                        </div>
                    }
                />

                {/* Filters */}
                <div className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name, company, or role..."
                            className="input pl-10"
                        />
                    </div>
                    <select className="input sm:w-48">
                        <option value="">All Statuses</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                {/* Records Table & Mobile Cards */}
                <div className="table-container">
                    {/* Mobile Card View (< md) */}
                    <div className="md:hidden p-4 space-y-3">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5 space-y-3">
                                    <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/3"></div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded"></div>
                                        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded"></div>
                                    </div>
                                </div>
                            ))
                        ) : records.length === 0 ? (
                            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                No placement records found.
                            </div>
                        ) : (
                            records.map((record) => (
                                <div key={record.id} className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl p-4 shadow-xs space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                                                {record.student?.full_name || 'Unknown'}
                                            </h4>
                                            <p className="text-xs text-slate-500">{record.student?.student_id || 'N/A'}</p>
                                        </div>
                                        <span className={`badge ${record.status === 'placed' ? 'badge-success' : 'badge-warning'}`}>
                                            {record.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60 dark:border-white/5 text-xs">
                                        <div>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Company</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{record.company_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Role</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{record.job_role}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Package</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{record.package} LPA</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Date</span>
                                            <span className="text-slate-600 dark:text-slate-300">{new Date(record.placed_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {record.offer_letter_url && (
                                        <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex justify-end">
                                            <a
                                                href={record.offer_letter_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-link inline-flex items-center gap-1 text-xs"
                                            >
                                                <span>View Offer Letter</span>
                                                <ExternalLink size={13} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table (>= md) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="table-base">
                            <thead>
                                <tr>
                                    <th className="table-th">Student</th>
                                    <th className="table-th">Company</th>
                                    <th className="table-th">Role</th>
                                    <th className="table-th">Package</th>
                                    <th className="table-th">Date</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th">Offer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="table-td"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32"></div></td>
                                            <td className="table-td"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                                            <td className="table-td"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20"></div></td>
                                            <td className="table-td"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-16"></div></td>
                                            <td className="table-td"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                                            <td className="table-td"><div className="h-6 bg-slate-200 dark:bg-white/10 rounded-full w-20"></div></td>
                                            <td className="table-td"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-8"></div></td>
                                        </tr>
                                    ))
                                ) : records.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="table-td py-12 text-center text-slate-500 dark:text-slate-400">
                                            No placement records found.
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record.id} className="table-tr">
                                            <td className="table-td">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{record.student?.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">{record.student?.student_id || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="table-td font-medium text-slate-800 dark:text-slate-200">{record.company_name}</td>
                                            <td className="table-td text-slate-500 dark:text-slate-400">{record.job_role}</td>
                                            <td className="table-td font-semibold text-emerald-600 dark:text-emerald-400">₹{record.package} LPA</td>
                                            <td className="table-td text-slate-500 dark:text-slate-400 text-xs">
                                                {new Date(record.placed_date).toLocaleDateString()}
                                            </td>
                                            <td className="table-td">
                                                <span className={`badge ${record.status === 'placed' ? 'badge-success' : 'badge-warning'}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="table-td">
                                                {record.offer_letter_url ? (
                                                    <a
                                                        href={record.offer_letter_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-1"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Record Modal */}
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
                                className="relative bg-white dark:bg-surface-950 border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl z-10"
                            >
                                <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/[0.07] flex justify-between items-center sticky top-0 bg-white/95 dark:bg-surface-950/95 backdrop-blur-md">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Placement Record</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                                    <div>
                                        <label className="input-label">Student Database ID</label>
                                        <input
                                            type="number"
                                            name="student_id"
                                            required
                                            value={formData.student_id}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="Enter internal DB ID (e.g. 1)"
                                        />
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Numerical identifier of student record in database.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">Company</label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                required
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="e.g. Microsoft"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Role</label>
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
                                            <label className="input-label">Package (LPA)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="package"
                                                required
                                                value={formData.package}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="e.g. 18.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Placed Date</label>
                                            <input
                                                type="date"
                                                name="placed_date"
                                                required
                                                value={formData.placed_date}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">Offer Letter URL (Optional)</label>
                                        <input
                                            type="url"
                                            name="offer_letter_url"
                                            value={formData.offer_letter_url}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
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
                                            Save Record
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

export default PlacementRecords;
