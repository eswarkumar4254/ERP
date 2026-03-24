import React, { useState } from 'react';
import { 
  Plus, Boxes, Building, Wrench, ShieldCheck, Database, 
  Search, QrCode, ClipboardList, Package, Truck, LayoutGrid,
  CheckCircle, RefreshCw, XCircle, AlertTriangle
} from 'lucide-react';

const InfrastructureIPM = () => {
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';

  const [activeTab, setActiveTab] = useState('stock');

  // --- MOCK DATA ---
  const stockItems = [
    { id: 'STK-442', name: 'LCD Projector', dept: 'CSE', room: 'Lab 4', status: 'In Use', qr: 'CSE-L4-PR01' },
    { id: 'STK-091', name: 'Air Conditioner', dept: 'Registrar', room: 'Main Office', status: 'Maintenance', qr: 'REG-OFF-AC02' },
    { id: 'STK-998', name: 'Server Rack', dept: 'IT', room: 'Data Center', status: 'New', qr: 'IT-DC-SR01' },
  ];

  const pendingRequests = [
    { id: 'REQ-101', item: '40x Lab Chairs', from: 'Dean AAA', status: 'PENDING REGISTRAR' },
    { id: 'REQ-102', item: 'Server Upgrade', from: 'IT Admin', status: 'APPROVED' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
         <h1 className="text-gradient">Infrastructure & Stock (IPM)</h1>
         <p>Manage stock, suppliers, asset QR codes, and maintenance requests.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')}>Stock & Assets</button>
        <button className={`tab-btn ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => setActiveTab('suppliers')}>Suppliers & Purchase</button>
        <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Issue Requests</button>
        <button className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>Facilities Maint.</button>
      </div>

      {activeTab === 'stock' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <h3>Central Asset Ledger</h3>
                  <button className="btn" style={{ fontSize: '0.75rem' }}><QrCode size={14} /> Generate QR Labels</button>
               </div>
               <button className="btn-premium"><Plus size={16} /> Add New Stock</button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Asset ID</th><th>Item Name</th><th>Location</th><th>QR Code</th><th>Status</th><th>Action</th></tr>
               </thead>
               <tbody>
                  {stockItems.map(item => (
                     <tr key={item.id}>
                        <td style={{ fontWeight: 'bold' }}>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.dept} - {item.room}</td>
                        <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{item.qr}</span></td>
                        <td>
                           <span className="badge" style={{ 
                              background: item.status === 'In Use' ? '#d1fae5' : '#fee2e2',
                              color: item.status === 'In Use' ? '#065f46' : '#991b1b'
                           }}>{item.status}</span>
                        </td>
                        <td><button className="btn-ghost" style={{ fontSize: '0.75rem' }}>Edit</button></td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'requests' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
            <div className="card">
               <h3>Stock Issue Requests (HOD/Dean)</h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                     <tr><th>ID</th><th>Stock Item</th><th>Requested By</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                     {pendingRequests.map(req => (
                        <tr key={req.id}>
                           <td>{req.id}</td>
                           <td style={{ fontWeight: 'bold' }}>{req.item}</td>
                           <td>{req.from}</td>
                           <td><span className="badge">{req.status}</span></td>
                           <td>
                              <button className="btn" disabled={req.status === 'PENDING REGISTRAR'}>
                                 {role === 'registrar' ? 'Approve' : 'Forward to Registrar'}
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="card">
               <h3>QR Tracker Info</h3>
               <p style={{ fontSize: '0.85rem' }}>Each stock item is stamped with a QR code containing:</p>
               <ul style={{ fontSize: '0.85rem', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <li>📍 Building & Block</li>
                  <li>🏢 Department & Floor</li>
                  <li>🏷️ Item Specifications</li>
                  <li>🛠️ Maintenance History</li>
               </ul>
               <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <QrCode size={100} color="var(--text-muted)" style={{ margin: '0 auto' }} />
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '5px' }}>Sample Stamp</p>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'suppliers' && (
         <div className="card" style={{ borderTop: '4px solid #6366f1' }}>
            <h3>Supplier & Purchase Management</h3>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Supplier</th><th>Category</th><th>Contract Status</th><th>Rating</th><th>Action</th></tr>
               </thead>
               <tbody>
                  <tr>
                     <td style={{ fontWeight: 'bold' }}>Nexus IT Solutions</td>
                     <td>IT Hardware</td>
                     <td><span className="badge">Active</span></td>
                     <td>★★★★☆</td>
                     <td><button className="btn-ghost">View Orders</button></td>
                  </tr>
                  <tr>
                     <td style={{ fontWeight: 'bold' }}>Apex Constructions</td>
                     <td>Infrastructure</td>
                     <td><span className="badge" style={{ background: '#fee2e2' }}>Expired</span></td>
                     <td>★★★☆☆</td>
                     <td><button className="btn-ghost">Renew</button></td>
                  </tr>
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'maintenance' && (
         <div className="stat-grid">
            <div className="card">
               <Wrench size={24} color="#6366f1" />
               <h3>Infrastructure Maintenance</h3>
               <p style={{ margin: '10px 0', fontSize: '0.85rem' }}>Track repairs for rooms, blocks, and buildings.</p>
               <button className="btn-premium">Log New Request</button>
            </div>
            <div className="glass-pane">
               <h4>Active Maintenance Projects</h4>
               <div style={{ marginTop: '10px' }}>
                  <p>• Block A Roof Repair - 40% Complete</p>
                  <p>• Lab 2 Rewiring - Completed</p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default InfrastructureIPM;
