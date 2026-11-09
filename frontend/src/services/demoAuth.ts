/**
 * Demo Credentials & Instant Authentication Service
 * 
 * Provides client-side instant login for pre-configured demonstration accounts,
 * eliminating the 50-80s Render free-tier cold-start waiting period on the login page.
 */

export interface DemoAccount {
    id: string;
    role: 'student' | 'teacher' | 'placement_coordinator' | 'admin';
    email: string;
    pass: string;
    name: string;
    title: string;
    badge: string;
    targetPath: string;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
    'student@example.com': {
        id: 'student',
        role: 'student',
        email: 'student@example.com',
        pass: 'student123',
        name: 'Demo Student',
        title: 'Student Portal',
        badge: 'Student',
        targetPath: '/student/dashboard',
    },
    'teacher@example.com': {
        id: 'teacher',
        role: 'teacher',
        email: 'teacher@example.com',
        pass: 'teacher123',
        name: 'Demo Faculty',
        title: 'Teacher Portal',
        badge: 'Faculty',
        targetPath: '/dashboard',
    },
    'coordinator@example.com': {
        id: 'coordinator',
        role: 'placement_coordinator',
        email: 'coordinator@example.com',
        pass: 'coordinator123',
        name: 'Demo Placement Coordinator',
        title: 'Placement Coordinator',
        badge: 'Placement',
        targetPath: '/placement/dashboard',
    },
    'admin@example.com': {
        id: 'admin',
        role: 'admin',
        email: 'admin@example.com',
        pass: 'admin123',
        name: 'Demo Administrator',
        title: 'Admin Portal',
        badge: 'Administrator',
        targetPath: '/dashboard',
    },
};

/**
 * Checks whether an email & password match one of the demo accounts.
 */
export const getDemoAccount = (email: string, password?: string): DemoAccount | null => {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS[cleanEmail];
    if (!account) return null;
    if (password !== undefined && password !== account.pass) {
        return null;
    }
    return account;
};

/**
 * Creates a valid, decodable JWT token on the frontend for instant demo authentication.
 */
export const createDemoToken = (account: DemoAccount): string => {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const payload = {
        sub: account.email,
        role: account.role,
        can_modify: false,
        is_demo: true,
        full_name: account.name,
        // 30 days validity
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        iat: Math.floor(Date.now() / 1000),
    };

    const base64Url = (obj: any): string => {
        const json = JSON.stringify(obj);
        return btoa(unescape(encodeURIComponent(json)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const encodedHeader = base64Url(header);
    const encodedPayload = base64Url(payload);
    const signature = 'demo_signature_' + btoa(account.email).replace(/[^a-zA-Z0-9]/g, '');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

