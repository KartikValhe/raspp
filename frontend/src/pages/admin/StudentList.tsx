import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Search, Filter, FileDown, Plus, Pencil, Trash2, Users, GraduationCap, Activity, CheckCircle } from 'lucide-react';
import { DataTable, type Column } from '../../components/Table/DataTable';
import { motion } from 'framer-motion';

interface Student {
    id: number;
    student_id: string;
    full_name: string;
    current_semester: number;
    branch_id?: number;
    section?: string;
}

export const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [branches, setBranches] = useState<{ id: number, code: string, name: string }[]>([]);

    // Filters
    const [semesterFilter, setSemesterFilter] = useState<number | ''>('');
    const [branchFilter, setBranchFilter] = useState<number | ''>('');
    const [sectionFilter, setSectionFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Partial<Student>>({});
    const [isEditMode, setIsEditMode] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        student_id: '',
        full_name: '',
        current_semester: 1,
        branch_id: '',
        section: '',
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [semesterFilter, branchFilter, sectionFilter, searchQuery]);

    const fetchBranches = async () => {
        try {
            const response = await api.get('/api/v1/branches/');
            setBranches(response.data);
        } catch (error) {
            console.error("Failed to fetch branches", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const params: any = {};
            if (semesterFilter) params.semester = semesterFilter;
            if (branchFilter !== '') params.branch_id = branchFilter;
            if (sectionFilter && sectionFilter !== '') params.section = sectionFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await api.get('/api/v1/students', { params });
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const handleAddClick = async () => {
        setFormData({
            student_id: '',
            full_name: '',
            current_semester: 1,
            branch_id: '',
            section: ''
        });

        // Fetch Next ID
        try {
            const res = await api.get('/api/v1/students/next_id');
            setFormData(prev => ({
                ...prev,
                student_id: res.data,
                // Also default email if we want:
                // email: `${res.data.toLowerCase()}@example.com` 
            }));
        } catch (e) {
            console.error("Failed to fetch next student ID", e);
        }

        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        setFormData({
            student_id: student.student_id,
            full_name: student.full_name,
            current_semester: student.current_semester,
            branch_id: student.branch_id?.toString() || '',
            section: student.section || ''
        });
        setSelectedStudent(student);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                branch_id: formData.branch_id ? parseInt(formData.branch_id) : null
            };

            if (isEditMode && selectedStudent.id) {
                await api.put(`/api/v1/students/${selectedStudent.id}`, payload);
            } else {
                await api.post('/api/v1/students', {
                    ...payload,
                    password: 'password123',
                    email: (formData as any).email // Use configured email
                });
            }
            setIsModalOpen(false);
            fetchStudents();
            if (!isEditMode) {
                alert(`Student created successfully!\n\nCredentials:\nEmail: ${(formData as any).email}\nPassword: password123`);
            }
        } catch (error) {
            console.error("Failed to save student", error);
            alert("Failed to save student. Please check inputs.");
        }
    };
    const columns: Column<Student>[] = [
        {
            key: 'student_id',
            label: 'Student ID',
            sortable: true,
            className: 'font-mono text-slate-600 dark:text-slate-300'
        },
        {
            key: 'full_name',
            label: 'Full Name',
            sortable: true,
            className: 'font-medium text-slate-900 dark:text-white',
            render: (student) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                        {student.full_name.substring(0, 2)}
                    </div>
                    {student.full_name}
                </div>
            )
        },
        {
            key: 'branch_id',
            label: 'Branch',
            className: 'text-slate-600 dark:text-slate-400',
            render: (student) => branches.find(b => b.id === student.branch_id)?.code || '-'
        },
        {
            key: 'current_semester',
            label: 'Semester',
            sortable: true,
            render: (student) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                    Semester {student.current_semester}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (student) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEditClick(student); }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit Student"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Student"
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this student? This will also delete their user account.')) {
                                try {
                                    await api.delete(`/api/v1/students/${student.id}`);
                                    fetchStudents(); // Refresh the list
                                } catch (error) {
                                    console.error('Failed to delete student', error);
                                    alert('Failed to delete student. Please try again.');
                                }
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
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Student Directory</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage student records and academic progress.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-sm font-medium shadow-sm"
                        >
                            <FileDown size={18} />
                            Export CSV
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-bold"
                        >
                            <Plus size={18} />
                            Add Student
                        </motion.button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Students', value: students.length || '1,240', color: 'from-blue-500 to-cyan-500', icon: Users },
                        { label: 'Avg Attendance', value: '85%', color: 'from-green-500 to-emerald-500', icon: Activity },
                        { label: 'Active', value: '98%', color: 'from-purple-500 to-pink-500', icon: CheckCircle },
                        { label: 'Graduating', value: '320', color: 'from-orange-500 to-amber-500', icon: GraduationCap }
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

            {/* Filters Bar */}
            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 dark:border-white/10 pl-4 overflow-x-auto">
                    <Filter className="text-slate-400 shrink-0" size={18} />

                    {/* Branch Filter */}
                    <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value ? Number(e.target.value) : '')}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Branches</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.code}</option>
                        ))}
                    </select>

                    {/* Semester Filter */}
                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value ? Number(e.target.value) : '')}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>Sem {sem}</option>
                        ))}
                    </select>

                    {/* Division Filter */}
                    <select
                        value={sectionFilter}
                        onChange={(e) => setSectionFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Divisions</option>
                        {['A', 'B', 'C', 'D'].map(sec => (
                            <option key={sec} value={sec}>Div {sec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="flex-1 overflow-y-auto min-h-0 rounded-xl border border-slate-200 dark:border-white/10">
                <DataTable
                    columns={columns}
                    data={students}
                    emptyMessage="No students found matching your filters."
                />
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{isEditMode ? 'Edit Student' : 'Add New Student'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
                                    <input
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                                        value={formData.student_id}
                                        onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                                        disabled={isEditMode}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field (New) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                                    value={(formData as any).email || ''} // Using ANY to bypass type strictness for now if Type not updated, but I should update state type ideally.
                                    onChange={e => setFormData({ ...formData, email: e.target.value.toLowerCase() } as any)}
                                    placeholder="student@gmail.com"
                                    required={!isEditMode}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Branch</label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                                        value={formData.branch_id}
                                        onChange={e => setFormData({ ...formData, branch_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                                        value={formData.current_semester}
                                        onChange={e => setFormData({ ...formData, current_semester: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                            <option key={s} value={s}>Semester {s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Division (Optional)</label>
                                <input
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    placeholder="e.g. A"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    {isEditMode ? 'Save Changes' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
