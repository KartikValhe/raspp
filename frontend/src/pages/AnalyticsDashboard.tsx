import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Users, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart as RechartsBar, Bar, Legend, AreaChart, Area
} from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/api/v1/analytics/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load analytics data. Is the backend running?");
            });
    }, []);

    // Mock Data for Charts (since the backend endpoint for detailed history is not fully implementing history yet)
    const performanceData = [
        { name: 'Week 1', avg: 75, top: 92 },
        { name: 'Week 2', avg: 78, top: 94 },
        { name: 'Week 3', avg: 72, top: 89 },
        { name: 'Week 4', avg: 82, top: 95 },
        { name: 'Week 5', avg: 79, top: 91 },
        { name: 'Week 6', avg: 85, top: 98 },
        { name: 'Week 7', avg: 81, top: 94 },
        { name: 'Week 8', avg: 88, top: 96 },
    ];

    const attendanceData = [
        { name: 'Mon', present: 85, absent: 15 },
        { name: 'Tue', present: 88, absent: 12 },
        { name: 'Wed', present: 92, absent: 8 },
        { name: 'Thu', present: 78, absent: 22 },
        { name: 'Fri', present: 82, absent: 18 },
    ];

    if (error) return (
        <div className="p-8 flex flex-col items-center justify-center h-full text-slate-500">
            <AlertTriangle size={48} className="text-red-400 mb-4" />
            <p className="text-lg font-medium text-slate-800">Connection Error</p>
            <p className="mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">Retry</button>
        </div>
    );

    if (!stats) return (
        <div className="p-8 flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-500 font-medium">Loading analytics...</span>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Institutional Analytics</h1>
                <p className="text-slate-500">Global insights into student performance and attendance.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.total_students}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Teachers</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.total_teachers}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Avg Attendance</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.avg_attendance}%</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">At Risk Alerts</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.active_alerts}</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Academic Performance Trend</h3>
                        <select className="text-xs border-slate-200 rounded-lg text-slate-500 bg-slate-50 p-2">
                            <option>This Semester</option>
                            <option>Last Semester</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" name="Class Average" />
                                <Line type="monotone" dataKey="top" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Top Performer" />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Weekly Attendance</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar size={14} />
                            <span>This Week</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={attendanceData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="present" name="Present %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="absent" name="Absent %" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for TypeScript alias
const RechartsBarChart = RechartsBar;
