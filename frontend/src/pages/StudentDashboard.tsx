import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StatsCard } from '../components/StatsCard';
import { PerformanceChart } from '../components/charts/PerformanceChart'; // Can reuse for now, or make a student specific one
import { BookOpen, Clock, Award, BrainCircuit } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Learning Dashboard</h1>
                <p className="text-slate-500">Good afternoon, {user?.email}. Keep up the great work!</p>
            </div>

            {/* Student Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Current GPA"
                    value="3.8"
                    icon={Award}
                    color="purple"
                    trend={{ value: 0.2, isPositive: true }}
                />
                <StatsCard
                    label="My Attendance"
                    value="92%"
                    icon={Clock}
                    color="blue"
                    trend={{ value: 1, isPositive: true }}
                />
                <StatsCard
                    label="Assignments Due"
                    value="2"
                    icon={BookOpen}
                    color="red"
                />
                <StatsCard
                    label="AI Prediction"
                    value="Excellent"
                    icon={BrainCircuit}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">My Performance Trend</h2>
                    <PerformanceChart />
                </div>

                {/* Notifications / Upcoming */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Deadlines</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Database Project", date: "Tomorrow, 11:59 PM", type: "Assignment" },
                            { title: "AI Mid-Term", date: "Fri, Oct 24", type: "Exam" },
                            { title: "Lab Report 3", date: "Mon, Oct 27", type: "Lab" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="bg-white p-2 rounded border border-slate-200 text-slate-500 font-bold text-center w-12 text-xs leading-tight">
                                    {item.date.split(',')[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
