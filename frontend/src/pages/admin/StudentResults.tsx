import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { getBranches, type Branch } from '../../services/subjectService';
import { Trophy, TrendingUp, Users, Download } from 'lucide-react';

interface MeritListItem {
    rank: number;
    student_id: string;
    student_name: string;
    branch: string;
    semester: number;
    total_marks: number;
    percentage: number;
    status: string;
}

const StudentResults: React.FC = () => {
    const [meritList, setMeritList] = useState<MeritListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);

    // Filters
    const [selectedSemester, setSelectedSemester] = useState<number>(0); // 0 = All
    const [selectedBranch, setSelectedBranch] = useState<number>(0);
    const [academicYear] = useState('2024-25');
    const [limit, setLimit] = useState<number | 'all'>('all');

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await getBranches();
                setBranches(data);
            } catch (error) {
                console.error('Failed to fetch branches', error);
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchResults();
    }, [selectedSemester, selectedBranch, academicYear]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const params: any = { academic_year: academicYear };
            if (selectedSemester > 0) params.semester = selectedSemester;
            if (selectedBranch > 0) params.branch_id = selectedBranch;

            // Currently using the same endpoint, can be split later if logic differs significantly
            const response = await api.get('/api/v1/results/merit-list', { params });
            setMeritList(response.data);
        } catch (error) {
            console.error('Failed to fetch results', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden p-6">
            <div className="flex-none space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Student Results & Merit List
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Analyze performance across semesters and branches</p>
                        </div>
                    </div>

                    {/* Global Filters */}
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                            className="bg-white dark:bg-white/5 border text-sm border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                            <option value={0}>All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                <option key={s} value={s}>Semester {s}</option>
                            ))}
                        </select>

                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(parseInt(e.target.value))}
                            className="bg-white dark:bg-white/5 border text-sm border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                            <option value={0}>All Branches</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <select
                            value={limit}
                            onChange={(e) => setLimit(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className="bg-white dark:bg-white/5 border text-sm border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                            <option value="all">All Students</option>
                            <option value={3}>Top 3</option>
                            <option value={5}>Top 5</option>
                            <option value={10}>Top 10</option>
                            <option value={20}>Top 20</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                                <Trophy size={20} />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Top Performer</h3>
                        </div>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">
                            {meritList.length > 0 ? meritList[0].student_name : '-'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {meritList.length > 0 ? `${meritList[0].percentage.toFixed(2)}%` : ''}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                <Users size={20} />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Total Students</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{meritList.length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Avg Performance</h3>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                            {meritList.length > 0
                                ? (meritList.reduce((acc, curr) => acc + curr.percentage, 0) / meritList.length).toFixed(1) + '%'
                                : '-'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="flex-1 flex flex-col min-h-0 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl dark:shadow-none overflow-hidden">
                {/* Card Header - Fixed */}
                <div className="flex-none p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-500" />
                        Merit List
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>

                {/* Table - Scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/90 dark:bg-slate-900/90 border-y border-slate-100 dark:border-white/10 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-20 backdrop-blur-sm">
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Branch & Sem</th>
                                <th className="px-6 py-4 text-center">Total Marks</th>
                                <th className="px-6 py-4 text-center">Percentage</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Loading results...
                                    </td>
                                </tr>
                            ) : meritList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        No results found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                (limit === 'all' ? meritList : meritList.slice(0, typeof limit === 'number' ? limit : undefined)).map((item) => (
                                    <tr key={item.student_id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                                ${item.rank === 1 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                                    item.rank === 2 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                                                        item.rank === 3 ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                                                            'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400'}
                                            `}>
                                                {item.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm
                                                    ${['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'][Math.floor(Math.random() * 5)]}
                                                `}>
                                                    {item.student_name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800 dark:text-white">{item.student_name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 font-mono">{item.student_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                <span className="font-medium">{item.branch}</span>
                                                <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
                                                Sem {item.semester}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                                            {item.total_marks.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${item.percentage >= 75 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' :
                                                    item.percentage >= 60 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400' :
                                                        'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400'}
                                            `}>
                                                {item.percentage.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`
                                                inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize
                                                ${item.status === 'Pass' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10'}
                                            `}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentResults;
