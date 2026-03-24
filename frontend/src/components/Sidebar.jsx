import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Globe, LayoutDashboard, Users, GraduationCap, ClipboardList, 
  BookOpen, Star, Activity, History, Wallet, MessageSquare,
  Briefcase, HeartHandshake, LibraryBig, Boxes, Building,
  Zap, BarChart3, Fingerprint, Sparkles, Database, Workflow,
  ShieldCheck, Shield, Settings, Key, Code2, HeartPulse,
  Truck, Bed, HelpCircle, User, Award, ClipboardCopy, MonitorPlay,
  ShieldAlert, Brain, TrendingUp, UserPlus
} from 'lucide-react';

import axios from 'axios';

const Sidebar = () => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('http://localhost:8000/api/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserInfo(res.data);
          localStorage.setItem('user_role', res.data.role);
          localStorage.setItem('user_name', res.data.full_name);
        }
      } catch (err) {
        console.error("Session expired or invalid", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.reload();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const role = userInfo?.role || localStorage.getItem('user_role') || 'student';
  const name = userInfo?.full_name || localStorage.getItem('user_name') || 'User';
  const allowed_modules = userInfo?.allowed_modules || [];

  const navGroups = [
    {
      label: 'Strategic Control (SaaS)',
      roles: ['super_admin'],
      items: [
        { label: 'Platform Oversight', icon: Globe, path: '/saas-admin' },
        { label: 'Global Analytics', icon: BarChart3, path: '/global-analytics' },
        { label: 'SaaS Billing', icon: Wallet, path: '/saas-billing' },
        { label: 'Nodes & Health', icon: Zap, path: '/health' },
      ]
    },
    {
      label: 'Institutional Admin',
      roles: ['institution_admin'],
      items: [
        { label: 'Uni. Profile', icon: Building, path: '/institution-profile' },
        { label: 'Student Registry', icon: Users, path: '/students' },
        { label: 'System Settings', icon: Settings, path: '/settings' },
        { label: 'Governance (RBAC)', icon: Shield, path: '/settings/roles' },
      ]
    },
    {
      label: 'Faculty Operations',
      roles: ['super_admin', 'institution_admin', 'faculty', 'hod'],
      items: [
        { label: 'Faculty Portal', icon: GraduationCap, path: '/faculty-portal' },
        { label: 'Workforce (HR)', icon: Users, path: '/staff' },
      ]
    },
    {
      label: 'Assessments & Exams (AAA)',
      roles: ['super_admin', 'institution_admin', 'dean_aaa', 'academic_deo', 'exam_cell_deo', 'scrutinizer', 'hod', 'faculty', 'student', 'dean'],
      items: [
        { label: 'AAA Hub', icon: Award, path: '/academic-aaa' },
        { label: 'Integrity Center', icon: ShieldAlert, path: '/exams/integrity' },
        { label: 'Exam Cell (Official)', icon: ClipboardCopy, path: '/exam-cell' },
        { label: 'Smart Exam Hall', icon: MonitorPlay, path: '/exam-hall' },
        { label: 'My Results', icon: BarChart3, path: '/academics/results' },
      ]
    },
    {
      label: 'Admission & Reg (AR)',
      roles: ['super_admin', 'institution_admin', 'dean_ar', 'junior_assistant', 'finance_officer', 'student', 'dean'],
      items: [
        { label: 'Dean AR Matrix', icon: ClipboardList, path: '/dean-ar' },
        { label: 'Student Onboarding', icon: UserPlus, path: '/students/onboarding' },
      ]
    },
    {
      label: 'Department (HOD)',
      roles: ['super_admin', 'hod', 'faculty', 'student', 'parent', 'timetable_incharge', 'registrar'],
      items: [
        { label: 'HOD Matrix', icon: Building, path: '/department-hod' },
      ]
    },
    {
      label: 'Infra Management (IPM)',
      roles: ['super_admin', 'ipm_manager', 'registrar', 'dean', 'it_admin'],
      items: [
        { label: 'IPM Console', icon: Boxes, path: '/infrastructure-ipm' },
      ]
    },
    {
      label: 'Strategic Intelligence',
      roles: ['super_admin', 'institution_admin', 'dean', 'iqac', 'registrar', 'randd', 'hod'],
      items: [
        { label: 'Enterprise Reports', icon: BarChart3, path: '/reports' },
        { label: 'Strategic Analytics', icon: Brain, path: '/analytics/strategic' },
        { label: 'Compliance Hub', icon: ShieldCheck, path: '/compliance/strategic' },
        { label: 'Research Matrix', icon: Sparkles, path: '/research' },
        { label: 'Quality Hub (IQAC)', icon: Activity, path: '/iqac' },
      ]
    },
    {
      label: 'Campus Life (HMS/TMS)',
      roles: ['super_admin', 'institution_admin', 'hostel_warden', 'transport_manager', 'staff', 'student'],
      items: [
        { label: 'Hostel Matrix (HMS)', icon: Bed, path: '/facilities/hostel', module: 'HMS' },
        { label: 'Transport Fleet (TMS)', icon: Truck, path: '/facilities/transport', module: 'TMS' },
      ]
    },
    {
      label: 'Financial Layer (FMS)',
      roles: ['super_admin', 'institution_admin', 'finance_officer', 'student', 'staff'],
      items: [
        { label: 'Unified Finance', icon: Wallet, path: '/finance', module: 'FMS' },
        { label: 'Strategic Recovery', icon: TrendingUp, path: '/finance/strategic', module: 'FMS' },
        { label: 'Ledger BI Hub', icon: Database, path: '/bi-warehouse', module: 'FMS' },
      ]
    },
    {
      label: 'Knowledge Hub (LMS)',
      roles: ['super_admin', 'institution_admin', 'library_manager', 'student', 'faculty'],
      items: [
        { label: 'Digital Library', icon: LibraryBig, path: '/library', module: 'LMS' },
        { label: 'LMS Content', icon: BookOpen, path: '/lms', module: 'LMS' },
        { label: 'Academic Hierarchy', icon: Database, path: '/knowledge-hub', module: 'LMS' },
      ]
    },
    {
      label: 'Engagement Hub',
      roles: ['super_admin', 'institution_admin', 'placement_officer', 'tpo', 'student', 'alumni', 'staff', 'faculty'],
      items: [
        { label: 'Placement CRM', icon: Briefcase, path: '/placements' },
        { label: 'Alumni Network', icon: HeartHandshake, path: '/alumni' },
        { label: 'Student Counseling', icon: HeartPulse, path: '/counseling' },
        { label: 'Comm. Center', icon: MessageSquare, path: '/communication' },
      ]
    },
    {
      label: 'Personalized Portal',
      roles: ['student', 'parent', 'alumni', 'staff', 'faculty'],
      items: [
        { label: 'My Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Digital Vault', icon: Fingerprint, path: '/digital-vault' },
      ]
    }
  ];

  const filteredGroups = navGroups.map(group => {
    const filteredItems = group.items.filter(item => {
      if (!item.module) return true; // Always show core items
      return allowed_modules.includes(item.module);
    });
    return { ...group, items: filteredItems };
  }).filter(group => {
    // If super_admin, ONLY show the SaaS group
    if (role === 'super_admin') {
      return group.label === 'Strategic Control (SaaS)';
    }
    // For other roles, keep existing logic
    return group.roles.includes(role) && group.items.length > 0;
  });

  // Redirect super_admin from root to saas-admin
  React.useEffect(() => {
    if (role === 'super_admin' && window.location.pathname === '/') {
      window.location.href = '/saas-admin';
    }
  }, [role]);

  if (loading) return <aside className="sidebar loading">...</aside>;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-main">NexGen ERP</div>
        <div className="logo-sub">{role.replace('_', ' ').toUpperCase()}</div>
      </div>
      
      <nav className="sidebar-nav">
        {filteredGroups.map((group) => (
          <div key={group.label} className="sidebar-section">
            <p className="sidebar-group-label">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon || HelpCircle;
              return (
                <NavLink 
                   key={item.path} 
                   to={item.path} 
                   end={item.path === '/'}
                   className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer" onClick={() => {
        localStorage.clear();
        window.location.reload();
      }} style={{ cursor: 'pointer' }}>
        <div className="user-profile-clean">
          <div className="avatar-initial">{name[0]}</div>
          <div className="user-meta">
            <span className="name">{name}</span>
            <div className="plan">
              <ShieldCheck size={12} color="var(--primary-color)" />
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
