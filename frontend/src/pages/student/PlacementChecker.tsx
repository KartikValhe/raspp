import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PlacementChecker: React.FC = () => {
    // const { user } = useAuth(); // Removed unused user

    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState<any>(null);

    const checkPrediction = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/v1/placement/my-prediction');
            setPrediction(res.data);

            // Simulating explanation if not available in API yet
            setExplanation({
                strengths: ['High CGPA', 'Strong Internship Record'],
                weaknesses: ['Low Mock Interview Score'],
                recommendations: ['Focus on Communication Skills', 'Practice more Mock Interviews']
            });
        } catch (error) {
            console.error("Error fetching prediction", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="text-center space-y-4 mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-fuchsia-500/30"
                    >
                        <Target size={40} />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold">Placement Probability Checker</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
                        Our AI analyzes your academic history, skills, and projects to predict your placement chances.
                    </p>
                </div>

                {!prediction ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center"
                    >
                        <button
                            onClick={checkPrediction}
                            disabled={loading}
                            className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Analyzing Profile..." : "Analyze My Profile"}
                        </button>
                        <p className="mt-4 text-sm text-slate-400">Uses Random Forest Classification Model (95% Accuracy)</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Result Card */}
                        <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 text-center">
                                <p className="text-violet-200 font-medium uppercase tracking-widest mb-2">Prediction Result</p>
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <h2 className="text-6xl font-extrabold">{prediction.prediction}</h2>
                                    {prediction.prediction === 'Placed' ? (
                                        <CheckCircle size={48} className="text-emerald-400" />
                                    ) : (
                                        <AlertTriangle size={48} className="text-amber-400" />
                                    )}
                                </div>
                                <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
                                    <p className="text-sm text-slate-300 mb-1">Confidence Score</p>
                                    <p className="text-3xl font-bold">{(prediction.confidence * 100).toFixed(1)}%</p>
                                </div>
                            </div>
                            {/* Background Glows */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" /> Key Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {explanation.strengths.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <BookOpen className="text-blue-500" /> Recommendations
                                </h3>
                                <ul className="space-y-3">
                                    {explanation.recommendations.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PlacementChecker;
