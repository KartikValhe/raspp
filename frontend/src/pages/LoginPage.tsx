import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, ArrowRight, Loader2, Sparkles, Moon, Sun,
    Eye, EyeOff, ArrowLeft, GraduationCap, Briefcase, ShieldCheck,
    CheckCircle2, BookOpen, ChevronRight
} from 'lucide-react';

interface PortalOption {
    id: string;
    role: string;
    title: string;
    badge: string;
    subtitle: string;
    icon: React.ElementType;
    email: string;
    pass: string;
    targetPath: string;
    color: string;
    gradient: string;
    activeBorder: string;
    activeBg: string;
    badgeBg: string;
    badgeText: string;
}

const PORTALS: PortalOption[] = [
    {
        id: 'student',
        role: 'student',
        title: 'Student Portal',
        badge: 'Student',
        subtitle: 'Results, CGPA, Resume & Placement',
        icon: GraduationCap,
        email: 'student@example.com',
        pass: 'student123',
        targetPath: '/student/dashboard',
        color: 'text-blue-500',
        gradient: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
        activeBorder: 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20',
        activeBg: 'bg-blue-50/70 dark:bg-blue-950/30',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/50',
        badgeText: 'text-blue-700 dark:text-blue-300',
    },
    {
        id: 'teacher',
        role: 'teacher',
        title: 'Teacher Portal',
        badge: 'Faculty',
        subtitle: 'Grading Hub, Attendance & Batch ML',
        icon: BookOpen,
        email: 'teacher@example.com',
        pass: 'teacher123',
        targetPath: '/dashboard',
        color: 'text-emerald-500',
        gradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
        activeBorder: 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20',
        activeBg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50',
        badgeText: 'text-emerald-700 dark:text-emerald-300',
    },
    {
        id: 'coordinator',
        role: 'placement_coordinator',
        title: 'Placement Coordinator',
        badge: 'Placement',
        subtitle: 'Recruitment Drives, Jobs & Records',
        icon: Briefcase,
        email: 'coordinator@example.com',
        pass: 'coordinator123',
        targetPath: '/placement/dashboard',
        color: 'text-purple-500',
        gradient: 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500',
        activeBorder: 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20',
        activeBg: 'bg-purple-50/70 dark:bg-purple-950/30',
        badgeBg: 'bg-purple-100 dark:bg-purple-900/50',
        badgeText: 'text-purple-700 dark:text-purple-300',
    },
    {
        id: 'admin',
        role: 'admin',
        title: 'Admin Portal',
        badge: 'Administrator',
        subtitle: 'Curriculum, Users & Institutional Analytics',
        icon: ShieldCheck,
        email: 'admin@example.com',
        pass: 'admin123',
        targetPath: '/dashboard',
        color: 'text-amber-500',
        gradient: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
        activeBorder: 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20',
        activeBg: 'bg-amber-50/70 dark:bg-amber-950/30',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/50',
        badgeText: 'text-amber-700 dark:text-amber-300',
    },
];

