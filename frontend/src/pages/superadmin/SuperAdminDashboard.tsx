import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ── Types ────────────────────────────────────────────────────────────────────
interface UserSummary {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  can_modify: boolean;
  full_name: string | null;
}

interface SystemStats {
  total_users: number;
  total_admins: number;
  total_teachers: number;
  total_students: number;
  total_placement_coordinators: number;
  active_users: number;
  inactive_users: number;
  demo_users: number;
}

interface Branch { id: number; name: string; code: string; }

// ── API helper (uses sa_token, NOT regular token) ────────────────────────────
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    return `${protocol}//${hostname}`;
  }
  return 'http://localhost:8000';
};

const saApi = axios.create({ baseURL: getBaseURL() });
saApi.interceptors.request.use(config => {
  const token = localStorage.getItem('sa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Sub-components ────────────────────────────────────────────────────────────

// Stat card
const StatCard = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${color}30`,
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${color}15`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '22px', flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: '#f9fafb' }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>{label}</div>
    </div>
  </div>
);

// Role badge
const RoleBadge = ({ role }: { role: string }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    superadmin:             { bg: 'rgba(139,92,246,0.2)',  text: '#a78bfa' },
    admin:                  { bg: 'rgba(59,130,246,0.2)',  text: '#60a5fa' },
    teacher:                { bg: 'rgba(16,185,129,0.2)',  text: '#34d399' },
    student:                { bg: 'rgba(245,158,11,0.2)',  text: '#fbbf24' },
    placement_coordinator:  { bg: 'rgba(236,72,153,0.2)',  text: '#f472b6' },
  };
  const c = colors[role] || { bg: 'rgba(107,114,128,0.2)', text: '#9ca3af' };
  return (
    <span style={{
      background: c.bg, color: c.text,
      borderRadius: '6px', padding: '3px 10px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>{role.replace('_', ' ')}</span>
  );
};

// Status & Permission badge
const PermissionBadge = ({ canModify }: { canModify: boolean }) => (
  <span style={{
    background: canModify ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
    color: canModify ? '#34d399' : '#fbbf24',
    border: `1px solid ${canModify ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
    borderRadius: '6px', padding: '3px 10px',
    fontSize: '11px', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: '5px',
  }}>
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: canModify ? '#34d399' : '#f59e0b' }} />
    {canModify ? 'Full Access' : 'View Only (Demo)'}
  </span>
);

// ── Modal component ───────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
  }} onClick={onClose}>
    <div style={{
      background: '#111827', border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '460px',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
    }} onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#f9fafb', fontSize: '18px', fontWeight: 700, margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '20px' }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// Input helper
const Field = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <input style={{
      width: '100%', boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '10px 12px', color: '#f9fafb', fontSize: '14px', outline: 'none',
    }} {...props} />
  </div>
);

// Select helper
const SelectField = ({ label, children, ...props }: { label: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <select style={{
      width: '100%', boxSizing: 'border-box',
      background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', padding: '10px 12px', color: '#f9fafb', fontSize: '14px', outline: 'none',
    }} {...props}>{children}</select>
  </div>
);

const SubmitBtn = ({ loading, label }: { loading: boolean; label: string }) => (
  <button type="submit" disabled={loading} style={{
    width: '100%', padding: '11px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none', borderRadius: '8px', color: 'white',
    fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1, marginTop: '4px',
  }}>{loading ? 'Saving…' : label}</button>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
type Tab = 'overview' | 'admins' | 'teachers' | 'users';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const saEmail = localStorage.getItem('sa_email') || 'Superadmin';

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Per-tab cache: avoids re-fetching when switching tabs
  const cache = useRef<Record<string, UserSummary[]>>({});
  const statsCache = useRef<SystemStats | null>(null);
  // In-flight request promises to deduplicate concurrent requests
  const inFlight = useRef<Record<string, Promise<any> | undefined>>({});

  // Modals
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showCreateTeacher, setShowCreateTeacher] = useState(false);
  const [showResetPass, setShowResetPass] = useState<UserSummary | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<UserSummary | null>(null);

  // Forms
  const [adminForm, setAdminForm] = useState({ email: '', password: '', full_name: '', is_demo: false });
  const [teacherForm, setTeacherForm] = useState({ email: '', password: '', full_name: '', department: '', branch_id: '', is_demo: false });
  const [newPassword, setNewPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logout = () => {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_email');
    navigate('/superadmin-portal');
  };

  const fetchStats = useCallback(async (force = false) => {
    if (!force && statsCache.current) {
      setStats(statsCache.current);
      return statsCache.current;
    }
    const pendingStats = inFlight.current['stats'];
    if (!force && pendingStats !== undefined) {
      const data = await pendingStats;
      setStats(data);
      return data;
    }
    const promise = saApi.get('/api/v1/superadmin/stats')
      .then(res => {
        statsCache.current = res.data;
        setStats(res.data);
        return res.data;
      })
      .catch(err => {
        showToast('Failed to load stats', 'error');
        throw err;
      })
      .finally(() => {
        delete inFlight.current['stats'];
      });

    inFlight.current['stats'] = promise;
    return promise;
  }, []);

  const fetchUsers = useCallback(async (role?: string, force = false) => {
    const cacheKey = role || 'all';
    // Return cached data instantly unless forced refresh
    if (!force && cache.current[cacheKey]) {
      setUsers(cache.current[cacheKey]);
      setLoading(false);
      return cache.current[cacheKey];
    }
    setLoading(true);
    const pendingUsers = inFlight.current[cacheKey];
    if (!force && pendingUsers !== undefined) {
      try {
        const data = await pendingUsers;
        setUsers(data);
        return data;
      } finally {
        setLoading(false);
      }
    }
    const params = role ? { role } : {};
    const promise = saApi.get('/api/v1/superadmin/users', { params })
      .then(res => {
        cache.current[cacheKey] = res.data;
        setUsers(res.data);
        return res.data;
      })
      .catch(err => {
        showToast('Failed to load users', 'error');
        throw err;
      })
      .finally(() => {
        delete inFlight.current[cacheKey];
        setLoading(false);
      });

    inFlight.current[cacheKey] = promise;
    return promise;
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await saApi.get('/api/v1/auth/branches');
      setBranches(res.data);
    } catch { }
  }, []);

  // Invalidate a cache key so next visit re-fetches
  const invalidateCache = useCallback((keys: string[]) => {
    keys.forEach(k => { delete cache.current[k]; });
    statsCache.current = null;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('sa_token');
    if (!token) { navigate('/superadmin-portal'); return; }

    // Start background parallel prefetching on mount — zero blocking, zero duplicate requests
    fetchStats();
    fetchUsers('admin');
    fetchUsers('teacher');
    fetchBranches();
  }, [navigate, fetchStats, fetchUsers, fetchBranches]);

  useEffect(() => {
    if (tab === 'overview') {
      fetchStats(); // instant from cache or in-flight promise
      return;
    }
    const roleMap: Record<Tab, string> = { overview: '', admins: 'admin', teachers: 'teacher', users: '' };
    const role = roleMap[tab];
    fetchUsers(role || undefined); // instant from cache or attaches to in-flight promise
  }, [tab, fetchStats, fetchUsers]);

  // ── Permission toggle (Full Write vs View-Only Demo) ───────────────────────
  const toggleAccess = async (user: UserSummary) => {
    setActionLoading(user.id);
    // Toggle can_modify — user can ALWAYS log in, but write actions are granted/revoked
    const newCanModify = user.can_modify === undefined ? false : !user.can_modify;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, can_modify: newCanModify } : u));
    // Update cache too
    const cacheKey = user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'all';
    if (cache.current[cacheKey]) {
      cache.current[cacheKey] = cache.current[cacheKey].map(u =>
        u.id === user.id ? { ...u, can_modify: newCanModify } : u
      );
    }
    // Update stats locally
    if (statsCache.current) {
      statsCache.current = {
        ...statsCache.current,
        demo_users: statsCache.current.demo_users + (newCanModify ? -1 : 1),
      };
      setStats(statsCache.current);
    }
    try {
      await saApi.patch(`/api/v1/superadmin/users/${user.id}/access`, { can_modify: newCanModify });
      showToast(newCanModify ? `Granted Full Write Access to ${user.email}` : `Set ${user.email} to View-Only (Demo mode)`);
      fetchStats(true);
    } catch (err: any) {
      // Rollback on failure
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, can_modify: !newCanModify } : u));
      if (cache.current[cacheKey]) {
        cache.current[cacheKey] = cache.current[cacheKey].map(u =>
          u.id === user.id ? { ...u, can_modify: !newCanModify } : u
        );
      }
      statsCache.current = null;
      showToast(err?.response?.data?.detail || 'Failed to update access', 'error');
    } finally { setActionLoading(null); }
  };

  // ── Delete user ──────────────────────────────────────────────────────────
  const deleteUser = async () => {
    if (!showDeleteConfirm) return;
    setActionLoading(showDeleteConfirm.id);
    const deleted = showDeleteConfirm;
    try {
      await saApi.delete(`/api/v1/superadmin/users/${deleted.id}`);
      // Remove from local state + all cache keys
      setUsers(prev => prev.filter(u => u.id !== deleted.id));
      invalidateCache(['admin', 'teacher', 'student', 'all']);
      // Update stats locally
      if (statsCache.current) {
        const roleKey = `total_${deleted.role}s` as keyof SystemStats;
        statsCache.current = {
          ...statsCache.current,
          total_users: statsCache.current.total_users - 1,
          active_users: deleted.is_active
            ? statsCache.current.active_users - 1
            : statsCache.current.active_users,
          inactive_users: !deleted.is_active
            ? statsCache.current.inactive_users - 1
            : statsCache.current.inactive_users,
        };
        setStats(statsCache.current);
      }
      showToast(`User ${deleted.email} deleted`);
      setShowDeleteConfirm(null);
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Delete failed', 'error');
    } finally { setActionLoading(null); }
  };

  // ── Create Admin ─────────────────────────────────────────────────────────
  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await saApi.post('/api/v1/superadmin/admins', {
        email: adminForm.email,
        password: adminForm.password,
        full_name: adminForm.full_name,
        can_modify: !adminForm.is_demo,
      });
      // Append to admin cache + local state if on admins tab
      const newUser: UserSummary = res.data;
      if (cache.current['admin']) cache.current['admin'] = [newUser, ...cache.current['admin']];
      if (tab === 'admins') setUsers(prev => [newUser, ...prev]);
      invalidateCache([]);
      statsCache.current = null;
      showToast(`Admin ${adminForm.email} created (${adminForm.is_demo ? 'Demo View-Only' : 'Full Access'})`);
      setShowCreateAdmin(false);
      setAdminForm({ email: '', password: '', full_name: '', is_demo: false });
      fetchStats(true);
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to create admin', 'error');
    } finally { setFormLoading(false); }
  };

  // ── Create Teacher ───────────────────────────────────────────────────────
  const createTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await saApi.post('/api/v1/superadmin/teachers', {
        email: teacherForm.email,
        password: teacherForm.password,
        full_name: teacherForm.full_name,
        department: teacherForm.department,
        branch_id: teacherForm.branch_id ? Number(teacherForm.branch_id) : null,
        can_modify: !teacherForm.is_demo,
      });
      const newUser: UserSummary = res.data;
      if (cache.current['teacher']) cache.current['teacher'] = [newUser, ...cache.current['teacher']];
      if (tab === 'teachers') setUsers(prev => [newUser, ...prev]);
      statsCache.current = null;
      showToast(`Teacher ${teacherForm.email} created (${teacherForm.is_demo ? 'Demo View-Only' : 'Full Access'})`);
      setShowCreateTeacher(false);
      setTeacherForm({ email: '', password: '', full_name: '', department: '', branch_id: '', is_demo: false });
      fetchStats(true);
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to create teacher', 'error');
    } finally { setFormLoading(false); }
  };

  // ── Reset password ───────────────────────────────────────────────────────
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetPass) return;
    setFormLoading(true);
    try {
      await saApi.patch(`/api/v1/superadmin/users/${showResetPass.id}/password`, { new_password: newPassword });
      showToast(`Password updated for ${showResetPass.email}`);
      setShowResetPass(null);
      setNewPassword('');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to reset password', 'error');
    } finally { setFormLoading(false); }
  };

  // ── Filtered users ───────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.full_name || '').toLowerCase().includes(q)
    );
  });

  // ── Styles ───────────────────────────────────────────────────────────────
  const s = {
    root: {
      minHeight: '100vh',
      background: '#080c12',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#f9fafb',
    } as React.CSSProperties,
    sidebar: {
      position: 'fixed' as const,
      top: 0, left: 0, bottom: 0,
      width: '240px',
      background: 'rgba(13,13,25,0.95)',
      borderRight: '1px solid rgba(139,92,246,0.12)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column' as const,
      zIndex: 100,
    },
    main: {
      marginLeft: '240px',
      padding: '32px',
      minHeight: '100vh',
    },
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'admins', label: 'Admins', icon: '🛡️' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
    { id: 'users', label: 'All Users', icon: '👥' },
  ];

  const tabLabel = tab === 'admins' ? 'Admin Accounts' : tab === 'teachers' ? 'Teacher Accounts' : 'All System Users';

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
        input::placeholder { color: #4b5563; }
        select option { background: #1f2937; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e9d5ff' }}>RASPP</div>
              <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 500 }}>Superadmin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', marginBottom: '4px',
                background: tab === t.id ? 'rgba(139,92,246,0.15)' : 'transparent',
                border: tab === t.id ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                color: tab === t.id ? '#c4b5fd' : '#6b7280',
                fontWeight: tab === t.id ? 600 : 500,
                fontSize: '13px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '16px' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '10px', padding: '12px',
            marginBottom: '10px',
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Signed in as</div>
            <div style={{ fontSize: '12px', color: '#c4b5fd', fontWeight: 600, wordBreak: 'break-all' }}>{saEmail}</div>
            <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 700, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⬡ Superadmin</div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '9px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', color: '#f87171', fontWeight: 600, fontSize: '12px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={s.main}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f9fafb', margin: '0 0 6px' }}>
            {tab === 'overview' && '📊 System Overview'}
            {tab === 'admins' && '🛡️ Admin Management'}
            {tab === 'teachers' && '👨‍🏫 Teacher Management'}
            {tab === 'users' && '👥 All System Users'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            RASPP Superadmin Control Panel — Full access to user and permission management
          </p>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {stats ? (
                <>
                  <StatCard label="Total Users" value={stats.total_users} icon="👥" color="#8b5cf6" />
                  <StatCard label="Admins" value={stats.total_admins} icon="🛡️" color="#3b82f6" />
                  <StatCard label="Teachers" value={stats.total_teachers} icon="👨‍🏫" color="#10b981" />
                  <StatCard label="Students" value={stats.total_students} icon="🎓" color="#f59e0b" />
                  <StatCard label="Placement Coordinators" value={stats.total_placement_coordinators} icon="💼" color="#ec4899" />
                  <StatCard label="Demo / View-Only" value={stats.demo_users || 0} icon="🔒" color="#f59e0b" />
                  <StatCard label="Active Accounts" value={stats.active_users} icon="✅" color="#10b981" />
                </>
              ) : (
                [1, 2, 3, 4, 5, 6, 7].map(n => (
                  <div key={n} style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '14px', padding: '20px', height: '88px', display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60px', height: '24px', background: 'rgba(255,255,255,0.07)', borderRadius: '6px', marginBottom: '6px', animation: 'pulse 1.5s infinite' }} />
                      <div style={{ width: '90px', height: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick actions */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e5e7eb', margin: 0 }}>Quick Actions</h3>
                <button
                  onClick={() => { fetchStats(true); showToast('Stats refreshed'); }}
                  style={{
                    padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: '#c4b5fd', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  🔄 Refresh Stats
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button onClick={() => { setTab('admins'); setShowCreateAdmin(true); }} style={{
                  padding: '10px 20px', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '13px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>+ Create Admin</span>
                </button>
                <button onClick={() => { setTab('teachers'); setShowCreateTeacher(true); }} style={{
                  padding: '10px 20px', background: 'linear-gradient(135deg, #065f46, #10b981)',
                  border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '13px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span>+ Create Teacher</span>
                </button>
                <button onClick={() => setTab('users')} style={{
                  padding: '10px 20px', background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', color: '#c4b5fd',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                }}>
                  View All Users
                </button>
              </div>
            </div>

            {/* Warning notice */}
            <div style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '12px', padding: '16px 20px', marginTop: '20px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#fbbf24', marginBottom: '4px' }}>Security Reminder</div>
                <div style={{ fontSize: '12px', color: '#92400e', lineHeight: '1.5' }}>
                  This portal has full authority over all system users. Actions taken here (delete, revoke) are permanent and affect the live database.
                  Do not share the portal URL or secret token with anyone.
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── USERS TABLE (admins / teachers / all) ── */}
        {tab !== 'overview' && (
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                placeholder="🔍  Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, minWidth: '220px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '10px 14px', color: '#f9fafb', fontSize: '13px', outline: 'none',
                }}
              />
              {tab === 'users' && (
                <select
                  value={roleFilter}
                  onChange={e => { setRoleFilter(e.target.value); fetchUsers(e.target.value || undefined); }}
                  style={{
                    background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '10px 14px', color: '#f9fafb', fontSize: '13px', outline: 'none',
                  }}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="placement_coordinator">Placement Coordinator</option>
                </select>
              )}
              <button
                onClick={() => {
                  const roleMap: Record<Tab, string> = { overview: '', admins: 'admin', teachers: 'teacher', users: roleFilter };
                  fetchUsers(roleMap[tab] || undefined, true);
                  showToast('Reloading fresh data…');
                }}
                title="Force refresh"
                style={{
                  padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: '#c4b5fd', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                🔄 Refresh
              </button>
              {(tab === 'admins') && (
                <button onClick={() => setShowCreateAdmin(true)} style={{
                  padding: '10px 18px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                }}>
                  + New Admin
                </button>
              )}
              {(tab === 'teachers') && (
                <button onClick={() => setShowCreateTeacher(true)} style={{
                  padding: '10px 18px', background: 'linear-gradient(135deg, #065f46, #10b981)',
                  border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                }}>
                  + New Teacher
                </button>
              )}
            </div>

            {/* Stats bar */}
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
              Showing <strong style={{ color: '#c4b5fd' }}>{filteredUsers.length}</strong> {tab === 'admins' ? 'admin' : tab === 'teachers' ? 'teacher' : ''} accounts
            </div>

            {/* Table */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(139,92,246,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['ID', 'Name / Email', 'Role', 'Permission Mode', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1, 2, 3, 4, 5].map(k => (
                        <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '16px' }}>
                            <div style={{ width: '32px', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ width: '130px', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '6px' }} />
                            <div style={{ width: '180px', height: '11px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ width: '64px', height: '22px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ width: '80px', height: '22px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ width: '150px', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
                          </td>
                        </tr>
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#4b5563', fontSize: '14px' }}>
                        No users found
                      </td></tr>
                    ) : filteredUsers.map((u, i) => (
                      <tr key={u.id} style={{
                        borderBottom: i < filteredUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        transition: 'background 0.1s',
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>#{u.id}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: '#f3f4f6' }}>{u.full_name || '—'}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}><RoleBadge role={u.role} /></td>
                        <td style={{ padding: '14px 16px' }}><PermissionBadge canModify={u.can_modify ?? true} /></td>
                        <td style={{ padding: '14px 16px' }}>
                          {u.role !== 'superadmin' && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {/* Toggle Permission Mode */}
                              <button
                                onClick={() => toggleAccess(u)}
                                disabled={actionLoading === u.id}
                                title={u.can_modify ? 'Revoke write permission (set to view-only demo)' : 'Grant write permission'}
                                style={{
                                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none',
                                  background: (u.can_modify ?? true) ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                                  color: (u.can_modify ?? true) ? '#fbbf24' : '#34d399',
                                  transition: 'all 0.15s',
                                  opacity: actionLoading === u.id ? 0.5 : 1,
                                }}
                              >
                                {(u.can_modify ?? true) ? '🔒 Set View-Only' : '🔓 Grant Write'}
                              </button>

                              {/* Reset password */}
                              <button
                                onClick={() => setShowResetPass(u)}
                                title="Reset Password"
                                style={{
                                  padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                                  cursor: 'pointer', border: 'none',
                                  background: 'rgba(245,158,11,0.12)', color: '#fbbf24',
                                }}
                              >
                                🔑 Password
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setShowDeleteConfirm(u)}
                                title="Delete User"
                                style={{
                                  padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                                  cursor: 'pointer', border: 'none',
                                  background: 'rgba(239,68,68,0.12)', color: '#f87171',
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                          {u.role === 'superadmin' && (
                            <span style={{ fontSize: '11px', color: '#4b5563', fontStyle: 'italic' }}>Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Create Admin Modal ── */}
      {showCreateAdmin && (
        <Modal title="Create Admin Account" onClose={() => setShowCreateAdmin(false)}>
          <form onSubmit={createAdmin}>
            <Field label="Full Name (optional)" type="text" value={adminForm.full_name} onChange={e => setAdminForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Dr. Rahul Sharma" />
            <Field label="Email" type="email" required value={adminForm.email} onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@college.in" />
            <Field label="Password" type="password" required value={adminForm.password} onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))} placeholder="Strong password" />
            
            {/* Demo Mode Toggle */}
            <div style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#f3f4f6' }}>
                <input
                  type="checkbox"
                  checked={adminForm.is_demo}
                  onChange={e => setAdminForm(f => ({ ...f, is_demo: e.target.checked }))}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#fbbf24' }}>Create as Demo / View-Only Account</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', lineHeight: '1.4' }}>
                    Live visitors can log in to explore the system, but cannot create, update, or delete any students, teachers, branches, or subjects.
                  </div>
                </div>
              </label>
            </div>

            <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '12px', color: '#93c5fd' }}>
              ℹ️ Permitted admins can manage teachers, students, branches, and subjects. They cannot access this superadmin panel.
            </div>
            <SubmitBtn loading={formLoading} label={adminForm.is_demo ? "Create Demo Admin" : "Create Admin"} />
          </form>
        </Modal>
      )}

      {/* ── Create Teacher Modal ── */}
      {showCreateTeacher && (
        <Modal title="Create Teacher Account" onClose={() => setShowCreateTeacher(false)}>
          <form onSubmit={createTeacher}>
            <Field label="Full Name" type="text" required value={teacherForm.full_name} onChange={e => setTeacherForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Prof. Anjali Mehta" />
            <Field label="Email" type="email" required value={teacherForm.email} onChange={e => setTeacherForm(f => ({ ...f, email: e.target.value }))} placeholder="teacher@college.in" />
            <Field label="Password" type="password" required value={teacherForm.password} onChange={e => setTeacherForm(f => ({ ...f, password: e.target.value }))} placeholder="Strong password" />
            <Field label="Department" type="text" required value={teacherForm.department} onChange={e => setTeacherForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Computer Science" />
            <SelectField label="Branch (optional)" value={teacherForm.branch_id} onChange={e => setTeacherForm(f => ({ ...f, branch_id: e.target.value }))}>
              <option value="">No branch assigned</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
            </SelectField>

            {/* Demo Mode Toggle */}
            <div style={{
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#f3f4f6' }}>
                <input
                  type="checkbox"
                  checked={teacherForm.is_demo}
                  onChange={e => setTeacherForm(f => ({ ...f, is_demo: e.target.checked }))}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#fbbf24' }}>Create as Demo / View-Only Account</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', lineHeight: '1.4' }}>
                    Live visitors can log in to explore the teacher portal, but cannot enter marks, edit profiles, or modify data.
                  </div>
                </div>
              </label>
            </div>

            <SubmitBtn loading={formLoading} label={teacherForm.is_demo ? "Create Demo Teacher" : "Create Teacher"} />
          </form>
        </Modal>
      )}

      {/* ── Reset Password Modal ── */}
      {showResetPass && (
        <Modal title={`Reset Password — ${showResetPass.email}`} onClose={() => setShowResetPass(null)}>
          <form onSubmit={resetPassword}>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#fbbf24' }}>
              ⚠️ This will immediately change the user's login password.
            </div>
            <Field label="New Password" type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
            <SubmitBtn loading={formLoading} label="Update Password" />
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setShowDeleteConfirm(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
            <p style={{ color: '#f3f4f6', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
              Are you sure you want to permanently delete this account?
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>
              <strong style={{ color: '#f87171' }}>{showDeleteConfirm.email}</strong>
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '24px' }}>
              Role: <RoleBadge role={showDeleteConfirm.role} />
            </p>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px', marginBottom: '20px', fontSize: '12px', color: '#f87171' }}>
              ⛔ This action is <strong>permanent</strong> and cannot be undone. All associated data (teacher/student profile) will also be deleted.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#9ca3af', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                onClick={deleteUser}
                disabled={actionLoading === showDeleteConfirm.id}
                style={{
                  flex: 1, padding: '10px',
                  background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                  borderRadius: '8px', color: '#f87171', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                }}
              >
                {actionLoading === showDeleteConfirm.id ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: '12px', padding: '14px 20px',
          color: toast.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '13px', fontWeight: 600,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'slideUp 0.3s ease',
          maxWidth: '360px',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
