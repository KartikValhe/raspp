import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BookOpen, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubjects, deleteSubject, getBranches, type Subject, type Branch } from '../../services/subjectService';
import SubjectForm from './SubjectForm';
import { PageHeader } from '../../components/PageHeader';

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
            setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
            setBranches(Array.isArray(branchesData) ? branchesData : []);
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
        <div className="min-h-full flex flex-col p-3 sm:p-6 space-y-4 sm:space-y-5">

            {/* Standardized Page Header */}
            <PageHeader
                icon={BookOpen}
                title="Subject Management"
                subtitle="Manage all subjects and course curriculum"
                iconClass="bg-violet-500"
                actions={
                    <button onClick={handleAdd} className="btn-primary">
                        <Plus size={14} />
                        Add Subject
                    </button>
                }
            />

            {/* Stats + Filters wrapper */}
            <div className="flex-none space-y-4 mb-4">

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
            </div>  {/* end stats+filters wrapper */}

            {/* Subject List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="w-full">
                    {/* Mobile Cards View (Visible on < md) */}
                    <div className="md:hidden flex flex-col gap-3">
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject, idx) => (
                                <motion.div
                                    key={subject.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3"
                                >
                                    {/* Card Header: Code & Status */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-500/20 px-2.5 py-1 rounded-lg">
                                            {subject.code}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            subject.is_active
                                                ? 'bg-green-500/15 text-green-700 dark:text-green-300'
                                                : 'bg-red-500/15 text-red-700 dark:text-red-300'
                                        }`}>
                                            {subject.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                                            {subject.name}
                                        </h3>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Semester</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">Sem {subject.semester}</span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Branch</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{getBranchName(subject.branch_id)}</span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Credits</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{subject.credits} Credits</span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Max Marks</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{subject.max_marks}</span>
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(subject)}
                                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                                        >
                                            <Pencil size={13} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(subject.id)}
                                            className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-1.5 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
                                No subjects found
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View (Hidden on < md, visible on md+) */}
                    <div className="hidden md:block w-full overflow-x-auto bg-white dark:bg-white/5 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
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
