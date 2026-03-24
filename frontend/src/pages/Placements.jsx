import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, TrendingUp, Building2, Plus, BarChart2 } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const statusColor = (s) => ({
  placed: '#10b981',
  internship: '#6366f1',
  rejected: '#ef4444',
}[s] || '#f59e0b');

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [activeTab, setActiveTab] = useState('placements');
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_id: '', company_name: '', package_offered: '', designation: '', status: 'placed' });
  const [intForm, setIntForm] = useState({ student_id: '', company_name: '', duration_months: '', stipend: '', status: 'active' });
  const [eligibility, setEligibility] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const role = localStorage.getItem('user_role') || 'tpo';

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [pRes, aRes, sRes, iRes] = await Promise.all([
        axios.get(`${API}/placements/`, { headers }),
        axios.get(`${API}/placements/analytics`, { headers }),
        axios.get(`${API}/students/`, { headers }),
        axios.get(`${API}/placements/internships`, { headers }),
      ]);
      setPlacements(pRes.data);
      setAnalytics(aRes.data);
      setStudents(sRes.data);
      setInternships(iRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/placements/`, { ...form, student_id: parseInt(form.student_id), package_offered: parseFloat(form.package_offered) }, { headers });
      setShowForm(false);
      setForm({ student_id: '', company_name: '', package_offered: '', designation: '', status: 'placed' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleIntSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/placements/internships`, { ...intForm, student_id: parseInt(intForm.student_id), duration_months: parseInt(intForm.duration_months), stipend: parseFloat(intForm.stipend) }, { headers });
      setShowForm(false);
      setIntForm({ student_id: '', company_name: '', duration_months: '', stipend: '', status: 'active' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const fetchEligibility = async (minCgpa = 6.0, minAtt = 75.0) => {
    setEligibilityLoading(true);
    try {
      const url = role === 'student'
        ? `${API}/placements/eligibility/check`
        : `${API}/placements/eligibility/batch?min_cgpa=${minCgpa}&min_attendance=${minAtt}`;
      const res = await axios.get(url, { headers });
      setEligibility(res.data);
    } catch (e) { console.error(e); }
    finally { setEligibilityLoading(false); }
  };

  if (loading) return <p>Loading Career Hub...</p>;

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Placement & Internship Hub</h1>
          <p>Track student career progression from internships to final placements.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> {activeTab === 'placements' ? 'Add Placement' : 'Record Internship'}
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
                    { label: 'Students Placed', value: analytics.total_placed ?? placements.length, color: '#10b981', icon: Briefcase },
            { label: 'Highest Package (LPA)', value: `₹${analytics.highest_package ?? 45}L`, color: '#6366f1', icon: TrendingUp },
            { label: 'Avg. Package (LPA)', value: `₹${analytics.average_package}L`, color: '#f59e0b', icon: BarChart2 },
            { label: 'Global Recruiters', value: analytics.top_companies?.length, color: '#38bdf8', icon: Building2 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="card dashboard-stat-card" style={{ margin: 0, borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <p className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</p>
                  <h2 className="stat-value">{value}</h2>
                </div>
                <div style={{ background: `${color}15`, padding: '0.6rem', borderRadius: '10px', alignSelf: 'center', color }}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('placements')}
          className={`tab-btn ${activeTab === 'placements' ? 'active' : ''}`}
        >
          Final Placements
        </button>
        <button 
          onClick={() => setActiveTab('internships')}
          className={`tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
        >
          Internship Records
        </button>
        <button
          onClick={() => { setActiveTab('eligibility'); fetchEligibility(); }}
          className={`tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
        >
          🎯 Eligibility Screening
        </button>
      </div>

      {/* Forms */}
      {showForm && activeTab === 'placements' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Record Placement</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="stat-label">Student</label>
                <select className="input-field" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="stat-label">Company</label>
                <input className="input-field" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} required />
              </div>
              <div>
                <label className="stat-label">Package (LPA)</label>
                <input className="input-field" type="number" step="0.1" value={form.package_offered} onChange={e => setForm({ ...form, package_offered: e.target.value })} required />
              </div>
              <div>
                <label className="stat-label">Designation</label>
                <input className="input-field" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="submit">Save Record</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color-light)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showForm && activeTab === 'internships' && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Record Internship</h3>
          <form onSubmit={handleIntSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="stat-label">Student</label>
                <select className="input-field" value={intForm.student_id} onChange={e => setIntForm({ ...intForm, student_id: e.target.value })} required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="stat-label">Company</label>
                <input className="input-field" value={intForm.company_name} onChange={e => setIntForm({ ...intForm, company_name: e.target.value })} required />
              </div>
              <div>
                <label className="stat-label">Duration (Months)</label>
                <input className="input-field" type="number" value={intForm.duration_months} onChange={e => setIntForm({ ...intForm, duration_months: e.target.value })} required />
              </div>
              <div>
                <label className="stat-label">Stipend (Monthly)</label>
                <input className="input-field" type="number" value={intForm.stipend} onChange={e => setIntForm({ ...intForm, stipend: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="submit">Save Record</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color-light)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tables */}
      <div className="card" style={{ padding: 0 }}>
        {activeTab === 'placements' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--surface-color-light)' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Student ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Company</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Package (LPA)</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Designation</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>#{p.student_id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.company_name}</td>
                  <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 'bold' }}>₹{p.package_offered}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{p.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--surface-color-light)' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Student ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Company</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Duration</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Stipend</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {internships.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>#{i.student_id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{i.company}</td>
                  <td style={{ padding: '12px 16px' }}>{new Date(i.start_date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', color: '#6366f1' }}>₹{i.is_ppo ? 'PPO Offered' : 'Standard'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(activeTab === 'placements' ? placements : internships).length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No records found in this category.</p>
        )}
      </div>
      {/* Eligibility Screening Panel */}
      {activeTab === 'eligibility' && (
        <div>
          {eligibilityLoading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}><p>Running Eligibility Engine...</p></div>
          ) : eligibility ? (
            role === 'student' ? (
              <div className="card" style={{
                borderLeft: `6px solid ${eligibility.eligible ? '#10b981' : '#ef4444'}`
              }}>
                <h2 style={{ color: eligibility.eligible ? '#10b981' : '#ef4444' }}>
                  {eligibility.eligible ? '✅ You are Eligible for Placements!' : '❌ Not Eligible — Action Required'}
                </h2>
                <div className="stat-grid" style={{ marginTop: '1.5rem' }}>
                  <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem' }}>Your CGPA</p><h2 style={{ color: eligibility.cgpa >= 6 ? '#10b981' : '#ef4444' }}>{eligibility.cgpa}</h2><p style={{ fontSize: '0.75rem' }}>Min Required: 6.0</p></div>
                  <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem' }}>Attendance</p><h2 style={{ color: eligibility.attendance_pct >= 75 ? '#10b981' : '#ef4444' }}>{eligibility.attendance_pct}%</h2><p style={{ fontSize: '0.75rem' }}>Min Required: 75%</p></div>
                  <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem' }}>Active Backlogs</p><h2 style={{ color: eligibility.backlogs === 0 ? '#10b981' : '#ef4444' }}>{eligibility.backlogs}</h2><p style={{ fontSize: '0.75rem' }}>Must be Zero</p></div>
                </div>
                {eligibility.issues?.length > 0 && (
                  <div style={{ marginTop: '1.5rem', background: '#fee2e2', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ color: '#ef4444', margin: '0 0 8px' }}>Issues to Resolve:</h4>
                    {eligibility.issues.map((issue, i) => <p key={i} style={{ margin: '4px 0', color: '#ef4444' }}>• {issue}</p>)}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="stat-grid" style={{ marginBottom: '2rem' }}>
                  <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}><p style={{ margin: 0, fontSize: '0.8rem' }}>Eligible</p><h2 style={{ color: '#10b981' }}>{eligibility.eligible_count}</h2></div>
                  <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}><p style={{ margin: 0, fontSize: '0.8rem' }}>Not Eligible</p><h2 style={{ color: '#ef4444' }}>{eligibility.ineligible_count}</h2></div>
                  <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}><p style={{ margin: 0, fontSize: '0.8rem' }}>Eligible %</p><h2 style={{ color: '#6366f1' }}>{eligibility.eligible_percentage}%</h2>
                     <div className="progress-track"><div className="progress-fill" style={{ width: `${eligibility.eligible_percentage}%`, background: '#6366f1' }}></div></div>
                  </div>
                </div>
                <div className="glass-pane" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <table>
                    <thead><tr><th>Student</th><th>Enrollment</th><th>CGPA</th><th>Attendance</th><th>Backlogs</th><th>Status</th><th>Issues</th></tr></thead>
                    <tbody>
                      {eligibility.students?.map(s => (
                        <tr key={s.student_id}>
                          <td>{s.name}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.enrollment}</td>
                          <td style={{ fontWeight: 700, color: s.cgpa >= 6 ? '#10b981' : '#ef4444' }}>{s.cgpa}</td>
                          <td style={{ fontWeight: 700, color: s.attendance_pct >= 75 ? '#10b981' : '#ef4444' }}>{s.attendance_pct}%</td>
                          <td style={{ fontWeight: 700, color: s.backlogs === 0 ? '#10b981' : '#ef4444' }}>{s.backlogs}</td>
                          <td><span className="badge-premium" style={{ background: s.eligible ? '#dcfce7' : '#fee2e2', color: s.eligible ? '#166534' : '#991b1b' }}>{s.eligible ? 'ELIGIBLE' : 'BLOCKED'}</span></td>
                          <td style={{ fontSize: '0.75rem', color: '#ef4444' }}>{s.issues?.join(', ') || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Click a tab to run eligibility screening.</p>
              <button className="btn-premium" onClick={() => fetchEligibility()}>Run Screening Now</button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Placements;
