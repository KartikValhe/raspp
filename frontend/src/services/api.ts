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
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
