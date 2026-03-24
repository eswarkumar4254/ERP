import React, { useState } from 'react';
import axios from 'axios';
import { 
  Calendar, UserCheck, ShieldCheck, PenTool, CheckCircle, 
  FileSignature, Users, Plus, Award, RefreshCw, XCircle, Search,
  Briefcase, BookOpen, Clock, LayoutGrid
} from 'lucide-react';

const DepartmentHOD = () => {
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';

  const [activeTab, setActiveTab] = useState(role === 'student' ? 'my-requests' : 'dashboard');
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [studentODs, setStudentODs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [atRisk, setAtRisk] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [coursePrefs, setCoursePrefs] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const BASE_API = 'http://localhost:8000/api/v1/department';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaveRes, odRes, projRes, analyticsRes, riskRes, staffRes] = await Promise.all([
        axios.get(`${BASE_API}/leaves/pending`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${BASE_API}/od/pending`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${BASE_API}/projects`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${BASE_API}/metrics/overview`, { headers }).catch(() => ({ data: null })),
        axios.get(`${BASE_API}/students/at-risk`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${BASE_API}/staff/performance`, { headers }).catch(() => ({ data: [] })),
        axios.get(`http://localhost:8000/api/v1/academics/faculty/preferences/all?semester=1&academic_year=2026-2027`, { headers }).catch(() => ({ data: [] })),
      ]);
      setPendingLeaves(leaveRes.data);
      setStudentODs(odRes.data);
      setProjects(projRes.data);
      setAnalytics(analyticsRes.data);
      setAtRisk(riskRes.data);
      setStaffPerformance(staffRes.data);
      setCoursePrefs(prefsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (role !== 'student') {
      fetchData();
    }
  }, [role]);

  const approveLeave = async (id) => {
    try {
      await axios.post(`${BASE_API}/leaves/approve/${id}?remarks=Approved+by+HOD`, {}, { headers });
      fetchData();
    } catch (e) { alert('Approval failed'); }
  };

  const verifyOD = async (id) => {
    try {
      await axios.post(`${BASE_API}/od/verify/${id}`, {}, { headers });
      fetchData();
    } catch (e) { alert('Verification failed'); }
  };

  const approveAssignment = async (pref) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/academics/faculty/assign`, {
        staff_id: pref.staff_id,
        course_id: pref.course_id,
        semester: pref.semester,
        academic_year: pref.academic_year
      }, { headers });
      alert('Course officially assigned to faculty!');
      fetchData();
    } catch (e) { alert('Assignment failed'); }
  };

  // --- STUDENT VIEW (Role mapped to department services) ---
  if (role === 'student') {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Department Self-Service</h1>
          <p>Submit certificates, request No-Dues, and secure ODs from HOD.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <ShieldCheck size={22} color="#10b981" />
            <h3>Apply for OD (On-Duty)</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Required for attendance exemption.</p>
            <button className="btn-premium" style={{ marginTop: '10px', fontSize: '0.75rem' }}>Start Application</button>
          </div>
          <div className="card">
            <CheckCircle size={22} color="#6366f1" />
            <h3>No-Due Clearance</h3>
            <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>4 Departments Pending</p>
            <button className="btn-ghost" style={{ marginTop: '10px', fontSize: '0.75rem', background: '#f3f4f6' }}>View Status</button>
          </div>
          <div className="card">
            <FileSignature size={22} color="#f59e0b" />
            <h3>Form Outing / Events</h3>
            <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Permissions for campus exit.</p>
            <button className="btn" style={{ marginTop: '10px', fontSize: '0.75rem' }}>Submit Form</button>
          </div>
        </div>

        <div className="card">
           <h3>My Active Requests</h3>
           <table style={{ marginTop: '1rem' }}>
              <thead>
                 <tr><th>Type</th><th>Applied Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                 <tr>
                    <td>OD Certificate</td>
                    <td>Mar 10, 2026</td>
                    <td><span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>PENDING HOD</span></td>
                    <td><button className="btn-ghost">Details</button></td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    );
  }

  // --- HOD / DEAN VIEW ---
  return (
    <div className="page-content">
      <div className="page-header">
         <h1 className="text-gradient">Department Matrix ({role.toUpperCase()})</h1>
         <p>Faculty leaves, timetable adjustments, project batches, and student oversight.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Analytics Hub</button>
        <button className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>Pending Approvals</button>
        <button className={`tab-btn ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>Timetable & Adj.</button>
        <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Project Batches</button>
        <button className={`tab-btn ${activeTab === 'oversight' ? 'active' : ''}`} onClick={() => setActiveTab('oversight')}>Faculty Oversight</button>
        <button className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>Course Assignments</button>
      </div>

      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="stat-grid">
            <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Pass Percentage</p>
              <h2 style={{ color: '#10b981' }}>{analytics?.pass_percentage || '0'}%</h2>
              <p style={{ fontSize: '0.7rem' }}>Current Semester</p>
            </div>
            <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Avg Attendance</p>
              <h2 style={{ color: '#6366f1' }}>{analytics?.avg_attendance || '0'}%</h2>
              <p style={{ fontSize: '0.7rem' }}>Critical Monitor</p>
            </div>
            <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Active Projects</p>
              <h2 style={{ color: '#f59e0b' }}>{analytics?.active_projects || '0'}</h2>
              <p style={{ fontSize: '0.7rem' }}>Final Year Capstone</p>
            </div>
            <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Pending Actions</p>
              <h2 style={{ color: '#ef4444' }}>{analytics?.pending_actions || '0'}</h2>
              <button className="btn-ghost" style={{ fontSize: '0.6rem', padding: '2px 6px' }} onClick={() => setActiveTab('approvals')}>View All</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
              <h3>Students At Risk</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>Flagged for low attendance or academics.</p>
              <table style={{ width: '100%', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '8px' }}>Student</th>
                    <th style={{ padding: '8px' }}>Atten.</th>
                    <th style={{ padding: '8px' }}>Backlogs</th>
                    <th style={{ padding: '8px' }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px' }}>{s.name}</td>
                      <td style={{ padding: '8px', color: s.attendance < 75 ? '#ef4444' : 'inherit' }}>{s.attendance}%</td>
                      <td style={{ padding: '8px' }}>{s.backlogs}</td>
                      <td style={{ padding: '8px' }}>
                        <span className="badge" style={{ 
                          background: s.risk_level === 'High' ? '#fee2e2' : '#fef3c7',
                          color: s.risk_level === 'High' ? '#ef4444' : '#92400e'
                        }}>{s.risk_level}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-ghost" style={{ width: '100%', marginTop: '1rem' }}>View Detained List</button>
            </div>

            <div className="card">
              <h3>Performance Distribution</h3>
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(analytics?.student_dist || []).map((d, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                      <span>{d.label}</span>
                      <span style={{ fontWeight: 'bold' }}>{d.value}%</span>
                    </div>
                    <div className="progress-track" style={{ height: '8px' }}>
                      <div className="progress-fill" style={{ width: `${d.value}%`, background: d.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
               <h3>Faculty Leaves (CL/CC)</h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                     <tr><th>Faculty</th><th>Type</th><th>Duration</th><th>Reason</th><th>Decision</th></tr>
                  </thead>
                  <tbody>
                     {pendingLeaves.map(l => (
                        <tr key={l.id}>
                           <td style={{ fontWeight: 'bold' }}>{l.staff_name}</td>
                           <td><span className="badge">{l.leave_type}</span></td>
                           <td>{new Date(l.start_date).toLocaleDateString()} - {new Date(l.end_date).toLocaleDateString()}</td>
                           <td>{l.reason}</td>
                           <td style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn" style={{ background: '#10b981', padding: '4px 10px' }} onClick={() => approveLeave(l.id)}>Approve</button>
                              <button className="btn" style={{ background: '#ef4444', padding: '4px 10px' }}>Reject</button>
                           </td>
                        </tr>
                     ))}
                     {pendingLeaves.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No pending leave requests</td></tr>}
                  </tbody>
               </table>
            </div>

            <div className="card">
               <h3>Student Requests (OD / No-Due)</h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                     <tr><th>Student</th><th>Category</th><th>Details</th><th>Status</th><th>Decision</th></tr>
                  </thead>
                  <tbody>
                     {studentODs.map(s => (
                        <tr key={s.id}>
                           <td>{s.student_name} ({s.enrollment})</td>
                           <td>On-Duty</td>
                           <td>{s.event_name} ({new Date(s.start_date).toLocaleDateString()})</td>
                           <td><span className="badge" style={{ background: '#fef3c7' }}>{s.status}</span></td>
                           <td><button className="btn" style={{ background: '#10b981' }} onClick={() => verifyOD(s.id)}>Verify & Sign</button></td>
                        </tr>
                     ))}
                     {studentODs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No pending OD requests</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeTab === 'timetable' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3>Day-wise Timetable Adjustments</h3>
               <button className="btn-premium"><Plus size={16} /> Add Substitution</button>
            </div>
            <div style={{ background: '#f9fafb', height: '300px', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
               <Clock size={32} color="var(--text-muted)" />
               <p style={{ marginTop: '10px' }}>Select a faculty on leave to distribute their load.</p>
               <button className="btn" style={{ marginTop: '1rem' }}>View Master Timetable</button>
            </div>
         </div>
      )}

      {activeTab === 'projects' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3>Final Year Project Batches</h3>
               <button className="btn-premium"><Plus size={16} /> Create New Batch</button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Batch ID</th><th>Title</th><th>Guide</th><th>Students</th><th>Status</th></tr>
               </thead>
               <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.title}</td>
                      <td>{p.guide_id || 'Not Assigned'}</td>
                      <td>{p.student_ids?.length} Students</td>
                      <td><span className="badge">{p.status}</span></td>
                    </tr>
                  ))}
                  {projects.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No project batches created yet</td></tr>}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'oversight' && (
         <div className="card">
            <h3>Faculty Workload & Performance Scorecard</h3>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Faculty Member</th><th>Designation</th><th>Syllabus Completion</th><th>Student Feedback</th><th>Research Score</th></tr>
               </thead>
               <tbody>
                  {staffPerformance.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 'bold' }}>{s.name}</td>
                      <td>{s.designation}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-track" style={{ width: '60px', height: '6px' }}>
                            <div className="progress-fill" style={{ width: `${s.syllabus_completion}%`, background: '#6366f1' }}></div>
                          </div>
                          <span>{s.syllabus_completion}%</span>
                        </div>
                      </td>
                      <td style={{ color: '#facc15', fontWeight: 'bold' }}>★ {s.avg_student_feedback}</td>
                      <td>
                        <span className="badge" style={{ background: '#f3f4f6' }}>{s.research_score} / 100</span>
                      </td>
                    </tr>
                  ))}
                  {staffPerformance.length === 0 && (
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Dr. Rajesh K.</td>
                      <td>HOD / Professor</td>
                      <td>85%</td>
                      <td>4.4 / 5</td>
                      <td><span className="badge" style={{ background: '#10b981', color: '#fff' }}>HEALHTY</span></td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'assignments' && (
         <div className="card">
            <h3>Faculty Course Subject Preferences</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Review subjects requested by tracking faculty members and approve allocations.</p>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Faculty Member</th><th>Course ID</th><th>Priority</th><th>Semester</th><th>Status</th><th>Action</th></tr>
               </thead>
               <tbody>
                  {coursePrefs.map(pref => (
                    <tr key={pref.id}>
                      <td style={{ fontWeight: 'bold' }}>Staff #{pref.staff_id}</td>
                      <td>Course #{pref.course_id}</td>
                      <td><span className="badge" style={{ background: '#f3f4f6' }}>Choice {pref.priority}</span></td>
                      <td>Semester {pref.semester} ({pref.academic_year})</td>
                      <td>
                        <span className="badge" style={{ 
                          background: pref.status === 'approved' ? '#d1fae5' : '#fef3c7',
                          color: pref.status === 'approved' ? '#065f46' : '#92400e'
                        }}>{pref.status.toUpperCase()}</span>
                      </td>
                      <td>
                        {pref.status === 'pending' && (
                          <button className="btn" style={{ background: '#10b981', padding: '4px 10px' }} onClick={() => approveAssignment(pref)}>Assign Subject</button>
                        )}
                        {pref.status === 'approved' && (
                          <button className="btn-ghost" disabled style={{ padding: '4px 10px', opacity: 0.5 }}>Assigned</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {coursePrefs.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No preferences submitted by faculty yet.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};

export default DepartmentHOD;
