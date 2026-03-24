import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserPlus, FileCheck, DollarSign, ListOrdered, Share, CheckCircle, 
  Upload, Search, CreditCard, Award, FileText, XCircle, ArrowRight,
  UserCheck, ShieldAlert, BookOpen, Fingerprint, Download
} from 'lucide-react';

const API = 'http://localhost:8000';

const DeanAR = () => {
  const [activeTab, setActiveTab] = useState('vsat_eval');
  const [showVsatExam, setShowVsatExam] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem('user_role') || 'staff';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admissions/`, { headers }).catch(() => ({ data: [] }));
      setApplications(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const processBatch = async () => {
    try {
      await axios.post(`${API}/api/v1/admissions/batches/process`, {}, { headers });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const updateApp = async (id, data) => {
    try {
      await axios.patch(`${API}/api/v1/admissions/${id}`, data, { headers });
      fetchData();
      setSelectedCandidate(null);
    } catch (e) { console.error(e); }
  };

  // --- Mock vsatStatus for Student View ---
  const vsatStatus = {
    counselingSlot: "March 25, 2026 - 10:00 AM",
  };

  // --- STUDENT VIEWS ---
  if (role === 'student') {
    if (showVsatExam) {
      return (
        <div className="page-content">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2>VSAT Entrance Examination 2026</h2>
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                Time Left: 119:44
              </div>
            </div>
            <div style={{ padding: '2rem 0' }}>
               <p style={{ fontWeight: 'bold' }}>Q1: If log(x+y) = log(x) + log(y), then x equals:</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  <label><input type="radio" name="q1" /> y/(y-1)</label>
                  <label><input type="radio" name="q1" /> y/(y+1)</label>
                  <label><input type="radio" name="q1" /> (y-1)/y</label>
               </div>
            </div>
            <button className="btn-premium" onClick={() => setShowVsatExam(false)}>Submit VSAT Paper</button>
          </div>
        </div>
      );
    }

    return (
      <div className="page-content">
        <div className="page-header">
           <h1>Admission & Registration Portal</h1>
           <p>Manage your entry into the University lifecycle.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <button className={`tab-btn ${activeTab === 'entrance' ? 'active' : ''}`} onClick={() => setActiveTab('entrance')}>VSAT & Entrance</button>
          <button className={`tab-btn ${activeTab === 'counseling' ? 'active' : ''}`} onClick={() => setActiveTab('counseling')}>Counseling & Allotment</button>
          <button className={`tab-btn ${activeTab === 'registration' ? 'active' : ''}`} onClick={() => setActiveTab('registration')}>Course Registration</button>
        </div>

        {activeTab === 'entrance' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="stat-grid">
                 <div className="card">
                    <Fingerprint size={24} color="#6366f1" />
                    <h3>VSAT Registration</h3>
                    <p style={{ color: '#10b981', fontWeight: 'bold' }}>✓ REGISTERED</p>
                    <button className="btn-ghost" style={{ marginTop: '10px' }}>View Online Form</button>
                 </div>
                 <div className="card">
                    <BookOpen size={24} color="#f59e0b" />
                    <h3>Examination</h3>
                    <p style={{ opacity: 0.7 }}>Next Slot: Available Now</p>
                    <button className="btn-premium" style={{ marginTop: '10px' }} onClick={() => setShowVsatExam(true)}>Attempt VSAT Online</button>
                 </div>
                 <div className="card">
                    <Award size={24} color="#10b981" />
                    <h3>VSAT Result</h3>
                    <h2 style={{ margin: 0 }}>Rank 1422</h2>
                    <span className="badge" style={{ background: '#d1fae5', color: '#065f46', marginTop: '10px' }}>QUALIFIED</span>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'counseling' && (
           <div className="card">
              <h3>Counseling & Document Verification</h3>
              <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginTop: '1rem' }}>
                 <p style={{ fontWeight: 'bold' }}>Scheduled Date: {vsatStatus.counselingSlot}</p>
                 <p style={{ fontSize: '0.85rem' }}>Please report to Hall 4 with original Educational & Demographic documents.</p>
              </div>
              <div style={{ marginTop: '2rem' }}>
                 <h4>Upload Digital Copies (Pre-Verification)</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span>10th / SSC Memo</span>
                       <button className="btn-ghost"><Upload size={14} /> Upload</button>
                    </div>
                    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span>Aadhar / Identity</span>
                       <button className="btn-ghost"><Upload size={14} /> Upload</button>
                    </div>
                 </div>
                 <button className="btn-premium" style={{ marginTop: '1.5rem' }}>Submit Demographic Details</button>
              </div>
           </div>
        )}

        {activeTab === 'registration' && (
           <div className="card">
              <h3>Final Registration & Fee Payment</h3>
              <div className="stat-grid" style={{ marginTop: '1rem' }}>
                 <div className="glass-card">
                    <p style={{ fontSize: '0.8rem' }}>Course Allotted</p>
                    <h3>B.Tech CSE Core</h3>
                 </div>
                 <div className="glass-card">
                    <p style={{ fontSize: '0.8rem' }}>Scholarship Benefit</p>
                    <h3 style={{ color: '#10b981' }}>25% (Merit)</h3>
                 </div>
              </div>
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                       <h4>Course Admission Challan</h4>
                       <p style={{ fontSize: '0.8rem', color: '#dc2626' }}>Status: UNPAID</p>
                    </div>
                    <button className="btn-premium"><Download size={14} /> Download Challan</button>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: '#10b981' }}><CreditCard size={14} /> Pay Fees Online</button>
                    <div style={{ flex: 1 }}>
                       <input type="text" className="input-premium" placeholder="Enter Transaction ID / Reference" />
                    </div>
                    <button className="btn-ghost" style={{ background: '#f3f4f6' }}>Submit Paid Receipt</button>
                 </div>
                 <div style={{ marginTop: '2rem', padding: '1rem', background: '#d1fae5', borderRadius: '4px', textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', color: '#065f46' }}>Registration Acknowledgement</p>
                    <p style={{ fontSize: '0.8rem' }}>UV No: 2026AR8442 (Provisional)</p>
                 </div>
              </div>
           </div>
        )}
      </div>
    );
  }

  // --- DEAN AR / JUNIOR ASSISTANT VIEWS ---
  return (
    <div className="page-content">
      <div className="page-header">
         <h1>Dean AR Console</h1>
         <p>VSAT management, counseling, and registration oversight.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'vsat_eval' ? 'active' : ''}`} onClick={() => setActiveTab('vsat_eval')}>VSAT OMR Evaluation</button>
        <button className={`tab-btn ${activeTab === 'counseling_matrix' ? 'active' : ''}`} onClick={() => setActiveTab('counseling_matrix')}>Counseling Matrix</button>
        <button className={`tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`} onClick={() => setActiveTab('scholarships')}>Scholarships & Verifications</button>
        <button className={`tab-btn ${activeTab === 'registry' ? 'active' : ''}`} onClick={() => setActiveTab('registry')}>Registry & Promotion</button>
      </div>

      {activeTab === 'vsat_eval' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3>Entrance OMR Scanner</h3>
               <button className="btn-premium" onClick={processBatch}>Bulk Scan Sheets</button>
            </div>
            <div style={{ padding: '3rem', border: '2px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
               <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto' }} />
               <p style={{ marginTop: '1rem' }}>Drop OMR digital scans here to simulate mark calculation...</p>
               <button className="btn-ghost" style={{ marginTop: '1rem' }} onClick={processBatch}>Process Batch A-102</button>
            </div>
            <table style={{ marginTop: '2rem' }}>
               <thead>
                  <tr><th>Batch</th><th>Count</th><th>Qualified %</th><th>Status</th></tr>
               </thead>
               <tbody>
                  <tr><td>A-101</td><td>{applications.length}</td><td>82%</td><td><span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>COMPLETED</span></td></tr>
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'counseling_matrix' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
            <div className="card">
               <h3>Live Counseling Queue (Hall 4)</h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                     <tr><th>ID</th><th>Student</th><th>Entrance Score</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                     {applications.filter(a => a.status === 'counseling').map((a, i) => (
                        <tr key={i}>
                           <td>#{a.id}</td>
                           <td style={{ fontWeight: 'bold' }}>{a.student_name}</td>
                           <td>{a.entrance_exam_score?.toFixed(1) || '—'}</td>
                           <td>{a.status.toUpperCase()}</td>
                           <td><button className="btn" onClick={() => setSelectedCandidate(a)}>Process Enrollment</button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            {selectedCandidate && (
               <div className="card" style={{ border: '2px solid #2563eb' }}>
                  <h3>Counseling: {selectedCandidate.student_name}</h3>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <div>
                        <p style={{ fontSize: '0.85rem' }}>Original Documents Received?</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                           <button className="badge active">Yes (SSC, Inter, TC)</button>
                           <button className="badge" style={{ background: '#f3f4f6', color: '#000' }}>Incomplete</button>
                        </div>
                     </div>
                     <div>
                        <p style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Branch Allocation</p>
                        <select className="input-premium">
                           <option>B.Tech CSE (Core)</option>
                           <option>B.Tech AI & ML</option>
                           <option>B.Tech ECE</option>
                        </select>
                     </div>
                     <div>
                        <p style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Scholarship Percentage</p>
                        <input type="number" className="input-premium" defaultValue="25" />
                     </div>
                     <button className="btn-premium" onClick={() => updateApp(selectedCandidate.id, { status: 'allotted', scholarship_amount: 25000, challan_generated: true })}>Confirm Allotment & Generate Challan</button>
                     <button className="btn-ghost" onClick={() => setSelectedCandidate(null)}>Close</button>
                  </div>
               </div>
            )}
         </div>
      )}

      {activeTab === 'scholarships' && (
         <div className="card">
            <h3>Scholarship Verification Pool</h3>
            <p>Verification by Junior Assistants based on Student demographic and previous marks.</p>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Application</th><th>Basis</th><th>Amount</th><th>Status</th><th>Verification</th></tr>
               </thead>
               <tbody>
                  <tr>
                    <td>REG-1422 (Rahul S.)</td>
                    <td>VSAT Rank 42</td>
                    <td>₹84,000</td>
                    <td><span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>PENDING VERIFICATION</span></td>
                    <td>
                       <button className="btn" style={{ fontSize: '0.75rem' }}>Verify Docs & Approve</button>
                    </td>
                  </tr>
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'registry' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <div>
                  <h3>Student Promotion Registry</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Finalize semester transitions and promote students to next year.</p>
               </div>
               <button className="btn-premium" onClick={() => {
                  const studentIds = applications.filter(a => a.status === 'registered').map(a => a.id);
                  if (studentIds.length === 0) {
                     alert('No eligible students found in registry.');
                     return;
                  }
                  axios.post(`${API}/api/v1/academics/deo/promote`, studentIds, { headers })
                     .then(() => { alert('Promotion batch initiated successfully'); fetchData(); })
                     .catch(e => alert('Promotion failed: Server error.'));
               }}>
                  Promote Eligible Students
               </button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Student</th><th>Current Semester</th><th>CGPA</th><th>Attendance</th><th>Status</th></tr>
               </thead>
               <tbody>
                  {applications.filter(a => a.status === 'registered').map((a, i) => (
                     <tr key={i}>
                        <td style={{ fontWeight: 'bold' }}>{a.student_name}</td>
                        <td>Semester 5</td>
                        <td>8.9</td>
                        <td>88%</td>
                        <td><span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>READY</span></td>
                     </tr>
                  ))}
                  {applications.filter(a => a.status === 'registered').length === 0 && (
                     <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No students found in registered pool.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};

export default DeanAR;
