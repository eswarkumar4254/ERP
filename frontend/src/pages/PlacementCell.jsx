import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trophy, TrendingUp, Award, Briefcase, GraduationCap, 
  Search, Users, Star, BarChart3, PieChart, Filter, 
  ArrowUpRight, Download, Calendar, Mail, FileText, CheckCircle,
  AlertTriangle, UserCheck, ShieldCheck
} from 'lucide-react';

const API = 'http://localhost:8000';

const PlacementCell = () => {
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [drives, setDrives] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [batchEligibility, setBatchEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (role === 'student') {
        const [eligRes, driveRes] = await Promise.all([
          axios.get(`${API}/api/v1/placements/eligibility/check`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/api/v1/placements/drives`, { headers }).catch(() => ({ data: [] }))
        ]);
        setEligibility(eligRes.data);
        setDrives(driveRes.data);
      } else {
        const [analytRes, driveRes, batchRes] = await Promise.all([
          axios.get(`${API}/api/v1/placements/analytics`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/api/v1/placements/drives`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/placements/eligibility/batch`, { headers }).catch(() => ({ data: null }))
        ]);
        setAnalytics(analytRes.data);
        setDrives(driveRes.data);
        setBatchEligibility(batchRes.data);
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const Card = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</p>
          <h2 style={{ color }}>{value}</h2>
          <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>{subtitle}</p>
        </div>
        <div style={{ background: `${color}15`, padding: '8px', borderRadius: '8px', color }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="page-content">Loading Placement Data...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="text-gradient">Placement Intelligence & Training</h1>
        <p>Comprehensive analytics for campus drives, internships, and job readiness.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          {role === 'student' ? 'My Readiness' : 'Advanced Analytics'}
        </button>
        <button className={`tab-btn ${activeTab === 'drives' ? 'active' : ''}`} onClick={() => setActiveTab('drives')}>Campus Drives</button>
        {role !== 'student' && (
           <button className={`tab-btn ${activeTab === 'screening' ? 'active' : ''}`} onClick={() => setActiveTab('screening')}>Batch Screening</button>
        )}
        <button className={`tab-btn ${activeTab === 'no_due' ? 'active' : ''}`} onClick={() => setActiveTab('no_due')}>TPO No-Due</button>
      </div>

      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {role === 'student' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
               <div className="card" style={{ borderLeft: eligibility?.eligible ? '5px solid #10b981' : '5px solid #ef4444' }}>
                  <h3>Placement Eligibility Status</h3>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                     <div style={{ 
                        width: '100px', height: '100px', borderRadius: '50%', border: '8px solid #eee', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                     }}>
                        <span style={{ fontWeight: 900, fontSize: '1.5rem' }}>{eligibility?.cgpa}</span>
                        <p style={{ position: 'absolute', bottom: '-25px', fontSize: '0.6rem', fontWeight: 'bold' }}>CGPA</p>
                     </div>
                     <div>
                        {eligibility?.eligible ? (
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                              <CheckCircle size={24} />
                              <h3 style={{ margin: 0 }}>Eligible for Placement</h3>
                           </div>
                        ) : (
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                              <AlertTriangle size={24} />
                              <h3 style={{ margin: 0 }}>Action Required</h3>
                           </div>
                        )}
                        <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
                           {eligibility?.eligible ? 'You meet all institutional criteria for the 2026 recruitment season.' : 'You have active backlogs or low attendance hindering your placement registration.'}
                        </p>
                     </div>
                  </div>
                  {eligibility?.issues?.length > 0 && (
                     <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#991b1b', marginBottom: '8px' }}>ELIGIBILITY CONSTRAINTS:</p>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b', fontSize: '0.85rem' }}>
                           {eligibility.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                        </ul>
                     </div>
                  )}
               </div>

               <div className="card">
                  <h3>Training & Skillset (AI Analysis)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                     <div className="glass-card">
                        <p style={{ fontSize: '0.75rem', marginBottom: '5px' }}>DSA & Problem Solving</p>
                        <div style={{ height: '8px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                           <div style={{ width: '85%', height: '100%', background: 'var(--primary-color)' }}></div>
                        </div>
                     </div>
                     <div className="glass-card">
                        <p style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Communication Skills</p>
                        <div style={{ height: '8px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                           <div style={{ width: '92%', height: '100%', background: '#10b981' }}></div>
                        </div>
                     </div>
                     <div className="glass-card">
                        <p style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Technical Knowledge</p>
                        <div style={{ height: '8px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                           <div style={{ width: '70%', height: '100%', background: '#f59e0b' }}></div>
                        </div>
                     </div>
                     <button className="btn-premium" style={{ marginTop: '1rem' }}>Resume Builder Beta</button>
                  </div>
               </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="stat-grid">
                <Card title="Total Placed" value={analytics?.total_placed || 0} subtitle={`Batch Success: ${analytics?.placement_percentage || 0}%`} icon={TrendingUp} color="#10b981" />
                <Card title="Avg Package" value={`₹${analytics?.average_package || 0} LPA`} subtitle="+12% from last year" icon={Award} color="#6366f1" />
                <Card title="Highest Package" value={`₹${analytics?.highest_package || 0} LPA`} subtitle="Top Offer" icon={Star} color="#f59e0b" />
                <Card title="Dream Offers (>10L)" value="84" subtitle="Top 15% of candidates" icon={Trophy} color="#ec4899" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card">
                  <h3>Placement Intelligence Reports</h3>
                  <div style={{ border: '1px dashed var(--border-color)', height: '250px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '8px' }}>
                     <p style={{ color: 'var(--text-muted)' }}>[ Correlation: Placement vs CGPA - Scatter Plot ]</p>
                  </div>
                </div>

                <div className="card">
                   <h3>Quick Segments</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
                      <button className="btn" style={{ textAlign: 'left', justifyContent: 'flex-start', background: '#f3f4f6', color: '#000' }}>Students with &gt;10L Package</button>
                      <button className="btn" style={{ textAlign: 'left', justifyContent: 'flex-start', background: '#f3f4f6', color: '#000' }}>Backlog Analytics</button>
                      <button className="btn-premium" style={{ marginTop: '1rem' }}><Download size={14} /> Export NAAC Data</button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'drives' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3>Upcoming Campus Drives</h3>
            {role !== 'student' && <button className="btn-premium">Register New Company</button>}
          </div>
          <table style={{ marginTop: '1rem' }}>
             <thead>
                <tr><th>Date</th><th>Company</th><th>Job Description</th><th>Eligibility</th><th>Status</th><th>Action</th></tr>
             </thead>
             <tbody>
                {drives.length > 0 ? drives.map((d, i) => (
                   <tr key={i}>
                      <td>{new Date(d.drive_date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold' }}>{d.company_name}</td>
                      <td>{d.job_role}</td>
                      <td>CGPA &gt; {d.min_cgpa || '6.0'}</td>
                      <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>ACTIVE</span></td>
                      <td><button className="btn-ghost" style={{ fontSize: '0.75rem' }}>Details</button></td>
                   </tr>
                )) : (
                  <tr>
                    <td>Mar 12, 2026</td>
                    <td style={{ fontWeight: 'bold' }}>Google Ireland</td>
                    <td>Cloud Associate</td>
                    <td>CGPA &gt; 8.5</td>
                    <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>ACTIVE</span></td>
                    <td><button className="btn-ghost">Apply</button></td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      )}

      {activeTab === 'screening' && role !== 'student' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <div>
                  <h3>Batch Eligibility Screening</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Screening {batchEligibility?.total} students based on live records.</p>
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ textAlign: 'right' }}>
                     <h2 style={{ margin: 0, color: '#10b981' }}>{batchEligibility?.eligible_percentage}%</h2>
                     <p style={{ margin: 0, fontSize: '0.7rem' }}>Eligible Pool</p>
                  </div>
               </div>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Student</th><th>Enrollment</th><th>CGPA</th><th>Attendance</th><th>Issues</th><th>Status</th></tr>
               </thead>
               <tbody>
                  {batchEligibility?.students?.map((s, i) => (
                     <tr key={i}>
                        <td style={{ fontWeight: 'bold' }}>{s.name}</td>
                        <td>{s.enrollment}</td>
                        <td>{s.cgpa}</td>
                        <td>{s.attendance_pct}%</td>
                        <td style={{ fontSize: '0.7rem', color: '#ef4444' }}>{s.issues?.join(', ') || 'None'}</td>
                        <td>
                           <span className={`badge ${s.eligible ? 'success' : 'error'}`} style={{ 
                              background: s.eligible ? '#dcfce7' : '#fee2e2',
                              color: s.eligible ? '#166534' : '#991b1b'
                           }}>
                              {s.eligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'no_due' && (
         <div className="card">
            <h3>TPO No-Due Clearance Queue</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Final approval for graduating students based on job acceptance and resource return.</p>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Student</th><th>Batch</th><th>Job Secured</th><th>Asset Return</th><th>Status</th><th>Action</th></tr>
               </thead>
               <tbody>
                  <tr>
                     <td>Ananya S.</td>
                     <td>2022-26</td>
                     <td>Yes (TCS)</td>
                     <td><span style={{ color: '#10b981' }}>✓ Returned</span></td>
                     <td><span className="badge">PENDING TPO SIGN</span></td>
                     <td><button className="btn" style={{ background: '#10b981' }}>Approve & Sign</button></td>
                  </tr>
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};

export default PlacementCell;
