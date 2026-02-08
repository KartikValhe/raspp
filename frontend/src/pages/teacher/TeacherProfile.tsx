import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building2, Lock, Eye, EyeOff, Check, AlertCircle, Shield, Key, ChevronRight } from 'lucide-react';

interface TeacherProfile {
    id: number;
    full_name: string;
    email: string;
    department: string;
    branch?: {
        id: number;
        name: string;
        code: string;
    };
    stats?: {
        students_count: number;
        average_score: number;
        subjects_count: number;
    };
}

export const TeacherProfile: React.FC = () => {
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [loading, setLoading] = useState(true);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/v1/teachers/me');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);
        setIsSubmitting(true);

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            setIsSubmitting(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            setIsSubmitting(false);
            return;
        }

        try {
            await api.put('/api/v1/teachers/me/password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (error: any) {
            setPasswordError(error.response?.data?.detail || 'Failed to update password');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full overflow-y-auto p-8 space-y-8">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-[60vh] flex-col gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <h2 className="text-xl font-bold text-slate-700 dark:text-gray-200">Failed to load profile</h2>
                <button onClick={fetchProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Immersive Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-900 p-1.5 shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                                {profile?.full_name.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 shadow-sm"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pb-2 text-white flex-1"
                    >
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{profile?.full_name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-blue-100">
                            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                <Building2 size={14} />
                                {profile?.department} Dept
                            </span>
                            {profile?.branch && (
                                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                    <Shield size={14} />
                                    {profile.branch.name}
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar - Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${activeTab === 'profile'
                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <User size={20} />
                                    <span>Personal Information</span>
                                </div>
                                {activeTab === 'profile' && <ChevronRight size={16} />}
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${activeTab === 'security'
                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Shield size={20} />
                                    <span>Security & Privacy</span>
                                </div>
                                {activeTab === 'security' && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </motion.div>

                    {/* Quick Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-lg font-bold mb-4 relative z-10">Academy Status</h3>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <span className="text-indigo-100 text-sm">Total Students</span>
                                <span className="font-bold text-xl">{profile?.stats?.students_count || 0}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <span className="text-indigo-100 text-sm">Avg. Score</span>
                                <span className="font-bold text-xl">{profile?.stats?.average_score || 0}%</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <span className="text-indigo-100 text-sm">Classes</span>
                                <span className="font-bold text-xl">{profile?.stats?.subjects_count || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-8"
                            >
                                <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Details</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
                                    </div>
                                    <button className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                                        Edit Details
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">Full Name</label>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                                                <User className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" size={20} />
                                                <span className="font-medium text-slate-700 dark:text-slate-200">{profile?.full_name}</span>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">Email Address</label>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                                                <Mail className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" size={20} />
                                                <span className="font-medium text-slate-700 dark:text-slate-200">{profile?.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">Department</label>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                                                <Building2 className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" size={20} />
                                                <span className="font-medium text-slate-700 dark:text-slate-200">{profile?.department}</span>
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">Assigned Branch</label>
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                                                <Shield className="text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" size={20} />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">{profile?.branch?.name || 'N/A'}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{profile?.branch?.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-8"
                            >
                                <div className="mb-8 border-b border-slate-100 dark:border-white/10 pb-4">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Update your password and security preferences</p>
                                </div>

                                <div className="max-w-xl">
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative group">
                                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={e => setCurrentPassword(e.target.value)}
                                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/5 outline-none transition-all font-medium text-slate-900 dark:text-white"
                                                    placeholder="Enter current password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={newPassword}
                                                        onChange={e => setNewPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/5 outline-none transition-all font-medium text-slate-900 dark:text-white"
                                                        placeholder="New password"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    Confirm
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={confirmPassword}
                                                        onChange={e => setConfirmPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/20 border-2 border-slate-100 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/5 outline-none transition-all font-medium text-slate-900 dark:text-white"
                                                        placeholder="Confirm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {passwordError && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100"
                                                >
                                                    <AlertCircle size={20} className="shrink-0" />
                                                    <p>{passwordError}</p>
                                                </motion.div>
                                            )}

                                            {passwordSuccess && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center gap-3 text-green-600 text-sm bg-green-50 p-4 rounded-xl border border-green-100"
                                                >
                                                    <div className="bg-green-100 p-1 rounded-full">
                                                        <Check size={16} className="shrink-0" />
                                                    </div>
                                                    <p className="font-semibold">Password updated successfully!</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <Shield size={20} />
                                                        Update Password
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
