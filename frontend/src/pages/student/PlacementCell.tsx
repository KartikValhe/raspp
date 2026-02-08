import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, MapPin, CheckCircle2, XCircle, Search, Upload, Clock, ChevronRight } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

interface Job {
    id: number;
    company: string;
    role: string;
    location: string;
    package: string;
    description: string;
    minCgpa: number;
    maxBacklogs: number;
    deadline: string;
    type: 'Full Time' | 'Internship';
    logoColor: string;
}

export const PlacementCell: React.FC = () => {
    // const { user } = useAuth(); // Unused for now as we mock the profile
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'All' | 'Eligible' | 'Applied'>('All');

    // Mock Student Profile for Eligibility Check
    const studentProfile = {
        cgpa: 8.25,
        backlogs: 0,
        branch: 'CSE'
    };

    const jobs: Job[] = [
        {
            id: 1,
            company: "Google",
            role: "Software Engineer - Early Career",
            location: "Bangalore, India",
            package: "28 LPA",
            description: "Join our Core Systems team to build scalable infrastructure.",
            minCgpa: 8.5,
            maxBacklogs: 0,
            deadline: "2 Days Left",
            type: "Full Time",
            logoColor: "bg-red-500"
        },
        {
            id: 2,
            company: "Microsoft",
            role: "SDE I",
            location: "Hyderabad, India",
            package: "45 LPA",
            description: "Work on Azure Cloud services and AI integration.",
            minCgpa: 7.5,
            maxBacklogs: 0,
            deadline: "Apply Now",
            type: "Full Time",
            logoColor: "bg-blue-500"
        },
        {
            id: 3,
            company: "Razorpay",
            role: "Frontend Engineer Intern",
            location: "Remote / Bangalore",
            package: "40k/mo",
            description: "Build pixel-perfect payment experiences.",
            minCgpa: 7.0,
            maxBacklogs: 1,
            deadline: "1 Week Left",
            type: "Internship",
            logoColor: "bg-indigo-500"
        },
        {
            id: 4,
            company: "Deloitte",
            role: "Technology Analyst",
            location: "Mumbai",
            package: "8 LPA",
            description: "Consulting and digital transformation projects.",
            minCgpa: 6.5,
            maxBacklogs: 0,
            deadline: "Closing Soon",
            type: "Full Time",
            logoColor: "bg-green-500"
        }
    ];

    const isEligible = (job: Job) => {
        if (studentProfile.cgpa < job.minCgpa) return { eligible: false, reason: `Requires ${job.minCgpa} CGPA` };
        if (studentProfile.backlogs > job.maxBacklogs) return { eligible: false, reason: `Max ${job.maxBacklogs} Backlogs` };
        return { eligible: true, reason: 'You are Eligible' };
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.role.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'Eligible') return matchesSearch && isEligible(job).eligible;
        return matchesSearch;
    });

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Briefcase size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Placement Cell</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your job applications and eligibility.</p>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-900 border border-white/10 p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Briefcase size={200} className="text-white" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-bold text-white mb-4">Launch Your Career 🚀</h1>
                    <p className="text-indigo-200 text-lg mb-8">
                        Explore exclusive opportunities from top companies. Your profile is automatically matched for eligibility.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <h3 className="text-3xl font-bold text-white">12</h3>
                            <p className="text-indigo-300 text-sm">Active Drives</p>
                        </div>
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <h3 className="text-3xl font-bold text-white">8.5 LPA</h3>
                            <p className="text-indigo-300 text-sm">Avg Package</p>
                        </div>
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <h3 className="text-3xl font-bold text-white">82%</h3>
                            <p className="text-indigo-300 text-sm">Placement Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Job Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl backdrop-blur-sm shadow-sm dark:shadow-none">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search companies or roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                            {['All', 'Eligible', 'Applied'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === f
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {f} Jobs
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Cards */}
                    <motion.div layout className="grid gap-4">
                        <AnimatePresence>
                            {filteredJobs.map((job) => {
                                const eligibility = isEligible(job);
                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={job.id}
                                        className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 shadow-sm dark:shadow-none"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Company Logo */}
                                            <div className={`w-16 h-16 rounded-xl ${job.logoColor} flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-black/20 shrink-0`}>
                                                {job.company[0]}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">{job.role}</h3>
                                                        <p className="text-gray-400 font-medium flex items-center gap-2">
                                                            <Building2 size={14} /> {job.company}
                                                            <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                                                            <span className="text-gray-500 text-sm">{job.type}</span>
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-emerald-400 font-bold text-lg">{job.package}</span>
                                                        <span className="text-xs text-gray-500">{job.deadline}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                                        <MapPin size={14} className="text-indigo-400" /> {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                                        <CheckCircle2 size={14} className="text-indigo-400" /> &gt; {job.minCgpa} CGPA
                                                    </span>
                                                </div>

                                                <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-white/10 pt-4">
                                                    {/* Eligibility Badge */}
                                                    <div className={`flex items-center gap-2 text-sm font-medium ${eligibility.eligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {eligibility.eligible ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                        {eligibility.reason}
                                                    </div>

                                                    <button
                                                        disabled={!eligibility.eligible}
                                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${eligibility.eligible
                                                            ? 'bg-indigo-600 dark:bg-white text-white dark:text-indigo-900 hover:bg-indigo-700 dark:hover:bg-indigo-50 hover:scale-105 shadow-lg shadow-indigo-500/20'
                                                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {eligibility.eligible ? 'Apply Now' : 'Not Eligible'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <Search size={48} className="text-gray-600 mx-auto mb-4" />
                            <h3 className="text-white font-bold text-lg">No Jobs Found</h3>
                            <p className="text-gray-500">Try adjusting your valid filters.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Application Tracker */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm dark:shadow-none">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-indigo-400" />
                            Recent Applications
                        </h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-3 items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs ring-1 ring-orange-500/40">
                                        AZ
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-gray-900 dark:text-white text-sm font-medium truncate">Amazon Inc.</h4>
                                        <p className="text-gray-500 text-xs truncate">SDE Intern • Applied 2d ago</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold text-indigo-500 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-200 uppercase tracking-wider border-t border-gray-200 dark:border-white/10 transition-colors">
                            View All History
                        </button>
                    </div>

                    {/* Resume Upload */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
                        <h3 className="text-white font-bold mb-2">My Resume</h3>
                        <p className="text-gray-400 text-xs mb-4">Last updated: 24 Oct 2024</p>

                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                            <Upload size={24} className="text-gray-400 mx-auto mb-2 group-hover:text-indigo-400 transition-colors" />
                            <p className="text-indigo-400 text-sm font-bold">Update Resume</p>
                            <p className="text-gray-500 text-[10px] mt-1">PDF, DOCX up to 5MB</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
