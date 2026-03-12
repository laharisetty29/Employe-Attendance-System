import { useState } from 'react';
import Badge from '../../components/Badge';
import Icon from '../../components/Icon';
import { today, fmt } from '../../utils/helpers';

export default function AllEmployees({ users, attendance }) {
  const emps = users.filter(u => u.role === 'employee');
  const depts = [...new Set(emps.map(e => e.department))];

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(today());
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = emps.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q);
    const matchDept = deptFilter === 'all' || e.department === deptFilter;
    const rec = attendance.find(a => a.userId === e.id && a.date === dateFilter);
    const matchStatus = statusFilter === 'all' || (rec ? rec.status === statusFilter : statusFilter === 'absent');
    return matchSearch && matchDept && matchStatus;
  });

  const getAtt = (userId) => attendance.find(a => a.userId === userId && a.date === dateFilter);

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Icon name="search" size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', outline: 'none', color: '#0f172a' }} />
        </div>
        {[
          ['deptFilter', deptFilter, setDeptFilter, [['all','All Departments'], ...depts.map(d=>[d,d])]],
          ['statusFilter', statusFilter, setStatusFilter, [['all','All Statuses'],['present','Present'],['absent','Absent'],['late','Late'],['half-day','Half Day']]],
        ].map(([key, val, setter, opts]) => (
          <select key={key} value={val} onChange={e => setter(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none', cursor: 'pointer' }}>
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', color: '#0f172a', outline: 'none' }} />
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          [`${filtered.filter(e => { const r=getAtt(e.id); return r&&r.status!=='absent'; }).length} Present`, '#f0fdf4', '#16a34a'],
          [`${filtered.filter(e => !getAtt(e.id) || getAtt(e.id)?.status==='absent').length} Absent`, '#fef2f2', '#dc2626'],
          [`${filtered.filter(e => getAtt(e.id)?.status==='late').length} Late`, '#fffbeb', '#d97706'],
        ].map(([label, bg, color]) => (
          <div key={label} style={{ padding: '4px 12px', borderRadius: 99, background: bg, color, fontSize: 13, fontWeight: 600 }}>{label}</div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Employee', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No records found.</td></tr>
            )}
            {filtered.map(e => {
              const rec = getAtt(e.id);
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{e.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{e.name}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{e.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{e.department}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{fmt(rec?.checkInTime)}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{fmt(rec?.checkOutTime)}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{rec ? `${rec.totalHours}h` : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {rec ? <Badge status={rec.status} /> : <span style={{ fontSize: 12, color: '#94a3b8' }}>No record</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
