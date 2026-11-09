import axios from 'axios';

export const resolveBaseUrl = (): string => {
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

const isLocalhost = typeof window !== 'undefined' && 
    (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1');

const api = axios.create({
    baseURL: resolveBaseUrl(),
    // Allow up to 120s for Render free-tier cold starts (takes ~60-110s on first request), 20s for local
    timeout: isLocalhost ? 20000 : 120000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-clear stale tokens on 401 and auto-retry wake-up errors (502/503/network during cold start)
api.interceptors.response.use(
    (response) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('raspp:server-ready'));
        }
        return response;
    },
    async (error) => {
        const config = error.config;

        if (error.response?.status === 401) {
            const url = config?.url || '';
            // Only clear token for non-login endpoints (login 401 = wrong password)
            if (!url.includes('/auth/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('can_modify');
            }
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            const detail = error.response?.data?.detail;
            if (typeof detail === 'string' && (detail.includes('Demo') || detail.includes('View-Only') || detail.includes('security'))) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('raspp:demo-blocked', { 
                        detail: { message: detail } 
                    }));
                }
            }
            return Promise.reject(error);
        }

        // Automatic retry for Render free-tier wake-up blips (502/503/504 or network timeout while waking)
        const isWakeUpError = !error.response || [502, 503, 504].includes(error.response?.status);
        const isEligibleRequest = config && !config.__isRetry && (
            config.method === 'get' || 
            (typeof config.url === 'string' && config.url.includes('/auth/login'))
        );

        if (isWakeUpError && isEligibleRequest) {
            config.__retryCount = (config.__retryCount || 0) + 1;
            if (config.__retryCount <= 2) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('raspp:server-waking', { 
                        detail: { 
                            retryCount: config.__retryCount,
                            message: 'Server is waking up (Render free tier sleeps when idle)...' 
                        } 
                    }));
                }
                // Wait 2.5s before retrying
                await new Promise((resolve) => setTimeout(resolve, 2500));
                return api(config);
            }
        }

        return Promise.reject(error);
    }
);

let prewarmPromise: Promise<any> | null = null;
export const prewarmBackend = (): Promise<any> => {
    if (!prewarmPromise) {
        prewarmPromise = api.get('/health').catch(() => {
            // Reset on error so subsequent actions can re-probe
            prewarmPromise = null;
        });
    }
    return prewarmPromise;
};

export defau