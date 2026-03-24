import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserPlus, Mail, ShieldAlert, CheckCircle,
  Key, CreditCard, ArrowRight, Download, Printer
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const PROGRAM_STRUCTURE = {
  UG: {
    label: "Undergraduate (UG)",
    courses: {
      "B.Tech": 4,
      "BBA": 3,
      "BCA": 3,
      "B.Com": 3,
      "B.Sc": 3
    }
  },
  PG: {
    label: "Postgraduate (PG)",
    courses: {
      "M.Tech": 2,
      "MBA": 2,
      "MCA": 2,
      "M.Sc": 2
    }
  },
  PhD: {
    label: "Doctorate (PhD)",
    courses: {
      "PhD Research": 5
    }
  }
};

const StudentOnboarding = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    first_name: '', 
    last_name: '', 
    enrollment_number: '',
    contact_email: '', 
    grade_level: 'UG',
    branch: 'B.Tech', 
    current_year: 1,
    admission_year: new Date().getFullYear(),
    password: 'Student@123'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await axios.get(`${API}/tenants/me`, { headers });
      setPlan(res.data.plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (level) => {
    const firstCourse = Object.keys(PROGRAM_STRUCTURE[level].courses)[0];
    setForm({
      ...form, 
      grade_level: level, 
      branch: firstCourse, 
      current_year: 1
    });
  };

  const handleCourseChange = (course) => {
    setForm({
      ...form, 
      branch: course, 
      current_year: 1
    });
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        grade_level: PROGRAM_STRUCTURE[form.grade_level].label // Send full label to backend
      };
      const res = await axios.post(`${API}/students/enroll`, payload, { headers });
      setResult(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : "Enrollment failed. Check form data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !plan) return <div className="p-10">Verifying Institutional Plan...</div>;

  if (plan && !plan.modules.find(m => m.name === 'SMS')) {
    return (
      <div className="page-content p-10">
        <div className="glass-card text-center p-10">
          <ShieldAlert size={64} color="#ef4444" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Automated Onboarding Restricted</h2>
          <p className="text-muted mb-6">Your "{plan.name}" plan does not include the <b>Student Lifecycle (SMS)</b> module.</p>
          <button className="btn-premium">Upgrade to Enterprise</button>
        </div>
      </div>
    );
  }

  const currentLevelOptions = PROGRAM_STRUCTURE[form.grade_level];
  const maxYears = currentLevelOptions.courses[form.branch] || 1;

  return (
    <div className="page-content">
      {/* 🚀 Page Header */}
      <div className="page-header">
        <h1>Student Admission</h1>
        <p style={{ color: 'var(--text-muted)' }}>Securely provision identity credentials and synchronize academic records across the institutional registry.</p>
      </div>

      {result ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '3rem', textAlign: 'center', borderTop: '4px solid #10b981' }}>
            <div className="stat-icon" style={{ width: '64px', height: '64px', background: '#ecfdf5', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={32} color="#10b981" />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>ONBOARDING SUCCESSFUL</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Institutional identity has been propagated to the global registry.</p>
            
            <div style={{ background: 'var(--surface-color-light)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{result.first_name} {result.last_name}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{result.enrollment_number}</p>
                </div>
                <span className="badge" style={{ background: '#ecfdf5', color: '#10b981', borderColor: '#10b981' }}>OFFICIAL RECORD</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                   <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>LOGIN IDENTIFIER</label>
                   <p style={{ fontFamily: 'monospace', margin: 0, fontWeight: 'bold' }}>{result.contact_email}</p>
                </div>
                <div>
                   <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>GENESIS PASSWORD</label>
                   <p style={{ fontFamily: 'monospace', margin: 0, fontWeight: 'bold' }}>{form.password}</p>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px dashed var(--border-color)', display: 'flex', gap: '1rem' }}>
                <button className="btn-ghost" style={{ flex: 1 }}><Printer size={18} /> Print Record</button>
                <button className="btn" style={{ flex: 1 }}><Download size={18} /> Archive identity</button>
              </div>
            </div>
            
            <button className="btn" style={{ marginTop: '2.5rem', background: 'transparent', color: 'var(--secondary-color)', border: 'none' }} onClick={() => setResult(null)}>
               Enroll Another Candidate <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
             <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={24} color="var(--primary-color)" /> Academic Entry Record
             </h3>
             
             <form onSubmit={handleEnroll}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>GIVEN NAME</label>
                      <input type="text" className="input-premium" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="e.g. John" />
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>FAMILY NAME</label>
                      <input type="text" className="input-premium" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="e.g. Doe" />
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ENROLLMENT ID</label>
                      <input type="text" className="input-premium" required value={form.enrollment_number} onChange={e => setForm({...form, enrollment_number: e.target.value})} placeholder="e.g. 2024CS001" />
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>PRIMARY EMAIL (LOGIN ID)</label>
                      <input type="email" className="input-premium" required value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} placeholder="student@university.edu" />
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>PROGRAM LEVEL</label>
                      <select className="input-premium" value={form.grade_level} onChange={e => handleLevelChange(e.target.value)}>
                          {Object.keys(PROGRAM_STRUCTURE).map(lvl => (
                            <option key={lvl} value={lvl}>{PROGRAM_STRUCTURE[lvl].label}</option>
                          ))}
                      </select>
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>COURSE / STREAM</label>
                      <select className="input-premium" value={form.branch} onChange={e => handleCourseChange(e.target.value)}>
                          {Object.keys(currentLevelOptions.courses).map(course => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                      </select>
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>ADMISSION YEAR (1 TO {maxYears})</label>
                      <select className="input-premium" value={form.current_year} onChange={e => setForm({...form, current_year: parseInt(e.target.value)})}>
                          {Array.from({ length: maxYears }, (_, i) => i + 1).map(y => (
                            <option key={y} value={y}>Year {y}</option>
                          ))}
                      </select>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>JOINING BATCH</label>
                      <input type="number" className="input-premium" value={form.admission_year} onChange={e => setForm({...form, admission_year: parseInt(e.target.value)})} />
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>GENESIS KEY</label>
                      <input type="text" className="input-premium" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                   </div>
                </div>

                {error && (
                  <div style={{ padding: '1rem', background: '#fef2f2', color: 'var(--error-color)', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #fee2e2', fontSize: '0.85rem' }}>
                    <strong>Access Restored:</strong> {error}
                  </div>
                )}

                <button type="submit" className="btn-premium" style={{ width: '100%', padding: '15px' }} disabled={loading}>
                   {loading ? 'Processing Admission Sequence...' : 'INITIALIZE INSTITUTIONAL IDENTITY'}
                </button>
             </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--secondary-color)', background: '#eff6ff' }}>
               <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} /> Subscription
               </h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>Tier:</span>
                     <span className="badge" style={{ background: '#fff', color: 'var(--secondary-color)', fontWeight: 'bold' }}>{plan?.name.toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>Quota:</span>
                     <span style={{ fontWeight: 'bold' }}>UNLIMITED</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>Protection:</span>
                     <span style={{ fontWeight: 'bold', color: '#10b981' }}>ENFORCED</span>
                  </div>
               </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
               <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Record Accuracy</h4>
               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  The primary email provided will serve as the unique login credential. Please verify its precision before committing to the institutional mesh.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOnboarding;
