import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import Icon from '../../components/Icon';
import { today, fmt, getMonthSummary, formatDate } from '../../utils/helpers';

export default function EmpDashboard({ user, attendance, onCheckIn, onCheckOut }) {

  const myAtt    = attendance.filter(a => a.userId === user.id);
  const todayAtt = myAtt.find(a => a.date === today());
  const now      = new Date();
  const summary  = getMonthSummary(myAtt, now.getMonth(), now.getFullYear());
  const last7    = myAtt.filter(a => (new Date() - new Date(a.date)) / 86400000 <= 7)
                        .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);

  const canCheckIn  = !todayAtt;
  const canCheckOut = todayAtt && !todayAtt.checkOutTime;

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: 18, padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
      }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
            {greeting}, {user.name.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
            {user.department} · {user.employeeId} · {now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {todayAtt ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <Badge status={todayAtt.status} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                In: {fmt(todayAtt.checkInTime)}{todayAtt.checkOutTime ? ` · Out: ${fmt(todayAtt.checkOutTime)}` : ''}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>You haven't checked in yet today.</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCheckIn} disabled={!canCheckIn} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 10, border: 'none',
            fontWeight: 600, fontSize: 14, cursor: canCheckIn ? 'pointer' : 'not-allowed',
            background: canCheckIn ? '#fff' : 'rgba(255,255,255,0.2)',
            color: canCheckIn ? '#16a34a' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
          }}>
            <Icon name="check" size={16} color={canCheckIn ? '#16a34a' : 'rgba(255,255,255,0.4)'} />
            Check In
          </button>
          <button onClick={onCheckOut} disabled={!canCheckOut} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 20px', borderRadius: 10, border: 'none',
            fontWeight: 600, fontSize: 14, cursor: canCheckOut ? 'pointer' : 'not-allowed',
            background: canCheckOut ? '#fff' : 'rgba(255,255,255,0.2)',
            color: canCheckOut ? '#dc2626' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
          }}>
            <Icon name="x" size={16} color={canCheckOut ? '#dc2626' : 'rgba(255,255,255,0.4)'} />
            Check Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Present"     value={summary.present}    sub="This month"       icon="check"    accent="#16a34a" />
        <StatCard label="Absent"      value={summary.absent}     sub="This month"       icon="x"        accent="#dc2626" />
        <StatCard label="Late"        value={summary.late}       sub="This month"       icon="clock"    accent="#d97706" />
        <StatCard label="Hours Worked" value={`${summary.totalHours}h`} sub="This month" icon="chart"   accent="#4f46e5" />
      </div>

      {/* Recent attendance */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>
          Last 7 Days
        </h3>
        {last7.length === 0 && <p style={{ fontSize: 14, color: '#94a3b8' }}>No records yet.</p>}
        {last7.map(a => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>
                {formatDate(a.date, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 10 }}>
                {fmt(a.checkInTime)} – {fmt(a.checkOutTime)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>{a.totalHours}h</span>
              <Badge status={a.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
