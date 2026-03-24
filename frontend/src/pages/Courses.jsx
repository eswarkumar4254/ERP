import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, Search, Filter, Plus, 
  Layers, Clock, GraduationCap, 
  MoreVertical, Download, ExternalLink,
  Code2, Share2
} from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/v1/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>Academic Governance</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>Unified curriculum, subject catalogue, and institutional program frameworks.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px' }}><Share2 size={18} /> Global Sync</button>
            <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px' }}><Plus size={18} /> Add Program</button>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search curricula by code, title or department..." 
            className="input-premium"
            style={{ paddingLeft: '44px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Layers size={16} /> All Faculties
          </div>
          <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Clock size={16} /> Credit Thresholds
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10vh' }}>
          <Activity className="spin" size={40} color="var(--primary-color)" />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Compiling Academic Catalog...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {courses.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
               <p style={{ color: 'var(--text-muted)' }}>No curriculum profiles found for this institutional context.</p>
            </div>
          ) : (
            courses.filter(c => 
              c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              c.code.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((c) => (
              <div key={c.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Code2 size={24} color="var(--primary-color)" />
                   </div>
                   <button className="icon-btn" style={{ padding: '6px' }}><MoreVertical size={18} color="var(--text-muted)" /></button>
                </div>

                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className="badge-premium" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>{c.code}</span>
                      <span className="badge-premium" style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)' }}>{c.credits} CREDITS</span>
                   </div>
                   <h3 style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.4' }}>{c.name}</h3>
                   <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {c.description || 'Global standard curriculum for advanced institutional learning and multi-branch certification.'}
                   </p>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      <GraduationCap size={14} /> UG PROGRAM
                   </div>
                   <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Catalog View <ExternalLink size={12} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Activity Proxy
const Activity = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default Courses;
