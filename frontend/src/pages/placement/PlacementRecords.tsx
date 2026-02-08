import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Download,
    CheckCircle,
    X,
    Edit,
    ExternalLink
} from 'lucide-react';
import api from '../../services/api';

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
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Placement Records</h1>
                        <p className="text-slate-500 dark:text-slate-400">Comprehensive list of all student placements</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 flex items-center gap-2">
                            <Download size={20} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-500/30"
                        >
                            <Plus size={20} />
                            Add Record
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by student name, company, or role..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <select className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 outline-none">
                        <option value="">All Statuses</option>
                        <option value="placed">Placed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                {/* Records Table */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Package</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Offer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-16"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-white/10 rounded-full w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-8"></div></td>
                                        </tr>
                                    ))
                                ) : records.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            No placement records found.
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{record.student?.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{record.student?.student_id || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{record.company_name}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{record.job_role}</td>
                                            <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">₹{record.package} LPA</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {new Date(record.placed_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${record.status === 'placed'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {record.offer_letter_url && (
                                                    <a
                                                        href={record.offer_letter_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
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
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowModal(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Add Placement Record</h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Student Database ID</label>
                                        <input
                                            type="number"
                                            name="student_id"
                                            required
                                            value={formData.student_id}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Enter internal DB ID (temporary)"
                                        />
                                        <p className="text-xs text-slate-400">Note: In future updates this will be a search field.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Company</label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                required
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Role</label>
                                            <input
                                                type="text"
                                                name="job_role"
                                                required
                                                value={formData.job_role}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Package (LPA)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="package"
                                                required
                                                value={formData.package}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date</label>
                                            <input
                                                type="date"
                                                name="placed_date"
                                                required
                                                value={formData.placed_date}
                                                onChange={handleInputChange}
                                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Offer Letter URL (Optional)</label>
                                        <input
                                            type="url"
                                            name="offer_letter_url"
                                            value={formData.offer_letter_url}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 mt-4"
                                    >
                                        Save Record
                                    </button>
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
