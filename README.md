# Employee Attendance System

A full-featured attendance management system built with React. Supports Employee and Manager roles.

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v16 or above) — https://nodejs.org
- npm (comes with Node.js)

### Steps

```bash
# 1. Navigate into the project folder
cd attendx

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

---

## 🔐 Demo Login Credentials

| Role     | Email                  | Password |
|----------|------------------------|----------|
| Employee | arjun@company.com      | pass123  |
| Employee | priya@company.com      | pass123  |
| Manager  | manager@company.com    | mgr123   |

---

## 📁 Project Structure

```
attendx/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── seed.js           
│   ├── utils/
│   │   └── helpers.js       
│   ├── components/
│   │   ├── Icon.jsx           
│   │   ├── Badge.jsx          
│   │   ├── StatCard.jsx       
│   │   └── Sidebar.jsx        
│   ├── pages/
│   │   ├── Login.jsx         
│   │   ├── emp/
│   │   │   ├── EmpDashboard.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── AttHistory.jsx
│   │   │   └── Profile.jsx
│   │   └── mgr/
│   │       ├── MgrDashboard.jsx
│   │       ├── AllEmployees.jsx
│   │       └── Reports.jsx
│   ├── App.jsx              
│   ├── index.js
│   └── index.css
└── package.json
```

---

## ✨ Features

### Employee
- ✅ Login with credentials
- ✅ Check In / Check Out with live clock
- ✅ Dashboard with monthly stats
- ✅ Attendance history (Calendar + Table view)
- ✅ Color-coded calendar (green/red/yellow/orange)
- ✅ Profile with attendance rate

### Manager
- ✅ Team dashboard with charts
- ✅ Weekly attendance bar chart
- ✅ Department-wise pie chart
- ✅ View all employees attendance by date
- ✅ Filter by employee, date, department, status
- ✅ Export filtered data to CSV
- ✅ View absent employees list

---

## 🛠 Tech Stack
- React 18
- Recharts (charts)
- Pure CSS-in-JS (no Tailwind or external UI library)

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `build/` folder.

## The app is live now

```bash
https://employee-attendance-system-five.vercel.app/
```
