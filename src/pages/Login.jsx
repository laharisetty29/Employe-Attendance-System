import { useState } from 'react';
import Icon from '../components/Icon';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Management'];

const inputStyle = (focused) => ({
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: `1.5px solid ${focused ? '#4f46e5' : '#e2e8f0'}`,
  boxShadow: focused ? '0 0 0 3px #eef2ff' : 'none',
  fontSize: 14,
  background: '#f8fafc',
  outline: 'none',
  color: '#0f172a',
  transition: 'all 0.15s',
  boxSizing: 'border-box',
});

function InputField({ label, type = 'text', value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default function Login({ users, initialView = 'login', onLogin, onRegister, onSwitchView }) {
  const [view, setView] = useState(initialView);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', error: '' });
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', employeeId: '', error: '',
  });

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password)
      return setLoginForm(f => ({ ...f, error: 'Please fill in all fields.' }));
    const u = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (!u) return setLoginForm(f => ({ ...f, error: 'Invalid email or password.' }));
    onLogin(u);
  };

  const handleRegister = () => {
    const { name, email, password, confirmPassword, department, employeeId } = regForm;
    if (!name || !email || !password || !department || !employeeId)
      return setRegForm(f => ({ ...f, error: 'Please fill in all required fields.' }));
    if (!/\S+@\S+\.\S+/.test(email))
      return setRegForm(f => ({ ...f, error: 'Please enter a valid email address.' }));
    if (password.length < 6)
      return setRegForm(f => ({ ...f, error: 'Password must be at least 6 characters.' }));
    if (password !== confirmPassword)
      return setRegForm(f => ({ ...f, error: 'Passwords do not match.' }));
    if (users.find(u => u.email === email))
      return setRegForm(f => ({ ...f, error: 'An account with this email already exists.' }));
    if (users.find(u => u.employeeId === employeeId.toUpperCase()))
      return setRegForm(f => ({ ...f, error: 'This Employee ID is already taken.' }));
    onRegister({
      id: `u${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'employee',
      employeeId: employeeId.trim().toUpperCase(),
      department,
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const switchView = (v) => {
    setView(v);
    setLoginForm({ email: '', password: '', error: '' });
    setRegForm({ name: '', email: '', password: '', confirmPassword: '', department: '', employeeId: '', error: '' });
    onSwitchView(v);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 55%, #f0fdf4 100%)', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
          }}>
            <Icon name="clock" size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            AttendX
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>Employee Attendance Management System</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 28px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            {[['login','🔑 Sign In'], ['register','✨ Register']].map(([v, label]) => (
              <button key={v} onClick={() => switchView(v)} style={{
                flex: 1, padding: '14px', fontSize: 14, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? '#4f46e5' : '#94a3b8',
                borderBottom: view === v ? '2px solid #4f46e5' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>{label}</button>
            ))}
          </div>

          <div style={{ padding: '26px 28px 24px' }}>

            {/* ── LOGIN ── */}
            {view === 'login' && (
              <>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Welcome back! Sign in to your account.</p>
                {loginForm.error && (
                  <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>
                    ⚠️ {loginForm.error}
                  </div>
                )}
                <InputField label="Email Address" type="email" value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value, error: '' }))}
                  placeholder="you@company.com" required />
                <InputField label="Password" type="password" value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value, error: '' }))}
                  placeholder="••••••••" required />
                <button onClick={handleLogin} style={{
                  width: '100%', padding: '12px', borderRadius: 10, background: '#4f46e5',
                  color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                  marginTop: 4, boxShadow: '0 4px 12px rgba(79,70,229,0.3)', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; }}>
                  Sign In →
                </button>
                <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 16 }}>
                  No account?{' '}
                  <button onClick={() => switchView('register')} style={{ color: '#4f46e5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    Create one
                  </button>
                </p>
              </>
            )}

            {/* ── REGISTER ── */}
            {view === 'register' && (
              <>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Create a new employee account to get started.</p>
                {regForm.error && (
                  <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>
                    ⚠️ {regForm.error}
                  </div>
                )}
                <InputField label="Full Name" value={regForm.name}
                  onChange={e => setRegForm(f => ({ ...f, name: e.target.value, error: '' }))}
                  placeholder="e.g. Arjun Sharma" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <InputField label="Employee ID" value={regForm.employeeId}
                    onChange={e => setRegForm(f => ({ ...f, employeeId: e.target.value, error: '' }))}
                    placeholder="e.g. EMP006" required />
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      Department <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select value={regForm.department}
                      onChange={e => setRegForm(f => ({ ...f, department: e.target.value, error: '' }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, background: '#f8fafc', color: regForm.department ? '#0f172a' : '#94a3b8', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <option value="">Select…</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <InputField label="Email Address" type="email" value={regForm.email}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value, error: '' }))}
                  placeholder="you@company.com" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <InputField label="Password" type="password" value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value, error: '' }))}
                    placeholder="Min 6 chars" required />
                  <InputField label="Confirm Password" type="password" value={regForm.confirmPassword}
                    onChange={e => setRegForm(f => ({ ...f, confirmPassword: e.target.value, error: '' }))}
                    placeholder="Re-enter" required />
                </div>
                <div style={{ padding: '10px 12px', background: '#fffbeb', borderRadius: 10, border: '1px solid #fde68a', fontSize: 12, color: '#92400e', marginBottom: 16 }}>
                  ℹ️ New accounts are created as <strong>Employee</strong> role by default.
                </div>
                <button onClick={handleRegister} style={{
                  width: '100%', padding: '12px', borderRadius: 10, background: '#16a34a',
                  color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22,163,74,0.25)', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; }}>
                  Create Account →
                </button>
                <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 14 }}>
                  Already have an account?{' '}
                  <button onClick={() => switchView('login')} style={{ color: '#4f46e5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Demo creds */}
        {view === 'login' && (
          <div style={{ marginTop: 14, padding: '16px 18px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Demo Credentials
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['Employee', 'arjun@company.com',   'pass123', '#eef2ff', '#4f46e5'],
                ['Manager',  'manager@company.com', 'mgr123',  '#f0fdf4', '#16a34a'],
              ].map(([role, email, pw, bg, color]) => (
                <button key={role} onClick={() => setLoginForm({ email, password: pw, error: '' })} style={{
                  padding: '10px 12px', borderRadius: 10, border: `1px solid ${color}30`,
                  background: bg, textAlign: 'left', cursor: 'pointer', transition: 'transform 0.1s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color }}>{role}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{email}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>pw: {pw}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
