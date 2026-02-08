import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { AdminDashboard } from './admin/AdminDashboard';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();

    // Debug logging to help identify role issues
    console.log("Current User Role:", user?.role);

    // Role-based rendering
    if (user?.role === 'student') {
        return <Navigate to="/student/dashboard" replace />;
    }

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    // Default to teacher dashboard (or if user is teacher)
    return <TeacherDashboard />;
};
