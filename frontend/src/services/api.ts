import axios from 'axios';

const resolveBaseUrl = (): string => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined' && window.location?.hostname) {
        const host = window.location.hostname;
        // If accessed via LAN IP on local Wi-Fi from mobile/laptop
        if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
            return `${window.location.protocol}//${host}:8000`;
        }
        // If accessed on localhost or 127.0.0.1
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://127.0.0.1:8000';
        }
        // If accessed from deployed web preview (e.g. Vercel) and no env set
        return 'https://raspp-backend.onrender.com';
    }
    return 'http://127.0.0.1:8000';
};

const api = axios.create({
    baseURL: resolveBaseUrl(),
    // Fail fast on slow mobile/flaky connections instead of hanging forever
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-clear stale tokens on 401 to prevent stuck loading states
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            // Only clear token for non-login endpoints (login 401 = wrong password)
            if (!url.includes('/auth/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('can_modify');
            }
        } else if (error.response?.status === 403) {
            const detail = error.response?.data?.detail;
            if (typeof detail === 'string' && (detail.includes('Demo') || detail.includes('View-Only') || detail.includes('security'))) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('raspp:demo-blocked', { 
                        detail: { message: detail } 
                    }));
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
