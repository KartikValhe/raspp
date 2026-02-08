import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Download, CheckCircle, XCircle, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CheckResults: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const semesters = [
        { id: 'sem5', label: 'Semester 5 (Fall 2024)', isRecent: true },
        { id: 'sem4', label: 'Semester 4 (Spring 2024)', isRecent: false },
        { id: 'sem3', label: 'Semester 3 (Fall 2023)', isRecent: false },
    ];

    // Mock Result Data
    const resultData = {
        sgpa: 9.2,
        cgpa: 8.8,
        status: 'Pass',
        totalMarks: 580,
        maxMarks: 600,
        credits: 24,
        rank: 5,
        subjects: [
            { name: 'Advanced Algorithms', grade: 'O', score: 95 },
            { name: 'Machine Learning', grade: 'A+', score: 88 },
            { name: 'Cloud Computing', grade: 'O', score: 92 },
            { name: 'System Design', grade: 'A+', score: 85 },
            { name: 'Soft Skills', grade: 'A', score: 78 },
        ]
    };

    const handleCheckResult = () => {
        if (!selectedSemester) return;
        setIsLoading(true);

        // Simulate loading delay
        setTimeout(() => {
            setIsLoading(false);
            setShowResult(true);
        }, 1500);
    };

    return (
        <div className="h-full relative overflow-y-auto bg-slate-50 dark:bg-slate-900">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Trophy size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Check Results</h1>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!showResult ? (
                        /* SEARCH SECTION */
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30">
                                <Trophy size={48} className="text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                Ready to see your performance?
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                                Select your semester session to view the official declared results.
                                Best of luck! 🍀
                            </p>

                            <div className="w-full max-w-md space-y-4">
                                <div className="relative">
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 pr-12 text-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                    >
                                        <option value="" disabled>Select Examination Session</option>
                                        {semesters.map(sem => (
                                            <option key={sem.id} value={sem.id}>{sem.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Search className="text-slate-400" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckResult}
                                    disabled={!selectedSemester || isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Fetching Result...
                                        </>
                                    ) : (
                                        'View Result'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* RESULT DISPLAY SECTION */
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="w-full max-w-2xl mx-auto"
                        >
                            {/* Result Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                {/* Header / Hero */}
                                <div className="relative bg-gradient-to-br from-indigo-900 to-violet-800 p-8 text-white text-center overflow-hidden">
                                    {/* Simple Background Pattern */}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

                                    <p className="relative z-10 text-indigo-200 font-medium mb-2 uppercase tracking-widest text-xs">Semester 5 Performance</p>
                                    <div className="relative z-10 flex justify-center items-center gap-6 my-6">
                                        <div className="text-center">
                                            <span className="text-6xl font-black tracking-tighter drop-shadow-lg">{resultData.sgpa}</span>
                                            <span className="block text-sm opacity-70 font-medium mt-1">SGPA</span>
                                        </div>
                                        <div className="h-16 w-px bg-white/20" />
                                        <div className="text-center">
                                            <span className="text-6xl font-black tracking-tighter drop-shadow-lg flex items-center gap-2">
                                                {resultData.status === 'Pass' ? (
                                                    <span className="text-emerald-400">P</span>
                                                ) : (
                                                    <span className="text-rose-400">F</span>
                                                )}
                                            </span>
                                            <span className="block text-sm opacity-70 font-medium mt-1">Status</span>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="relative z-10 inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
                                    >
                                        <Sparkles size={16} className="text-yellow-400" />
                                        <span className="text-sm font-bold">Top 5% of Class (Rank #{resultData.rank})</span>
                                    </motion.div>
                                </div>

                                {/* Detailed Breakdown */}
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Total Marks</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{resultData.totalMarks} <span className="text-sm text-slate-400 font-normal">/ {resultData.maxMarks}</span></p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Total Credits</p>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{resultData.credits}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Subject Highlights</h3>
                                    <div className="space-y-3 mb-8">
                                        {resultData.subjects.map((sub, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sub.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{sub.score}</span>
                                                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${sub.grade === 'O' || sub.grade === 'A+' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                                                        {sub.grade}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowResult(false)}
                                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Check Another
                                        </button>
                                        <button
                                            onClick={() => navigate('/student/transcript')}
                                            className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                        >
                                            <Download size={18} />
                                            Download Transcript
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
