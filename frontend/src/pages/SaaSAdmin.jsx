import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, Plus, CheckCircle, XCircle, 
  Users, Globe, Calendar, CreditCard, 
  ShieldCheck, ArrowRight, BarChart3, 
  Activity, Key, HardDrive, Cpu, 
  Search, Filter, MoreVertical, LayoutGrid,
  Server, Zap, Layers, RefreshCw
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const SaaSAdmin = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchTenants(); }, []);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/tenants/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data || []);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>Global SaaS Plane</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>Orchestrate institutional isolation, license lifecycle, and cross-tenant performance analytics.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px' }}><RefreshCw size={18} /> Sync Clusters</button>
            <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px' }}><Plus size={18} /> Provision Tenant</button>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search institutions by domain, name or stack..." 
            className="input-premium"
            style={{ paddingLeft: '44px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Server size={16} /> Load Balancer 2.4s
          </div>
          <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Zap size={16} /> Hot-Swap Active
          </div>
        </div>
      </div>

      {/* Global Instance Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Active Partitions', value: tenants.length, up: true, color: 'var(--primary-color)', icon: Layers },
          { label: 'Cloud Egress', value: '4.2 TB', up: true, color: 'var(--secondary-color)', icon: Globe },
          { label: 'System Requests', value: '184M', up: true, color: 'var(--accent-color)', icon: Activity },
          { label: 'Database Shards', value: '64', up: true, color: '#ec4899', icon: HardDrive },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <stat.icon size={20} color={stat.color} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>ONLINE</span>
             </div>
             <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
             <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem' }}>{stat.value}</h2>
             <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', background: `${stat.color}05`, borderRadius: '50%', filter: 'blur(20px)' }} />
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10vh' }}>
          <Activity className="spin" size={40} color="var(--primary-color)" />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Synchronizing Global Control Plane...</p>
        </div>
      ) : (
        <div className="glass-pane" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <table style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Institution Partition</th>
                <th>Target Domain</th>
                <th>License Lifecycle</th>
                <th>Isolation Status</th>
                <th>System Utilization</th>
                <th style={{ textAlign: 'center' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                   <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No partitions provisioned on the global stack.</td>
                </tr>
              ) : (
                tenants.filter(t => 
                  t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  t.domain.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {t.name[0]}
                        </div>
                        <span style={{ fontWeight: 700 }}>{t.name}</span>
                      </div>
                    </td>
                    <td><code style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>{t.domain}</code></td>
                    <td>
                       <span className="badge-premium" style={{ background: t.subscription_plan === 'enterprise' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)', color: t.subscription_plan === 'enterprise' ? '#c084fc' : 'var(--primary-color)' }}>
                         {(t.subscription_plan || 'STANDARD').toUpperCase()}
                       </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: 700 }}>
                          <ShieldCheck size={14} /> ISOLATED
                       </div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-track" style={{ width: '80px' }}><div className="progress-fill" style={{ width: '22%', background: 'var(--primary-color)' }} /></div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>22%</span>
                       </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                       <button className="icon-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.02)' }}><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SaaSAdmin;
