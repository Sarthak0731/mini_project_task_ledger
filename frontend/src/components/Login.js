import React, { useState } from 'react';
import api from '../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('taskledger_token', response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d1117' }}>
      <div style={{ width: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', '@media (max-width: 768px)': { display: 'none' } }}>
        <div style={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '32px', marginBottom: '16px' }}>TaskLedger</h1>
          <p style={{ fontSize: '18px', marginBottom: '24px' }}>Accountability. Clarity. Progress.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>✓ Real-time Updates</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>✓ Role-based Access</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>✓ Team Analytics</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '60px', height: '60px', background: 'rgba(99,102,241,0.3)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
        <div style={{ position: 'absolute', bottom: '30%', right: '15%', width: '80px', height: '80px', background: 'rgba(34,211,238,0.3)', borderRadius: '50%', filter: 'blur(25px)' }}></div>
        <div style={{ position: 'absolute', top: '50%', right: '20%', width: '40px', height: '40px', background: 'rgba(99,102,241,0.4)', borderRadius: '50%', filter: 'blur(15px)' }}></div>
      </div>
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', '@media (max-width: 768px)': { width: '100%' } }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: '28px', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: '#8b949e', marginBottom: '24px' }}>Sign in to your workspace</p>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '10px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#f0f6fc' }}>Email</label>
              <input
                type="email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#f0f6fc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#f0f6fc' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#f0f6fc',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#30363d'}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8b949e',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', position: 'relative' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px' }}></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#8b949e' }}>
            Admin credentials: admin@example.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
