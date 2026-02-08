import React, { useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { QrCode, Wifi, Share2, Download, ShieldCheck, Mail, Phone, MapPin, Calendar, IdCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfile: React.FC = () => {
    const { user } = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);

    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState<any>(null);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                // If we have a user context with student ID we could use that,
                // but checking the backend standard, we likely have a "me" endpoint or query by email.
                // I just added /me endpoint to students.py, so let's use it.
                // Assuming api.get('/api/v1/students/me') works now.
                const response = await api.get('/api/v1/students/me');
                setStudentData(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!studentData) {
        return <div className="h-full flex items-center justify-center">Student profile not found. Please contact admin.</div>;
    }

    // Map API data to UI structure
    const student = {
        name: studentData.full_name,
        usn: studentData.student_id,
        branch: studentData.branch?.name || "Engineering",
        batch: `Sem ${studentData.current_semester}`, // Simplification for now
        dob: "01 Jan 2004", // Placeholder as DOB might not be in DB yet
        bloodGroup: "O+", // Placeholder
        validity: "July 2026",
        email: studentData.email || user?.email,
        phone: "+91 98765 43210", // Placeholder
        address: "University Campus" // Placeholder
    };

    return (
        <div className="h-full overflow-y-auto p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <IdCard size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Digital ID</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Use this digital card for library access and campus entry.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* ID Card Section - 3D Flip Effect */}
                    <div className="perspective-1000">
                        <motion.div
                            className="relative w-full aspect-[1.586/1] cursor-pointer preserve-3d transition-all duration-700"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            onClick={() => setIsFlipped(!isFlipped)}
                            style={{ transformStyle: 'preserve-3d' }}
                            whileHover={{ scale: 1.02 }}
                        >
                            {/* FRONT of Card */}
                            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl backface-hidden border border-white/20" style={{ backfaceVisibility: 'hidden' }}>
                                {/* Background & Holo Effect */}
                                <div className="absolute inset-0 bg-slate-900">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-slate-900" />
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

                                    {/* Holographic Wave */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent blur-xl transform rotate-45 translate-x-[-50%] animate-pulse" />

                                    {/* Decorative Circles */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl opacity-50" />
                                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl opacity-50" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-white/90">
                                            <div className="p-1.5 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md shadow-inner">
                                                <ShieldCheck size={24} className="text-emerald-400 drop-shadow-md" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold tracking-widest uppercase block opacity-70">Official ID</span>
                                                <span className="text-sm font-bold tracking-wide">STUDENT</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h2 className="text-white font-black text-xl leading-none tracking-tight">RASPP</h2>
                                            <p className="text-[9px] text-white/60 tracking-[0.2em] uppercase mt-0.5">University</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-2">
                                        <div className="relative w-28 h-32 rounded-xl bg-slate-800 p-1 shadow-xl ring-1 ring-white/10 flex-shrink-0">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                                alt="Profile"
                                                className="w-full h-full rounded-lg object-cover bg-gradient-to-b from-gray-700 to-gray-800"
                                            />
                                            <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none border border-white/5"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-2xl font-bold text-white mb-0.5 truncate drop-shadow-sm">{student.name}</h3>
                                            <p className="text-indigo-200 font-mono text-sm tracking-wide bg-indigo-500/20 px-2 py-0.5 rounded inline-block border border-indigo-500/20">{student.usn}</p>

                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                                                <div>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-wider">Branch</p>
                                                    <p className="text-xs font-semibold text-white/90 truncate">{student.branch}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-wider">Batch</p>
                                                    <p className="text-xs font-semibold text-white/90">{student.batch}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-wider">DOB</p>
                                                    <p className="text-xs font-semibold text-white/90">{student.dob}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-wider">Blood Group</p>
                                                    <p className="text-xs font-semibold text-white/90 text-red-300">{student.bloodGroup}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
                                        <div className="w-1/2">
                                            {/* Barcode Mockup */}
                                            <div className="h-6 w-full opacity-80 flex items-end gap-[1px]">
                                                {[...Array(30)].map((_, i) => (
                                                    <div key={i} className={`bg-white h-[${Math.random() > 0.5 ? '100%' : '60%'}] w-full rounded-sm`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-white/40 uppercase tracking-wider mb-0.5">Valid Thru</p>
                                            <p className="text-sm font-bold text-emerald-300">{student.validity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BACK of Card */}
                            <div
                                className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl backface-hidden border border-white/20"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-950 to-slate-950" />
                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                <div className="relative z-10 h-full flex flex-col">
                                    {/* Magnetic Strip */}
                                    <div className="h-12 w-full bg-gray-900 mt-6 border-y border-white/5" />

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div className="flex items-start gap-6">
                                            <div className="w-2/3">
                                                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Authorization Signature</p>
                                                <div className="h-10 bg-white/10 rounded-lg border border-white/5 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg')] bg-contain bg-no-repeat bg-center opacity-50 invert" />
                                                </div>
                                                <p className="text-[9px] text-white/30 leading-relaxed mt-2">
                                                    This card is the property of RASPP University. If found, please return to the administrative office or call +91 12345 67890.
                                                </p>
                                            </div>
                                            <div className="w-1/3 flex flex-col items-center">
                                                <div className="bg-white p-2 rounded-xl shadow-lg">
                                                    <QrCode size={80} className="text-slate-900" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center border-t border-white/10 pt-2">
                                            <p className="text-[10px] text-emerald-400/80 font-mono tracking-widest uppercase">Verified Secure ID</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                            <Wifi size={14} className="animate-pulse text-indigo-500" />
                            Click card to flip
                        </p>
                    </div>

                    {/* Personal Details & Actions */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Email Address</p>
                                        <p className="text-gray-900 dark:text-gray-200">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Phone Number</p>
                                        <p className="text-gray-900 dark:text-gray-200">{student.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Address</p>
                                        <p className="text-gray-900 dark:text-gray-200">{student.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Date of Birth</p>
                                        <p className="text-gray-900 dark:text-gray-200">{student.dob}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-3 bg-indigo-600 dark:bg-white text-white dark:text-indigo-900 font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-lg dark:shadow-none">
                                <Download size={18} />
                                Download ID
                            </button>
                            <button className="flex-1 py-3 bg-white dark:bg-white/5 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2">
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