export const LoginPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialPortal = PORTALS.find(p => p.id === searchParams.get('portal')) || PORTALS[0];

    const [selectedPortal, setSelectedPortal] = useState<PortalOption>(initialPortal);
    const [email, setEmail] = useState(initialPortal.email);
    const [password, setPassword] = useState(initialPortal.pass);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Select a portal and auto-populate its credentials
    const handleSelectPortal = (portal: PortalOption) => {
        setSelectedPortal(portal);
        setEmail(portal.email);
        setPassword(portal.pass);
        setError('');
    };

    // Helper for direct login
    const performLogin = async (loginEmail: string, loginPass: string, targetPath?: string) => {
        setError('');
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('username', loginEmail.trim());
            params.append('password', loginPass);

            const response = await api.post('/api/v1/auth/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const role = response.data.role;
            const canModify = response.data.can_modify ?? true;
            login(response.data.access_token, role, canModify);

            if (targetPath) {
                navigate(targetPath);
            } else if (role === 'student') {
                navigate('/student/dashboard');
            } else if (role === 'placement_coordinator') {
                navigate('/placement/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error(err);
            if (!err.response) {
                const isLocal = typeof window !== 'undefined' && 
                    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
                if (isLocal) {
                    setError('Cannot connect to local backend. Please make sure the backend is running at http://127.0.0.1:8000 (run .\\start.bat in PowerShell).');
                } else {
                    setError('Cannot connect to cloud backend. The free cloud server (Render) may be waking up from cold sleep (takes ~45-60s on first visit). Please wait a few seconds and tap Launch again.');
                }
            } else {
                setError(err.response?.data?.detail || 'Invalid credentials. Please verify your email and password.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await performLogin(email, password, selectedPortal.targetPath);
    };

    const handleDirectLaunch = (portal: PortalOption, e: React.MouseEvent) => {
        e.stopPropagation();
        handleSelectPortal(portal);
        performLogin(portal.email, portal.pass, portal.targetPath);
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-500 relative">
            {/* Top Navigation Bar */}
            <div className="absolute top-5 left-5 right-5 z-50 flex items-center justify-between pointer-events-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-semibold shadow-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-md hover:scale-105"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Left Side - Animated Showcase */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 items-center justify-center p-12 transition-colors duration-500">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 text-slate-900 dark:text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="w-16 h-16 bg-white dark:bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 dark:border-white/20 shadow-xl shadow-indigo-500/10">
                            <Sparkles className="text-indigo-600 dark:text-blue-400" size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                            RASPP Portal Access <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Direct Authentication
                            </span>
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            Select which portal you would like to enter. Instantly launch with pre-configured role credentials or sign in with your institutional account.
                        </p>

                        {/* Interactive Role Card Highlights */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {PORTALS.map((portal) => {
                                const Icon = portal.icon;
                                const isCurrent = selectedPortal.id === portal.id;
                                return (
                                    <div
                                        key={portal.id}
                                        onClick={() => handleSelectPortal(portal)}
                                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                            isCurrent
                                                ? `${portal.activeBg} ${portal.activeBorder} shadow-sm`
                                                : 'bg-white/70 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1 font-bold text-sm">
                                            <Icon className={portal.color} size={18} />
                                            <span className="text-slate-800 dark:text-white">{portal.title}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{portal.subtitle}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Cloud Backend: FastAPI & MySQL / TiDB Database</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Direct Portal Picker & Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative pt-20 lg:pt-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md space-y-6 relative z-10"
                >
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                            <span>Role-Based Portal Access</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Choose Your Portal
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Click a portal to select it or tap <span className="font-semibold text-slate-700 dark:text-slate-200">Instant Launch</span>.
                        </p>
                    </div>

                    {/* DIRECT PORTAL PICKER GRID (4 PORTALS) */}
                    <div className="grid grid-cols-2 gap-2.5">
                        {PORTALS.map((portal) => {
                            const Icon = portal.icon;
                            const isSelected = selectedPortal.id === portal.id;
                            return (
                                <div
                                    key={portal.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleSelectPortal(portal)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSelectPortal(portal);
                                        }
                                    }}
                                    className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer select-none ${
                                        isSelected
                                            ? `${portal.activeBorder} ${portal.activeBg} shadow-md`
                                            : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-1 mb-2">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${portal.badgeBg}`}>
                                            <Icon className={portal.color} size={18} />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${portal.badgeBg} ${portal.badgeText}`}>
                                            {portal.badge}
                                        </span>
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                        {portal.title}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {portal.email}
                                    </div>

                                    {/* 1-Tap Quick Launch */}
                                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-slate-400">Quick login</span>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDirectLaunch(portal, e)}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            <span>Launch</span>
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Alerts */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* LOGIN FORM WITH SELECTED PORTAL */}
                    <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                        <div className="space-y-3.5">
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                    Email Address ({selectedPortal.badge})
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className={`h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                    Password
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className={`h-4 w-4 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full relative group overflow-hidden bg-gradient-to-r ${selectedPortal.gradient} text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Logging in to {selectedPortal.title}...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enter {selectedPortal.title}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        Default test credentials are pre-filled above. Simply tap <span className="font-semibold text-slate-700 dark:text-slate-300">Enter {selectedPortal.title}</span> or select another portal.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
