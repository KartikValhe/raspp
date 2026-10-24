import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: any;
    login: (token: string, explicitRole?: string, explicitCanModify?: boolean) => void;
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
    const storedCanModify = localStorage.getItem('can_modify');
    if (!token) return null;
    const decoded = parseJwt(token);
    return {
        email: decoded?.sub || '',
        role: storedRole || decoded?.role || 'student',
        can_modify: storedCanModify !== null ? storedCanModify === 'true' : (decoded?.can_modify ?? true),
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
                    const serverCanModify = response.data.can_modify !== undefined ? response.data.can_modify : true;
                    setUser({
                        ...response.data,
                        can_modify: serverCanModify,
                    });
                    if (response.data.role) {
                        localStorage.setItem('user_role', response.data.role);
                    }
                    localStorage.setItem('can_modify', String(serverCanModify));
                    setIsAuthenticated(true);
                })
                .catch((err) => {
                    // Only log out on 401 Unauthorized (expired/invalid token), NOT on 403 Forbidden (view-only demo mode)
                    if (err.response && err.response.status === 401) {
                        logout();
                    }
                });
        }
    }, []);

    const login = (token: string, explicitRole?: string, explicitCanModify?: boolean) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);

        const decoded = parseJwt(token);
        const resolvedRole = explicitRole || decoded?.role || 'student';
        const resolvedCanModify = explicitCanModify !== undefined ? explicitCanModify : (decoded?.can_modify ?? true);
        localStorage.setItem('user_role', resolvedRole);
        localStorage.setItem('can_modify', String(resolvedCanModify));

        // Set user immediately from JWT / response — no extra round-trip needed
        const immediateUser = {
            email: decoded?.sub || '',
            role: resolvedRole,
            can_modify: resolvedCanModify,
        };
        setUser(immediateUser);

        // Background-fetch full profile to enrich additional fields (non-blocking)
        api.get('/api/v1/users/me')
            .then(res => {
                const serverCanModify = res.data.can_modify !== undefined ? res.data.can_modify : resolvedCanModify;
                setUser({
                    ...res.data,
                    can_modify: serverCanModify,
                });
                if (res.data.role) {
                    localStorage.setItem('user_role', res.data.role);
                }
                localStorage.setItem('can_modify', String(serverCanModify));
            })
            .catch(() => {
                // Non-fatal — the immediateUser above is sufficient for routing
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('can_modify');
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
