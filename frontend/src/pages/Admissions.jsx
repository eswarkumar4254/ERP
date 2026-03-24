import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserPlus, CheckCircle, XCircle, Clock, 
  Award, Search, Filter, MoreHorizontal,
  ChevronRight, BarChart3, Globe, Zap
} from 'lucide-react';

const API = 'http://localhost:8000';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admissions/`, { headers });
      setAdmissions(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateAdmissionStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/api/v1/admissions/${id}`, { status }, { headers });
      fetchData();
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const statusMap = {
    registered: { color: 'var(--secondary-color)', icon: CheckCircle, bg: 'rgba(16, 185, 129, 0.1)' },
    allotted: { color: '#6366f1', icon: UserPlus, bg: 'rgba(99, 102, 241, 0.1)' },
    counseling: { color: '#f59e0b', icon: Clock, bg: 'rgba(245, 158, 11, 0.1)' },
    rejected: { color: 'var(--error-color)', icon: XCircle, bg: 'rgba(239, 68, 68, 0.1)' },
    pending: { color: 'var(--text-muted)', icon: Clock, bg: 'rgba(255, 255, 255, 0.05)' }
  };

  const handleStatusAction = async (id, status, isCompletion = false) => {
    try {
      if (isCompletion) {
        await axios.post(`${API}/api/v1/admissions/${id}/complete-registration`, {}, { headers });
      } else {
        await axios.patch(`${API}/api/v1/admissions/${id}`, { status }, { headers });
      }
      fetchData();
    } catch (e) { alert("Action failed. Check prerequisites."); }
  };

  const counts = {
    total: admissions.length,
    approved: admissions.filter(a => a.status === 'approved').length,
    pending: admissions.filter(a => a.status === 'pending').length,
    scholarships: admissions.filter(a => a.scholarship_amount > 0).length,
  };

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>Global Admissions Engine</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>Counseling workflow and institutional enrollment funnel across 24 global nodes.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px' }}><Zap size={18} /> Bulk Counsel</button>
            <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px' }}><UserPlus size={18} /> Manual Entry</button>
          </div>
        </div>
      </div>

      {/* Funnel Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Applications', value: counts.total, color: 'var(--primary-color)', icon: Globe },
          { label: 'Counseling Pending', value: counts.pending, color: 'var(--accent-color)', icon: Clock },
          { label: 'Institutional Yield', value: counts.approved, color: 'var(--secondary-color)', icon: CheckCircle },
          { label: 'Scholarship Grants', value: counts.scholarships, color: '#ec4899', icon: Award },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${stat.color}` }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', background: `${stat.color}15`, borderRadius: '12px' }}>
                   <stat.icon size={20} color={stat.color} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>LIVE FEED</span>
             </div>
             <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
             <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem' }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              style={{ 
                padding: '8px 20px', 
                borderRadius: '10px', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '0.85rem', 
                fontWeight: 700,
                background: filter === f ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: filter === f ? 'var(--primary-color)' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
           <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
           <input type="text" placeholder="Search application ID..." className="input-premium" style={{ width: '240px', paddingLeft: '40px', height: '40px' }} />
        </div>
      </div>

      <div className="glass-pane" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>S.No</th>
              <th>Applicant Details</th>
              <th>Channel / Node</th>
              <th>Funnel Status</th>
              <th>Assessment Score</th>
              <th>Grant Amount</th>
              <th style={{ textAlign: 'center' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing Admission Mesh...</td></tr>
            ) : (
              (filter === 'all' ? admissions : admissions.filter(a => a.status === filter)).map((a, idx) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{idx + 1}.</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {a.student_name[0]}
                       </div>
                       <div>
                          <p style={{ margin: 0, fontWeight: 700 }}>{a.student_name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.uv_registration_number || a.email}</p>
                       </div>
                    </div>
                  </td>
                  <td>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Globe size={14} color="var(--primary-color)" />
                        Direct Portal / London
                     </div>
                  </td>
                  <td>
                     <span className="badge-premium" style={{ background: statusMap[a.status]?.bg, color: statusMap[a.status]?.color }}>
                        {a.status.toUpperCase()}
                     </span>
                  </td>
                  <td>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-track" style={{ width: '60px' }}><div className="progress-fill" style={{ width: `${a.entrance_exam_score || 0}%`, background: 'var(--primary-color)' }} /></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{a.entrance_exam_score || '—'}</span>
                     </div>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--secondary-color)' }}>{a.challan_generated ? '✅ CHL ISSUED' : '—'}</td>
                  <td style={{ textAlign: 'center' }}>
                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {a.status === 'pending' && <button className="btn-ghost" onClick={() => handleStatusAction(a.id, 'counseling')} style={{ fontSize: '0.7rem' }}>Move to Counseling</button>}
                        {a.status === 'counseling' && <button className="btn-premium" onClick={() => handleStatusAction(a.id, 'allotted')} style={{ fontSize: '0.7rem' }}>Allot Seat</button>}
                        {a.status === 'allotted' && <button className="btn-premium" onClick={() => handleStatusAction(a.id, 'registered', true)} style={{ fontSize: '0.7rem', background: 'var(--secondary-color)' }}>Register</button>}
                        {a.status === 'registered' && <CheckCircle size={18} color="var(--secondary-color)" />}
                        <button className="icon-btn"><MoreHorizontal size={18} /></button>
                     </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admissions;
