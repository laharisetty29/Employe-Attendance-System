import { useState, useCallback, useRef } from 'react';
import { SEED_USERS, SEED_ATTENDANCE } from './data/seed';
import { today, nowTime } from './utils/helpers';
import Sidebar, { EMP_NAV, MGR_NAV } from './components/Sidebar';
import Login from './pages/Login';
import EmpDashboard   from './pages/emp/EmpDashboard';
import MarkAttendance from './pages/emp/MarkAttendance';
import AttHistory     from './pages/emp/AttHistory';
import Profile        from './pages/emp/Profile';
import MgrDashboard   from './pages/mgr/MgrDashboard';
import AllEmployees   from './pages/mgr/AllEmployees';
import Reports        from './pages/mgr/Reports';

export default function App() {
  const [users, setUsers]           = useState(SEED_USERS);
  const [attendance, setAttendance] = useState(SEED_ATTENDANCE);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage]             = useState('login');

  // Use a ref so checkIn/checkOut always see latest attendance without re-creating
  const attendanceRef = useRef(attendance);
  attendanceRef.current = attendance;

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage(user.role === 'manager' ? 'mgr-dashboard' : 'emp-dashboard');
  };

  const handleRegister = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setPage('emp-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkIn = useCallback(() => {
    const td = today();
    if (attendanceRef.current.find(a => a.userId === currentUser.id && a.date === td)) return;
    const hour = new Date().getHours();
    setAttendance(prev => [...prev, {
      id: `att-${currentUser.id}-${td}`,
      userId: currentUser.id,
      date: td,
      checkInTime: nowTime(),
      checkOutTime: null,
      status: hour >= 10 ? 'late' : 'present',
      totalHours: 0,
    }]);
  }, [currentUser]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkOut = useCallback(() => {
    const td = today();
    setAttendance(prev => prev.map(a => {
      if (a.userId !== currentUser.id || a.date !== td || a.checkOutTime) return a;
      const [ch, cm] = a.checkInTime.split(':').map(Number);
      const now = new Date();
      const totalHours = parseFloat(((now.getHours() + now.getMinutes() / 60) - (ch + cm / 60)).toFixed(2));
      return {
        ...a,
        checkOutTime: nowTime(),
        totalHours,
        status: totalHours < 4 ? 'half-day' : a.status,
      };
    }));
  }, [currentUser]);

  // ── Auth screens ──
  if (!currentUser || page === 'login' || page === 'register') {
    return (
      <Login
        users={users}
        initialView={page === 'register' ? 'register' : 'login'}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSwitchView={setPage}
      />
    );
  }

  const allNav    = [...EMP_NAV, ...MGR_NAV];
  const pageTitle = allNav.find(n => n.id === page)?.label || 'Dashboard';

  const renderPage = () => {
    switch (page) {
      case 'emp-dashboard':  return <EmpDashboard   user={currentUser} attendance={attendance} onCheckIn={checkIn} onCheckOut={checkOut} />;
      case 'emp-attendance': return <MarkAttendance user={currentUser} attendance={attendance} onCheckIn={checkIn} onCheckOut={checkOut} />;
      case 'emp-history':    return <AttHistory     user={currentUser} attendance={attendance} />;
      case 'emp-profile':    return <Profile        user={currentUser} attendance={attendance} />;
      case 'mgr-dashboard':  return <MgrDashboard   users={users}      attendance={attendance} />;
      case 'mgr-all':        return <AllEmployees   users={users}      attendance={attendance} />;
      case 'mgr-reports':    return <Reports        users={users}      attendance={attendance} />;
      default:               return <div style={{ padding: 32, color: '#64748b' }}>Page not found</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar user={currentUser} page={page} onNavigate={setPage} onLogout={handleLogout} />

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{pageTitle}</h1>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{currentUser.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'capitalize' }}>{currentUser.role} · {currentUser.department}</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
              {currentUser.name[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
