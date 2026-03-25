import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Wallet, Settings, 
  Bell, Search, User, LogOut, ChevronRight
} from 'lucide-react';
import './Dashboard.css';

import api from '../api';

const Dashboard = () => {
  const [student, setStudent] = useState({ name: 'Loading...', gpa: '-', attendance: '-' });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/students/me');
        const data = response.data;
        setStudent({
          ...data,
          name: `${data.first_name} ${data.last_name}`,
          gpa: data.cgpa,
          attendance: data.attendance
        });
      } catch (err) {
        console.error('Failed to fetch student profile', err);
        if (err.response && err.response.status === 401) {
           window.location.href = '/login';
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    window.location.href = '/login';
  };

  return (
    <div className="student-app-layout">
      {/* 🚀 Sidebar Navigation (Desktop) */}
      <aside className="sidebar-container">
        <div className="sidebar-header">
           <div className="institution-logo">
              <div className="logo-symbol">S</div>
              <div className="logo-text">
                 <span className="brand-main">STUDENT</span>
                 <span className="brand-sub">PORTAL v2</span>
              </div>
           </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="group-label">Core Navigation</span>
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
              <ChevronRight className="arrow" size={14} />
            </NavLink>
            <NavLink to="/academics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} />
              <span>Academic Records</span>
              <ChevronRight className="arrow" size={14} />
            </NavLink>
            <NavLink to="/syllabus" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BookOpen size={20} />
              <span>Syllabus Tracker</span>
              <ChevronRight className="arrow" size={14} />
            </NavLink>
            <NavLink to="/planner" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>AI Study Planner</span>
              <ChevronRight className="arrow" size={14} />
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Bell size={20} />
              <span>Attendance Registry</span>
              <ChevronRight className="arrow" size={14} />
            </NavLink>
            <NavLink to="/finance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Wallet size={20} />
              <span>Financial Center</span>
              <ChevronRight className="arrow" size={14} />
            </NavLink>
          </div>

          <div className="nav-group">
            <span className="group-label">Tools & Support</span>
            <NavLink to="/resources" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Search size={20} />
              <span>Knowledge Repo</span>
            </NavLink>
            <NavLink to="/support" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={20} />
              <span>Support Desk</span>
            </NavLink>
          </div>

          <div className="nav-group">
            <span className="group-label">Account Services</span>
            <NavLink to="/identity" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <User size={20} />
              <span>Digital Multi-pass</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Settings size={20} />
              <span>Identity Settings</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-action" onClick={handleLogout}>
             <LogOut size={18} />
             <span>Sign Out Intelligence</span>
          </button>
        </div>
      </aside>

      {/* 🏙️ Main Content Area */}
      <div className="main-stage">
        <header className="desktop-top-bar">
          <div className="page-context">
             <h2 className="current-view">Academic Overview</h2>
             <div className="breadcrumbs">Mesh / Student / {student.name}</div>
          </div>

          <div className="top-actions">
            <div className="search-box">
               <Search size={18} className="search-icon" />
               <input type="text" placeholder="Global search..." />
            </div>
            
            <button className="utility-btn">
               <Bell size={20} />
               <span className="badge-dot"></span>
            </button>

            <div className="profile-trigger">
               <div className="avatar-small">{student.name[0]}</div>
               <div className="user-info-brief">
                  <p className="name">{student.name}</p>
                  <p className="role">Official Student</p>
               </div>
            </div>
          </div>
        </header>

        <main className="content-scroller">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 📱 Mobile Specific Navigation (Only shows on mobile) */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/" end className="btn-mobile"><LayoutDashboard size={22} /></NavLink>
        <NavLink to="/academics" className="btn-mobile"><BookOpen size={22} /></NavLink>
        <NavLink to="/finance" className="btn-mobile"><Wallet size={22} /></NavLink>
        <NavLink to="/settings" className="btn-mobile"><Settings size={22} /></NavLink>
        <button className="btn-mobile" onClick={handleLogout} style={{ border: 'none', background: 'none' }}><LogOut size={22} /></button>
      </nav>
    </div>
  );
};

export default Dashboard;
