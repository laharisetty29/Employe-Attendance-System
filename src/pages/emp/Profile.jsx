export default function Profile({ user, attendance }) {
  const myAtt = attendance.filter(a => a.userId === user.id);
  const now = new Date();
  const thisMonth = myAtt.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const stats = [
    ['Total Records',  myAtt.length,                                           '#4f46e5'],
    ['Present Days',   myAtt.filter(a => a.status !== 'absent').length,        '#16a34a'],
    ['Absent Days',    myAtt.filter(a => a.status === 'absent').length,        '#dc2626'],
    ['Late Days',      myAtt.filter(a => a.status === 'late').length,          '#d97706'],
    ['This Month',     thisMonth.filter(a => a.status !== 'absent').length,    '#4f46e5'],
    ['Hours (Month)',  `${thisMonth.reduce((s,a) => s + a.totalHours, 0).toFixed(1)}h`, '#7c3aed'],
  ];

  const rate = myAtt.length
    ? ((myAtt.filter(a => a.status !== 'absent').length / myAtt.length) * 100).toFixed(0)
    : 0;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Avatar card */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 32, textAlign: 'center', marginBottom: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
          {user.name[0]}
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{user.name}</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>{user.employeeId} · {user.department}</p>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>{user.email}</p>

        {/* Attendance rate ring */}
        <div style={{ marginTop: 22, padding: '14px 20px', background: 'linear-gradient(135deg,#eef2ff,#f0fdf4)', borderRadius: 12, border: '1px solid #e2e8f0', display: 'inline-block' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: rate >= 80 ? '#16a34a' : rate >= 60 ? '#d97706' : '#dc2626' }}>
            {rate}%
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Overall Attendance Rate</div>
        </div>
      </div>

      {/* Info */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, marginBottom: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Employee Details</h3>
        {[
          ['Employee ID', user.employeeId],
          ['Department', user.department],
          ['Email', user.email],
          ['Role', user.role],
          ['Joined', user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN',{month:'long',year:'numeric'}) : 'N/A'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{k}</span>
            <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 600, textTransform: 'capitalize' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Attendance Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {stats.map(([label, value, color]) => (
            <div key={label} style={{ padding: '14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
