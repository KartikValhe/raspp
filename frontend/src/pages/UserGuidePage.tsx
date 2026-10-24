import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Search, GraduationCap, Users, Briefcase, ShieldCheck,
    CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Printer,
    FileText, Trophy, Clock, Brain, Target, Sparkles, AlertTriangle,
    Layers, Award, Lightbulb, Lock, ArrowRight, Laptop, Moon, Sun, MessageSquare
} from 'lucide-react';

type RoleCategory = 'all' | 'student' | 'teacher' | 'admin' | 'placement' | 'superadmin' | 'faq';

interface GuideItem {
    id: string;
    category: 'student' | 'teacher' | 'admin' | 'placement' | 'superadmin' | 'faq';
    title: string;
    summary: string;
    badge: string;
    icon: any;
    color: string;
    steps: { number: number; text: string; detail?: string }[];
    tip?: string;
    note?: string;
}

interface FaqItem {
    question: string;
    answer: string;
    category: string;
}

export const UserGuidePage: React.FC = () => {
    const { user } = useAuth();

    // Auto-detect role to present the most relevant tab initially
    const initialCategory = useMemo<RoleCategory>(() => {
        if (user?.role === 'student') return 'student';
        if (user?.role === 'teacher') return 'teacher';
        if (user?.role === 'admin') return 'admin';
        if (user?.role === 'placement_coordinator') return 'placement';
        if (user?.role === 'superadmin') return 'superadmin';
        return 'all';
    }, [user?.role]);

    const [selectedCategory, setSelectedCategory] = useState<RoleCategory>(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Guide Items organized by role
    const guideItems: GuideItem[] = [
        // ── STUDENT GUIDES ──
        {
            id: 'student-results',
            category: 'student',
            title: 'Checking Your Exam Marks & SGPA / CGPA',
            summary: 'Learn how to view your latest semester grades, subject breakdowns, and overall academic standing.',
            badge: 'Student Portal',
            icon: Trophy,
            color: 'from-amber-500 to-yellow-500',
            steps: [
                {
                    number: 1,
                    text: 'Open Performance or Results from the left menu',
                    detail: 'On mobile, tap the top-left menu icon (☰) to open the sidebar, then select "Performance".'
                },
                {
                    number: 2,
                    text: 'Select your Semester',
                    detail: 'Choose the semester you wish to review from the dropdown menu to see all enrolled subjects.'
                },
                {
                    number: 3,
                    text: 'Review SGPA and Subject Grades',
                    detail: 'Each subject displays your Internal Marks, External Exam Score, Total Percentage, and Letter Grade.'
                }
            ],
            tip: 'SGPA is your Grade Point Average for one single semester, while CGPA is your cumulative average across your entire degree.'
        },
        {
            id: 'student-transcript',
            category: 'student',
            title: 'Generating an Official PDF Transcript',
            summary: 'Generate and download an official, print-ready university transcript for scholarship or job applications.',
            badge: 'Student Portal',
            icon: FileText,
            color: 'from-blue-500 to-indigo-500',
            steps: [
                {
                    number: 1,
                    text: 'Navigate to Transcript in the sidebar',
                    detail: 'Click "Transcript" under your student menu.'
                },
                {
                    number: 2,
                    text: 'Verify your Academic Information',
                    detail: 'Ensure your Roll Number, Branch Name, and Completed Semesters are correct on the digital preview.'
                },
                {
                    number: 3,
                    text: 'Click "Print / Download PDF"',
                    detail: 'The system formats a clean, verified transcript document ready for physical printing or saving as a PDF file.'
                }
            ],
            tip: 'The downloaded transcript includes university-standard grading scales, credits earned, and official verification signatures.'
        },
        {
            id: 'student-resume',
            category: 'student',
            title: 'Building a Clean Resume in Minutes',
            summary: 'Create an ATS-friendly, professional resume with your verified academic scores pre-filled automatically.',
            badge: 'Student Portal',
            icon: Award,
            color: 'from-purple-500 to-pink-500',
            steps: [
                {
                    number: 1,
                    text: 'Open Resume Builder',
                    detail: 'Click "Resume Builder" from your student navigation menu.'
                },
                {
                    number: 2,
                    text: 'Review Pre-filled Scores & Add Details',
                    detail: 'Your degree and GPA are already filled. Add your technical projects, certifications, internships, and skills.'
                },
                {
                    number: 3,
                    text: 'Download Your PDF Resume',
                    detail: 'Choose your preferred professional styling template and export the document directly as a PDF.'
                }
            ],
            tip: 'No complex graphic design required — the builder creates recruiter-approved, clean layouts designed for campus placement.'
        },
        {
            id: 'student-prediction',
            category: 'student',
            title: 'AI Placement & Success Predictor',
            summary: 'Understand how the built-in AI analyzes your scores and trends to estimate your campus placement readiness.',
            badge: 'AI Feature',
            icon: Brain,
            color: 'from-emerald-500 to-teal-500',
            steps: [
                {
                    number: 1,
                    text: 'Visit My Prediction in the sidebar',
                    detail: 'Click "My Prediction" under the Placement section.'
                },
                {
                    number: 2,
                    text: 'Read Your Placement Readiness Score',
                    detail: 'The AI model calculates your score based on your semester grades, past backlogs, and branch trends.'
                },
                {
                    number: 3,
                    text: 'Follow Personalized Recommendations',
                    detail: 'Read tailored suggestions on which specific subjects, coding skills, or aptitude areas to strengthen to maximize job offers.'
                }
            ],
            note: 'The prediction is an advisory tool to help you prepare early. It does not replace formal campus recruitment interviews.'
        },
        {
            id: 'student-jobs',
            category: 'student',
            title: 'Exploring Campus Jobs & Applying',
            summary: 'Discover upcoming company recruitment drives, check your eligibility criteria, and register with one click.',
            badge: 'Placement',
            icon: Briefcase,
            color: 'from-rose-500 to-red-500',
            steps: [
                {
                    number: 1,
                    text: 'Click Job Listings',
                    detail: 'Find "Job Listings" under the Placement menu in your sidebar.'
                },
                {
                    number: 2,
                    text: 'Check Eligibility & Package Details',
                    detail: 'Each job card shows the company name, annual salary package (LPA), minimum CGPA cutoff, and drive date.'
                },
                {
                    number: 3,
                    text: 'Click Apply',
                    detail: 'If your CGPA meets the company cutoff, click "Apply Now" to register your interest with the placement cell.'
                }
            ]
        },

        // ── TEACHER GUIDES ──
        {
            id: 'teacher-grading',
            category: 'teacher',
            title: 'Grading Hub: Entering Student Marks',
            summary: 'Step-by-step instructions for entering internal tests, lab practicals, and semester exam marks.',
            badge: 'Faculty Suite',
            icon: Trophy,
            color: 'from-blue-600 to-cyan-600',
            steps: [
                {
                    number: 1,
                    text: 'Select Branch, Semester & Subject',
                    detail: 'Open "Grading Hub" from the sidebar and use the dropdown selectors to load your class roster.'
                },
                {
                    number: 2,
                    text: 'Enter Marks in the Interactive Roster',
                    detail: 'Type each student\'s marks into the table. The system automatically computes total percentages and letter grades.'
                },
                {
                    number: 3,
                    text: 'Click Save Marks',
                    detail: 'Click the green "Save Changes" button. Students and administrators will immediately see the updated grade records.'
                }
            ],
            tip: 'You can use the Tab key on your keyboard to quickly jump to the next student without touching your mouse.'
        },
        {
            id: 'teacher-attendance',
            category: 'teacher',
            title: 'Taking Daily Student Attendance',
            summary: 'Quickly mark student presence and monitor students who fall below the mandatory 75% attendance threshold.',
            badge: 'Faculty Suite',
            icon: Clock,
            color: 'from-amber-600 to-orange-600',
            steps: [
                {
                    number: 1,
                    text: 'Open Take Attendance',
                    detail: 'Click "Take Attendance" from the sidebar and select your subject and today\'s lecture date.'
                },
                {
                    number: 2,
                    text: 'Mark Absentees with 1-Click',
                    detail: 'All students are marked Present by default. Simply click on any student who is absent to toggle their status.'
                },
                {
                    number: 3,
                    text: 'Submit Register',
                    detail: 'Click "Submit Attendance". The system automatically updates each student\'s cumulative attendance percentage.'
                }
            ],
            tip: 'Students whose attendance drops below 75% are automatically highlighted in amber/red for easy visual identification.'
        },
        {
            id: 'teacher-ai-alerts',
            category: 'teacher',
            title: 'AI Academic Risk & Early Warning Alerts',
            summary: 'How the AI spots students who are struggling academically so you can intervene with tutoring before finals.',
            badge: 'AI Feature',
            icon: Brain,
            color: 'from-purple-600 to-indigo-600',
            steps: [
                {
                    number: 1,
                    text: 'Open Class Analytics or AI Predictions',
                    detail: 'Click "Class Analytics" in the sidebar.'
                },
                {
                    number: 2,
                    text: 'Review the "At-Risk" Student Section',
                    detail: 'The AI flags students whose recent test scores or attendance suggest they may fail upcoming semester exams.'
                },
                {
                    number: 3,
                    text: 'Take Early Action',
                    detail: 'Use this information to schedule counseling, remedial lectures, or parent discussions early in the term.'
                }
            ]
        },
        {
            id: 'teacher-merit',
            category: 'teacher',
            title: 'Class Merit Lists & Pass Statistics',
            summary: 'View top rankers, class averages, and subject pass rates with instant export to PDF.',
            badge: 'Faculty Suite',
            icon: Award,
            color: 'from-emerald-600 to-green-600',
            steps: [
                {
                    number: 1,
                    text: 'Open Merit List',
                    detail: 'Select "Merit List" from your teacher navigation menu.'
                },
                {
                    number: 2,
                    text: 'Filter by Semester & Subject',
                    detail: 'View students automatically sorted from highest to lowest score with rank badges.'
                },
                {
                    number: 3,
                    text: 'Export Class Report',
                    detail: 'Click "Export as PDF" to generate an official printout for department meetings.'
                }
            ]
        },

        // ── ADMIN GUIDES ──
        {
            id: 'admin-students',
            category: 'admin',
            title: 'Enrolling Students & Bulk Import',
            summary: 'How to register individual students or upload entire batches using a single Excel/CSV spreadsheet.',
            badge: 'Admin Panel',
            icon: GraduationCap,
            color: 'from-blue-600 to-indigo-700',
            steps: [
                {
                    number: 1,
                    text: 'Open Students from the sidebar',
                    detail: 'Click "Students" to see the full college enrollment database.'
                },
                {
                    number: 2,
                    text: 'Add Single Student or Bulk Import',
                    detail: 'Click "+ Add Student" to enter one student manually, or click "Import CSV" to upload a class roster from Excel.'
                },
                {
                    number: 3,
                    text: 'Assign Branch & Semester',
                    detail: 'Specify the student\'s degree program (e.g. Computer Engineering) and current semester so subjects map automatically.'
                }
            ],
            tip: 'When using Excel/CSV import, ensure columns are labeled: Full Name, Email, Student ID, Branch, and Semester.'
        },
        {
            id: 'admin-faculty',
            category: 'admin',
            title: 'Managing Teachers & Department Staff',
            summary: 'Create login accounts for professors, assign academic departments, and manage access credentials.',
            badge: 'Admin Panel',
            icon: Users,
            color: 'from-teal-600 to-cyan-700',
            steps: [
                {
                    number: 1,
                    text: 'Go to Teachers in the sidebar',
                    detail: 'View all active faculty members across all college departments.'
                },
                {
                    number: 2,
                    text: 'Click "+ Add Teacher"',
                    detail: 'Enter the teacher\'s name, official email, department, and initial temporary password.'
                },
                {
                    number: 3,
                    text: 'Share Credentials with Faculty',
                    detail: 'The professor can now log in at the login screen using their email and initial password.'
                }
            ]
        },
        {
            id: 'admin-branches',
            category: 'admin',
            title: 'Managing Branches, Degrees & Subjects',
            summary: 'Configure college departments (CSE, IT, ME, Civil) and map course subjects to each semester.',
            badge: 'Admin Panel',
            icon: Layers,
            color: 'from-violet-600 to-purple-700',
            steps: [
                {
                    number: 1,
                    text: 'Open Manage Branches or Subjects',
                    detail: 'Select "Manage Branches" to add degree codes (e.g., CSE, IT, MECH).'
                },
                {
                    number: 2,
                    text: 'Create New Subjects',
                    detail: 'Click "Subjects" -> "+ Add Subject". Enter the Subject Name, Subject Code, Credit Hours, and Semester.'
                },
                {
                    number: 3,
                    text: 'Subjects appear for Teachers automatically',
                    detail: 'Once a subject is added to a semester, all faculty assigned to that branch will see it in their grading roster.'
                }
            ]
        },

        // ── PLACEMENT COORDINATOR GUIDES ──
        {
            id: 'placement-jobs',
            category: 'placement',
            title: 'Posting Campus Recruitment Drives',
            summary: 'Publish company recruitment openings with salary packages, cutoff criteria, and application deadlines.',
            badge: 'Placement Cell',
            icon: Briefcase,
            color: 'from-pink-600 to-rose-600',
            steps: [
                {
                    number: 1,
                    text: 'Go to Job Management',
                    detail: 'Click "Job Management" in your placement coordinator sidebar.'
                },
                {
                    number: 2,
                    text: 'Click "+ Post New Job"',
                    detail: 'Enter Company Name, Designation, Annual Package (in LPA), Minimum CGPA, and Drive Date.'
                },
                {
                    number: 3,
                    text: 'Publish to Eligible Students',
                    detail: 'The system instantly broadcasts the job card to every student whose CGPA matches or exceeds the cutoff.'
                }
            ]
        },
        {
            id: 'placement-records',
            category: 'placement',
            title: 'Tracking Selected Students & Placement Stats',
            summary: 'Record company offer letters, track students placed, and compute average college salary packages.',
            badge: 'Placement Cell',
            icon: Award,
            color: 'from-amber-600 to-yellow-600',
            steps: [
                {
                    number: 1,
                    text: 'Open Placement Records',
                    detail: 'View all active campus hiring drives and student applications.'
                },
                {
                    number: 2,
                    text: 'Update Selection Status',
                    detail: 'When companies release final offer lists, mark students as "Selected" or "Placed".'
                },
                {
                    number: 3,
                    text: 'View Real-time College Statistics',
                    detail: 'College placement percentage, highest offer, and branch-wise placement numbers update automatically.'
                }
            ]
        },

        // ── SUPERADMIN & SECURITY GUIDES ──
        {
            id: 'superadmin-governance',
            category: 'superadmin',
            title: 'Superadmin Panel & Security Governance',
            summary: 'Understanding the top-level superadmin portal, user creation, and security permissions.',
            badge: 'System Governance',
            icon: ShieldCheck,
            color: 'from-indigo-600 to-violet-700',
            steps: [
                {
                    number: 1,
                    text: 'Accessing the Superadmin Portal',
                    detail: 'Superadmin is located at the secure URL "/superadmin-portal" and requires the secret master verification token.'
                },
                {
                    number: 2,
                    text: 'Managing Admin & Teacher Access',
                    detail: 'Superadmin can create college administrators, reset forgotten staff passwords, and grant or revoke write permissions.'
                },
                {
                    number: 3,
                    text: 'System-Wide Overview',
                    detail: 'Review total user accounts, active logins, role distribution, and demo mode testing accounts at a glance.'
                }
            ]
        },
        {
            id: 'superadmin-demo-mode',
            category: 'superadmin',
            title: 'Understanding "Demo Mode" (View-Only Safety)',
            summary: 'Why public visitors and evaluators are given View-Only access to protect the college database.',
            badge: 'Security Guard',
            icon: Lock,
            color: 'from-amber-600 to-red-600',
            steps: [
                {
                    number: 1,
                    text: 'Demo Users Can Always Log In',
                    detail: 'When write permission is revoked or a Demo Admin is created, the user can still log in and view every dashboard screen.'
                },
                {
                    number: 2,
                    text: 'Database Alteration is Blocked',
                    detail: 'If a demo user tries to add, edit, or delete records, the system security middleware safely blocks the action with a 403 alert.'
                },
                {
                    number: 3,
                    text: 'Permitted Staff Retain Full Access',
                    detail: 'Permitted staff log in with their official separate credentials to perform real additions, grading, and deletions.'
                }
            ],
            note: 'This ensures that anyone visiting your live demo link can explore features freely without any risk of breaking or corrupting college data.'
        }
    ];

    // Frequently Asked Questions
    const faqList: FaqItem[] = [
        {
            category: 'General',
            question: 'How do I switch between Dark and Light display mode?',
            answer: 'Look at the top right of your screen (or inside the sidebar menu). Click the Sun ☀️ icon for Light mode, or the Moon 🌙 icon for Dark mode. The system remembers your preference automatically.'
        },
        {
            category: 'General',
            question: 'Can I use this portal on my smartphone or tablet?',
            answer: 'Yes! RASPP is fully responsive on mobile devices and iPads. On phones, tap the ☰ menu icon at the top-left corner of your screen to open the navigation drawer.'
        },
        {
            category: 'Security',
            question: 'Why do I see a yellow "Demo Mode (View-Only)" banner at the top?',
            answer: 'This indicates you are logged into a public testing or demonstration account. You can explore all charts, analytics, and records freely, but creating, editing, or deleting live data is disabled to keep the database safe.'
        },
        {
            category: 'Students',
            question: 'How do I download or print my official transcript?',
            answer: 'Click "Transcript" in your sidebar menu, then click the blue "Download Official PDF" button. A formatted, clean report card will be generated for instant saving or printing.'
        },
        {
            category: 'Faculty',
            question: 'What happens if my internet disconnects while I am entering marks?',
            answer: 'Always click the green "Save Marks" button periodically while grading. If you temporarily lose connection, the system will notify you with a clear connection alert so no work is lost.'
        },
        {
            category: 'AI Assistant',
            question: 'Where can I ask questions if I need help finding something?',
            answer: 'Click the floating blue circular AI Chatbot bubble in the bottom-right corner of any page. You can ask anything in simple plain English (e.g., "Where are my semester results?", "How do I take attendance?") and get an instant answer!'
        },
        {
            category: 'Accounts',
            question: 'What should I do if a student or teacher forgets their password?',
            answer: 'College administrators can open the student or teacher profile and click "Reset Password" to generate a new initial password immediately.'
        }
    ];

    // Filter guide items by search query and category
    const filteredGuideItems = useMemo(() => {
        return guideItems.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            if (!matchesCategory) return false;

            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const inTitle = item.title.toLowerCase().includes(query);
            const inSummary = item.summary.toLowerCase().includes(query);
            const inBadge = item.badge.toLowerCase().includes(query);
            const inSteps = item.steps.some(s => s.text.toLowerCase().includes(query) || (s.detail && s.detail.toLowerCase().includes(query)));

            return inTitle || inSummary || inBadge || inSteps;
        });
    }, [selectedCategory, searchQuery]);

    // Filter FAQs by search query
    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return faqList;
        const q = searchQuery.toLowerCase();
        return faqList.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }, [searchQuery]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            {/* ── Top Header Hero Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-primary-900 to-slate-900 p-6 sm:p-10 text-white shadow-2xl border border-white/10"
            >
                {/* Decorative background glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide text-primary-200">
                            <BookOpen size={14} className="text-primary-300" />
                            <span>Official User Manual & Simple Guide</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            RASPP System User Guide
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Clear, step-by-step instructions designed for students, teachers, administrators, and placement teams without technical jargon.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all border border-white/15 backdrop-blur-md shadow-sm"
                            title="Print or save this guide as PDF"
                        >
                            <Printer size={16} />
                            <span>Print Guide / Save PDF</span>
                        </button>
                    </div>
                </div>

                {/* Live Search Bar */}
                <div className="mt-8 relative max-w-2xl">
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 text-slate-400 pointer-events-none" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type what you want to do (e.g. 'check marks', 'take attendance', 'print transcript', 'demo mode')..."
                            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/15 dark:bg-black/30 backdrop-blur-md text-white placeholder-slate-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm shadow-inner transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white"
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── 3-Step Quick Start Visual Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    whileHover={{ y: -3 }}
                    className="glass-card p-5 border border-slate-200 dark:border-white/10 rounded-2xl relative overflow-hidden bg-white/60 dark:bg-surface-900/60"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/20">
                            1
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Choose Your Portal</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Login with your assigned role</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Sign in using your institutional email. The portal automatically opens your dedicated view (Student Hub, Faculty Suite, or Admin Suite).
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -3 }}
                    className="glass-card p-5 border border-slate-200 dark:border-white/10 rounded-2xl relative overflow-hidden bg-white/60 dark:bg-surface-900/60"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20">
                            2
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Use the Left Menu</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Everything is 1-click away</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Every tool — from entering marks and checking attendance to viewing AI job predictions — is neatly organized on your left sidebar menu.
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -3 }}
                    className="glass-card p-5 border border-slate-200 dark:border-white/10 rounded-2xl relative overflow-hidden bg-white/60 dark:bg-surface-900/60"
                >
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base border border-purple-500/20">
                            3
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Assistant On-Demand</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">24/7 instant guidance</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Have a question? Click the floating blue chat bubble in the bottom right corner anytime to ask anything in natural, everyday language.
                    </p>
                </motion.div>
            </div>

            {/* ── Role Filter Pills ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'all'
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <Layers size={15} />
                    <span>All Guides ({guideItems.length})</span>
                </button>

                <button
                    onClick={() => setSelectedCategory('student')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'student'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <GraduationCap size={15} />
                    <span>Student Hub</span>
                </button>

                <button
                    onClick={() => setSelectedCategory('teacher')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'teacher'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <Users size={15} />
                    <span>Faculty & Teachers</span>
                </button>

                <button
                    onClick={() => setSelectedCategory('admin')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'admin'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <ShieldCheck size={15} />
                    <span>College Admin</span>
                </button>

                <button
                    onClick={() => setSelectedCategory('placement')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'placement'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <Briefcase size={15} />
                    <span>Placement Cell</span>
                </button>

                <button
                    onClick={() => setSelectedCategory('superadmin')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'superadmin'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <Lock size={15} />
                    <span>Superadmin & Demo Mode</span>
                </button>

                <button
                    onClick={() => setSelectedCategory('faq')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        selectedCategory === 'faq'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                >
                    <HelpCircle size={15} />
                    <span>Frequently Asked Questions</span>
                </button>
            </div>

            {/* ── Main Walkthrough Cards ── */}
            {selectedCategory !== 'faq' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Step-by-Step Instructions</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                {filteredGuideItems.length} topics
                            </span>
                        </h2>
                    </div>

                    {filteredGuideItems.length === 0 ? (
                        <div className="glass-card p-12 text-center rounded-2xl border border-slate-200 dark:border-white/10">
                            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">No guide articles match your search</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                Try searching for simpler terms like "marks", "attendance", "transcript", or select "All Guides".
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                className="mt-4 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold"
                            >
                                Reset Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredGuideItems.map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, delay: idx * 0.05 }}
                                        className="card p-6 flex flex-col justify-between border border-slate-200 dark:border-white/[0.08] hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all rounded-3xl bg-white dark:bg-surface-900/80 shadow-card"
                                    >
                                        <div className="space-y-4">
                                            {/* Item Header */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                                                        <IconComponent size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                                            {item.badge}
                                                        </span>
                                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {item.summary}
                                            </p>

                                            {/* Steps List */}
                                            <div className="space-y-3 pt-2">
                                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                    How to do it:
                                                </p>
                                                {item.steps.map((step) => (
                                                    <div key={step.number} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                                                        <div className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                            {step.number}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                                {step.text}
                                                            </p>
                                                            {step.detail && (
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                                                    {step.detail}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Pro Tip or Note Callout */}
                                            {item.tip && (
                                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs mt-3">
                                                    <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                                    <span><strong>Helpful Tip:</strong> {item.tip}</span>
                                                </div>
                                            )}

                                            {item.note && (
                                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 dark:text-indigo-300 text-xs mt-3">
                                                    <Sparkles size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                                                    <span><strong>Good to know:</strong> {item.note}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Frequently Asked Questions (FAQ) Section ── */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <HelpCircle size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            Frequently Asked Questions (FAQ)
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Quick answers to common questions for non-technical users
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden bg-white/70 dark:bg-white/[0.03] transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors"
                                >
                                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
                                        <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                                        {faq.question}
                                    </span>
                                    <span className="p-1 rounded-lg text-slate-400">
                                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/[0.04] leading-relaxed bg-slate-50/50 dark:bg-white/[0.01]"
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Need More Help / AI Assistance Banner ── */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-primary-600/10 via-primary-500/15 to-accent-600/10 border border-primary-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0">
                        <MessageSquare size={22} />
                    </div>
                    <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            Still have questions? Chat with our AI Assistant!
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            The intelligent chatbot understands regular English questions. Click the blue bubble in the bottom right corner of your screen anytime.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        AI Online & Ready
                    </span>
                </div>
            </div>
        </div>
    );
};
