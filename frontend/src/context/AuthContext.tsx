import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: any;
    login: (token: string, explicitRole?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const getInitialUser = () => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('user_role');
    if (!token) return null;
    const decoded = parseJwt(token);
    return {
        email: decoded?.sub || '',
        role: storedRole || decoded?.role || 'student',
    };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(getInitialUser);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token or fetch user profile
            api.get('/api/v1/users/me')
                .then(response => {
                    setUser(response.data);
                    if (response.data.role) {
                        localStorage.setItem('user_role', response.data.role);
                    }
                    setIsAuthenticated(true);
                })
                .catch((err) => {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        logout();
                    }
                });
        }
    }, []);

    const login = (token: string, explicitRole?: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);

        const decoded = parseJwt(token);
        const resolvedRole = explicitRole || decoded?.role || 'student';
        localStorage.setItem('user_role', resolvedRole);

        const immediateUser = {
            email: decoded?.sub || '',
            role: resolvedRole,
        };
        setUser(immediateUser);

        // Fetch full profile from backend to enrich
        api.get('/api/v1/users/me')
            .then(res => {
                setUser(res.data);
                if (res.data.role) {
                    localStorage.setItem('user_role', res.data.role);
                }
            })
            .catch(err => {
                console.error("Profile fetch error:", err);
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
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
