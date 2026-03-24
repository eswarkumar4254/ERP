import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Send, Users, Bell, MessageSquare,
  Mail, Phone, Smartphone, History,
  Search, Filter, Plus, Info, CheckCircle2,
  MoreVertical, ShieldAlert
} from 'lucide-react';

const API = 'http://localhost:8000';

const Communication = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  const [form, setForm] = useState({ title: '', content: '', target_group: 'all' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/api/v1/broadcasts/`, { headers }).catch(() => ({ data: [] }));
      setBroadcasts(response.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/v1/broadcasts/`, { ...form, sender_id: 1 }, { headers });
      setForm({ title: '', content: '', target_group: 'all' });
      setActiveTab('history');
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p>Connecting to Institutional Mesh...</p>;

  return (
    <div className="page-content">
      {/* 🔮 Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Institutional Communication</h1>
          <p style={{ color: 'var(--text-muted)' }}>Orchestrate mass announcements across email, SMS, and push notification channels.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-ghost">
             <History size={18} /> Logs
          </button>
          <button className="btn" onClick={() => setActiveTab('new')}>
            <Plus size={18} /> New Broadcast
          </button>
        </div>
      </div>

      {/* 📊 Network Analytics Grid */}
      <div className="stat-grid">
        <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 5px 0' }}>MESSAGES DISPATCHED</p>
              <h2 style={{ margin: 0 }}>{broadcasts.length}</h2>
            </div>
            <div className="stat-icon" style={{ background: '#eff6ff' }}><Mail size={22} color="var(--secondary-color)" /></div>
          </div>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 5px 0' }}>DELIVERY RATE</p>
              <h2 style={{ margin: 0 }}>98.4%</h2>
            </div>
            <div className="stat-icon" style={{ background: '#ecfdf5' }}><CheckCircle2 size={22} color="#10b981" /></div>
          </div>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 5px 0' }}>SMS BALANCE</p>
              <h2 style={{ margin: 0 }}>4.2k</h2>
            </div>
            <div className="stat-icon" style={{ background: '#fffbeb' }}><Smartphone size={22} color="#f59e0b" /></div>
          </div>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 5px 0' }}>URGENT ALERTS</p>
              <h2 style={{ margin: 0 }}>2</h2>
            </div>
            <div className="stat-icon" style={{ background: '#fef2f2' }}><ShieldAlert size={22} color="var(--accent-color)" /></div>
          </div>
        </div>
      </div>

      {/* 📑 Local Navigation */}
      <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('new')} 
          className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
        >
          <MessageSquare size={16} /> Compose New
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
        >
          <History size={16} /> Broadcast Logs
        </button>
      </div>

      {/* 📝 Main Console */}
      {activeTab === 'new' ? (
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', borderTop: '3px solid var(--primary-color)' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={24} color="var(--primary-color)" /> Define Global Transmission
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ANNOUNCEMENT TITLE</label>
              <input 
                className="input-premium" 
                required 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g., Campus Reopening Guidelines"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>TARGET RECIPIENT GROUP</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {['all', 'students', 'staff', 'parents'].map(group => (
                  <button 
                    key={group}
                    type="button"
                    onClick={() => setForm({...form, target_group: group})}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '4px', 
                      border: '1px solid',
                      borderColor: form.target_group === group ? 'var(--primary-color)' : 'var(--border-color)', 
                      background: form.target_group === group ? 'var(--primary-color)' : 'var(--surface-color)',
                      color: form.target_group === group ? '#fff' : 'var(--text-primary)',
                      cursor: 'pointer', 
                      textTransform: 'uppercase', 
                      fontWeight: 'bold', 
                      fontSize: '0.75rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>MESSAGE PAYLOAD</label>
              <textarea 
                className="input-premium" 
                rows="8" 
                required 
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                placeholder="Construct your institutional message here..."
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-color-light)', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> Email</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={16} /> SMS</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Bell size={16} /> Push</span>
              </div>
              <button className="btn-premium" type="submit" style={{ padding: '12px 32px' }}>
                <Send size={18} /> DISPATCH MESSAGE
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {broadcasts.map(b => (
            <div key={b.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', position: 'relative' }}>
              <div className="stat-icon" style={{ minWidth: '44px', height: '44px' }}>
                <Bell size={20} color="var(--primary-color)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{b.title}</h3>
                  <span className="badge">{new Date(b.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: '0 0 1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{b.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>TARGET: {b.target_group}</span>
                    <div style={{ display: 'flex', gap: '12px', marginLeft: '1rem' }}>
                      <Mail size={14} color="#10b981" title="Email Success" />
                      <Smartphone size={14} color="#10b981" title="SMS Success" />
                      <Bell size={14} color="#f59e0b" title="Push Pending" />
                    </div>
                  </div>
                  <button className="icon-btn"><MoreVertical size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {broadcasts.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
              <Info size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>No transmission history found in the institutional records.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Communication;
