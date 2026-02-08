import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Clock, Banknote, Filter, Search, Globe, Building2 } from 'lucide-react';

interface Internship {
    id: number;
    company: string;
    role: string;
    location: string;
    stipend: string; // e.g., "15,000/mo" or "Unpaid"
    duration: string;
    type: 'Remote' | 'On-site' | 'Hybrid';
    isPaid: boolean;
    ppoAvailable: boolean;
    logoColor: string;
    deadline: string;
}

export const InternshipCell: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [stipendFilter, setStipendFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
    const [modeFilter, setModeFilter] = useState<'All' | 'Remote' | 'On-site' | 'Hybrid'>('All');

    const internships: Internship[] = [
        {
            id: 1,
            company: "Swiggy",
            role: "Product Design Intern",
            location: "Bangalore",
            stipend: "₹25,000/mo",
            duration: "6 Months",
            type: "On-site",
            isPaid: true,
            ppoAvailable: true,
            logoColor: "bg-orange-500",
            deadline: "3 Days Left"
        },
        {
            id: 2,
            company: "TechCorp Startups",
            role: "React Developer",
            location: "Remote",
            stipend: "₹10,000/mo",
            duration: "3 Months",
            type: "Remote",
            isPaid: true,
            ppoAvailable: false,
            logoColor: "bg-blue-500",
            deadline: "Apply Now"
        },
        {
            id: 3,
            company: "NGO Connect",
            role: "Social Media Volunteer",
            location: "Remote",
            stipend: "Unpaid",
            duration: "1 Month",
            type: "Remote",
            isPaid: false,
            ppoAvailable: false,
            logoColor: "bg-green-500",
            deadline: "1 Week Left"
        },
        {
            id: 4,
            company: "Zoho",
            role: "Software Intern",
            location: "Chennai",
            stipend: "₹18,000/mo",
            duration: "6 Months",
            type: "On-site",
            isPaid: true,
            ppoAvailable: true,
            logoColor: "bg-yellow-500",
            deadline: "Closing Soon"
        },
        {
            id: 5,
            company: "Creative Studios",
            role: "Graphic Design Intern",
            location: "Mumbai (Hybrid)",
            stipend: "₹8,000/mo",
            duration: "3 Months",
            type: "Hybrid",
            isPaid: true,
            ppoAvailable: false,
            logoColor: "bg-purple-500",
            deadline: "5 Days Left"
        }
    ];

    const filteredInternships = internships.filter(item => {
        const matchesSearch = item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStipend = stipendFilter === 'All'
            ? true
            : stipendFilter === 'Paid' ? item.isPaid : !item.isPaid;
        const matchesMode = modeFilter === 'All' ? true : item.type === modeFilter;

        return matchesSearch && matchesStipend && matchesMode;
    });

    return (
        <div className="h-full overflow-y-auto p-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
                    <Rocket size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Internship Portal</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Find and apply for student internships.</p>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/10 p-8 md:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-20">
                    <Rocket size={200} className="text-white transform rotate-12" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        Kickstart Your Experience 🚀
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-100 text-lg mb-8"
                    >
                        Find internships that match your skills. Filter by stipend, remote work, or PPO opportunities.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-4"
                    >
                        <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/30 transition-colors">
                            <h3 className="text-3xl font-bold text-white">45+</h3>
                            <p className="text-indigo-100 text-sm">Open Roles</p>
                        </div>
                        <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/30 transition-colors">
                            <h3 className="text-3xl font-bold text-white">₹15k</h3>
                            <p className="text-indigo-100 text-sm">Avg Stipend</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar - Keeping functionality but tweaking style if needed (omitted for brevity unless changes needed) */}
                {/* ... (sidebar code remains similar unless I explicit replace it, but I'll focus on cards mainly) ... */}

                {/* Wait, I can't skip lines in replace_file_content if I want to match smoothly. 
                   I will need to be careful with the Start/End lines. 
                   The previous block was lines 106-127 for Hero.
                   I will target the Cards Loop for the second change. 
                */}

                {/* Filters Sidebar */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm sticky top-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Filter size={18} className="text-indigo-500" />
                            Smart Filters
                        </h3>

                        {/* Stipend Filter */}
                        <div className="mb-6">
                            <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 block">Stipend</label>
                            <div className="space-y-2">
                                {['All', 'Paid', 'Unpaid'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setStipendFilter(opt as any)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${stipendFilter === opt
                                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mode Filter */}
                        <div>
                            <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 block">Work Mode</label>
                            <div className="space-y-2">
                                {['All', 'Remote', 'On-site', 'Hybrid'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setModeFilter(opt as any)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${modeFilter === opt
                                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search for roles, companies, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm group-hover:shadow-md"
                        />
                    </div>

                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <AnimatePresence>
                            {filteredInternships.map((internship) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={internship.id}
                                    className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-full -mr-8 -mt-8 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className={`w-12 h-12 rounded-xl ${internship.logoColor} flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform`}>
                                            {internship.company[0]}
                                        </div>
                                        {internship.ppoAvailable && (
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                                                <Rocket size={10} /> PPO
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors relative z-10">{internship.role}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 relative z-10">{internship.company}</p>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 dark:text-slate-300 mb-6 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <Banknote size={16} className="text-emerald-500" />
                                            <span>{internship.stipend}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-500" />
                                            <span>{internship.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 col-span-2">
                                            {internship.type === 'Remote' ? <Globe size={16} className="text-indigo-500" /> : <Building2 size={16} className="text-indigo-500" />}
                                            <span>{internship.type} • {internship.location}</span>
                                        </div>
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-indigo-600 dark:hover:bg-indigo-50 text-white dark:text-slate-900 font-bold text-sm transition-all shadow-md hover:shadow-lg relative z-10 flex items-center justify-center gap-2">
                                        Apply Now <Rocket size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredInternships.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <Filter size={48} className="text-gray-600 mx-auto mb-4" />
                            <h3 className="text-white font-bold text-lg">No Internships Found</h3>
                            <p className="text-gray-500">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
