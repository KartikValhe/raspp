import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Search, Plus, Mail, User, BookOpen, X, Phone, GraduationCap, Pencil, Trash2, Users, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataTable, type Column } from '../../components/Table/DataTable';

interface Teacher {
    id: number;
    full_name: string;
    department: string;
    email: string;
    role: string;
}

export const TeacherList: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        department: '',
        role: 'Assistant Professor'
    });

    const [stats, setStats] = useState({
        teacher_count: 0,
        phd_count: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const res = await api.get('/api/v1/analytics/admin-dashboard');
            setStats(res.data);
        };
        fetchStats();
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await api.get('/api/v1/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        }
    };

    const handleAddClick = () => {
        setFormData({
            full_name: '',
            email: '',
            department: '',
            role: 'Assistant Professor'
        });
        setIsEditMode(false);
        setIsFormOpen(true);
    };

    const handleEditClick = (teacher: Teacher) => {
        setFormData({
            full_name: teacher.full_name,
            email: teacher.email,
            department: teacher.department,
            role: teacher.role || 'Assistant Professor'
        });
        setSelectedTeacher(teacher); // temporarily set for ID access
        setIsEditMode(true);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && selectedTeacher) {
                // Mock Update - API might not support updates yet
                // await api.put(`/api/v1/teachers/${selectedTeacher.id}`, formData);
                console.log("Updating teacher", selectedTeacher.id, formData);
            } else {
                await api.post('/api/v1/teachers/', { ...formData, password: 'password123' });
            }
            setIsFormOpen(false);
            fetchTeachers();
        } catch (error) {
            console.error("Failed to save teacher", error);
        }
    };

    // Filter logic
    const filteredTeachers = teachers.filter(teacher =>
        teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns: Column<Teacher>[] = [
        {
            key: 'full_name',
            label: 'Faculty Name',
            sortable: true,
            className: 'font-medium text-slate-900 dark:text-white',
            render: (teacher) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                        {teacher.full_name.substring(0, 2)}
                    </div>
                    {teacher.full_name}
                </div>
            )
        },
        {
            key: 'email',
            label: 'Email Address',
            className: 'text-slate-600 dark:text-slate-400',
            render: (teacher) => (
                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    {teacher.email}
                </div>
            )
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true,
            render: (teacher) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {teacher.department}
                </span>
            )
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            className: 'text-slate-600 dark:text-slate-400',
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (teacher) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEditClick(teacher); }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit Teacher"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Teacher"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this teacher?')) {
                                // Mock delete
                                console.log('Delete teacher', teacher.id);
                            }
                        }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="h-full flex flex-col p-8 space-y-6 overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-none"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20">
                            <School size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Faculty Directory</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage teachers and department assignments.</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all text-sm font-bold"
                    >
                        <Plus size={18} />
                        Add Teacher
                    </motion.button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Faculty', value: stats.teacher_count, color: 'from-indigo-500 to-violet-500', icon: Users },
                        { label: 'Departments', value: '4', color: 'from-blue-500 to-cyan-500', icon: BookOpen },
                        { label: 'Ph.D. Holders', value: stats.phd_count, color: 'from-pink-500 to-rose-500', icon: GraduationCap },
                        { label: 'New Joiners', value: '+3', color: 'from-green-500 to-emerald-500', icon: User }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Teachers Table - Using filteredTeachers */}
            <div className="flex-1 overflow-y-auto min-h-0 rounded-xl border border-slate-200 dark:border-white/10">
                <DataTable
                    columns={columns}
                    data={filteredTeachers}
                    emptyMessage="No teachers found matching your search."
                />
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {isEditMode ? 'Edit Teacher' : 'Add New Teacher'}
                                </h2>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                                            placeholder="Dr. John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                                            placeholder="john.doe@university.edu"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white appearance-none"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Mechanical">Mechanical</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                                    >
                                        <option value="Professor">Professor</option>
                                        <option value="Associate Professor">Associate Professor</option>
                                        <option value="Assistant Professor">Assistant Professor</option>
                                        <option value="Lecturer">Lecturer</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                    >
                                        {isEditMode ? 'Save Changes' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
