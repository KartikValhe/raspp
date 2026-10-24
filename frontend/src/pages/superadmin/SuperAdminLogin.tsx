import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PORTAL_TOKEN = 'raspp1234'; // must match .env SUPERADMIN_SECRET_TOKEN

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(PORTAL_TOKEN); // pre-filled — change if you updated .env
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/v1/superadmin/login', {
        email,
        password,
        secret_token: token,
      });
      localStorage.setItem('sa_token', res.data.access_token);
      localStorage.setItem('sa_email', res.data.email);
      navigate('/superadmin/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 40%, #080d1a 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 20px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Header badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(139,92,246,0.12)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '20px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Restricted Access
            </span>
          </div>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(139,92,246,0.4)',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={{ color: '#f0e9ff', fontSize: '22px', fontWeight: 700, margin: '0 0 6px' }}>
            Superadmin Portal
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            RASPP System — Authorized Personnel Only
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Admin Email
              </label>
              <input
                id="sa-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="superadmin@raspp.in"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="sa-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 42px 12px 14px',
                    color: '#f9fafb',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '2px',
                  }}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Secret Token */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Portal Secret Token
              </label>
              <input
                id="sa-token"
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                required
                placeholder="Enter portal access token"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '6px' }}>
                🔒 This token is configured in your server's .env file
              </p>
            </div>

            <button
              id="sa-login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading
                  ? 'rgba(139,92,246,0.4)'
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(139,92,246,0.4)',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Authenticating…
                </span>
              ) : (
                'Access Superadmin Portal'
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#374151', fontSize: '12px' }}>
          This portal is not publicly accessible. Unauthorized access is prohibited.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}
