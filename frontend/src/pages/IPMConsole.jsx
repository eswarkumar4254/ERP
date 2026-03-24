import React from 'react';
import { PackageOpen, Settings, Fingerprint, Layers, BarChart, HardDrive } from 'lucide-react';

const IPMConsole = () => {
  const role = localStorage.getItem('user_role') || 'student';

  return (
    <div className="page-content">
      <div className="page-header">
         <h1 className="text-gradient">Infrastructure Planning Management (IPM)</h1>
         <p>Asset lifecycles, supplier integrations, and stock distribution.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
         <div className="glass-card" style={{ borderTop: '3px solid #6366f1' }}>
            <HardDrive size={22} color="#6366f1" />
            <h3 style={{ marginTop: '10px' }}>Total Assets</h3>
            <h2 style={{ margin: 0 }}>4,520 Pcs</h2>
         </div>
         <div className="glass-card" style={{ borderTop: '3px solid #10b981' }}>
            <Layers size={22} color="#10b981" />
            <h3 style={{ marginTop: '10px' }}>Stock Inventory</h3>
            <h2 style={{ margin: 0, color: '#10b981' }}>82%</h2>
         </div>
         <div className="glass-card" style={{ borderTop: '3px solid #f59e0b' }}>
            <PackageOpen size={22} color="#f59e0b" />
            <h3 style={{ marginTop: '10px' }}>Pending Requests</h3>
            <h2 style={{ margin: 0, color: '#f59e0b' }}>24</h2>
         </div>
         <div className="glass-card" style={{ borderTop: '3px solid #ef4444' }}>
            <Settings size={22} color="#ef4444" />
            <h3 style={{ marginTop: '10px' }}>Maint Due</h3>
            <h2 style={{ margin: 0, color: '#ef4444' }}>12</h2>
         </div>
      </div>

      <div className="glass-pane">
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Infrastructure Operations</h2>
         </div>
         <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn-premium">Generate QR for Asset</button>
            {(role === 'ipm_manager' || role === 'super_admin') && (
               <>
                  <button className="btn" style={{ background: '#10b981' }}>Issue Stock</button>
                  <button className="btn" style={{ background: '#6366f1' }}>Manage Suppliers</button>
               </>
            )}
            {(role === 'dean' || role === 'registrar') && (
               <>
                  <button className="btn" style={{ background: '#f59e0b' }}>Request Infra Upgrade</button>
                  <button className="btn-ghost" style={{ background: 'rgba(255,255,255,0.05)' }}>Approve Stock Requests</button>
               </>
            )}
         </div>
      </div>
    </div>
  );
};

export default IPMConsole;
