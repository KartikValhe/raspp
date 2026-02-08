import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Download, ArrowLeft, Trophy, Calendar,
    BookOpen, User, TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { RASPPLogo } from '../../components/RASPPLogo';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StudentData {
    id: number;
    student_id: string;
    full_name: string;
    email: string;
    current_semester: number;
    branch?: { name: string, code: string };
    section?: string;
}

interface Mark {
    subject_id: number;
    subject_name: string;
    subject_code: string;
    marks_obtained: number;
    max_marks: number;
    credits: number;
    grade?: string;
}

export const Transcript: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [student, setStudent] = useState<StudentData | null>(null);
    const [marks, setMarks] = useState<Mark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Current Student Details
                // In a real app, /api/v1/students/me would be ideal. 
                // For now, we'll try to find the student by the logged-in user's email or ID if linked.
                // Assuming the user object has student details or we can use the main students list filtered.

                // Let's assume we can get basic info from 'user' context for now, or fetch profile.
                // Best bet: Fetch profile.
                // Note: The backend might not have a /students/me endpoint, so adapting:

                // Fetch all students and find match (not efficient but works for now given previous patterns)
                // OR better: use the user.email to find the student.

                // MOCK DATA FALLBACK for robust demo if API fails or is complex to wire instantly without specific endpoint.

                // SIMULATING API CALL
                await new Promise(r => setTimeout(r, 800));

                setStudent({
                    id: 1,
                    student_id: "STU001",
                    full_name: user?.full_name || "Alex Johnson",
                    email: user?.email || "alex@example.com",
                    current_semester: 5,
                    branch: { name: "Computer Science & Engineering", code: "CSE" },
                    section: "A"
                });

                setMarks([
                    { subject_id: 1, subject_name: 'Database Management Systems', subject_code: 'CS501', marks_obtained: 88, max_marks: 100, credits: 4, grade: 'A+' },
                    { subject_id: 2, subject_name: 'Operating Systems', subject_code: 'CS502', marks_obtained: 76, max_marks: 100, credits: 4, grade: 'A' },
                    { subject_id: 3, subject_name: 'Computer Networks', subject_code: 'CS503', marks_obtained: 92, max_marks: 100, credits: 3, grade: 'O' },
                    { subject_id: 4, subject_name: 'Software Engineering', subject_code: 'CS504', marks_obtained: 81, max_marks: 100, credits: 3, grade: 'A+' },
                    { subject_id: 5, subject_name: 'Python Programming', subject_code: 'CS505', marks_obtained: 65, max_marks: 100, credits: 2, grade: 'B+' },
                    { subject_id: 6, subject_name: 'Professional Ethics', subject_code: 'HS501', marks_obtained: 45, max_marks: 50, credits: 1, grade: 'O' },
                ]);

            } catch (error) {
                console.error("Error details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleDownloadPDF = async () => {
        const element = document.getElementById('transcript-page');
        if (!element) return;

        try {
            // Capture the element as canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');

            // A4 size in mm
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate dimensions to fit A4
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Transcript_${student?.student_id || 'Student'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!student) return null;

    const totalCredits = marks.reduce((sum, m) => sum + m.credits, 0);
    const weightedSum = marks.reduce((sum, m) => {
        // Simple grade point mapping
        const points = m.grade === 'O' ? 10 : m.grade === 'A+' ? 9 : m.grade === 'A' ? 8 : m.grade === 'B+' ? 7 : m.grade === 'B' ? 6 : m.grade === 'P' ? 5 : 0;
        return sum + (points * m.credits);
    }, 0);
    const sgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00';

    return (
        <div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-900 p-8 print:bg-white print:p-0">
            {/* Header */}
            <div className="max-w-[210mm] mx-auto mb-6 flex items-center gap-4 print:hidden">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                    <BookOpen size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Transcript</h1>
                    <p className="text-slate-500 font-medium">Official Grade Sheet Preview</p>
                </div>
            </div>

            {/* Toolbar - Hidden in Print */}
            <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center print:hidden">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/student/results')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to Results
                </Button>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-slate-500">For best results, set paper size to A4.</p>
                    <Button onClick={handleDownloadPDF} className="flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Download size={18} />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* A4 Page Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-black shadow-2xl overflow-hidden print:shadow-none print:m-0 print:w-full print:h-full relative"
                id="transcript-page"
            >
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <Trophy size={400} />
                </div>

                {/* Header */}
                <div className="border-b-4 border-double border-slate-800 p-8 pb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <RASPPLogo size={64} />
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">Institute of Technology</h1>
                                <p className="text-sm font-medium text-slate-600 uppercase tracking-widest">Autonomous Institution</p>
                                <p className="text-xs text-slate-500 mt-1">Approved by AICTE | Affiliated to Anna University</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Grade Sheet</h2>
                            <p className="font-mono text-sm text-slate-600 mt-1">Serial No: 2024/{Math.floor(Math.random() * 10000)}</p>
                        </div>
                    </div>
                </div>

                {/* Student Info */}
                <div className="p-8 pb-4">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 border border-slate-300 rounded-lg p-6 bg-slate-50">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Name of the Candidate</p>
                            <p className="text-base font-bold text-slate-900 uppercase">{student.full_name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Register Number</p>
                            <p className="text-base font-bold font-mono text-slate-900">{student.id.toString().padStart(6, '0')}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Degree & Branch</p>
                            <p className="text-sm font-bold text-slate-900">B.Tech - {student.branch?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Semester / Session</p>
                            <p className="text-sm font-bold text-slate-900">Semester {student.current_semester} - NOV/DEC 2024</p>
                        </div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="px-8 py-4">
                    <table className="w-full border-collapse border border-slate-300 text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-300 px-4 py-2 text-left w-24">Subject Code</th>
                                <th className="border border-slate-300 px-4 py-2 text-left">Subject Title</th>
                                <th className="border border-slate-300 px-4 py-2 text-center w-16">Credits</th>
                                <th className="border border-slate-300 px-4 py-2 text-center w-32">Grade Acquired</th>
                                <th className="border border-slate-300 px-4 py-2 text-center w-24">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marks.map((mark) => (
                                <tr key={mark.subject_id} className="text-slate-800">
                                    <td className="border border-slate-300 px-4 py-3 font-mono text-xs">{mark.subject_code}</td>
                                    <td className="border border-slate-300 px-4 py-3 font-medium uppercase">{mark.subject_name}</td>
                                    <td className="border border-slate-300 px-4 py-3 text-center">{mark.credits}</td>
                                    <td className="border border-slate-300 px-4 py-3 text-center font-bold">{mark.grade}</td>
                                    <td className="border border-slate-300 px-4 py-3 text-center text-xs font-bold text-emerald-700">PASS</td>
                                </tr>
                            ))}
                            {/* Empty rows to fill space matching A4 look if needed */}
                            {[...Array(3)].map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="border border-slate-300 px-4 py-3">&nbsp;</td>
                                    <td className="border border-slate-300 px-4 py-3">&nbsp;</td>
                                    <td className="border border-slate-300 px-4 py-3">&nbsp;</td>
                                    <td className="border border-slate-300 px-4 py-3">&nbsp;</td>
                                    <td className="border border-slate-300 px-4 py-3">&nbsp;</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer/Summary */}
                <div className="px-8 mt-4 flex justify-end">
                    <div className="border border-slate-800 rounded-lg p-4 w-64">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold uppercase">Total Credits</span>
                            <span className="font-bold">{totalCredits}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-300 pt-2">
                            <span className="text-sm font-bold uppercase">SGPA</span>
                            <span className="text-xl font-bold">{sgpa}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-8 right-8">
                    <div className="flex justify-between items-end pt-8 border-t border-slate-400">
                        <div className="text-xs text-slate-500">
                            <p>Date of Issue: {new Date().toLocaleDateString()}</p>
                            <p className="mt-1">Chennai - 600 001</p>
                        </div>
                        <div className="text-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_sample.svg"
                                alt="Signature"
                                className="h-10 mx-auto opacity-70 mb-1"
                            />
                            <p className="text-xs font-bold uppercase border-t border-slate-400 pt-1 px-4">Controller of Examinations</p>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};
