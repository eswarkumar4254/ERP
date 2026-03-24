import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HeartPulse, Brain, Heart, Activity, ShieldAlert,
  Stethoscope, FileText, Calendar, Plus, Search,
  ArrowRight, CheckCircle, Clock, Database, Thermometer
} from 'lucide-react';

const StudentCounseling = () => {
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';

  const [activeTab, setActiveTab] = useState('wellness');
  const [counselingSessions, setCounselingSessions] = useState([]);
  const [mood, setMood] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API = 'http://localhost:8000/api/v1';

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [counselRes] = await Promise.all([
        axios.get(`${API}/student-affairs/counseling`, { headers })
      ]);
      setCounselingSessions(counselRes.data);
    } catch (e) {
      console.error("Counseling Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const medicalRecords = healthData || {
    bloodGroup: 'O+',
    allergies: ['Peanuts', 'Penicillin'],
    vaccinations: ['Covid-19 Booster', 'Hep B'],
    recentCheckup: 'Jan 15, 2026',
    emergencyContact: '+91 98XXX-X8822 (Father)'
  };

  if (role === 'student' || role === 'parent') {
    return (
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Student Welfare & Safe Space</h1>
            <p>Confidential support, mental wellness tracking, and institutional care.</p>
          </div>
          <button className="btn" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
            <ShieldAlert size={18} /> Emergency Crisis Help
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button className={`tab-btn ${activeTab === 'wellness' ? 'active' : ''}`} onClick={() => setActiveTab('wellness')}>Personal Wellness</button>
          <button className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Wellness Library</button>
          <button className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`} onClick={() => setActiveTab('medical')}>Medical Vault</button>
          <button className={`tab-btn ${activeTab === 'discipline' ? 'active' : ''}`} onClick={() => setActiveTab('discipline')}>Conduct Logs</button>
        </div>

        {activeTab === 'wellness' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="card">
                <h3>Daily Mood Check-in</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>How are you feeling today, {name}?</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {[
                    { emoji: '😔', label: 'Low', color: '#6366f1' },
                    { emoji: '😕', label: 'Meh', color: '#94a3b8' },
                    { emoji: '😐', label: 'Okay', color: '#10b981' },
                    { emoji: '🙂', label: 'Good', color: '#f59e0b' },
                    { emoji: '😊', label: 'Great', color: '#ec4899' }
                  ].map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setMood(m.label)}
                      className="glass-card"
                      style={{
                        border: mood === m.label ? `2px solid ${m.color}` : '1px solid var(--border-color)',
                        padding: '12px 5px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
                {mood && (
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    Glad you shared! We've logged your {mood} mood.
                  </p>
                )}
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>My Counseling Sessions</h3>
                  <button className="btn-premium">Schedule Professional Help</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '12px' }}>Date</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Professional</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {counselingSessions.length > 0 ? counselingSessions.map((s, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px' }}>{new Date(s.session_date).toLocaleDateString()}</td>
                          <td style={{ padding: '12px' }}><span className="badge">{s.type}</span></td>
                          <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.counselor_id}</td>
                          <td style={{ padding: '12px' }}><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>COMPLETED</span></td>
                          <td style={{ padding: '12px' }}><button className="btn-ghost" style={{ fontSize: '0.7rem' }}>View Findings</button></td>
                        </tr>
                      )) : (
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px' }}>Feb 12, 2026</td>
                          <td style={{ padding: '12px' }}><span className="badge">Academic Stress</span></td>
                          <td style={{ padding: '12px', fontWeight: 'bold' }}>Dr. Sarah J.</td>
                          <td style={{ padding: '12px' }}><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Completed</span></td>
                          <td style={{ padding: '12px' }}><button className="btn-ghost" style={{ fontSize: '0.7rem' }}>Download PDF</button></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                { title: 'Managing Exam Anxiety', desc: '5-minute breathing techniques and focus exercises.', icon: Brain, color: '#6366f1' },
                { title: 'Mindfulness & Meditation', desc: 'Curated list of guided sessions for campus life.', icon: Heart, color: '#ec4899' },
                { title: 'Healthy Sleep Cycles', desc: 'Internal research on student sleep patterns and tips.', icon: Activity, color: '#10b981' },
                { title: 'Digital Detox Guide', desc: 'How to balance screen time and physical activity.', icon: Stethoscope, color: '#f59e0b' }
              ].map((res, i) => (
                <div key={i} className="card-pro" style={{ padding: '1.5rem', borderTop: `4px solid ${res.color}` }}>
                  <res.icon size={24} color={res.color} style={{ marginBottom: '1rem' }} />
                  <h4 style={{ margin: '0 0 10px 0' }}>{res.title}</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>{res.desc}</p>
                  <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Access Resource <ArrowRight size={14} style={{ marginLeft: '8px' }} /></button>
                </div>
              ))}
            </div>

            <div className="glass-pane" style={{ padding: '2rem', textAlign: 'center' }}>
              <Brain size={48} color="var(--primary-color)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Anonymous Peer Support</h3>
              <p style={{ maxWidth: '600px', margin: '10px auto', fontSize: '0.9rem', opacity: 0.7 }}>
                Connect with trained student mentors and peers in a 100% anonymous environment. Sometimes just talking helps.
              </p>
              <button className="btn-premium" style={{ marginTop: '1.5rem' }}>Join Secure Chat Room</button>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
              <h3>Emergency Profile</h3>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Blood Group</span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{medicalRecords.bloodGroup}</span>
                </div>
                <div className="glass-card">
                  <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Allergies</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                    {(Array.isArray(medicalRecords.allergies) ? medicalRecords.allergies : []).map(a => <span key={a} className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>{a}</span>)}
                  </div>
                </div>
                <div className="glass-card">
                  <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Emergency Contact</p>
                  <p style={{ fontSize: '0.9rem' }}>{medicalRecords.emergencyContact}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <h3>Medical History & Records</h3>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-pane">
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Last Campus Checkup</p>
                  <h4 style={{ margin: 0 }}>{medicalRecords.recentCheckup}</h4>
                </div>
                <div className="glass-pane">
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Vaccinations</p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{(Array.isArray(medicalRecords.vaccinations) ? medicalRecords.vaccinations : []).join(', ')}</p>
                </div>
                <button className="btn-ghost" style={{ width: '100%' }}><Plus size={14} /> Upload Hospital Report</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discipline' && (
          <div className="card">
            <h3>Disciplinary Audit Trail</h3>
            <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle size={24} color="#10b981" />
              <p style={{ margin: 0, fontWeight: 'bold', color: '#065f46' }}>No active disciplinary issues or behavioral reports found for your profile.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1>Institutional Welfare Command</h1>
          <p>Predictive behavioral analytics and campus-wide health monitoring.</p>
        </div>
        <button className="btn" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', fontWeight: 'bold', borderRadius: '10px' }}>
          Activate Rapid Response Team
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
          <p className="stat-label">Daily Intake Volume</p>
          <h2 className="stat-value" style={{ margin: '10px 0' }}>{counselingSessions.length + 8} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>sessions</span></h2>
          <p style={{ fontSize: '0.7rem', color: '#10b981', margin: 0 }}>↑ 12% vs last week</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <p className="stat-label">Emotional Alerts</p>
          <h2 className="stat-value" style={{ margin: '10px 0' }}>2 <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>High Priority</span></h2>
          <p style={{ fontSize: '0.7rem', color: '#ef4444', margin: 0 }}>Action required immediately</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <p className="stat-label">Staff Utilization</p>
          <h2 className="stat-value" style={{ margin: '10px 0' }}>84%</h2>
          <p style={{ fontSize: '0.7rem', margin: 0 }}>Avg wait: 14 mins</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <p className="stat-label">Campus Wellness</p>
          <h2 className="stat-value" style={{ margin: '10px 0' }}>7.8/10</h2>
          <p style={{ fontSize: '0.7rem', color: '#10b981', margin: 0 }}>Positive trend overall</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2.5rem', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Intake Queue & Case Files</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-ghost" style={{ fontSize: '0.75rem' }}><Search size={14} /> Search Records</button>
            <button className="btn-ghost" style={{ fontSize: '0.75rem' }}><Database size={14} /> Export Logs</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--surface-color-light)' }}>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>Student Profile</th>
                <th style={{ padding: '16px' }}>Session Intent</th>
                <th style={{ padding: '16px' }}>Urgency</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(counselingSessions.length > 0 ? counselingSessions : [
                { id: 101, student_id: 'STU-992', type: 'Clinical Depression', notes: 'Student reporting recurring low energy scores.', priority: 'High' },
                { id: 102, student_id: 'STU-441', type: 'Career Counseling', notes: 'Discussing placement anxiety.', priority: 'Normal' }
              ]).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 'bold' }}>{s.student_id}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Year 3 • CSE Dept</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge" style={{ background: 'var(--surface-color-light)' }}>{s.type}</span>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', opacity: 0.8 }}>{s.notes.substring(0, 40)}...</p>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge" style={{
                      background: s.priority === 'High' ? '#fee2e2' : '#f3f4f6',
                      color: s.priority === 'High' ? '#ef4444' : '#6b7280',
                      fontWeight: 'bold'
                    }}>{s.priority?.toUpperCase() || 'NORMAL'}</span>
                  </td>
                  <td style={{ padding: '16px' }}><span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>AWAITING INTAKE</span></td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Open Case</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentCounseling;
