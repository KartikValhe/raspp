import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { getSubjects, type Subject } from '../../services/subjectService';
import { Search, Save, BookOpen, Edit, X, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
    id: number;
    student_id: string;
    full_name: string;
    current_semester: number;
    branch?: {
        id: number;
        code: string;
        name: string;
    };
}


export const MarksEntry: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [teacherBranchId, setTeacherBranchId] = useState<number | null>(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [studentSubjects, setStudentSubjects] = useState<Subject[]>([]);
    const [studentMarks, setStudentMarks] = useState<Record<number, string>>({}); // subject_id -> mark (string for input)
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [saving, setSaving] = useState(false);
    const [examType, setExamType] = useState('Mid-Term');

    const examTypes = ['Mid-Term', 'End-Term', 'Assignment 1', 'Assignment 2', 'Quiz 1', 'Quiz 2'];

    useEffect(() => {
        fetchTeacherProfile();
    }, []);

    useEffect(() => {
        if (teacherBranchId !== null) {
            fetchStudents();
        }
    }, [selectedSemester, teacherBranchId]);

    useEffect(() => {
        if (currentStudent && showModal) {
            fetchStudentData();
        }
    }, [currentStudent, showModal]);

    const fetchTeacherProfile = async () => {
        try {
            // Retrieve teacher's profile to get assigned branch
            const response = await api.get('/api/v1/teachers/me');
            if (response.data.branch && response.data.branch.id) {
                setTeacherBranchId(response.data.branch.id);
            } else {
                console.warn("Teacher has no assigned branch, showing all students or handling error");
                // Fallback or specific logic if teacher has no branch
            }
        } catch (error) {
            console.error("Failed to fetch teacher profile", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const params: any = {
                semester: selectedSemester > 0 ? selectedSemester : undefined,
            };

            // Filter by teacher's branch if available
            if (teacherBranchId) {
                params.branch_id = teacherBranchId;
            }

            const response = await api.get('/api/v1/students', { params });
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const fetchStudentData = async () => {
        if (!currentStudent) return;
        setLoadingSubjects(true);
        try {
            // Fetch subjects for this student's semester and branch
            // If selectedSemester is 0 (All), fetch all subjects for the student's branch
            const subjectsData = await getSubjects({
                // Create a stricter filter: If selectedSemester is 0, use student.current_semester
                // This prevents showing ALL subjects from Sem 1-8 by default
                semester: selectedSemester > 0 ? selectedSemester : currentStudent.current_semester,
                branch_id: currentStudent.branch?.id || undefined
            });
            setStudentSubjects(subjectsData);

            // Fetch existing marks for this student
            const marksResponse = await api.get('/api/v1/marks/', {
                params: {
                    student_id: currentStudent.student_id,
                    semester: selectedSemester > 0 ? selectedSemester : undefined,
                    exam_type: examType
                }
            });

            const marksMap: Record<number, string> = {};
            marksResponse.data.forEach((m: any) => {
                if (m.subject_id) {
                    marksMap[m.subject_id] = m.marks_obtained.toString();
                }
            });
            setStudentMarks(marksMap);
        } catch (error) {
            console.error('Failed to fetch student data', error);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleOpenModal = (student: Student) => {
        setCurrentStudent(student);
        setShowModal(true);
        setStudentMarks({});
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentStudent(null);
    };

    const handleMarkChange = (subjectId: number, value: string) => {
        if (value === '') {
            const newMarks = { ...studentMarks };
            delete newMarks[subjectId];
            setStudentMarks(newMarks);
            return;
        }

        // Allow only integer input
        if (/^\d*$/.test(value)) {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                setStudentMarks({ ...studentMarks, [subjectId]: value });
            } else if (value === '') {
                setStudentMarks({ ...studentMarks, [subjectId]: '' });
            }
        }
    };

    const handleSaveMarks = async () => {
        if (!currentStudent) return;
        setSaving(true);
        try {
            // Validate that all marks are entered
            const missingMarks = studentSubjects.filter(s =>
                !studentMarks[s.id] || studentMarks[s.id].trim() === ''
            );

            if (missingMarks.length > 0) {
                alert(`Please enter marks for all subjects. Missing: ${missingMarks.map(s => s.name).join(', ')}`);
                setSaving(false);
                return;
            }

            const marksToSave = Object.entries(studentMarks).map(([subjectId, mark]) => {
                const subject = studentSubjects.find(s => s.id === parseInt(subjectId));
                // Use subject's semester, or current selected semester (if valid), or student's current semester
                const semesterToSave = subject?.semester || (selectedSemester > 0 ? selectedSemester : currentStudent.current_semester);

                return {
                    student_id: currentStudent.student_id,
                    subject_id: parseInt(subjectId),
                    marks_obtained: parseFloat(mark),
                    exam_type: examType,
                    semester: semesterToSave,
                    max_marks: subject?.max_marks || 100,
                    academic_year: '2024-25' // Hardcoded for now, should be dynamic
                };
            });

            if (marksToSave.length > 0) {
                await api.post('/api/v1/marks/bulk', marksToSave);
                alert('Marks saved successfully!');
                handleCloseModal();
            } else {
                alert('No marks to save');
            }
        } catch (error: any) {
            console.error('Failed to save marks', error);

            if (error.code === 'ERR_NETWORK') {
                alert('Network Error: Cannot reach the server. The database might be locked or the server is down. Please check the backend terminal.');
                return;
            }

            const errorMessage = error.response?.data?.detail
                ? JSON.stringify(error.response.data.detail)
                : error.message || 'Unknown error';
            alert(`Failed to save marks: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.student_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col p-8 space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 text-white">
                        <PenTool size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Marks Entry System
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Select a student to enter their marks</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                        <BookOpen size={18} className="text-blue-500 dark:text-blue-400" />
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
                        >
                            <option value={0} className="dark:bg-slate-900">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem} className="dark:bg-slate-900">Semester {sem}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search students by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm font-medium text-sm placeholder:text-slate-400"
                />
            </div>

            {/* Premium Student List */}
            <div className="flex-1 flex flex-col min-h-0 space-y-4 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:flex">
                    <div className="w-1/3">Student Details</div>
                    <div className="w-1/6 text-center">Semester</div>
                    <div className="w-1/6 text-center">Branch</div>
                    <div className="w-1/6 text-center">Section</div>
                    <div className="w-1/6 text-right">Action</div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 space-y-3 custom-scrollbar">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4"
                                onClick={() => handleOpenModal(student)}
                            >
                                {/* Student Info */}
                                <div className="w-full md:w-1/3 flex items-center gap-4">
                                    <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-blue-500/20
                                        ${['bg-gradient-to-br from-blue-500 to-indigo-600', 'bg-gradient-to-br from-purple-500 to-pink-600', 'bg-gradient-to-br from-emerald-500 to-teal-600'][index % 3]}
                                    `}>
                                        {student.full_name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{student.full_name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                                                {student.student_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Semester */}
                                <div className="w-full md:w-1/6 flex md:justify-center justify-between">
                                    <span className="md:hidden text-xs font-semibold text-slate-400">Semester:</span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20">
                                        Sem {student.current_semester}
                                    </span>
                                </div>

                                {/* Branch */}
                                <div className="w-full md:w-1/6 flex md:justify-center justify-between">
                                    <span className="md:hidden text-xs font-semibold text-slate-400">Branch:</span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                                        {student.branch?.code || 'N/A'}
                                    </span>
                                </div>

                                {/* Section - Placeholder as it's not in interface yet, checking if exists otherwise dash */}
                                <div className="w-full md:w-1/6 flex md:justify-center justify-between">
                                    <span className="md:hidden text-xs font-semibold text-slate-400">Section:</span>
                                    <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center font-bold text-sm">
                                        -
                                    </span>
                                </div>

                                {/* Action */}
                                <div className="w-full md:w-1/6 flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenModal(student);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 w-full md:w-auto justify-center"
                                    >
                                        <Edit size={16} />
                                        <span>Marks</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center"
                        >
                            <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No students found</h3>
                            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria</p>
                        </motion.div>
                    )}
                </div>
            </div>


            {/* Premium Marks Modal */}
            <AnimatePresence>
                {showModal && currentStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-900 text-white p-6 shrink-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="flex gap-5 items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/20">
                                            {currentStudent.full_name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{currentStudent.full_name}</h2>
                                            <div className="flex gap-3 text-slate-300 mt-1">
                                                <span className="flex items-center gap-1.5 text-sm bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                                    {currentStudent.student_id}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-sm bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                                                    Sem {selectedSemester || currentStudent.current_semester}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-slate-300 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar grow bg-slate-50 dark:bg-slate-950">
                                {/* Exam Selector */}
                                <div className="mb-6 bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Select Exam Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {examTypes.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setExamType(type);
                                                    setStudentMarks({});
                                                }}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${examType === type
                                                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-blue-500/20'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {loadingSubjects ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading subjects...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {studentSubjects.length > 0 ? (
                                            studentSubjects.map((subject, idx) => {
                                                const currentMark = studentMarks[subject.id];
                                                const isValid = currentMark && parseFloat(currentMark) >= 0 && parseFloat(currentMark) <= subject.max_marks;
                                                const isPassing = isValid && parseFloat(currentMark!) >= (subject.max_marks * 0.4);

                                                return (
                                                    <motion.div
                                                        key={subject.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="group relative bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                                                    >
                                                        {/* Gradient Accent Bar */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isPassing ? 'bg-emerald-500' : currentMark ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'} transition-colors duration-300`} />

                                                        <div className="flex items-center justify-between gap-6 pl-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-black/20 text-slate-600 dark:text-slate-400 font-mono border border-slate-200 dark:border-white/10">
                                                                        {subject.code}
                                                                    </span>
                                                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{subject.name}</h3>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md">
                                                                        Credits: {subject.credits || 0}
                                                                    </span>
                                                                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md">
                                                                        Type: Core
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right hidden sm:block">
                                                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Score</p>
                                                                    <p className={`text-sm font-bold ${isValid ? (isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400') : 'text-slate-300'}`}>
                                                                        {isValid ? (isPassing ? 'PASSING' : 'FAILING') : 'PENDING'}
                                                                    </p>
                                                                </div>

                                                                <div className="relative w-32 sm:w-40">
                                                                    <input
                                                                        type="text"
                                                                        inputMode="numeric"
                                                                        value={currentMark || ''}
                                                                        onChange={(e) => handleMarkChange(subject.id, e.target.value)}
                                                                        className={`
                                                                            w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-black/20 border-2 rounded-xl text-2xl font-bold outline-none transition-all text-center
                                                                            ${!currentMark
                                                                                ? 'border-slate-200 dark:border-white/10 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/5 text-slate-500'
                                                                                : isPassing
                                                                                    ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 focus:border-emerald-500'
                                                                                    : 'border-red-500/50 bg-red-50/50 dark:bg-red-500/10 text-red-700 dark:text-red-400 focus:border-red-500'}
                                                                        `}
                                                                        placeholder="-"
                                                                    />
                                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none">
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Max</span>
                                                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{subject.max_marks}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-12 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                                <p className="text-slate-500 dark:text-slate-400">No subjects found for this semester/branch.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0 flex justify-end gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveMarks}
                                    disabled={saving || studentSubjects.length === 0}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save All Marks
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};
