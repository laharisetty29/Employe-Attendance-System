export const today = () => new Date().toISOString().split('T')[0];

export const nowTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
};

export const fmt = (t) => t || '--:--';

export const STATUS_COLORS = {
  present:  '#16a34a',
  absent:   '#dc2626',
  late:     '#d97706',
  'half-day': '#ea580c',
};

export const STATUS_STYLES = {
  present:    { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
  absent:     { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  late:       { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  'half-day': { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' },
};

export const formatDate = (ds, opts = {}) =>
  new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...opts });

export const getMonthSummary = (att, month, year) => {
  const filtered = att.filter(a => {
    const d = new Date(a.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  return {
    present:  filtered.filter(a => a.status === 'present').length,
    absent:   filtered.filter(a => a.status === 'absent').length,
    late:     filtered.filter(a => a.status === 'late').length,
    halfDay:  filtered.filter(a => a.status === 'half-day').length,
    totalHours: parseFloat(filtered.reduce((s, a) => s + a.totalHours, 0).toFixed(1)),
  };
};
