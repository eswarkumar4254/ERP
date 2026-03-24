import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import {
  Globe, Activity, TrendingUp, Zap, ShieldCheck, 
  MapPin, Users, Briefcase, DollarSign, Cpu, 
  Layers, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  LayoutGrid, GraduationCap, Award, BookOpen, Clock, Truck,
  FileText, ShieldAlert, HeartPulse, Building
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    if (role === 'student') {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:8000/api/v1/academics/attendance/summary', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setStats(res.data)).catch(console.error);
    }
  }, [role]);

  const Card = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => (
    <div className="card stat-card">
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={20} />
        </div>
        <div className="card-trend">
          {trend === 'up' ? (
            <span className="trend-up"><ArrowUpRight size={14} /> {trendValue}</span>
          ) : trend === 'down' ? (
            <span className="trend-down"><ArrowDownRight size={14} /> {trendValue}</span>
          ) : null}
        </div>
      </div>
      <div className="card-body">
        <p className="card-title">{title}</p>
        <h2 className="card-value">{value}</h2>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const renderRoleDashboard = () => {
    switch (role) {
      case 'student':
        return (
          <div className="dashboard-grid">
            <Card 
               title="Attendance" 
               value={stats ? `${stats.attendance.toFixed(1)}%` : "88.4%"} 
               icon={Activity} 
               color={stats?.status === 'Shortage' ? '#ef4444' : '#10b981'} 
               trend={stats?.attendance > 85 ? "up" : "down"} 
               trendValue={stats?.attendance > 85 ? "+2.1%" : "-1.4%"}
               subtitle={stats?.status || "Safe Zone"} 
            />
            <Card title="CGPA" value="8.92" icon={Award} color="#6366f1" subtitle="Current Sem" />
            <Card title="Next Exam" value="Mar 15" icon={Clock} color="#f59e0b" subtitle="Database Systems (T2)" />
            <Card 
               title="Pending Fines" 
               value={stats ? `₹${stats.fine_amount}` : "₹0"} 
               icon={DollarSign} 
               color={stats?.fine_amount > 0 ? "#ef4444" : "#10b981"} 
               subtitle={stats?.fine_amount > 0 ? "Attendance Shortage" : "Clear"} 
            />
          </div>
        );
      case 'dean_ar':
        return (
          <div className="dashboard-grid">
            <Card title="VSAT Registered" value="14,250" icon={Users} color="#6366f1" trend="up" trendValue="+12%" />
            <Card title="OMR Evaluated" value="12,100" icon={FileText} color="#10b981" />
            <Card title="Counseling Complete" value="842" icon={UserCheck} color="#f59e0b" />
            <Card title="Admissions Blocked" value="12" icon={ShieldAlert} color="#ef4444" />
          </div>
        );
      case 'faculty':
        return (
          <div className="dashboard-grid">
            <Card title="Active Classes" value="4" icon={BookOpen} color="#6366f1" />
            <Card title="Attendance Posting" value="98%" icon={CheckCircle} color="#10b981" />
            <Card title="Scripts to Evaluate" value="42" icon={FileText} color="#f59e0b" />
            <Card title="Leave Balance" value="4.5 d" icon={Clock} color="#ef4444" />
          </div>
        );
      case 'hod':
        return (
          <div className="dashboard-grid">
            <Card title="Dept. Attendance" value="91.2%" icon={Activity} color="#10b981" />
            <Card title="Active Faculty" value="24" icon={Users} color="#6366f1" />
            <Card title="Pending Leaves" value="4" icon={Clock} color="#ef4444" />
            <Card title="Syllabus Coverage" value="68%" icon={TrendingUp} color="#f59e0b" />
          </div>
        );
      case 'scrutinizer':
        return (
          <div className="dashboard-grid">
            <Card title="In Queue" value="184" icon={Layers} color="#6366f1" />
            <Card title="Locked Today" value="42" icon={ShieldCheck} color="#10b981" />
            <Card title="Rejected/Return" value="3" icon={ShieldAlert} color="#ef4444" />
            <Card title="Scrutiny Accuracy" value="99.4%" icon={Activity} color="#f59e0b" />
          </div>
        );
      case 'academic_deo':
      case 'exam_cell_deo':
        return (
          <div className="dashboard-grid">
            <Card title="Promotion Ready" value="240" icon={TrendingUp} color="#10b981" subtitle="Batch 2024" />
            <Card title="Hall Map Set" value="12/14" icon={Building} color="#6366f1" />
            <Card title="Ineligible List" value="18" icon={ShieldAlert} color="#ef4444" />
            <Card title="System Health" value="Stable" icon={Zap} color="#10b981" />
          </div>
        );
      case 'finance_officer':
        return (
          <div className="dashboard-grid">
             <Card title="Revenue (Sem)" value="₹4.2 Cr" icon={DollarSign} color="#10b981" />
             <Card title="Pending Dues" value="₹12.4 L" icon={DollarSign} color="#ef4444" />
             <Card title="Payroll Status" value="Processing" icon={Clock} color="#f59e0b" />
             <Card title="Scholarship Paid" value="₹18 L" icon={Award} color="#6366f1" />
          </div>
        );
      case 'dean_aaa':
      case 'super_admin':
        return (
          <div className="dashboard-grid">
            <Card title="Global Students" value="2,420" icon={Users} color="#6366f1" trend="up" trendValue="+8%" />
            <Card title="Research (H-Index)" value="14.2" icon={Cpu} color="#10b981" />
            <Card title="Placement %" value="82%" icon={Briefcase} color="#f59e0b" />
            <Card title="System Nodes" value="24" icon={Zap} color="#6366f1" />
          </div>
        );
      default:
        return (
           <div className="dashboard-grid">
              <Card title="Institutional View" value="Active" icon={Building} color="#6366f1" />
              <Card title="My Metrics" value="--" icon={Activity} color="#f59e0b" />
           </div>
        );
    }
  };

  return (
    <div className="page-content dashboard-page">
      <div className="dashboard-header-modern">
        <div>
          <h1>Welcome back, {name}</h1>
          <p className="text-secondary">Here's what's happening in the University today.</p>
        </div>
        <div className="dashboard-time">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {renderRoleDashboard()}

      <div className="dashboard-sections">
        <div className="visual-card">
          <h3>Announcements & Notifications</h3>
          <div className="feed-items">
             <div className="feed-item">
                <div className="feed-icon" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                  <Zap size={24} />
                </div>
                <div className="feed-content">
                   <h4>Mid-Semester Results Published (T1)</h4>
                   <p>10 minutes ago • Exams Cell</p>
                </div>
             </div>
             <div className="feed-item">
                <div className="feed-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                  <Clock size={24} />
                </div>
                <div className="feed-content">
                   <h4>Timetable Adjusted for CSE Mechanical Elective</h4>
                   <p>2 hours ago • HOD Office</p>
                </div>
             </div>
          </div>
        </div>

        <div className="visual-card">
           <h3>Quick Links</h3>
           <div className="quick-links">
              <button className="link-btn" onClick={() => navigate('/academic-aaa')}>
                 <span>AAA Hub</span>
                 <ArrowUpRight size={18} color="#94a3b8" />
              </button>
              <button className="link-btn" onClick={() => navigate('/dean-ar')}>
                 <span>Admission Console</span>
                 <ArrowUpRight size={18} color="#94a3b8" />
              </button>
              <button className="link-btn" onClick={() => navigate('/department-hod')}>
                 <span>Department Matrix</span>
                 <ArrowUpRight size={18} color="#94a3b8" />
              </button>
              <button className="link-btn">
                 <span>My Digital Vault</span>
                 <ArrowUpRight size={18} color="#94a3b8" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
