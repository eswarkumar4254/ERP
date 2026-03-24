import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, QrCode, ClipboardList, PenTool, 
  Search, Filter, Plus, CheckCircle2, 
  XCircle, Clock, Info, ShieldCheck,
  HardDrive, Monitor, Truck, Box
} from 'lucide-react';

const API = 'http://localhost:8000';

const Inventory = () => {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('inventory'); // inventory, requests, audits
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({ asset_name: '', quantity: 1, reason: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [assetRes, reqRes] = await Promise.all([
        axios.get(`${API}/assets/`, { headers }),
        axios.get(`${API}/asset-requests/`, { headers })
      ]);
      setAssets(assetRes.data);
      setRequests(reqRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      // requester_id is hardcoded for demo
      await axios.post(`${API}/asset-requests/`, { ...requestForm, requester_id: 1 }, { headers });
      setRequestForm({ asset_name: '', quantity: 1, reason: '' });
      setShowRequestForm(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API}/asset-requests/${id}/status?status=${status}`, {}, { headers });
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <p>Syncing Asset Registry...</p>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Operations & Asset Management</h1>
          <p>Lifecycle tracking for institutional stock, equipment, and departmental resource requests.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" style={{ background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>
             Print QR Labels
          </button>
          <button className="btn" onClick={() => setShowRequestForm(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Request Stock
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button onClick={() => setView('inventory')} style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: `2px solid ${view === 'inventory' ? 'var(--primary-color)' : 'transparent'}`, color: view === 'inventory' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={18} /> Asset Inventory</button>
        <button onClick={() => setView('requests')} style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: `2px solid ${view === 'requests' ? 'var(--primary-color)' : 'transparent'}`, color: view === 'requests' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ClipboardList size={18} /> Stock Requests</button>
        <button onClick={() => setView('audits')} style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: `2px solid ${view === 'audits' ? 'var(--primary-color)' : 'transparent'}`, color: view === 'audits' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> Compliance Audits</button>
      </div>

      {showRequestForm && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h3>New Stock/Resource Request</h3>
          <form onSubmit={handleRequestSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="stat-label">Stock/Item Name</label>
                <input className="input-field" required value={requestForm.asset_name} onChange={e => setRequestForm({...requestForm, asset_name: e.target.value})} placeholder="e.g. 50x A4 Paper Bundles" />
              </div>
              <div>
                <label className="stat-label">Quantity</label>
                <input className="input-field" type="number" required value={requestForm.quantity} onChange={e => setRequestForm({...requestForm, quantity: e.target.value})} />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="stat-label">Justification / Reason</label>
              <textarea className="input-field" rows="3" required value={requestForm.reason} onChange={e => setRequestForm({...requestForm, reason: e.target.value})} placeholder="Describe intended use..." />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <button className="btn" type="submit">Submit Request</button>
               <button className="btn" type="button" onClick={() => setShowRequestForm(false)} style={{ background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {view === 'inventory' && (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--surface-color-light)' }}>
              <tr>
                <th style={{ width: '50px', padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>S.No</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Asset Tag</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Description</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Category</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Location</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Condition</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, idx) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <QrCode size={16} color="var(--primary-color)" />
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.asset_tag}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{a.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cost: ₹{a.purchase_cost}</p>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge" style={{ background: '#6366f122', color: '#6366f1' }}>{a.category.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem' }}>{a.location}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: a.condition === 'good' ? '#10b981' : a.condition === 'poor' ? '#ef4444' : '#f59e0b',
                      fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {a.condition === 'good' ? <CheckCircle2 size={14} /> : <Info size={14} />} {a.condition.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>Record Audit</button>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No assets registered in cluster.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {view === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map(r => (
            <div key={r.id} className="card" style={{ margin: 0, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--surface-color-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <Box size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{r.asset_name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>x {r.quantity}</span></h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reason: {r.reason}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {new Date(r.created_at).toLocaleDateString()}</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Info size={12} /> Requester ID: {r.requester_id}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                 {r.status === 'pending' ? (
                   <>
                     <button onClick={() => handleStatusUpdate(r.id, 'approved')} className="stat-icon-wrapper" style={{ background: '#10b98122', color: '#10b981', border: 'none', cursor: 'pointer' }} title="Approve">
                        <CheckCircle2 size={20} />
                     </button>
                     <button onClick={() => handleStatusUpdate(r.id, 'rejected')} className="stat-icon-wrapper" style={{ background: '#ef444422', color: '#ef4444', border: 'none', cursor: 'pointer' }} title="Reject">
                        <XCircle size={20} />
                     </button>
                   </>
                 ) : (
                   <span className="badge" style={{ 
                     background: r.status === 'approved' ? '#10b98122' : '#ef444422', 
                     color: r.status === 'approved' ? '#10b981' : '#ef4444'
                   }}>
                     {r.status.toUpperCase()}
                   </span>
                 )}
              </div>
            </div>
          ))}
          {requests.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>No active stock requests.</div>}
        </div>
      )}

      {view === 'audits' && (
        <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
          <h3>System Compliance Verified</h3>
          <p>Annual asset audit successfully synchronized with departmental logs.</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
