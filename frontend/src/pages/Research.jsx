import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, TrendingUp, Award, BookOpen, Users, 
  BarChart3, ShieldCheck, Database, Target, FileText,
  Briefcase, Zap, Search, LayoutGrid, CheckCircle,
  Plus, DollarSign, Microscope, Globe, FileSignature
} from 'lucide-react';

const ResearchModuleSize = () => {
  const role = localStorage.getItem('user_role') || 'staff';
  const name = localStorage.getItem('user_name') || 'User';

  const [activeTab, setActiveTab] = useState('publications');
  const [publications, setPublications] = useState([]);
  const [grants, setGrants] = useState([]);
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API = 'http://localhost:8000/api/v1';

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [pubRes, grantRes, patRes] = await Promise.all([
        axios.get(`${API}/research/publications`, { headers }),
        axios.get(`${API}/research/grants`, { headers }),
        axios.get(`${API}/research/patents`, { headers })
      ]);
      setPublications(pubRes.data);
      setGrants(grantRes.data);
      setPatents(patRes.data);
    } catch (e) {
      console.error("RMS Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Publications', value: publications.length || '1,842', icon: BookOpen, color: '#6366f1' },
    { label: 'Total Patents', value: patents.length || '42', icon: ShieldCheck, color: '#10b981' },
    { label: 'Grants Funded', value: grants.length > 0 ? `₹${(grants.reduce((a, b) => a + b.amount_granted, 0) / 100000).toFixed(1)}L` : '₹1.2 Cr', icon: DollarSign, color: '#f59e0b' },
    { label: 'Avg H-Index', value: '14.2', icon: TrendingUp, color: '#ec4899' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Research & Development (RMS)</h1>
        <p>Managing faculty publications, patents, research grants, and institutional H-index.</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card">
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ background: `${s.color}15`, padding: '10px', borderRadius: '10px', color: s.color }}>
                   <s.icon size={24} />
                </div>
                <div>
                   <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>{s.label}</p>
                   <h2 style={{ margin: 0 }}>{s.value}</h2>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'publications' ? 'active' : ''}`} onClick={() => setActiveTab('publications')}>Publications</button>
        <button className={`tab-btn ${activeTab === 'patents' ? 'active' : ''}`} onClick={() => setActiveTab('patents')}>Patents & IP</button>
        <button className={`tab-btn ${activeTab === 'grants' ? 'active' : ''}`} onClick={() => setActiveTab('grants')}>Research Grants</button>
        <button className={`tab-btn ${activeTab === 'targets' ? 'active' : ''}`} onClick={() => setActiveTab('targets')}>R&D Targets</button>
      </div>

      {activeTab === 'publications' && (
        <div className="card">
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Institutional Research Ledger</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button className="btn-ghost">Add Bulk (DOI)</button>
                 <button className="btn-premium"><Plus size={16} /> Submit New Paper</button>
              </div>
           </div>
           <table style={{ marginTop: '1rem' }}>
              <thead>
                 <tr><th>DOI / URL</th><th>Title</th><th>Faculty ID</th><th>Journal</th><th>Indexing</th><th>Status</th></tr>
              </thead>
              <tbody>
                 {publications.length > 0 ? publications.map(p => (
                   <tr key={p.id}>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{p.doi_url || 'N/A'}</td>
                      <td style={{ fontWeight: 'bold' }}>{p.title}</td>
                      <td>{p.staff_id}</td>
                      <td>{p.journal_name}</td>
                      <td><span className="badge">{p.indexed_in}</span></td>
                      <td><span className="badge" style={{ background: p.status === 'published' ? '#dcfce7' : '#fef3c7', color: p.status === 'published' ? '#166534' : '#92400e' }}>{p.status.toUpperCase()}</span></td>
                   </tr>
                 )) : (
                   <tr>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>10.1016/j.ai.2023.01</td>
                      <td style={{ fontWeight: 'bold' }}>Edge Computing for Smart Cities</td>
                      <td>Dr. Amit Mishra</td>
                      <td>IEEE Access</td>
                      <td><span className="badge">SCOPUS</span></td>
                      <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>PUBLISHED</span></td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'patents' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3>IP & Patent Portfolio</h3>
               <button className="btn-premium">File New Patent</button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Patent No</th><th>Title</th><th>Staff ID</th><th>Status</th><th>Filing Date</th></tr>
               </thead>
               <tbody>
                  {patents.length > 0 ? patents.map(p => (
                    <tr key={p.id}>
                       <td>{p.patent_number || 'PENDING'}</td>
                       <td style={{ fontWeight: 'bold' }}>{p.title}</td>
                       <td>{p.staff_id}</td>
                       <td><span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>{p.status.toUpperCase()}</span></td>
                       <td>{new Date(p.filing_date).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                       <td>2024410123xx</td>
                       <td style={{ fontWeight: 'bold' }}>IoT Based Soil Nutrient Monitor</td>
                       <td>Dr. Rajesh K.</td>
                       <td><span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>GRANTED</span></td>
                       <td>Jan 12, 2024</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'grants' && (
         <div className="card">
            <h3>Funded Research Projects</h3>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Project Title</th><th>Agency</th><th>Amount</th><th>Staff ID</th><th>Spent</th><th>Status</th></tr>
               </thead>
               <tbody>
                  {grants.length > 0 ? grants.map(g => (
                    <tr key={g.id}>
                       <td style={{ fontWeight: 'bold' }}>{g.title}</td>
                       <td>{g.agency}</td>
                       <td>₹{g.amount_granted.toLocaleString()}</td>
                       <td>{g.staff_id}</td>
                       <td>₹{g.amount_spent.toLocaleString()}</td>
                       <td><span className="badge">{g.status.toUpperCase()}</span></td>
                    </tr>
                  )) : (
                    <tr>
                       <td style={{ fontWeight: 'bold' }}>AI for COVID Surveillance</td>
                       <td>DST - SERB</td>
                       <td>₹42,00,000</td>
                       <td>Dr. Amit Mishra</td>
                       <td>₹12,40,000</td>
                       <td><span style={{ fontSize: '0.8rem' }}>ACTIVE</span></td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'targets' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
               <h3>R&D Target Achievement</h3>
               <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Tracking faculty output against set institutional yearly targets.</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>CSE Department (Papers)</span>
                        <span>310 / 400</span>
                     </div>
                     <div className="progress-track"><div className="progress-fill" style={{ width: '77.5%', background: '#6366f1' }}></div></div>
                  </div>
                  <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>ECE Department (Grants)</span>
                        <span>₹15L / ₹25L</span>
                     </div>
                     <div className="progress-track"><div className="progress-fill" style={{ width: '60%', background: '#10b981' }}></div></div>
                  </div>
               </div>
            </div>
            <div className="card" style={{ background: '#f8fafc' }}>
               <h3>Dean R&D Command Center</h3>
               <p style={{ fontSize: '0.85rem' }}>Quick actions for research oversight.</p>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="btn" style={{ background: '#fff', border: '1px solid var(--border-color)', color: '#000' }}>Post New Target</button>
                  <button className="btn" style={{ background: '#fff', border: '1px solid var(--border-color)', color: '#000' }}>Approve Expenditure</button>
                  <button className="btn" style={{ background: '#fff', border: '1px solid var(--border-color)', color: '#000' }}>Audit Publications</button>
                  <button className="btn" style={{ background: '#fff', border: '1px solid var(--border-color)', color: '#000' }}>H-Index Analysis</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ResearchModuleSize;
