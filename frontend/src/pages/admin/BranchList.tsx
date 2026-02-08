import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Plus, Trash2, BookOpen, Users, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

interface Branch {
    id: number;
    name: string;
    code: string;
}

export const BranchList: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBranch, setNewBranch] = useState({ name: '', code: '' });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await api.get('/api/v1/branches/');
            setBranches(response.data);
        } catch (error) {
            console.error("Failed to fetch branches", error);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/api/v1/branches/', newBranch);
            setIsModalOpen(false);
            setNewBranch({ name: '', code: '' });
            fetchBranches();
        } catch (error) {
            console.error("Failed to create branch", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/api/v1/branches/${id}`);
            fetchBranches();
        } catch (error) {
            console.error("Failed to delete branch", error);
        }
    };

    const [stats, setStats] = useState({
        student_count: 0,
        teacher_count: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/v1/analytics/admin-dashboard');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch branch stats", error);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                        <GitBranch size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Branch Management</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage academic branches and departments.</p>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
                    <Plus size={16} /> Add Branch
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium mb-1">Total Branches</p>
                        <h2 className="text-4xl font-bold mb-2">{branches.length}</h2>
                        <div className="flex items-center gap-1 text-blue-100 text-sm">
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-semibold">100%</span>
                            <span>Operational</span>
                        </div>
                    </div>
                    <BookOpen className="absolute right-4 bottom-4 text-white/10 w-24 h-24 transform group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Total Students</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.student_count}</h2>
                            <p className="text-green-500 text-sm font-medium mt-1 flex items-center">
                                +12% vs last year
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Faculty Count</p>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{stats.teacher_count}</h2>
                            <p className="text-blue-500 text-sm font-medium mt-1 flex items-center">
                                Across all depts
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M12 12v9" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch Grid */}
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Branches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                    <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDelete(branch.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{branch.name}</h3>
                                <span className="inline-block mt-1 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                    {branch.code}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>Active Status</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Branch</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <Trash2 className="rotate-45" size={20} />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Branch Name</label>
                            <input
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                                placeholder="e.g. Computer Science"
                                value={newBranch.name}
                                onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Branch Code</label>
                            <input
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white"
                                placeholder="e.g. CSE"
                                value={newBranch.code}
                                onChange={e => setNewBranch({ ...newBranch, code: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleCreate}>Create Branch</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
