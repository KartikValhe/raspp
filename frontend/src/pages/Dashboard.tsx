import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { AdminDashboard } from './admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Resolve role from state first, with immediate localStorage fallback so the screen never hangs
    const effectiveRole = user?.role || storedRole;

    if (!token && !user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based rendering
    if (effectiveRole === 'student') {
        return <Navigate to="/student/dashboard" replace />;
    }

    if (effectiveRole === 'placement_coordinator') {
        return <Navigate to="/placement/dashboard" replace />;
    }

    if (effectiveRole === 'admin') {
        return <AdminDashboard />;
    }

    if (effectiveRole === 'teacher') {
        return <TeacherDashboard />;
    }

    // Temporary fallback only while resolving first token payload (maximum 1-2 frames)
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-slate-500">Loading your portal...</span>
        </div>
    );
};
