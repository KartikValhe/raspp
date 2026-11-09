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
        <div className="page-wrap">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="text-center space-y-3 mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-primary"
                    >
                        <Target size={32} />
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Placement Probability Checker</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
                        Evaluate campus hiring probability using historical academic performance, aptitude testing, and coding assessments.
                    </p>
                </div>

                {!prediction ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-8 sm:p-12 text-center"
                    >
                        <button
                            onClick={checkPrediction}
                            disabled={loading}
                            className="btn-primary px-8 py-3.5 text-base shadow-primary"
                        >
                            {loading ? "Evaluating Telemetry..." : "Analyze My Profile"}
                        </button>
                        <p className="mt-3 text-xs text-slate-400">Powered by machine learning classification algorithm</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-5"
                    >
                        {/* Result Card */}
                        <div className="card p-6 sm:p-8 bg-gradient-to-br from-primary-900/40 via-surface-900/60 to-surface-950/80 border-primary-500/30 text-white relative overflow-hidden">
                            <div className="relative z-10 text-center">
                                <p className="section-label text-primary-300 mb-2">Prediction Outcome</p>
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <h2 className="text-4xl sm:text-5xl font-extrabold">{prediction.prediction}</h2>
                                    {prediction.prediction === 'Placed' ? (
                                        <CheckCircle size={40} className="text-emerald-400" />
                                    ) : (
                                        <AlertTriangle size={40} className="text-amber-400" />
                                    )}
                                </div>
                                <div className="inline-block bg-white/10 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
                                    <p className="text-xs text-slate-300 mb-0.5">Confidence Score</p>
                                    <p className="text-2xl font-bold text-emerald-400">{(prediction.confidence * 100).toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="card p-5 sm:p-6">
                                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <TrendingUp className="text-emerald-500" size={18} />
                                    <span>Key Strengths</span>
                                </h3>
                                <ul className="space-y-2.5">
                                    {explanation.strengths.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="card p-5 sm:p-6">
                                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <BookOpen className="text-primary-500" size={18} />
                                    <span>Recommended Focus Areas</span>
                                </h3>
                                <ul className="space-y-2.5">
                                    {explanation.recommendations.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></div>
                                            <span>{item}</span>
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
