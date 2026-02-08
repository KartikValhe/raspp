import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, Sparkles, Moon, Sun, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/api/v1/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            login(response.data.access_token);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-900 transition-colors duration-500 relative">
            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-lg hover:scale-110"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Left Side - Animated Hero Section */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-50 dark:bg-slate-900 items-center justify-center p-12 transition-colors duration-500">
                {/* Animated Background Mesh */}
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
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Welcome to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                RASPP Portal
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                            Your gateway to academic excellence. Manage student performance, track placements, and streamline administration with our advanced platform.
                        </p>

                        <div className="flex gap-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold relative z-0 hover:z-10 transition-all hover:scale-110">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                                            alt="User"
                                            className="w-full h-full rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-bold text-sm">1,200+ Active Users</span>
                                <span className="text-xs text-slate-400">Join the community today</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {/* Mobile Background Elements */}
                <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sign In</h2>
                        <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access your account.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="relative group">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                    Email Address
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className={`h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Dashboard</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                        Don't have an account?{' '}
                        <a href="#" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                            Contact Admin
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
