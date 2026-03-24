import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, Bus, Users, MapPin, 
  Bed, Shield, Settings, Info, 
  Plus, CheckCircle2, AlertCircle, 
  Clock, Navigation2, LogIn
} from 'lucide-react';

const API = 'http://localhost:8000';

const Facilities = () => {
  const [activeTab, setActiveTab] = useState('hostels');
  const [hostels, setHostels] = useState([]);
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hRes, tRes] = await Promise.all([
        axios.get(`${API}/hostels`, { headers }),
        axios.get(`${API}/transport-routes`, { headers })
      ]);
      setHostels(hRes.data);
      setTransportRoutes(tRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading Facilities infrastructure...</p>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Facilities & Logistics</h1>
          <p>Real-time oversight of residential hostels and institutional fleet operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" style={{ background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>
            <Settings size={18} style={{ marginRight: '8px' }} /> Configure
          </button>
          <button className="btn">
            <Plus size={18} style={{ marginRight: '8px' }} /> New Entry
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #6366f1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <p className="stat-label">Total Beds</p>
              <h2 className="stat-value">{hostels.reduce((acc, h) => acc + h.total_capacity, 0)}</h2>
            </div>
            <div className="stat-icon-wrapper" style={{ background: '#6366f122' }}>
              <Bed size={22} color="#6366f1" />
            </div>
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <p className="stat-label">Active Routes</p>
              <h2 className="stat-value">{transportRoutes.length}</h2>
            </div>
            <div className="stat-icon-wrapper" style={{ background: '#10b98122' }}>
              <Bus size={22} color="#10b981" />
            </div>
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <p className="stat-label">System Guard</p>
              <h2 className="stat-value">Active</h2>
            </div>
            <div className="stat-icon-wrapper" style={{ background: '#f59e0b22' }}>
              <Shield size={22} color="#f59e0b" />
            </div>
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #ec4899' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <p className="stat-label">Logistics Up</p>
              <h2 className="stat-value">99.9%</h2>
            </div>
            <div className="stat-icon-wrapper" style={{ background: '#ec489922' }}>
              <Navigation2 size={22} color="#ec4899" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('hostels')}
          style={{ 
            background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer',
            borderBottom: `2px solid ${activeTab === 'hostels' ? 'var(--primary-color)' : 'transparent'}`,
            color: activeTab === 'hostels' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Building2 size={18} /> Hostel Management
        </button>
        <button 
          onClick={() => setActiveTab('transport')}
          style={{ 
            background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer',
            borderBottom: `2px solid ${activeTab === 'transport' ? 'var(--primary-color)' : 'transparent'}`,
            color: activeTab === 'transport' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Bus size={18} /> Transport & Fleet
        </button>
      </div>

      {activeTab === 'hostels' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {hostels.map(h => (
            <div key={h.id} className="card lms-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '10px', background: '#6366f111', borderRadius: '12px' }}>
                    <Building2 color="#6366f1" size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{h.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Warden: {h.warden_name}</p>
                  </div>
                </div>
                <span className="badge" style={{ background: '#10b98122', color: '#10b981' }}>Fully Operational</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--surface-color-light)', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Occupancy</p>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{h.total_capacity} <Users size={14} style={{ opacity: 0.6 }} /></h4>
                </div>
                <div style={{ background: 'var(--surface-color-light)', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vacant Rooms</p>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#10b981' }}>12 <Bed size={14} style={{ opacity: 0.6 }} /></h4>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <button style={{ color: '#6366f1', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>View Room Map</button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', alignSelf: 'center' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Security Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--surface-color-light)' }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Route Title</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Vehicle & Driver</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Monthly Fee</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transportRoutes.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Navigation2 size={16} color="#6366f1" />
                      <span style={{ fontWeight: 600 }}>{t.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.vehicle_number}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.driver_name}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge" style={{ background: '#10b98122', color: '#10b981' }}>On Route</span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 700 }}>₹{t.monthly_fee}</td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>Tracking</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transportRoutes.length === 0 && <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No fleet routes registered.</p>}
        </div>
      )}
    </div>
  );
};

export default Facilities;
