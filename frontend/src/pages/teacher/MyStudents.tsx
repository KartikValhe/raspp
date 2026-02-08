import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Search, Filter, FileDown, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Student {
    id: number;
    student_id: string;
    full_name: string;
    current_semester: number;
    branch_id?: number;
    section?: string;
}

export const MyStudents: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [branches, setBranches] = useState<{ id: number, code: string, name: string }[]>([]);
    const [teacherBranchId, setTeacherBranchId] = useState<number | null>(null);

    // Modal State
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [semesterFilter, setSemesterFilter] = useState<number | ''>('');
    const [sectionFilter, setSectionFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (teacherBranchId) {
            fetchStudents();
        }
    }, [semesterFilter, sectionFilter, searchQuery, teacherBranchId]);

    const fetchInitialData = async () => {
        try {
            // Fetch branches for reference
            const branchesRes = await api.get('/api/v1/branches/');
            setBranches(branchesRes.data);

            // Fetch current teacher profile to get branch
            const teacherRes = await api.get('/api/v1/teachers/me');
            setTeacherBranchId(teacherRes.data.branch_id);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        }
    };

    const fetchStudents = async () => {
        if (!teacherBranchId) return;

        try {
            const params: any = {
                branch_id: teacherBranchId
            };
            if (semesterFilter) params.semester = semesterFilter;
            if (sectionFilter && sectionFilter !== '') params.section = sectionFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await api.get('/api/v1/students', { params });
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                        <GraduationCap size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Students</h1>
                        <p className="text-slate-500 dark:text-slate-400">View students in your department.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                        <FileDown size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

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

                    {/* Semester Filter */}
                    <select
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value ? Number(e.target.value) : '')}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="" className="dark:bg-slate-900">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem} className="dark:bg-slate-900">Sem {sem}</option>
                        ))}
                    </select>

                    {/* Section Filter */}
                    <select
                        value={sectionFilter}
                        onChange={(e) => setSectionFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="" className="dark:bg-slate-900">All Sections</option>
                        {['A', 'B', 'C', 'D'].map(sec => (
                            <option key={sec} value={sec} className="dark:bg-slate-900">Sec {sec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Premium Students List */}
            <div className="flex-none flex items-center justify-between px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:flex">
                <div className="w-2/5">Student Profile</div>
                <div className="w-1/5 text-center">Details</div>
                <div className="w-1/5 text-center">Status</div>
                <div className="w-1/5 text-right">Actions</div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                                setSelectedStudent(student);
                                setIsModalOpen(true);
                            }}
                            className="group bg-white dark:bg-white/5 hover:bg-blue-50/10 dark:hover:bg-blue-500/10 p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4"
                        >
                            {/* Profile Info */}
                            <div className="w-full md:w-2/5 flex items-center gap-5">
                                <div className="relative">
                                    <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md
                                            ${['bg-blue-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-emerald-500'][index % 4]}
                                        `}>
                                        {student.full_name.substring(0, 2)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{student.full_name}</h3>
                                    <p className="text-slate-400 text-sm font-mono flex items-center gap-2">
                                        {student.student_id}
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                        {student.section ? `Sec ${student.section}` : 'No Section'}
                                    </p>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="w-full md:w-1/5 flex flex-row md:flex-col items-center justify-center gap-2">
                                <span className="text-xs text-slate-400 uppercase font-semibold md:hidden">Details:</span>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-white/10">
                                        {branches.find(b => b.id === student.branch_id)?.code}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-500/20">
                                        Sem {student.current_semester}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="w-full md:w-1/5 flex justify-center">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Active Student
                                </div>
                            </div>

                            {/* Action */}
                            <div className="w-full md:w-1/5 flex justify-end">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium text-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                                    <span>View Profile</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-slate-400">No students found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Student Details Modal */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Modal Header with Gradient */}
                        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold uppercase ring-4 ring-white dark:ring-slate-800">
                                        {selectedStudent.full_name.substring(0, 2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="pt-16 px-8 pb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedStudent.full_name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{selectedStudent.student_id}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/20">
                                    Active Student
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Academic Info</div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Branch</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{branches.find(b => b.id === selectedStudent.branch_id)?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Semester</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{selectedStudent.current_semester}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600 dark:text-slate-400">Section</span>
                                                <span className="font-medium text-slate-900 dark:text-white">{selectedStudent.section || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 h-full">
                                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Contact & Other</div>
                                        <div className="space-y-2">
                                            <div className="flex flex-col">
                                                <span className="text-slate-600 dark:text-slate-400 text-xs">Email</span>
                                                <span className="font-medium text-slate-900 dark:text-white break-all">{selectedStudent.student_id.toLowerCase()}@example.com</span>
                                            </div>
                                            {/* Placeholder for future data */}
                                            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-white/10">
                                                <p className="text-xs text-slate-400 dark:text-slate-500 text-center italic">Attendance & detailed performance data coming soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-medium transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                                    onClick={() => navigate(`/teacher/students/${selectedStudent.student_id}/performance`)}
                                >
                                    <FileDown size={18} />
                                    View Scorecard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )
            }
        </div >
    );
};

