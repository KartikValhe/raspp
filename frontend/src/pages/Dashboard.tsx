import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { AdminDashboard } from './admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();

    // If user state is still loading from token, show spinner
    if (!user) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-sm font-semibold text-slate-500">Loading your portal...</span>
            </div>
        );
    }

    // Role-based rendering
    if (user.role === 'student') {
        return <Navigate to="/student/dashboard" replace />;
    }

    if (user.role === 'placement_coordinator') {
        return <Navigate to="/placement/dashboard" replace />;
    }

    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    // Teacher
    return <TeacherDashboard />;
};
