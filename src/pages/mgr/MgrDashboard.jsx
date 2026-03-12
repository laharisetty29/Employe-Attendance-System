import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { today } from '../../utils/helpers';

const PIE_COLORS = ['#4f46e5','#16a34a','#d97706','#dc2626','#7c3aed'];

export default function MgrDashboard({ users, attendance }) {
  const emps    = users.filter(u => u.role === 'employee');
  const td      = today();
  const todayR  = attendance.filter(a => a.date === td);
  const presentT= todayR.filter(a => a.status !== 'absent').length;
  const lateT   = todayR.filter(a => a.status === 'late').length;
  const absentT = emps.length - todayR.filter(a => a.status !== 'absent').length;

  // Weekly bar chart
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const ds = d.toISOString().split('T')[0];
    const recs = attendance.filter(a => a.date === ds);
    weekData.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      Present: recs.filter(a => a.status !== 'absent').length,
      Absent:  emps.length - recs.filter(a => a.status !== 'absent').length,
    });
  }

  // Dept pie
  const depts = [...new Set(emps.map(e => e.department))];
  const deptData = depts.map(dept => ({
    name: dept,
    value: emps.filter(e => e.department === dept).length,
  }));

  const absentList = emps.filter(e => !todayR.find(a => a.userId === e.id && a.status !== 'absent'));

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Employees" value={emps.length}   icon="users"  accent="#4f46e5" sub="Active staff" />
        <StatCard label="Present Today"   value={presentT}      icon="check"  accent="#16a34a" sub={`of ${emps.length} employees`} />
        <StatCard label="Absent Today"    value={absentT}       icon="x"      accent="#dc2626" sub="Not checked in" />
        <StatCard label="Late Arrivals"   value={lateT}         icon="clock"  accent="#d97706" sub="After 10:00 AM" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Bar chart */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 20 }}>
            Weekly Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} barGap={6} barCategoryGap="30%">
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Bar dataKey="Present" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Absent"  fill="#fecaca" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>
            By Department
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="45%" outerRadius={72} dataKey="value" paddingAngle={3}>
                {deptData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Absent employees */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 14 }}>
          Absent Today
          <span style={{ marginLeft: 8, padding: '2px 10px', borderRadius: 99, background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600 }}>
            {absentList.length}
          </span>
        </h3>
        {absentList.length === 0
          ? <p style={{ fontSize: 14, color: '#16a34a', fontWeight: 500 }}>🎉 All employees are present today!</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {absentList.map(e => (
                <div key={e.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                  background: '#fef2f2', borderRadius: 10, border: '1px solid #fecaca',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{e.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{e.department}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
