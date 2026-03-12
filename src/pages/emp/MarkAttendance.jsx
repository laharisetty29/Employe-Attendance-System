import { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import Badge from '../../components/Badge';
import { today, nowTime, fmt } from '../../utils/helpers';

export default function MarkAttendance({ user, attendance, onCheckIn, onCheckOut }) {
  const [time, setTime] = useState(nowTime());
  useEffect(() => { const t = setInterval(() => setTime(nowTime()), 1000); return () => clearInterval(t); }, []);

  const todayAtt    = attendance.find(a => a.userId === user.id && a.date === today());
  const canCheckIn  = !todayAtt;
  const canCheckOut = todayAtt && !todayAtt.checkOutTime;
  const done        = todayAtt && todayAtt.checkOutTime;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', textAlign: 'center' }}>
        {/* Clock */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)',
            border: '3px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
          }}>
            <Icon name="clock" size={38} color="#4f46e5" />
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 700, color: '#0f172a', letterSpacing: '-1px' }}>
            {time}
          </div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Status card */}
        {todayAtt && (
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: '16px 20px', marginBottom: 24, border: '1px solid #e2e8f0', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Today's Status</span>
              <Badge status={todayAtt.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['Check In', todayAtt.checkInTime], ['Check Out', todayAtt.checkOutTime]].map(([label, val]) => (
                <div key={label} style={{ padding: '10px 12px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#0f172a' }}>{fmt(val)}</div>
                </div>
              ))}
            </div>
            {done && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: 13, color: '#16a34a', fontWeight: 500 }}>
                ✅ Attendance complete · Total: {todayAtt.totalHours}h worked
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCheckIn} disabled={!canCheckIn} style={{
            flex: 1, padding: '13px', borderRadius: 12, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontWeight: 700, fontSize: 15,
            background: canCheckIn ? '#16a34a' : '#f0fdf4',
            color: canCheckIn ? '#fff' : '#86efac',
            cursor: canCheckIn ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { if (canCheckIn) e.currentTarget.style.background = '#15803d'; }}
            onMouseLeave={e => { if (canCheckIn) e.currentTarget.style.background = '#16a34a'; }}
          >
            <Icon name="check" size={18} color={canCheckIn ? '#fff' : '#86efac'} />
            Check In
          </button>
          <button onClick={onCheckOut} disabled={!canCheckOut} style={{
            flex: 1, padding: '13px', borderRadius: 12, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontWeight: 700, fontSize: 15,
            background: canCheckOut ? '#dc2626' : '#fef2f2',
            color: canCheckOut ? '#fff' : '#fca5a5',
            cursor: canCheckOut ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { if (canCheckOut) e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={e => { if (canCheckOut) e.currentTarget.style.background = '#dc2626'; }}
          >
            <Icon name="x" size={18} color={canCheckOut ? '#fff' : '#fca5a5'} />
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
