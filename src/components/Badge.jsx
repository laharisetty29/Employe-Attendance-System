import { STATUS_STYLES } from '../utils/helpers';

export default function Badge({ status }) {
  const style = STATUS_STYLES[status] || { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' };
  return (
    <span style={{
      ...style,
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}
