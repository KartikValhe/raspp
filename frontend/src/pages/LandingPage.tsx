import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
    Sparkles, ArrowRight, GraduationCap, Briefcase, ShieldCheck, 
    BookOpen, CheckCircle, Brain, BarChart3, FileText, 
    ChevronRight, Zap, Globe, Lock, Moon, Sun, PlayCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
        try {
            const params = new URLSearchParams();
            params.append('username', demoEmail);
            params.append('password', demoPass);

            const res = await api.post('/api/v1/auth/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            login(res.data.access_token);
            navigate('/dashboard');
        } catch (e) {
            console.error('Quick login error:', e);
            // Fallback: navigate to login page with prefilled credentials
            navigate(`/login`);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                RASPP<span className="text-blue-600 dark:text-blue-400">.ai</span>
                            </span>
                            <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
                                Academic Intelligence
                            </span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <a href="#portals" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Portals</a>
                        <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Getting Started</a>
                        <a href="#ai-engine" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Models</a>
                        <a href="#demo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Instant Demo</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                            >
                                Open Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/login?mode=register')}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight size={15} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6 max-w-4xl mx-auto"
                >
                    {/* Floating Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-sm">
                        <Zap size={14} className="text-blue-600 dark:text-blue-400 fill-current" />
                        <span>Ensemble Voting ML + Random Forest (~95% Accuracy)</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                        Predict Academic Outcomes.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                            Accelerate Student Careers.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                        An institutional management & predictive intelligence platform. Analyze semester performance, detect at-risk students before exams, and power campus placements with Machine Learning.
                    </p>

                    {/* CTA Buttons */}
                    <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="#demo"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
                        >
                            <PlayCircle size={20} />
                            <span>Launch Live Portals</span>
                        </a>

                        <button
                            onClick={() => navigate('/login?mode=register')}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-base transition-all"
                        >
                            <GraduationCap size={20} className="text-blue-600 dark:text-blue-400" />
                            <span>New Student Registration</span>
                        </button>
                    </div>

                    {/* Key Metrics Strip */}
                    <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">95.2%</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Placement Prediction</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">4 Roles</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Dedicated Portals</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">Real-Time</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">CGPA & Risk Scoring</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">ATS Ready</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Resume Generator</div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 1-CLICK INSTANT DEMO LAUNCHER SECTION */}
            <section id="demo" className="py-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-200">
                            For Evaluators, Reviewers & Recruiters
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black mt-1">
                            Test Any Portal Instantly with 1-Click
                        </h2>
                        <p className="text-sm text-blue-100 mt-2">
                            No credentials to remember. Click any role button below to log in immediately and test the live application.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Student Demo */}
                        <div 
                            onClick={() => handleQuickLogin('student@example.com', 'student123')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/20 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <GraduationCap size={20} />
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-blue-600 transition-all">
                                    Launch →
                                </span>
                            </div>
                            <h3 className="font-bold text-lg">Student Portal</h3>
                            <p className="text-xs text-blue-100 mt-1 mb-2">View CGPA, mark trends, ATS resume & placement cell.</p>
                            <span className="text-[11px] font-mono text-blue-200">student@example.com</span>
                        </div>

                        {/* Teacher Demo */}
                        <div 
                            onClick={() => handleQuickLogin('teacher@example.com', 'teacher123')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/20 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <BookOpen size={20} />
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-600 transition-all">
                                    Launch →
                                </span>
                            </div>
                            <h3 className="font-bold text-lg">Teacher Portal</h3>
                            <p className="text-xs text-blue-100 mt-1 mb-2">Enter student marks, view class metrics & bulk predictions.</p>
                            <span className="text-[11px] font-mono text-blue-200">teacher@example.com</span>
                        </div>

                        {/* Placement Demo */}
                        <div 
                            onClick={() => handleQuickLogin('coordinator@example.com', 'coordinator123')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/20 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <Briefcase size={20} />
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-purple-600 transition-all">
                                    Launch →
                                </span>
                            </div>
                            <h3 className="font-bold text-lg">Placement Portal</h3>
                            <p className="text-xs text-blue-100 mt-1 mb-2">Track placement stats, jobs & AI candidate likelihood.</p>
                            <span className="text-[11px] font-mono text-blue-200">coordinator@example.com</span>
                        </div>

                        {/* Admin Demo */}
                        <div 
                            onClick={() => handleQuickLogin('admin@example.com', 'admin123')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/20 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-amber-600 transition-all">
                                    Launch →
                                </span>
                            </div>
                            <h3 className="font-bold text-lg">Admin Portal</h3>
                            <p className="text-xs text-blue-100 mt-1 mb-2">Manage branches, subjects, users & predictive analytics.</p>
                            <span className="text-[11px] font-mono text-blue-200">admin@example.com</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* PORTALS DEEP DIVE SECTION */}
            <section id="portals" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Institutional Governance
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                        Four Roles. One Unified Ecosystem.
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
                        Every stakeholder gets a purpose-built workspace designed for their specific daily workflow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Student Portal Card */}
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                            <GraduationCap size={26} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Student Portal</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Students stay ahead of their academic journey with clear visibility into their performance trajectory and placement readiness.
                        </p>
                        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-blue-500 shrink-0" />
                                <span>Real-time CGPA tracking & semester-wise breakdown</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-blue-500 shrink-0" />
                                <span>Built-in ATS Resume Builder with instant PDF export</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-blue-500 shrink-0" />
                                <span>Placement Cell: View hiring openings & AI eligibility score</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-blue-500 shrink-0" />
                                <span>Official academic transcript generator & download</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleQuickLogin('student@example.com', 'student123')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                        >
                            <span>Open Student Workspace</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Teacher Portal Card */}
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                            <BookOpen size={26} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Teacher Portal</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Educators gain actionable insights to identify struggling students early and manage grades without administrative overhead.
                        </p>
                        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                <span>Streamlined Marks Entry interface for fast grading</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                <span>Class-wise performance analytics and historical trends</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                <span>Bulk CSV Prediction to assess risk levels for an entire batch</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                                <span>Attendance status updates and student consistency checks</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleQuickLogin('teacher@example.com', 'teacher123')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform"
                        >
                            <span>Open Teacher Workspace</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Placement Coordinator Card */}
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                            <Briefcase size={26} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Placement Cell Portal</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Dedicated hub for placement officers to connect students with corporate recruiters and maximize campus offers.
                        </p>
                        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-purple-500 shrink-0" />
                                <span>Placement statistics: Avg Package, Placement Rate, Top Offers</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-purple-500 shrink-0" />
                                <span>Create and broadcast job listings directly to eligible students</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-purple-500 shrink-0" />
                                <span>AI Placement Probability Classifier (Random Forest ~95% Acc)</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-purple-500 shrink-0" />
                                <span>Placement records tracking and institutional placement history</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleQuickLogin('coordinator@example.com', 'coordinator123')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform"
                        >
                            <span>Open Placement Workspace</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Admin Portal Card */}
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                            <ShieldCheck size={26} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Portal</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Total institutional control: configure academic departments, assign teachers to subjects, and monitor university-wide metrics.
                        </p>
                        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-8">
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-amber-500 shrink-0" />
                                <span>Full User Management: register and configure teachers & students</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-amber-500 shrink-0" />
                                <span>Branch & Subject catalog management with semester mapping</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-amber-500 shrink-0" />
                                <span>Predictive system-wide analytics with risk distribution</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <CheckCircle size={16} className="text-amber-500 shrink-0" />
                                <span>Academic session management and student batch controls</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleQuickLogin('admin@example.com', 'admin123')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform"
                        >
                            <span>Open Admin Workspace</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS / GETTING STARTED */}
            <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            User Journey & Architecture
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                            Getting Started with RASPP
                        </h2>
                        <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
                            Here is how a new visitor, student, or faculty member accesses and uses the platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                            <span className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                            <h4 className="font-bold text-base mt-2 mb-2">Visit Live Link</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Arrive at the landing page. Read feature highlights, inspect the AI models, and select your target portal.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                            <span className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                            <h4 className="font-bold text-base mt-2 mb-2">Login or Register</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Use 1-Click Demo Logins for instant evaluation, or create a new student profile with your official Roll Number.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                            <span className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                            <h4 className="font-bold text-base mt-2 mb-2">AI Predictive Engine</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Machine learning algorithms assess attendance, internal marks, and skill metrics to output predictive scores.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                            <span className="absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                            <h4 className="font-bold text-base mt-2 mb-2">Actionable Results</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Teachers initiate timely interventions; students improve weaknesses and generate ATS resumes for placement drives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI ENGINE ARCHITECTURE */}
            <section id="ai-engine" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4">
                            <Brain size={14} />
                            <span>Dual Machine Learning Engine</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                            Powered by Pre-Trained Machine Learning Models
                        </h2>
                        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                            RASPP does not rely on static heuristics. It runs two real-time ML classifiers to generate high-confidence predictions:
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="text-blue-400 font-bold text-sm mb-1">01. Academic Performance Classifier</div>
                            <h4 className="text-lg font-bold mb-2">Ensemble Voting Model</h4>
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                Combines Random Forest and XGBoost to predict if a student is "At Risk", "Average", "Good", or "Excellent" based on marks consistency and attendance.
                            </p>
                            <span className="text-[11px] font-mono text-blue-300 bg-blue-900/40 px-2.5 py-1 rounded-md">
                                ensemble_model.joblib
                            </span>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="text-purple-400 font-bold text-sm mb-1">02. Placement Probability Classifier</div>
                            <h4 className="text-lg font-bold mb-2">Random Forest Estimator</h4>
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                Trained on CGPA, Data Structures proficiency, academic project count, and internships to estimate likelihood of securing a placement (~95% accuracy).
                            </p>
                            <span className="text-[11px] font-mono text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-md">
                                placement_model.joblib
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">RASPP Platform</span>
                        <span>• Deployed on Vercel & Render with TiDB Cloud</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/login')} className="hover:text-blue-600 dark:hover:text-blue-400">Sign In</button>
                        <button onClick={() => navigate('/login?mode=register')} className="hover:text-blue-600 dark:hover:text-blue-400">Register</button>
                        <a href="https://github.com/KartikValhe/deploy" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
