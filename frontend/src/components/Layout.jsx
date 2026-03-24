import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, Settings, LogOut, Globe } from 'lucide-react';

const Layout = ({ onLogout }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <div className="search-bar" style={{ position: 'relative', width: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              <input 
                type="text" 
                placeholder="Global Search: Nodes, Transactions, Personnel..." 
                style={{ paddingLeft: '48px', height: '44px', width: '100%', border: '1px solid var(--border-color)', background: 'transparent', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.9rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary-color)' }}>
              <Globe size={14} /> 24 NODES ACTIVE
            </div>
          </div>
          
          <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="icon-btn" title="Global Notifications" style={{ background: 'rgba(255,255,255,0.03)', padding: '10px' }}><Bell size={20} /></button>
            <button className="icon-btn" title="System Settings" style={{ background: 'rgba(255,255,255,0.03)', padding: '10px' }}><Settings size={20} /></button>
            <button className="btn-ghost" title="Logout" onClick={onLogout} style={{ border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error-color)', padding: '10px 18px', borderRadius: '12px', fontSize: '0.85rem' }}>
              <LogOut size={18} /> Disconnect
            </button>
          </div>
        </header>

        <div className="content-viewport" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
