import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  History, GraduationCap, MapPin, Search, Calendar, 
  Award, Briefcase, Users, MessageSquare, HeartHandshake,
  LayoutGrid, Star, ArrowRight, Download, QrCode
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const AlumniPortal = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/student-affairs/alumni`, { headers });
      setAlumni(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <p>Syncing Alumni Network...</p>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Alumni Management & Portals</h1>
        <p>Stay connected with your alma mater, mentor juniors, and track career milestones.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`} onClick={() => setActiveTab('directory')}>Alumni Directory</button>
        <button className={`tab-btn ${activeTab === 'mentorship' ? 'active' : ''}`} onClick={() => setActiveTab('mentorship')}>Mentorship Hub</button>
        <button className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>Referral Job Board</button>
        <button className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`} onClick={() => setActiveTab('id')}>Digital ID & Card</button>
      </div>

      {activeTab === 'directory' && (
        <div className="card">
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="input-group" style={{ flex: 1, position: 'relative' }}>
                 <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                 <input type="text" className="input-premium" placeholder="Search by name, company, or graduation year..." style={{ paddingLeft: '40px' }} />
              </div>
              <button className="btn">Apply Filters</button>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {alumni.map(person => (
                <div key={person.id} className="glass-card" style={{ borderTop: person.is_mentor ? '3px solid #6366f1' : 'none' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="avatar-initial" style={{ width: '40px', height: '40px' }}>{person.company[0]}</div>
                      {person.is_mentor && <span className="badge" style={{ background: '#dcfce7', color: '#166534', fontSize: '0.65rem' }}>MENTOR</span>}
                   </div>
                   <h4 style={{ marginTop: '10px' }}>Alumni #{person.student_id}</h4>
                   <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Class of {person.graduation_year}</p>
                   <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                      <p>🏢 <strong>{person.company}</strong></p>
                      <p>💼 {person.designation}</p>
                   </div>
                   <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
                      <button className="btn-ghost" style={{ flex: 1, fontSize: '0.75rem' }}>View Profile</button>
                      <button className="btn" style={{ flex: 1, fontSize: '0.75rem' }}>Connect</button>
                   </div>
                </div>
              ))}
              {alumni.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6 }}>No alumni records published yet.</p>}
           </div>
        </div>
      )}

      {activeTab === 'mentorship' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div className="card">
               <h3>Active Mentorship Pairings</h3>
               <div style={{ border: '2px dashed var(--border-color)', height: '300px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#f9fafb' }}>
                  <HeartHandshake size={32} color="var(--text-muted)" />
                  <p style={{ marginTop: '10px' }}>No active pairings. Select a mentor from the directory to start.</p>
               </div>
            </div>
            <div className="card">
               <h3>Mentorship FAQ</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
                  <div className="glass-pane">
                     <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>How often should we meet?</p>
                     <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>We recommend at least one 30-min sync per month.</p>
                  </div>
                  <div className="glass-pane">
                     <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Is it certificate based?</p>
                     <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Yes, students get 2 activity credits post completion.</p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'jobs' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3>Exclusive Referral Board</h3>
               <button className="btn-premium">Post a Referral</button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Posted By</th><th>Company</th><th>Role</th><th>Location</th><th>Deadline</th><th>Action</th></tr>
               </thead>
               <tbody>
                  <tr>
                     <td style={{ fontWeight: 'bold' }}>Siddharth V. (Mock)</td>
                     <td>Google</td>
                     <td>Associate SWE</td>
                     <td>Remote / India</td>
                     <td>Mar 30, 2026</td>
                     <td><button className="btn">Apply via Referral</button></td>
                  </tr>
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'id' && (
         <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h3>Digital Alumni ID</h3>
            <div className="glass-card" style={{ marginTop: '2rem', padding: '2rem', border: '1px solid #6366f1' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: 0 }}>NexGen University</h4>
                  <QrCode size={24} color="#6366f1" />
               </div>
               <div className="avatar-initial" style={{ width: '80px', height: '80px', margin: '0 auto' }}>A</div>
               <h3 style={{ marginTop: '1rem' }}>Member #4221</h3>
               <p style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '0.85rem' }}>ALUMNI - CLASS OF 2026</p>
               <hr style={{ margin: '1.5rem 0', opacity: 0.1 }} />
               <div style={{ textAlign: 'left', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <p>Valid From: May 2026</p>
                  <p>Library Access: Lifetime</p>
                  <p>Guest House Discount: 20%</p>
               </div>
            </div>
            <button className="btn-premium" style={{ marginTop: '2rem', width: '100%' }}><Download size={14} /> Download Digital Card</button>
         </div>
      )}
    </div>
  );
};

export default AlumniPortal;
