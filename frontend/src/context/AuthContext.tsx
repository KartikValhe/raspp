import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: any;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token or fecth user profile
            api.get('/api/v1/users/me')
                .then(response => {
                    setUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        // Fetch user details immediately after login
        api.get('/api/v1/users/me').then(res => setUser(res.data));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
