export const SEED_USERS = [
  { id: 'u1', name: 'Arjun Sharma',   email: 'arjun@company.com',   password: 'pass123', role: 'employee', employeeId: 'EMP001', department: 'Engineering',  joinDate: '2023-01-15' },
  { id: 'u2', name: 'Priya Patel',    email: 'priya@company.com',   password: 'pass123', role: 'employee', employeeId: 'EMP002', department: 'Design',       joinDate: '2023-03-20' },
  { id: 'u3', name: 'Rahul Nair',     email: 'rahul@company.com',   password: 'pass123', role: 'employee', employeeId: 'EMP003', department: 'Marketing',    joinDate: '2022-11-10' },
  { id: 'u4', name: 'Sneha Roy',      email: 'sneha@company.com',   password: 'pass123', role: 'employee', employeeId: 'EMP004', department: 'Engineering',  joinDate: '2023-06-01' },
  { id: 'u5', name: 'Dev Kapoor',     email: 'dev@company.com',     password: 'pass123', role: 'employee', employeeId: 'EMP005', department: 'HR',           joinDate: '2022-08-22' },
  { id: 'u6', name: 'Anika Mehra',    email: 'manager@company.com', password: 'mgr123',  role: 'manager',  employeeId: 'MGR001', department: 'Management',   joinDate: '2021-05-10' },
];

function generateAttendance() {
  const records = [];
  const today = new Date();
  const pool = ['present','present','present','present','late','absent','half-day','present'];

  SEED_USERS.filter(u => u.role === 'employee').forEach(emp => {
    for (let d = 59; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue; // skip weekends

      const ds = date.toISOString().split('T')[0];
      const status = pool[Math.floor(Math.random() * pool.length)];
      if (status === 'absent') {
        records.push({ id: `att-${emp.id}-${ds}`, userId: emp.id, date: ds, checkInTime: null, checkOutTime: null, status: 'absent', totalHours: 0 });
        continue;
      }
      const ciH = status === 'late' ? 10 + Math.floor(Math.random() * 2) : 9;
      const ciM = status === 'late' ? Math.floor(Math.random() * 59) : Math.floor(Math.random() * 29);
      const coH = status === 'half-day' ? 13 : 17 + Math.floor(Math.random() * 2);
      const coM = Math.floor(Math.random() * 59);
      const totalHours = parseFloat(((coH + coM / 60) - (ciH + ciM / 60)).toFixed(2));
      records.push({
        id: `att-${emp.id}-${ds}`,
        userId: emp.id,
        date: ds,
        checkInTime:  `${String(ciH).padStart(2,'0')}:${String(ciM).padStart(2,'0')}`,
        checkOutTime: `${String(coH).padStart(2,'0')}:${String(coM).padStart(2,'0')}`,
        status,
        totalHours,
      });
    }
  });
  return records;
}

export const SEED_ATTENDANCE = generateAttendance();
