import Icon from './Icon';

export default function StatCard({ label, value, sub, icon, accent = '#4f46e5' }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: '20px 22px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: accent + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={17} color={accent} />
        </div>
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: '#0f172a' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
