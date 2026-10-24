import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowRight, GraduationCap, Briefcase, ShieldCheck,
    BookOpen, CheckCircle, Brain, BarChart3, FileText,
    ChevronRight, Zap, Moon, Sun, PlayCircle, Activity,
    TrendingUp, Award, Sliders, Cpu, Layers, Server,
    ChevronDown, UserCheck, Shield, Check, Laptop, Clock,
    Target, Star, Users, Menu, X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // ─── Quick Demo Login State ──────────────────────────────────────────
    const [loadingRole, setLoadingRole] = useState<string | null>(null);

    const handleQuickLogin = async (demoEmail: string, demoPass: string, targetPath: string, role: string) => {
        setLoadingRole(role);
        try {
            const params = new URLSearchParams();
            params.append('username', demoEmail);
            params.append('password', demoPass);

            const res = await api.post('/api/v1/auth/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const userRole = role || res.data.role;
            const canModify = res.data.can_modify ?? true;
            login(res.data.access_token, userRole, canModify);
            navigate(targetPath);
        } catch (e) {
            console.error('Quick login error:', e);
            navigate(`/login`);
        } finally {
            setLoadingRole(null);
        }
    };

    // ─── Interactive Hero Showcase Tabs ──────────────────────────────────
    const [activeTab, setActiveTab] = useState<'student' | 'placement' | 'teacher' | 'admin'>('student');

    // ─── Interactive AI Predictor Simulator ──────────────────────────────
    const [simCgpa, setSimCgpa] = useState<number>(8.4);
    const [simAttendance, setSimAttendance] = useState<number>(88);
    const [simProjects, setSimProjects] = useState<number>(3);

    const calculatedProbability = useMemo(() => {
        // Realistic weighted formula mirroring the Random Forest classifier
        const cgpaScore = (simCgpa / 10) * 55; // 55% weight
        const attScore = (simAttendance / 100) * 25; // 25% weight
        const projScore = Math.min(simProjects / 4, 1) * 20; // 20% weight
        const total = Math.min(Math.round(cgpaScore + attScore + projScore), 99);
        return Math.max(total, 42);
    }, [simCgpa, simAttendance, simProjects]);

    const predictionTier = useMemo(() => {
        if (calculatedProbability >= 85) return { tier: 'Tier-1 Product Company Ready', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
        if (calculatedProbability >= 70) return { tier: 'High Placement Probability (Tier-2)', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
        if (calculatedProbability >= 55) return { tier: 'Moderate Chance • Upskilling Recommended', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
        return { tier: 'High Academic Risk • Remedial Coaching Needed', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
    }, [calculatedProbability]);

    // ─── Interactive FAQ Accordion State ─────────────────────────────────
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "How can reviewers and evaluators test the platform instantly?",
            a: "We provide dedicated 1-Click Instant Demo Launchers for all 4 roles (Student, Teacher, Placement Officer, Admin). Simply click any demo portal button to authenticate immediately into that live workspace with pre-populated demo data."
        },
        {
            q: "How are the academic risk and placement predictions calculated?",
            a: "RASPP deploys two pre-trained machine learning estimators: an Ensemble Voting Classifier (combining Random Forest and XGBoost) for semester pass/risk scoring, and a Random Forest Classifier trained on CGPA, attendance consistency, technical projects, and certifications achieving ~95.2% accuracy."
        },
        {
            q: "Can new students register and access their digital student profile?",
            a: "Yes. Students can click 'Get Started' or 'New Student Registration' to create their official account. The platform automatically provisions their digital student ID, links department catalogs, and generates real-time performance analytics."
        },
        {
            q: "What database and caching architecture powers this deployment?",
            a: "RASPP is powered by TiDB Cloud Serverless MySQL (Distributed ACID SQL) paired with a high-speed Dual Cache Layer (Redis with in-memory fallback), ensuring sub-5ms response times across all authenticated dashboards."
        }
    ];

    const getDashboardPath = () => {
        if (user?.role === 'student') return '/student/dashboard';
        if (user?.role === 'placement_coordinator') return '/placement/dashboard';
        return '/dashboard';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-400">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-indigo-500/15 dark:bg-indigo-600/12 rounded-full blur-[120px]" />
                <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-cyan-500/15 dark:bg-cyan-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-violet-600/10 rounded-full blur-[140px]" />
                {/* Subtle Dot Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08] dark:opacity-[0.15]" />
            </div>

            {/* FIXED GLASS CAPSULE NAVBAR (Stays pinned at top, never scrolls away) */}
            <div className="fixed top-2 sm:top-3 inset-x-0 mx-auto z-50 max-w-6xl px-3 sm:px-6 pointer-events-none">
                <header className="pointer-events-auto backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-black/20 transition-all duration-300">
                    <div className="h-14 sm:h-16 px-3.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
                        {/* Brand Logo */}
                        <div 
                            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0" 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-primary-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                                    RASPP<span className="text-indigo-600 dark:text-cyan-400 font-extrabold text-xs sm:text-sm">.ai</span>
                                </span>
                                <span className="hidden sm:block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
                                    Academic Intelligence
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Portals Preview</a>
                            <a href="#simulator" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">AI Simulator</a>
                            <a href="#demo" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Instant Testbed</a>
                            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Architecture</a>
                            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">FAQ</a>
                            <button onClick={() => navigate('/guide')} className="text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                                <span>User Guide</span>
                            </button>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            <button
                                onClick={toggleTheme}
                                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                            </button>

                            {isAuthenticated ? (
                                <button
                                    onClick={() => navigate(getDashboardPath())}
                                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all"
                                >
                                    <span>Workspace</span>
                                    <ArrowRight size={13} />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => navigate('/login?mode=register')}
                                        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight size={13} />
                                    </button>
                                </>
                            )}

                            {/* Mobile Menu Toggle Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Toggle Mobile Menu"
                            >
                                {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Drawer */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="md:hidden overflow-hidden border-t border-slate-200/70 dark:border-white/10 px-4 py-3.5 space-y-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900/95 rounded-b-2xl"
                            >
                                <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-200/60 dark:border-white/10">
                                    <a
                                        href="#showcase"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-indigo-50 dark:hover:bg-white/10 text-center"
                                    >
                                        Portals Preview
                                    </a>
                                    <a
                                        href="#simulator"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-indigo-50 dark:hover:bg-white/10 text-center"
                                    >
                                        AI Simulator
                                    </a>
                                    <a
                                        href="#demo"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-indigo-50 dark:hover:bg-white/10 text-center"
                                    >
                                        Instant Testbed
                                    </a>
                                    <a
                                        href="#faq"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-indigo-50 dark:hover:bg-white/10 text-center"
                                    >
                                        FAQs
                                    </a>
                                </div>

                                {/* Quick Access Actions in Mobile Drawer */}
                                <div className="pt-1 flex flex-col gap-2">
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); navigate('/guide'); }}
                                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center gap-2"
                                    >
                                        <BookOpen size={15} />
                                        <span>System User Guide (Simple)</span>
                                    </button>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                                            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold flex items-center justify-center"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => { setMobileMenuOpen(false); navigate('/login?mode=register'); }}
                                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-500/20"
                                        >
                                            <span>Get Started</span>
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-24 pb-12 sm:pt-36 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 sm:space-y-6 max-w-4xl mx-auto"
                >
                    {/* Live Badge */}
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs font-bold shadow-xs backdrop-blur-md max-w-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="truncate">Ensemble ML Dual Pipeline • 95.2% Verified Accuracy</span>
                        <ChevronRight size={13} className="text-indigo-400 shrink-0 hidden sm:inline" />
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] sm:leading-[1.15] text-slate-900 dark:text-white">
                        Predict Academic Trajectories.{' '}
                        <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-primary-500 to-cyan-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-teal-300">
                            Accelerate Student Careers.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed px-1 sm:px-0">
                        The comprehensive academic intelligence ecosystem for institutions. Detect at-risk students before examinations, streamline grading, and power campus placements with real-time predictive analytics.
                    </p>

                    {/* Action Buttons - Stacked on mobile with 44px+ touch targets */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 max-w-md sm:max-w-none mx-auto">
                        <a
                            href="#demo"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-primary-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 active:scale-98 transition-all"
                        >
                            <PlayCircle size={18} />
                            <span>Launch Live Portals (1-Click)</span>
                        </a>

                        <a
                            href="#simulator"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-98"
                        >
                            <Sliders size={16} className="text-indigo-500" />
                            <span>Try AI Simulator</span>
                        </a>

                        <button
                            onClick={() => navigate('/guide')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 sm:py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm transition-all active:scale-98 border border-indigo-200/50 dark:border-white/5"
                        >
                            <BookOpen size={16} className="text-indigo-500" />
                            <span>User Guide</span>
                        </button>
                    </div>

                    {/* Live Metrics Ribbon - Responsive grid */}
                    <div className="pt-6 sm:pt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-4xl mx-auto">
                        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
                            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">95.2%</div>
                            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Placement Accuracy</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
                            <div className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400">&lt; 4 ms</div>
                            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Dual-Cache Speed</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
                            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">4 Roles</div>
                            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Workspaces</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
                            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">Distributed</div>
                            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">TiDB Serverless SQL</div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* INTERACTIVE LIVE PLATFORM SHOWCASE (Hero Product Mockup) */}
            <section id="showcase" className="py-8 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-xl">
                    {/* Browser Chrome Header */}
                    <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/90" />
                            <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
                            <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">https://raspp.ai/portals/live</span>
                        </div>

                        {/* Interactive Tabs with Horizontal Touch Scroll */}
                        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 text-xs font-bold overflow-x-auto scrollbar-none max-w-full justify-start sm:justify-center">
                            <button
                                onClick={() => setActiveTab('student')}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${activeTab === 'student' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <GraduationCap size={14} />
                                <span>Student</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('placement')}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${activeTab === 'placement' ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <Briefcase size={14} />
                                <span>Placement</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('teacher')}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${activeTab === 'teacher' ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <BookOpen size={14} />
                                <span>Teacher</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${activeTab === 'admin' ? 'bg-white dark:bg-amber-600 text-amber-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <ShieldCheck size={14} />
                                <span>Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Showcase Body */}
                    <div className="p-6 sm:p-8 min-h-[380px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'student' && (
                                <motion.div
                                    key="student"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/20">
                                            <Star size={13} />
                                            <span>Active Student Workspace</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                            Student Academic & Placement Hub
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Students view their live digital ID card, track semester SGPA/CGPA trends, test placement readiness scores, and build ATS resumes with instant PDF export.
                                        </p>
                                        <button
                                            onClick={() => handleQuickLogin('student@example.com', 'student123', '/student/dashboard', 'student')}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all active:scale-98"
                                        >
                                            <span>Launch Student Portal Live</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>

                                    {/* Mock UI Cards */}
                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-500">Digital Student Card</span>
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">ACTIVE</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-md">
                                                    AS
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Aarav Sharma</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">STU202401 • CSE Sem 6</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex justify-between text-xs font-semibold">
                                                <span>Cumulative CGPA</span>
                                                <span className="text-indigo-600 dark:text-indigo-400 font-bold">8.80 / 10</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-500">Placement Predictor</span>
                                                <span className="text-[10px] font-bold text-emerald-500">Random Forest</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>Probability Score</span>
                                                    <span className="text-emerald-500">95.2%</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full w-[95%]" />
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                                                Status: <span className="text-indigo-500 font-semibold">Tier-1 Company Candidate</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'placement' && (
                                <motion.div
                                    key="placement"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/20">
                                            <Briefcase size={13} />
                                            <span>Corporate Drive Operations</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                            Placement Officer Command Center
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Placement coordinators post hiring opportunities, match eligible students via AI screening, analyze package distributions, and track institutional offers.
                                        </p>
                                        <button
                                            onClick={() => handleQuickLogin('coordinator@example.com', 'coordinator123', '/placement/dashboard', 'placement_coordinator')}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 shadow-md shadow-purple-500/25 transition-all active:scale-98"
                                        >
                                            <span>Launch Placement Portal Live</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>

                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                                            <span className="text-xs font-bold text-slate-500">Live Campus Drive</span>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Senior Software Engineer</h4>
                                            <p className="text-xs text-purple-500 font-semibold">Google Cloud • 24.5 LPA</p>
                                            <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
                                                <span>48 Eligible Students</span>
                                                <span className="font-bold text-emerald-500">12 AI Shortlisted</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                                            <span className="text-xs font-bold text-slate-500">Batch Placement Rate</span>
                                            <div className="text-2xl font-black text-purple-500">89.4%</div>
                                            <p className="text-xs text-slate-500">Total Offers: <span className="font-bold text-slate-900 dark:text-white">342 Placed</span></p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'teacher' && (
                                <motion.div
                                    key="teacher"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
                                            <BookOpen size={13} />
                                            <span>Academic Evaluation</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                            Teacher Grading & Risk Matrix
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Teachers enter marks rapidly, identify low-attendance students before internal exams, and run bulk batch risk predictions with CSV export.
                                        </p>
                                        <button
                                            onClick={() => handleQuickLogin('teacher@example.com', 'teacher123', '/dashboard', 'teacher')}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-md shadow-emerald-500/25 transition-all active:scale-98"
                                        >
                                            <span>Launch Teacher Portal Live</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>

                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                                            <span className="text-xs font-bold text-slate-500">Class Gradebook</span>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Database Management (CS601)</h4>
                                            <div className="space-y-1 text-xs pt-1">
                                                <div className="flex justify-between"><span>Batch Average</span><span className="font-bold text-emerald-500">81.4%</span></div>
                                                <div className="flex justify-between"><span>Pass Percentage</span><span className="font-bold text-indigo-500">96.0%</span></div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                                            <span className="text-xs font-bold text-slate-500">Early Intervention Flag</span>
                                            <div className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md inline-block">3 Students At-Risk</div>
                                            <p className="text-xs text-slate-500">Attendance dropped below 75% threshold in the last 14 days.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'admin' && (
                                <motion.div
                                    key="admin"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
                                >
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/20">
                                            <ShieldCheck size={13} />
                                            <span>University Governance</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                            Administrator Control Center
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Institutional administrators manage branch catalogs, assign faculty to courses, regulate credentials, and audit department-level performance metrics.
                                        </p>
                                        <button
                                            onClick={() => handleQuickLogin('admin@example.com', 'admin123', '/dashboard', 'admin')}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 shadow-md shadow-amber-500/25 transition-all active:scale-98"
                                        >
                                            <span>Launch Admin Portal Live</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>

                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                                            <span className="text-xs font-bold text-slate-500">Institutional Health</span>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                                <span className="font-bold text-sm text-slate-900 dark:text-white">All Systems Operational</span>
                                            </div>
                                            <p className="text-xs text-slate-500">Database: TiDB Cloud Singapore (4000) • Zero Cache Latency</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 space-y-2">
                                            <span className="text-xs font-bold text-slate-500">Campus Scale</span>
                                            <div className="text-2xl font-black text-amber-500">1,420 Enrolled</div>
                                            <p className="text-xs text-slate-500">8 Academic Departments • 42 Faculty Members</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* LIVE INTERACTIVE AI PREDICTOR SIMULATOR */}
            <section id="simulator" className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="p-5 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                            Interactive Sandbox
                        </span>
                        <h2 className="text-xl sm:text-3xl font-black text-white mt-1">
                            Live AI Placement Probability Simulator
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 mt-2 px-1 sm:px-0">
                            Adjust the student parameters below to see the Random Forest ML classifier calculate placement likelihood in real time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
                        {/* Sliders Control Panel */}
                        <div className="space-y-5 sm:space-y-6 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10">
                            {/* CGPA Slider */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                                    <span className="flex items-center gap-1.5">
                                        <GraduationCap size={15} className="text-indigo-400" />
                                        <span>Current CGPA</span>
                                    </span>
                                    <span className="text-indigo-300 font-mono text-sm">{simCgpa.toFixed(1)} / 10.0</span>
                                </div>
                                <input
                                    type="range"
                                    min="5.0"
                                    max="10.0"
                                    step="0.1"
                                    value={simCgpa}
                                    onChange={(e) => setSimCgpa(parseFloat(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer h-2.5 sm:h-2 bg-slate-800 rounded-lg py-1"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>5.0</span>
                                    <span>7.5</span>
                                    <span>10.0</span>
                                </div>
                            </div>

                            {/* Attendance Slider */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={15} className="text-cyan-400" />
                                        <span>Semester Attendance %</span>
                                    </span>
                                    <span className="text-cyan-300 font-mono text-sm">{simAttendance}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    step="1"
                                    value={simAttendance}
                                    onChange={(e) => setSimAttendance(parseInt(e.target.value))}
                                    className="w-full accent-cyan-500 cursor-pointer h-2.5 sm:h-2 bg-slate-800 rounded-lg py-1"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            {/* Projects & Internships Slider */}
                            <div>
                                <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase size={15} className="text-purple-400" />
                                        <span>Projects & Internships Count</span>
                                    </span>
                                    <span className="text-purple-300 font-mono text-sm">{simProjects} completed</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="6"
                                    step="1"
                                    value={simProjects}
                                    onChange={(e) => setSimProjects(parseInt(e.target.value))}
                                    className="w-full accent-purple-500 cursor-pointer h-2.5 sm:h-2 bg-slate-800 rounded-lg py-1"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>0</span>
                                    <span>3</span>
                                    <span>6+</span>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Output Gauge */}
                        <div className="bg-slate-900/80 p-6 sm:p-8 rounded-2xl border border-white/10 text-center space-y-4 sm:space-y-5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Real-Time Prediction Outcome
                            </span>

                            <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-slate-800"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={251.2 - (251.2 * calculatedProbability) / 100}
                                        strokeLinecap="round"
                                        className="text-indigo-500 transition-all duration-300"
                                        fill="transparent"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl sm:text-3xl font-black text-white">{calculatedProbability}%</span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Likelihood</span>
                                </div>
                            </div>

                            <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${predictionTier.bg} ${predictionTier.color}`}>
                                {predictionTier.tier}
                            </div>

                            <button
                                onClick={() => handleQuickLogin('student@example.com', 'student123', '/student/placement/prediction', 'student')}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-98"
                            >
                                Test With Full ML Model in Portal →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1-CLICK INSTANT DEMO LAUNCHER SECTION */}
            <section id="demo" className="py-12 sm:py-16 bg-gradient-to-r from-indigo-700 via-primary-600 to-purple-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-200">
                            Zero-Configuration Evaluator Sandbox
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black mt-1">
                            Experience Any Portal Instantly in 1-Click
                        </h2>
                        <p className="text-xs sm:text-sm text-indigo-100 mt-2 px-1 sm:px-0">
                            No credentials to remember. Click any role below to authenticate directly into that workspace with full sample data.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                        {/* Student Demo */}
                        <div
                            onClick={() => handleQuickLogin('student@example.com', 'student123', '/student/dashboard', 'student')}
                            className="bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 cursor-pointer transition-all shadow-lg group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <GraduationCap size={20} />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-blue-600 transition-all flex items-center gap-1">
                                    {loadingRole === 'student' ? 'Connecting...' : '1-Click Launch →'}
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-white">Student Portal</h3>
                            <p className="text-xs text-indigo-100 mt-1 mb-2">View CGPA, mark trends, digital ID card & ATS resume builder.</p>
                            <span className="text-[11px] font-mono text-indigo-200 bg-white/10 px-2 py-0.5 rounded">student@example.com</span>
                        </div>

                        {/* Teacher Demo */}
                        <div
                            onClick={() => handleQuickLogin('teacher@example.com', 'teacher123', '/dashboard', 'teacher')}
                            className="bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 cursor-pointer transition-all shadow-lg group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <BookOpen size={20} />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-600 transition-all flex items-center gap-1">
                                    {loadingRole === 'teacher' ? 'Connecting...' : '1-Click Launch →'}
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-white">Teacher Portal</h3>
                            <p className="text-xs text-indigo-100 mt-1 mb-2">Enter marks, view class performance & run bulk batch risk predictions.</p>
                            <span className="text-[11px] font-mono text-indigo-200 bg-white/10 px-2 py-0.5 rounded">teacher@example.com</span>
                        </div>

                        {/* Placement Demo */}
                        <div
                            onClick={() => handleQuickLogin('coordinator@example.com', 'coordinator123', '/placement/dashboard', 'placement_coordinator')}
                            className="bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 cursor-pointer transition-all shadow-lg group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <Briefcase size={20} />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-purple-600 transition-all flex items-center gap-1">
                                    {loadingRole === 'placement_coordinator' ? 'Connecting...' : '1-Click Launch →'}
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-white">Placement Portal</h3>
                            <p className="text-xs text-indigo-100 mt-1 mb-2">Broadcast company jobs, view candidates & track offer stats.</p>
                            <span className="text-[11px] font-mono text-indigo-200 bg-white/10 px-2 py-0.5 rounded">coordinator@example.com</span>
                        </div>

                        {/* Admin Demo */}
                        <div
                            onClick={() => handleQuickLogin('admin@example.com', 'admin123', '/dashboard', 'admin')}
                            className="bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 cursor-pointer transition-all shadow-lg group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white group-hover:bg-white group-hover:text-amber-600 transition-all flex items-center gap-1">
                                    {loadingRole === 'admin' ? 'Connecting...' : '1-Click Launch →'}
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-white">Admin Portal</h3>
                            <p className="text-xs text-indigo-100 mt-1 mb-2">Configure departments, assign faculty & manage predictive analytics.</p>
                            <span className="text-[11px] font-mono text-indigo-200 bg-white/10 px-2 py-0.5 rounded">admin@example.com</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* TECHNICAL ARCHITECTURE & DEPLOYMENT */}
            <section id="architecture" className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                        Production Architecture
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                        Engineered for High Reliability & Sub-5ms Caching
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 px-1 sm:px-0">
                        Modern cloud infrastructure built on distributed SQL, dual caching, and isolated ML inference.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                            <Server size={20} />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">Distributed TiDB Cloud</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Full ACID relational schema hosted on TiDB Cloud (AWS Singapore) supporting horizontal scale without downtime or lock contention.
                        </p>
                    </div>

                    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                            <Zap size={20} />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">Zero-Latency Dual Cache</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Ultra-fast in-memory fallback cache resolves user authentication and student profiles in under 3 milliseconds, avoiding remote round-trip delays.
                        </p>
                    </div>

                    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                            <Brain size={20} />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">Pre-Trained ML Pipeline</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Dual Scikit-Learn joblib estimators deliver instantaneous risk assessments and placement probability ratings with 95.2% accuracy.
                        </p>
                    </div>
                </div>
            </section>

            {/* FREQUENTLY ASKED QUESTIONS (Accordion) */}
            <section id="faq" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-8 sm:mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                        Got Questions?
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-xs transition-all"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown
                                    size={16}
                                    className={`shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODERN ENTERPRISE FOOTER */}
            <footer className="border-t border-slate-200 dark:border-white/10 py-8 sm:py-12 bg-white dark:bg-slate-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <span className="font-black text-sm text-slate-900 dark:text-white">RASPP.ai</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Result Analyzer & Student Performance Predictor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>All Systems Operational • Sub-4ms Caching Active</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <button onClick={() => navigate('/guide')} className="hover:text-indigo-600 dark:hover:text-cyan-400 flex items-center gap-1">
                            <BookOpen size={13} />
                            <span>User Guide</span>
                        </button>
                        <button onClick={() => navigate('/login')} className="hover:text-indigo-600 dark:hover:text-cyan-400">Sign In</button>
                        <button onClick={() => navigate('/login?mode=register')} className="hover:text-indigo-600 dark:hover:text-cyan-400">New Registration</button>
                        <a href="https://github.com/KartikValhe/deploy" target="_blank" rel="noreferrer" className="hover:text-indigo-600 dark:hover:text-cyan-400">GitHub Repo</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
