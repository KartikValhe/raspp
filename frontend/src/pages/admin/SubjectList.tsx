import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BookOpen, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubjects, deleteSubject, getBranches, type Subject, type Branch } from '../../services/subjectService';
import SubjectForm from './SubjectForm';

const SubjectList = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [filters, setFilters] = useState({
        semester: '',
        branch: '',
        search: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subjectsData, branchesData] = await Promise.all([
                getSubjects(),
                getBranches()
            ]);
            setSubjects(subjectsData);
            setBranches(branchesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await deleteSubject(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting subject:', error);
                alert('Failed to delete subject');
            }
        }
    };

    const handleEdit = (subject: Subject) => {
        setSelectedSubject(subject);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedSubject(null);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedSubject(null);
        fetchData();
    };

    const filteredSubjects = subjects.filter(subject => {
        if (filters.semester && subject.semester !== parseInt(filters.semester)) return false;
        if (filters.branch) {
            const branchId = filters.branch === 'common' ? null : parseInt(filters.branch);
            if (subject.branch_id !== branchId) return false;
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                subject.code.toLowerCase().includes(search) ||
                subject.name.toLowerCase().includes(search)
            );
        }
        return true;
    });

    const getBranchName = (branchId: number | null) => {
        if (!branchId) return 'Common';
        const branch = branches.find(b => b.id === branchId);
        return branch?.code || '-';
    };

    const stats = {
        total: subjects.length,
        active: subjects.filter(s => s.is_active).length,
        commonSubjects: subjects.filter(s => !s.branch_id).length,
        branchSpecific: subjects.filter(s => s.branch_id).length
    };

    return (
        <div className="h-full flex flex-col p-6 min-h-0 overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-none mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subject Management</h1>
                            <p className="text-gray-600 dark:text-purple-200">Manage all subjects and course curriculum</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAdd}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Subject
                    </motion.button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Subjects', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: '📚' },
                        { label: 'Active', value: stats.active, color: 'from-green-500 to-emerald-500', icon: '✅' },
                        { label: 'Common', value: stats.commonSubjects, color: 'from-purple-500 to-pink-500', icon: '🌐' },
                        { label: 'Branch Specific', value: stats.branchSpecific, color: 'from-orange-500 to-red-500', icon: '🎯' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 dark:text-purple-200 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                </div>
                                <div className={`text-4xl bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-5 h-5 text-gray-500 dark:text-purple-300" />
                        <h3 className="text-gray-900 dark:text-white font-semibold">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                            <input
                                type="text"
                                placeholder="Search by code or name..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            />
                        </div>
                        <select
                            value={filters.semester}
                            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                            className="px-4 py-2 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                        <select
                            value={filters.branch}
                            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                            className="px-4 py-2 bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        >
                            <option value="">All Branches</option>
                            <option value="common">Common Subjects</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.code} - {branch.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Subject List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto min-h-0 bg-white dark:bg-white/5 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                    <div className="min-w-full">
                        <table className="min-w-full sticky top-0">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Subject Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Branch</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Max Marks</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-purple-200 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                <AnimatePresence>
                                    {filteredSubjects.map((subject, idx) => (
                                        <motion.tr
                                            key={subject.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-purple-600 dark:text-purple-300 font-semibold">{subject.code}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 dark:text-white font-medium">{subject.name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                                    Sem {subject.semester}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-sm ${subject.branch_id
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'bg-green-500/20 text-green-300'
                                                    }`}>
                                                    {getBranchName(subject.branch_id)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{subject.credits}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{subject.max_marks}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-sm ${subject.is_active
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-red-500/20 text-red-300'
                                                    }`}>
                                                    {subject.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEdit(subject)}
                                                        className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(subject.id)}
                                                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {filteredSubjects.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-purple-200">No subjects found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Subject Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <SubjectForm
                        subject={selectedSubject}
                        branches={branches}
                        onClose={handleFormClose}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubjectList;
