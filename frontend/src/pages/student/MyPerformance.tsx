import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Trophy, TrendingUp, Download, ChevronDown, ChevronUp, FileText } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const MyPerformance: React.FC = () => {
    const navigate = useNavigate();
    const [expandedSemester, setExpandedSemester] = useState<number | null>(5); // Default open latest

    // Mock Data: SGPA Trend
    const sgpaData = [
        { semester: 'Sem 1', sgpa: 7.8, cgpa: 7.8 },
        { semester: 'Sem 2', sgpa: 8.2, cgpa: 8.0 },
        { semester: 'Sem 3', sgpa: 8.0, cgpa: 8.0 },
        { semester: 'Sem 4', sgpa: 8.5, cgpa: 8.12 },
        { semester: 'Sem 5', sgpa: 8.8, cgpa: 8.25 },
    ];

    // Mock Data: Detailed Results
    const semesters = [
        {
            id: 5,
            name: "Semester 5 (Fall 2024)",
            sgpa: 8.8,
            credits: 24,
            status: "PASS",
            subjects: [
                { code: "CS501", name: "Database Management Systems", credits: 4, internal: 28, external: 62, total: 90, grade: "S" },
                { code: "CS502", name: "Operating Systems", credits: 4, internal: 25, external: 55, total: 80, grade: "A" },
                { code: "CS503", name: "Computer Networks", credits: 3, internal: 22, external: 48, total: 70, grade: "B" },
                { code: "CS504", name: "Software Engineering", credits: 3, internal: 26, external: 58, total: 84, grade: "A" },
                { code: "CS505", name: "Python Programming", credits: 2, internal: 18, external: 35, total: 53, grade: "D" },
            ]
        },
        {
            id: 4,
            name: "Semester 4 (Spring 2024)",
            sgpa: 8.5,
            credits: 24,
            status: "PASS",
            subjects: [
                { code: "CS401", name: "Algorithms", credits: 4, internal: 24, external: 56, total: 80, grade: "A" },
                { code: "CS402", name: "Microprocessors", credits: 4, internal: 20, external: 60, total: 80, grade: "A" },
            ]
        }
    ];

    const toggleSemester = (id: number) => {
        setExpandedSemester(expandedSemester === id ? null : id);
    };

    return (
        <div className="h-full overflow-y-auto p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-600 dark:text-yellow-400">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Academic Performance
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Track your academic progress and detailed semester results.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/student/transcript')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium text-sm"
                    >
                        <Download size={18} />
                        Download Transcript
                    </button>
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SGPA Trend Chart */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none"
                    >
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-emerald-400" />
                            Academic Performance Trend
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sgpaData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" strokeOpacity={0.2} vertical={false} />
                                    <XAxis
                                        dataKey="semester"
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        domain={[0, 10]}
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="sgpa"
                                        name="SGPA"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="cgpa"
                                        name="CGPA"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Quick Stats / Summary */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/20">
                            <p className="text-indigo-200 font-medium mb-1">Current CGPA</p>
                            <h3 className="text-5xl font-bold mb-4">8.25</h3>
                            <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                                <TrendingUp size={14} />
                                <span>Top 15% of class</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none">
                            <h3 className="text-gray-900 dark:text-white font-bold mb-4">Credits Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 dark:text-gray-400">Earned</span>
                                        <span className="text-gray-900 dark:text-white font-bold">92</span>
                                    </div>
                                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: '65%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 dark:text-gray-400">Required</span>
                                        <span className="text-gray-900 dark:text-white font-bold">160</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Detailed Results Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText size={24} className="text-indigo-400" />
                        Semester Results
                    </h2>

                    {semesters.map((sem, index) => (
                        <motion.div
                            key={sem.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none"
                        >
                            <button
                                onClick={() => toggleSemester(sem.id)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${sem.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {sem.sgpa}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{sem.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{sem.credits} Credits • {sem.subjects.length} Subjects</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sem.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                        {sem.status}
                                    </span>
                                    {expandedSemester === sem.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedSemester === sem.id && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 border-t border-gray-200 dark:border-white/10">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">
                                                            <th className="py-4 font-medium">Subject Code</th>
                                                            <th className="py-4 font-medium">Subject Name</th>
                                                            <th className="py-4 font-medium text-center">Credits</th>
                                                            <th className="py-4 font-medium text-center">Internal</th>
                                                            <th className="py-4 font-medium text-center">External</th>
                                                            <th className="py-4 font-medium text-center">Total</th>
                                                            <th className="py-4 font-medium text-center">Grade</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-gray-700 dark:text-gray-300 text-sm">
                                                        {sem.subjects.map((sub, i) => (
                                                            <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                                <td className="py-4 font-medium text-indigo-600 dark:text-indigo-300">{sub.code}</td>
                                                                <td className="py-4 text-gray-900 dark:text-white">{sub.name}</td>
                                                                <td className="py-4 text-center text-gray-600 dark:text-gray-400">{sub.credits}</td>
                                                                <td className="py-4 text-center">{sub.internal}</td>
                                                                <td className="py-4 text-center">{sub.external}</td>
                                                                <td className="py-4 text-center font-bold text-gray-900 dark:text-white">{sub.total}</td>
                                                                <td className="py-4 text-center">
                                                                    <span className={`inline-block w-8 h-8 leading-8 rounded-lg font-bold text-xs ${sub.grade === 'S' ? 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300' :
                                                                        sub.grade === 'A' ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' :
                                                                            sub.grade === 'B' ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' :
                                                                                sub.grade === 'F' ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300' :
                                                                                    'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-300'
                                                                        }`}>
                                                                        {sub.grade}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
