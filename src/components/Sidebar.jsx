import Icon from './Icon';

const EMP_NAV = [
  { id: 'emp-dashboard',  label: 'Dashboard',        icon: 'home' },
  { id: 'emp-attendance', label: 'Mark Attendance',  icon: 'clock' },
  { id: 'emp-history',    label: 'My History',       icon: 'calendar' },
  { id: 'emp-profile',    label: 'Profile',          icon: 'user' },
];
const MGR_NAV = [
  { id: 'mgr-dashboard', label: 'Dashboard',        icon: 'home' },
  { id: 'mgr-all',       label: 'All Employees',    icon: 'users' },
  { id: 'mgr-reports',   label: 'Reports',          icon: 'report' },
];

export default function Sidebar({ user, page, onNavigate, onLogout }) {
  const nav = user?.role === 'manager' ? MGR_NAV : EMP_NAV;

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: '#fff',
      borderRight: '1px solid #e2e8f0', display: 'flex',
      flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="clock" size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#0f172a' }}>AttendX</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Attendance System</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => onNavigate(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, width: '100%',
              fontSize: 14, fontWeight: 500, textAlign: 'left',
              background: active ? '#eef2ff' : 'transparent',
              color: active ? '#4f46e5' : '#64748b',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
            >
              <Icon name={n.icon} size={17} color={active ? '#4f46e5' : 'currentColor'} />
              {n.label}
              {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4f46e5' }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: '#f8fafc', marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {user?.name?.[0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 10, width: '100%',
          fontSize: 13, fontWeight: 500, color: '#ef4444',
          cursor: 'pointer', background: 'transparent',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon name="logout" size={15} color="#ef4444" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export { EMP_NAV, MGR_NAV };
