import { useState } from 'react';
import Badge from '../../components/Badge';
import { fmt, formatDate, STATUS_COLORS } from '../../utils/helpers';

export default function AttHistory({ user, attendance }) {
  const myAtt = attendance.filter(a => a.userId === user.id);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [view, setView] = useState('calendar');
  const filtered = myAtt.filter(a => a.date.startsWith(viewMonth));

  // Calendar
  const [year, month] = viewMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const attMap = Object.fromEntries(filtered.map(a => [a.date, a]));
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <input type="month" value={viewMonth} onChange={e => setViewMonth(e.target.value)} style={{
          padding: '8px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
          fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none',
        }} />
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {['calendar', 'table'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: view === v ? '#fff' : 'transparent',
              color: view === v ? '#4f46e5' : '#64748b',
              border: 'none', cursor: 'pointer',
              boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s', textTransform: 'capitalize',
            }}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'calendar' ? (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#94a3b8', padding: '6px 0', letterSpacing: '0.03em' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={`empty-${i}`} />;
              const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
              const rec = attMap[ds];
              const isToday = ds === todayStr;
              return (
                <div key={ds} title={rec ? `${rec.status} · In: ${fmt(rec.checkInTime)} Out: ${fmt(rec.checkOutTime)}` : 'No record'} style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'default',
                  background: rec ? STATUS_COLORS[rec.status] + '22' : isToday ? '#eef2ff' : 'transparent',
                  color: rec ? STATUS_COLORS[rec.status] : isToday ? '#4f46e5' : '#475569',
                  border: isToday ? '2px solid #4f46e5' : rec ? `2px solid ${STATUS_COLORS[rec.status]}44` : '2px solid transparent',
                  transition: 'all 0.1s',
                }}>
                  {d}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            {Object.entries(STATUS_COLORS).map(([s, c]) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: c + '44', border: `2px solid ${c}66` }} />
                <span style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize', fontWeight: 500 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Date','Check In','Check Out','Hours','Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No records for this month.</td></tr>
              )}
              {filtered.sort((a,b) => b.date.localeCompare(a.date)).map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>
                    {formatDate(a.date, { day: 'numeric', month: 'short', weekday: 'short' })}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{fmt(a.checkInTime)}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{fmt(a.checkOutTime)}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{a.totalHours}h</td>
                  <td style={{ padding: '12px 16px' }}><Badge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
