import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Briefcase, GraduationCap, MapPin, 
  Linkedin, Calendar, Heart, Award,
  Search, Filter, Plus, ChevronRight, Globe
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const AlumniPortal = () => {
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState({ total_alumni: 0, active_mentors: 0, partner_companies: 0, placement_boost: '15%' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [alumniRes, statsRes] = await Promise.all([
        axios.get(`${API}/alumni/`, { headers }),
        axios.get(`${API}/alumni/stats`, { headers })
      ]);
      setAlumni(alumniRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error("Failed to fetch alumni data", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '2rem 3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>Alumni Relations & Career Pathways</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
            Leveraging our global network of graduates to enhance institutional reputation and student placement success.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-premium">
            <Plus size={18} /> Add Alumni
          </button>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card dashboard-stat-card" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <p className="stat-label">Global Alumni</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">{stats.total_alumni}</h2>
             <Users size={24} color="var(--primary-color)" />
          </div>
        </div>
        <div className="glass-card dashboard-stat-card" style={{ borderTop: '4px solid #10b981' }}>
          <p className="stat-label">Placement Boost</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value" style={{ color: '#10b981' }}>{stats.placement_boost}</h2>
             <Award size={24} color="#10b981" />
          </div>
        </div>
        <div className="glass-card dashboard-stat-card" style={{ borderTop: '4px solid var(--secondary-color)' }}>
          <p className="stat-label">Partner Companies</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">{stats.partner_companies}</h2>
             <Briefcase size={24} color="var(--secondary-color)" />
          </div>
        </div>
        <div className="glass-card dashboard-stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <p className="stat-label">Mentorship Network</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">{stats.active_mentors}</h2>
             <Heart size={24} color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <button onClick={() => setActiveTab('directory')} style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: `2px solid ${activeTab === 'directory' ? 'var(--primary-color)' : 'transparent'}`, color: activeTab === 'directory' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} /> Alumni Directory</button>
        <button onClick={() => setActiveTab('mentorship')} style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: `2px solid ${activeTab === 'mentorship' ? 'var(--primary-color)' : 'transparent'}`, color: activeTab === 'mentorship' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Heart size={18} /> Mentorship Programs</button>
        <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: `2px solid ${activeTab === 'events' ? 'var(--primary-color)' : 'transparent'}`, color: activeTab === 'events' ? 'var(--primary-color)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Reunions & Events</button>
      </div>

      {activeTab === 'directory' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
             <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input className="input-premium" style={{ paddingLeft: '40px' }} placeholder="Search by name, company, or batch..." />
                </div>
                <button className="icon-btn-glass"><Filter size={18} /></button>
             </div>
             <div style={{ display: 'flex', gap: '1rem' }}>
                <span className="badge" style={{ background: '#6366f122', color: '#6366f1' }}>Batch of 2024</span>
                <span className="badge" style={{ background: '#10b98122', color: '#10b981' }}>Fortune 500</span>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
            {alumni.length === 0 ? (
               <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                  <Globe size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No alumni records match your current filters.</p>
               </div>
            ) : (
              alumni.map(person => (
                <div key={person.id} className="glass-card alumni-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', transition: 'all 0.3s ease' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={32} color="var(--primary-color)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Alumnus #{person.student_id}</h3>
                      <a href={person.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#0077b5' }}><Linkedin size={18} /></a>
                    </div>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '5px 0' }}>
                      <GraduationCap size={14} /> Class of {person.graduation_year}
                    </p>
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-color-light)', borderRadius: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <Briefcase size={14} color="var(--primary-color)" />
                         <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{person.job_title}</span>
                       </div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '24px' }}>
                         {person.current_company}
                       </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-bottom)' }}>
                         <MapPin size={12} /> {person.location}
                       </div>
                       {person.mentorship_opt_in && (
                         <span className="badge" style={{ background: '#f59e0b22', color: '#f59e0b', fontSize: '0.65rem' }}>ACTIVE MENTOR</span>
                       )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'mentorship' && (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
           <Heart size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
           <h3>Mentorship Matchmaking</h3>
           <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '1rem auto' }}>
              Connect current students with alumni mentors based on industry focus and career goals.
           </p>
           <button className="btn">Initialize Mentorship Cycle</button>
        </div>
      )}
    </div>
  );
};

export default AlumniPortal;
