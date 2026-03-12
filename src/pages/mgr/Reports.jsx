import { useState } from 'react';
import Badge from '../../components/Badge';
import Icon from '../../components/Icon';
import { today, fmt, formatDate } from '../../utils/helpers';

export default function Reports({ users, attendance }) {
  const emps = users.filter(u => u.role === 'employee');
  const now  = new Date();
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const [empFilter,   setEmpFilter]   = useState('all');
  const [startDate,   setStartDate]   = useState(firstOfMonth);
  const [endDate,     setEndDate]     = useState(today());
  const [statusFilter,setStatusFilter]= useState('all');

  const filtered = attendance.filter(a => {
    const matchEmp    = empFilter === 'all' || a.userId === empFilter;
    const matchDate   = a.date >= startDate && a.date <= endDate;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchEmp && matchDate && matchStatus;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const getName = id => users.find(u => u.id === id)?.name || id;
  const getDept = id => users.find(u => u.id === id)?.department || '—';
  const getEmpId= id => users.find(u => u.id === id)?.employeeId || '—';

  const summary = filtered.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    acc.totalHours += a.totalHours;
    return acc;
  }, { present: 0, absent: 0, late: 0, 'half-day': 0, totalHours: 0 });

  const exportCSV = () => {
    const header = ['Employee', 'EmpID', 'Department', 'Date', 'Check In', 'Check Out', 'Hours', 'Status'];
    const rows = filtered.map(a => [
      getName(a.userId), getEmpId(a.userId), getDept(a.userId),
      a.date, a.checkInTime || '', a.checkOutTime || '', a.totalHours, a.status
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `attendance_${startDate}_to_${endDate}.csv`; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <select value={empFilter} onChange={e => setEmpFilter(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none', cursor: 'pointer' }}>
          <option value="all">All Employees</option>
          {emps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none', cursor: 'pointer' }}>
          {[['all','All Statuses'],['present','Present'],['absent','Absent'],['late','Late'],['half-day','Half Day']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>From</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none' }} />
          <span style={{ fontSize: 13, color: '#64748b' }}>To</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none' }} />
        </div>
        <button onClick={exportCSV} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 18px', borderRadius: 10, background: '#4f46e5',
          color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'background 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; }}
        >
          <Icon name="download" size={15} color="#fff" /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 14, marginBottom: 20 }}>
        {[
          ['Present',    summary.present,                      '#f0fdf4','#16a34a'],
          ['Absent',     summary.absent,                       '#fef2f2','#dc2626'],
          ['Late',       summary.late,                         '#fffbeb','#d97706'],
          ['Half Day',   summary['half-day'],                  '#fff7ed','#ea580c'],
          ['Total Hours',`${summary.totalHours.toFixed(1)}h`,  '#eef2ff','#4f46e5'],
        ].map(([label, value, bg, color]) => (
          <div key={label} style={{ background: bg, borderRadius: 14, padding: '16px 18px', border: `1px solid ${color}22` }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Employee','Dept','Date','Check In','Check Out','Hours','Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No records match your filters.</td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{getName(a.userId)}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{getEmpId(a.userId)}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{getDept(a.userId)}</td>
                <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>{formatDate(a.date, { day: 'numeric', month: 'short' })}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{fmt(a.checkInTime)}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{fmt(a.checkOutTime)}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{a.totalHours}h</td>
                <td style={{ padding: '12px 16px' }}><Badge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10 }}>{filtered.length} records found</p>
    </div>
  );
}
