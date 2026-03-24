import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Monitor, Package, ChevronDown, Plus, Tag, AlertTriangle } from 'lucide-react';

const API = 'http://localhost:8000';
const conditionColors = { good: '#10b981', fair: '#f59e0b', poor: '#ef4444', disposed: '#6b7280' };
const categoryIcons = { computer: '💻', furniture: '🪑', lab_equipment: '🔬', vehicle: '🚌' };

const Assets = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [audits, setAudits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', asset_tag: '', category: 'computer', location: '', condition: 'good', purchase_cost: '', assigned_to: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const role = localStorage.getItem('user_role') || 'student';
  const fetchData = async () => {
    try {
      const [aRes, reqRes] = await Promise.all([
        axios.get(`${API}/api/v1/ims/assets`, { headers }),
        axios.get(`${API}/api/v1/ims/maintenance/requests`, { headers }).catch(() => ({ data: [] })),
      ]);
      setAssets(aRes.data);
      setRequests(reqRes.data);
      // setAnalytics(null); // Simple fallback for now
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/assets/`, { ...form, purchase_cost: parseFloat(form.purchase_cost) || 0 }, { headers });
      setShowForm(false);
      setForm({ name: '', asset_tag: '', category: 'computer', location: '', condition: 'good', purchase_cost: '', assigned_to: '' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const updateCondition = async (id, condition) => {
    try {
      await axios.put(`${API}/assets/${id}/condition?condition=${condition}`, {}, { headers });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API}/asset-requests/${id}/status?status=${status}`, {}, { headers });
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p>Loading Assets...</p>;

  const filtered = filter === 'all' ? assets : assets.filter(a => a.category === filter || a.condition === filter);
  const poorAssets = assets.filter(a => a.condition === 'poor' || a.condition === 'disposed').length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Infrastructure & Asset Management</h1>
          <p>QR-tagged inventory, stock requests and maintenance tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" onClick={() => setActiveTab('requests')} style={{ background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>
            View Requests ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button className="btn" id="add-asset-btn" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add Asset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        {['inventory', 'requests', 'maintenance'].map(tab => (
          <button key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '0.75rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
              fontWeight: activeTab === tab ? 600 : 400, fontSize: '0.9rem', textTransform: 'capitalize'
            }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <>
          {/* Analytics Cards */}
          {analytics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ margin: 0, borderTop: '3px solid #6366f1' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Assets</p>
                <h2 style={{ margin: 0 }}>{analytics.total_assets}</h2>
              </div>
              <div className="card" style={{ margin: 0, borderTop: '3px solid #10b981' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Value</p>
                <h2 style={{ margin: 0 }}>₹{analytics.total_value.toLocaleString()}</h2>
              </div>
              <div className="card" style={{ margin: 0, borderTop: '3px solid #ef4444' }}>
                <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Need Attention</p>
                <h2 style={{ margin: 0, color: poorAssets > 0 ? '#ef4444' : 'inherit' }}>{poorAssets}</h2>
              </div>
            </div>
          )}

          {poorAssets > 0 && (
            <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <AlertTriangle size={20} color="#ef4444" />
              <span style={{ color: '#ef4444', fontWeight: 500 }}>{poorAssets} assets are in poor/disposed condition and need review.</span>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-color)' }}>
              <h2 style={{ marginTop: 0 }}>Register New Asset</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Asset Name *</label>
                    <input className="input-field" id="ast-name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dell Latitude Laptop" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Asset Tag (QR/Barcode) *</label>
                    <input className="input-field" id="ast-tag" required value={form.asset_tag} onChange={e => setForm({ ...form, asset_tag: e.target.value })} placeholder="AST-2024-001" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Category *</label>
                    <select className="input-field" id="ast-category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      <option value="computer">Computer</option>
                      <option value="furniture">Furniture</option>
                      <option value="lab_equipment">Lab Equipment</option>
                      <option value="vehicle">Vehicle</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Location *</label>
                    <input className="input-field" id="ast-location" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Lab 3, Block B" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Purchase Cost (₹)</label>
                    <input className="input-field" id="ast-cost" type="number" value={form.purchase_cost} onChange={e => setForm({ ...form, purchase_cost: e.target.value })} placeholder="0" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Assigned To</label>
                    <input className="input-field" id="ast-assigned" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} placeholder="Dept or person name" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn" type="submit" id="submit-asset-btn">Register Asset</button>
                  <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color-light)' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Filter UI */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', padding: '0 1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}><Filter size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> Filter:</span>
            {['all', 'computer', 'furniture', 'lab_equipment', 'vehicle', 'good', 'fair', 'poor'].map(f => (
              <button key={f} 
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  background: filter === f ? 'var(--primary-color)' : 'var(--surface-color-light)',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, textTransform: 'capitalize'
                }}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Asset List Table */}
          <div className="card" style={{ overflow: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color-light)' }}>
                  {['Tag', 'Name', 'Category', 'Location', 'Cost', 'Condition', 'Update'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <Tag size={12} />{a.asset_tag}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 500 }}>{a.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{a.category.replace('_', ' ')}</td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{a.location}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 500 }}>₹{a.purchase_cost.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${conditionColors[a.condition]}22`, color: conditionColors[a.condition], textTransform: 'capitalize' }}>{a.condition}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <select value={a.condition} onChange={e => updateCondition(a.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                        <option value="disposed">Disposed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'requests' && (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color-light)' }}>
                {['Item Requested', 'Qty', 'Reason', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{r.asset_name}</td>
                  <td style={{ padding: '1rem' }}>{r.quantity}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{r.reason || 'No reason provided'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, 
                      background: r.status === 'approved' ? '#10b98122' : r.status === 'rejected' ? '#ef444422' : '#f59e0b22',
                      color: r.status === 'approved' ? '#10b981' : r.status === 'rejected' ? '#ef4444' : '#f59e0b',
                      textTransform: 'uppercase'
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {r.status === 'pending' && (
                      <>
                        <button className="btn" onClick={() => updateRequestStatus(r.id, 'approved')} style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#10b981' }}>Approve</button>
                        <button className="btn" onClick={() => updateRequestStatus(r.id, 'rejected')} style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#ef4444' }}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No procurement requests yet.</p>}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>Maintenance Logs & Audit Trials</h3>
          <p>Scheduled audits and historical condition logs appear here.</p>
          <button className="btn" style={{ marginTop: '1rem' }}>Initiative Site Audit</button>
        </div>
      )}
    </div>
  );
};


export default Assets;
