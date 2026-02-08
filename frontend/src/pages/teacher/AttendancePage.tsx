import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, XCircle, Clock, Save, Filter } from 'lucide-react';
import api from '../../services/api';

interface Student {
    id: number;
    student_id: string;
    full_name: string;
    status: 'present' | 'absent' | 'late';
}

export const AttendancePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [semester, setSemester] = useState<number | ''>(''); // Default to All
    const [section, setSection] = useState<string>(''); // Default to All
    const [students, setStudents] = useState<Student[]>([]);
    const [teacherBranchId, setTeacherBranchId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTeacherInfo = async () => {
            try {
                const res = await api.get('/api/v1/teachers/me');
                setTeacherBranchId(res.data.branch_id);
            } catch (error) {
                console.error("Failed to fetch teacher info", error);
            }
        };
        fetchTeacherInfo();
    }, []);

    useEffect(() => {
        if (teacherBranchId) {
            fetchStudents();
        }
    }, [teacherBranchId, semester, section]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params: any = { branch_id: teacherBranchId };
            if (semester) params.semester = semester;
            if (section) params.section = section;

            const res = await api.get('/api/v1/students', { params });

            // Initialize with 'present' status by default
            const initializedStudents = res.data.map((s: any) => ({
                id: s.id,
                student_id: s.student_id,
                full_name: s.full_name,
                status: 'present'
            }));
            setStudents(initializedStudents);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id: number, status: 'present' | 'absent' | 'late') => {
        setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    };

    const markAll = (status: 'present' | 'absent' | 'late') => {
        setStudents(students.map(s => ({ ...s, status })));
    };

    const stats = {
        present: students.filter(s => s.status === 'present').length,
        absent: students.filter(s => s.status === 'absent').length,
        late: students.filter(s => s.status === 'late').length,
        total: students.length
    };

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                    <Calendar size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Mark and manage daily attendance for your classes.</p>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex gap-4 w-full md:w-auto flex-wrap">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Semester Selector */}
                    <div className="relative">
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value ? Number(e.target.value) : '')}
                            className="pl-4 pr-8 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                <option key={s} value={s}>Semester {s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section Selector */}
                    <div className="relative">
                        <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="pl-4 pr-8 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">All Sections</option>
                            {['A', 'B', 'C', 'D'].map(s => (
                                <option key={s} value={s}>Section {s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => markAll('present')} className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 rounded-xl text-sm font-semibold hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                        Mark All Present
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                        <Save size={16} />
                        Save Attendance
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-500">
                        <Users size={20} />
                    </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-green-200 dark:border-green-500/20 shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Present</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.present}</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400 relative z-10">
                        <CheckCircle size={20} />
                    </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-red-200 dark:border-red-500/20 shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Absent</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.absent}</p>
                    </div>
                    <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 relative z-10">
                        <XCircle size={20} />
                    </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 shadow-sm flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Late</p>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.late}</p>
                    </div>
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 relative z-10">
                        <Clock size={20} />
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                    <h3 className="font-semibold text-slate-800 dark:text-white">Student List</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search student..."
                                className="pl-8 pr-4 py-1.5 text-sm bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                            />
                            <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading students...</div>
                    ) : students.length > 0 ? (
                        students.map((student) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {student.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white">{student.full_name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{student.student_id}</p>
                                    </div>
                                </div>

                                <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'present')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${student.status === 'present'
                                            ? 'bg-white dark:bg-green-500 text-green-600 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        P
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'absent')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${student.status === 'absent'
                                            ? 'bg-white dark:bg-red-500 text-red-600 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        A
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'late')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${student.status === 'late'
                                            ? 'bg-white dark:bg-amber-500 text-amber-600 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        L
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">No students found for this section.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
