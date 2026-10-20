import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Lock, ArrowRight, Loader2, Sparkles, Moon, Sun, 
    Eye, EyeOff, ArrowLeft, GraduationCap, Briefcase, ShieldCheck, 
    CheckCircle2, UserPlus, BookOpen 
} from 'lucide-react';

interface Branch {
    id: number;
    name: string;
    code: string;
}

export const LoginPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isRegisterMode, setIsRegisterMode] = useState(searchParams.get('mode') === 'register');
    
    // Login form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Register form state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regStudentId, setRegStudentId] = useState('');
    const [regSemester, setRegSemester] = useState(1);
    const [regBranchId, setRegBranchId] = useState<number | ''>('');
    const [branches, setBranches] = useState<Branch[]>([]);

    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Fetch branches for registration
    useEffect(() => {
        api.get('/api/v1/auth/branches')
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setBranches(res.data);
                    setRegBranchId(res.data[0].id);
                }
            })
            .catch(() => {
                // Fallback branch if endpoint fails
                setBranches([{ id: 1, name: 'Computer Science & Engineering', code: 'CSE' }]);
                setRegBranchId(1);
            });
    }, []);

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
            login(response.data.access_token, role);

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
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await performLogin(email, password);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const payload = {
                student_id: regStudentId.trim(),
                full_name: regName.trim(),
                current_semester: Number(regSemester),
                branch_id: regBranchId ? Number(regBranchId) : null,
                section: 'A',
                email: regEmail.trim(),
                password: regPassword,
            };

            await api.post('/api/v1/auth/register-student', payload);
            setSuccessMessage('Account created successfully! Logging you in...');
            
            // Automatically log in newly registered student and go to student dashboard
            setTimeout(() => {
                performLogin(regEmail, regPassword, '/student/dashboard');
            }, 600);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Registration failed. Please check your details.');
            setLoading(false);
        }
    };

    const handleQuickLogin = (demoEmail: string, demoPass: string, targetPath: string, role: string) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setIsRegisterMode(false);
        performLogin(demoEmail, demoPass, targetPath);
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-500 relative">
            {/* Top Navigation Bar */}
            <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-semibold shadow-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-lg hover:scale-110"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Left Side - Animated Hero Section */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 items-center justify-center p-12 transition-colors duration-500">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-10"></div>
                </div>

                <div className="relative z-10 text-slate-900 dark:text-white max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="w-16 h-16 bg-white dark:bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 dark:border-white/20 shadow-2xl shadow-indigo-500/20 dark:shadow-none">
                            <Sparkles className="text-indigo-600 dark:text-blue-400" size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                            RASPP Portal Access <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Academic & Placement AI
                            </span>
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            Unified intelligence suite for higher education institutions. Monitor academic trajectory, forecast placement probability, and empower student success.
                        </p>

                        {/* Interactive Role Card Highlights */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 font-bold text-sm">
                                    <GraduationCap size={18} />
                                    <span>Students</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">CGPA trends, risk warnings & ATS resume builder</p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                    <BookOpen size={18} />
                                    <span>Teachers</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Marks entry, class metrics & ML batch prediction</p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-purple-400 font-bold text-sm">
                                    <Briefcase size={18} />
                                    <span>Placement Cell</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Job listings & AI placement likelihood predictor</p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400 font-bold text-sm">
                                    <ShieldCheck size={18} />
                                    <span>Admins</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Branches, subjects, users & institution insights</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Cloud Backend: Render (FastAPI) & TiDB Cloud</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form & Quick Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative pt-24 lg:pt-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md space-y-6 relative z-10"
                >
                    {/* Mode Switcher Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => { setIsRegisterMode(false); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                !isRegisterMode 
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsRegisterMode(true); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                isRegisterMode 
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            New Student Signup
                        </button>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isRegisterMode ? 'Create Student Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {isRegisterMode 
                                ? 'Register your profile to access your marks, CGPA & resume builder.' 
                                : 'Enter your credentials or choose a quick demo account below.'}
                        </p>
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
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2"
                            >
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* FORM SECTION */}
                    {!isRegisterMode ? (
                        /* LOGIN FORM */
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="space-y-3.5">
                                <div className="relative group">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                        Email Address
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
                                            placeholder="student@example.com"
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
                                className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In to Dashboard</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    ) : (
                        /* STUDENT REGISTRATION FORM */
                        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    placeholder="Aarav Sharma"
                                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                        Roll No / Student ID
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={regStudentId}
                                        onChange={(e) => setRegStudentId(e.target.value)}
                                        placeholder="STU105"
                                        className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                        Current Semester
                                    </label>
                                    <select
                                        value={regSemester}
                                        onChange={(e) => setRegSemester(Number(e.target.value))}
                                        className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                            <option key={s} value={s}>Semester {s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                    Academic Branch
                                </label>
                                <select
                                    value={regBranchId}
                                    onChange={(e) => setRegBranchId(Number(e.target.value))}
                                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        placeholder="aarav@college.edu"
                                        className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 text-sm disabled:opacity-70"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Creating account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={18} />
                                            <span>Complete Student Registration</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    )}

                    {/* 1-CLICK INSTANT DEMO LOGIN SECTION */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Instant Demo Accounts (1-Click Login)
                            </span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                                For Reviewers
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleQuickLogin('student@example.com', 'student123', '/student/dashboard', 'student')}
                                className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 text-left transition-all group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                                    <GraduationCap size={15} />
                                </div>
                                <div className="truncate">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">Student</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">student@example.com</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleQuickLogin('teacher@example.com', 'teacher123', '/dashboard', 'teacher')}
                                className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 text-left transition-all group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                                    <BookOpen size={15} />
                                </div>
                                <div className="truncate">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">Teacher</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">teacher@example.com</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleQuickLogin('coordinator@example.com', 'coordinator123', '/placement/dashboard', 'placement_coordinator')}
                                className="flex items-center gap-2 p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 text-left transition-all group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                                    <Briefcase size={15} />
                                </div>
                                <div className="truncate">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">Placement</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">coordinator@...</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleQuickLogin('admin@example.com', 'admin123', '/dashboard', 'admin')}
                                className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 text-left transition-all group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                                    <ShieldCheck size={15} />
                                </div>
                                <div className="truncate">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">Admin</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">admin@example.com</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                        {isRegisterMode ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsRegisterMode(false)}
                                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Sign In here
                                </button>
                            </>
                        ) : (
                            <>
                                Need teacher or admin access?{' '}
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    Contact Institution Admin
                                </span>
                            </>
                        )}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
