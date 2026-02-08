import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Code, Award, FileText,
    Download, Save, ChevronRight, ChevronLeft, Eye, Sparkles,
    Linkedin, Github, Globe, Phone, Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

interface ResumeData {
    full_name: string;
    email: string;
    phone: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    summary: string;
    education: any[];
    skills: string[];
    experience: any[];
    projects: any[];
    certifications: any[];
    achievements: any[];
}

const ResumeBuilder: React.FC = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [resumeData, setResumeData] = useState<ResumeData>({
        full_name: user?.name || '',
        email: user?.email || '',
        phone: '',
        linkedin_url: '',
        github_url: '',
        portfolio_url: '',
        summary: '',
        education: [],
        skills: [],
        experience: [],
        projects: [],
        certifications: [],
        achievements: []
    });
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [resumeId, setResumeId] = useState<number | null>(null);

    // Fetch existing resume on mount
    React.useEffect(() => {
        if (user?.student_id) {
            api.get(`/api/v1/resume/${user.student_id}`)
                .then(res => {
                    setResumeData(res.data);
                    setResumeId(res.data.id);
                })
                .catch(err => {
                    // 404 is fine, means no resume yet
                    if (err.response?.status !== 404) {
                        console.error('Error fetching resume:', err);
                    }
                });
        }
    }, [user]);

    const tabs = [
        { icon: User, label: 'Personal', color: 'text-violet-500' },
        { icon: GraduationCap, label: 'Education', color: 'text-blue-500' },
        { icon: Code, label: 'Skills', color: 'text-green-500' },
        { icon: Briefcase, label: 'Experience', color: 'text-orange-500' },
        { icon: FileText, label: 'Projects', color: 'text-pink-500' },
        { icon: Award, label: 'Extras', color: 'text-indigo-500' },
    ];

    const handleSave = async () => {
        if (!user?.student_id) {
            console.error("No student ID found");
            return;
        }
        setSaving(true);
        try {
            const payload = { ...resumeData, student_id: user.student_id };
            let response;
            if (resumeId) {
                response = await api.put(`/api/v1/resume/${resumeId}`, payload);
            } else {
                response = await api.post('/api/v1/resume/', payload);
                setResumeId(response.data.id);
            }
            console.log('Resume saved:', response.data);
            // Optional: Add toast notification here
        } catch (error) {
            console.error('Error saving resume:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!resumeId) return;
        try {
            const response = await api.get(`/api/v1/resume/${resumeId}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${resumeData.full_name.replace(' ', '_')}_Resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading PDF", error);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-6 scroll-smooth">
            <div className="max-w-7xl mx-auto pb-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-4xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                }`}>
                                <Sparkles className={theme === 'dark' ? 'text-yellow-400' : 'text-amber-500'} size={36} />
                                Resume Builder
                            </h1>
                            <p className={theme === 'dark' ? 'text-slate-300 mt-2' : 'text-slate-600 mt-2'}>
                                Create your professional resume in minutes
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowPreview(!showPreview)}
                                className={`px-6 py-3 backdrop-blur-lg border rounded-xl font-medium flex items-center gap-2 transition-all ${theme === 'dark'
                                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-md'
                                    }`}
                            >
                                <Eye size={20} />
                                {showPreview ? 'Hide' : 'Show'} Preview
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadPDF}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-medium flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                            >
                                <Download size={20} />
                                Download PDF
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className={`${showPreview ? 'col-span-7' : 'col-span-12'} transition-all duration-300`}>
                        {/* Tab Navigation */}
                        <div className={`backdrop-blur-xl border rounded-2xl p-2 mb-6 ${theme === 'dark'
                            ? 'bg-white/5 border-white/10'
                            : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                            <div className="grid grid-cols-6 gap-2">
                                {tabs.map((tab, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveTab(index)}
                                        className={`relative px-4 py-3 rounded-xl flex flex-col items-center gap-2 transition-all ${activeTab === index
                                            ? 'bg-violet-600 text-white shadow-md'
                                            : theme === 'dark'
                                                ? 'text-slate-400 hover:text-white hover:bg-white/5'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            } ${activeTab === index ? '' : tab.color}`}
                                    >
                                        <tab.icon size={24} />
                                        <span className="text-xs font-medium">{tab.label}</span>
                                        {activeTab === index && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white/10 rounded-xl"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Form Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`backdrop-blur-xl border rounded-2xl p-8 ${theme === 'dark'
                                ? 'bg-white/5 border-white/10'
                                : 'bg-white border-slate-200 shadow-sm'
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {activeTab === 0 && <PersonalInfoTab data={resumeData} setData={setResumeData} theme={theme} />}
                                {activeTab === 1 && <EducationTab theme={theme} />}
                                {activeTab === 2 && <SkillsTab theme={theme} />}
                                {activeTab === 3 && <ExperienceTab theme={theme} />}
                                {activeTab === 4 && <ProjectsTab theme={theme} />}
                                {activeTab === 5 && <ExtrasTab theme={theme} />}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className={`flex justify-between mt-8 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'
                                }`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                                    disabled={activeTab === 0}
                                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${theme === 'dark'
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                    Previous
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-3 bg-violet-600 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Progress
                                        </>
                                    )}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
                                    disabled={activeTab === tabs.length - 1}
                                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${theme === 'dark'
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                        }`}
                                >
                                    Next
                                    <ChevronRight size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Preview Panel */}
                    <AnimatePresence>
                        {showPreview && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="col-span-5"
                            >
                                <div className={`sticky top-6 rounded-2xl p-8 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto border ${theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                                    : 'bg-white border-slate-200 text-slate-600'
                                    }`}>
                                    <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Live Preview</h3>
                                    <ResumePreview data={resumeData} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Individual Tab Components
const PersonalInfoTab: React.FC<{ data: ResumeData; setData: React.Dispatch<React.SetStateAction<ResumeData>>; theme: string }> = ({ data, setData, theme }) => (
    <div className="space-y-6">
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-6">
            <FormInput label="Full Name" icon={User} value={data.full_name} onChange={(e) => setData({ ...data, full_name: e.target.value })} theme={theme} />
            <FormInput label="Email" icon={Mail} type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} theme={theme} />
            <FormInput label="Phone" icon={Phone} value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} theme={theme} />
            <FormInput label="LinkedIn URL" icon={Linkedin} value={data.linkedin_url} onChange={(e) => setData({ ...data, linkedin_url: e.target.value })} theme={theme} />
            <FormInput label="GitHub URL" icon={Github} value={data.github_url} onChange={(e) => setData({ ...data, github_url: e.target.value })} theme={theme} />
            <FormInput label="Portfolio URL" icon={Globe} value={data.portfolio_url} onChange={(e) => setData({ ...data, portfolio_url: e.target.value })} theme={theme} />
        </div>

        <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Professional Summary
            </label>
            <textarea
                value={data.summary}
                onChange={(e) => setData({ ...data, summary: e.target.value })}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl transition-all resize-none ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
                    }`}
                placeholder="Brief description of your professional background and career objectives..."
            />
        </div>
    </div>
);

const FormInput: React.FC<{ label: string; icon: any; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; theme: string }> = ({ label, icon: Icon, value, onChange, type = "text", theme }) => (
    <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            {label}
        </label>
        <div className="relative">
            <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`} size={20} />
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100'
                    }`}
                placeholder={`Enter ${label.toLowerCase()}...`}
            />
        </div>
    </div>
);

// Placeholder tabs
const EducationTab: React.FC<{ theme: string }> = ({ theme }) => (
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
        <GraduationCap className="mx-auto mb-4 text-blue-500" size={48} />
        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Education Section</h3>
        <p>Add your educational background, degrees, and certifications.</p>
    </div>
);

const SkillsTab: React.FC<{ theme: string }> = ({ theme }) => (
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
        <Code className="mx-auto mb-4 text-green-500" size={48} />
        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Skills Section</h3>
        <p>List your technical skills, soft skills, and competencies.</p>
    </div>
);

const ExperienceTab: React.FC<{ theme: string }> = ({ theme }) => (
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
        <Briefcase className="mx-auto mb-4 text-orange-500" size={48} />
        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Experience Section</h3>
        <p>Add your work experience, internships, and professional roles.</p>
    </div>
);

const ProjectsTab: React.FC<{ theme: string }> = ({ theme }) => (
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
        <FileText className="mx-auto mb-4 text-pink-500" size={48} />
        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Projects Section</h3>
        <p>Showcase your academic and personal projects.</p>
    </div>
);

const ExtrasTab: React.FC<{ theme: string }> = ({ theme }) => (
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
        <Award className="mx-auto mb-4 text-indigo-500" size={48} />
        <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Extras Section</h3>
        <p>Add certifications, achievements, awards, and honors.</p>
    </div>
);

const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => (
    <div className="space-y-6 text-slate-700">
        <div className="border-b border-slate-200 pb-4">
            <h1 className="text-3xl font-bold text-slate-900">{data.full_name || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>• {data.phone}</span>}
            </div>
        </div>
        {data.summary && (
            <div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">Summary</h3>
                <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
        )}
    </div>
);

export default ResumeBuilder;
