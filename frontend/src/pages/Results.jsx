import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Award, QrCode, Download, FileText, CheckCircle, 
  MapPin, Clock, Search, ShieldCheck, Star, 
  ChevronRight, ArrowLeft
} from 'lucide-react';

const API = 'http://localhost:8000';

const ResultsPortal = () => {
  const [viewingResult, setViewingResult] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/academics/results`, { headers }).catch(() => ({ data: [] }));
      setResults(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApplyRevaluation = async (examId) => {
    try {
      await axios.post(`${API}/api/v1/academics/revaluation/apply`, {
        exam_id: examId,
        subject_id: 101 // Default for demo
      }, { headers });
      alert("Revaluation Applied Successfully!");
    } catch (e) {
      alert("Failed to apply for revaluation.");
    }
  };

  const subjects = [
    { code: 'CS301', name: 'Database Management Systems', credits: 4, grade: 'S', internal: 38, external: 54, total: 92 },
    { code: 'CS302', name: 'Computer Networks', credits: 4, grade: 'A', internal: 32, external: 48, total: 80 },
    { code: 'CS303', name: 'Machine Learning', credits: 3, grade: 'S', internal: 39, external: 56, total: 95 },
  ];

  if (loading) return <p>Retrieving Academic Ledger...</p>;

  if (viewingResult) {
    return (
      <div className="page-content">
        <button className="btn-ghost" onClick={() => setViewingResult(null)} style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Semester List
        </button>

        <div className="card" style={{ padding: '0' }}>
           <div style={{ background: 'var(--primary-color)', color: '#fff', padding: '2rem', borderRadius: '8px 8px 0 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <h1>Semester {viewingResult.grade} Performance</h1>
                    <p style={{ opacity: 0.8 }}>{viewingResult.exam_title} • Provisional</p>
                 </div>
                 <div style={{ background: '#fff', padding: '5px', borderRadius: '4px' }}>
                    <QrCode size={60} color="#000" />
                 </div>
              </div>
           </div>

           <div style={{ padding: '2rem' }}>
              <h3>Subject-level Performance</h3>
              <table style={{ marginTop: '1rem' }}>
                 <thead>
                    <tr><th>Code</th><th>Subject Name</th><th>Credits</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th></tr>
                 </thead>
                 <tbody>
                    {subjects.map((s, i) => (
                       <tr key={i}>
                          <td style={{ fontWeight: 'bold' }}>{s.code}</td>
                          <td>{s.name}</td>
                          <td>{s.credits}</td>
                          <td>{s.internal}</td>
                          <td>{s.external}</td>
                          <td>{s.total}</td>
                          <td style={{ fontWeight: 'bold', color: s.grade === 'S' ? '#10b981' : '#000' }}>{s.grade}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>

              <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                 <div className="glass-card"><h4>SGPA: {viewingResult.grade}</h4></div>
                 <div className="glass-card"><h4>CGPA: 8.84</h4></div>
                 <div className="glass-card"><h4>Result: {viewingResult.is_pass ? 'PASSED' : 'RE-APPEAR'}</h4></div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                 <button className="btn-premium"><Download size={14} /> Download Digital Marks Memo</button>
                 <button className="btn" onClick={() => handleApplyRevaluation(viewingResult.id)}><Star size={14} /> Apply for Revaluation</button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Examination Results & Digital Memos</h1>
        <p>Access your verifiable semester results, transcripts, and provisional certificates.</p>
      </div>

      <div className="card">
         <h3>Academic History</h3>
         <table style={{ marginTop: '1.5rem' }}>
            <thead>
               <tr><th>Semester/Exam</th><th>Exam Date</th><th>SGPA</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
               {results.map((r, i) => (
                  <tr key={i}>
                     <td style={{ fontWeight: 'bold' }}>{r.exam_title}</td>
                     <td>{new Date(r.date).toLocaleDateString()}</td>
                     <td style={{ fontWeight: 'bold' }}>{r.grade}</td>
                     <td><span className="badge" style={{ background: r.is_pass ? '#dcfce7' : '#fee2e2', color: r.is_pass ? '#166534' : '#991b1b' }}>{r.is_pass ? 'PASSED' : 'FAILED'}</span></td>
                     <td>
                        <button className="btn" onClick={() => setViewingResult(r)}>View Marks Memo</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         {results.length === 0 && <p style={{ padding: '2rem', textAlign: 'center' }}>No results published yet.</p>}
      </div>

      <div style={{ marginTop: '2rem' }} className="stat-grid">
         <div className="card">
            <ShieldCheck size={24} color="#10b981" />
            <h3>Verified Transcripts</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Consolidated summary of all semesters.</p>
            <button className="btn-premium" style={{ marginTop: '1rem' }}>Generate Transcript</button>
         </div>
         <div className="card">
            <Award size={24} color="#f59e0b" />
            <h3>Provisional Certificate</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Available upon No-Due clearance.</p>
            <button className="btn" disabled style={{ marginTop: '1rem', background: '#f3f4f6', color: '#000' }}>Pending No-Due</button>
         </div>
      </div>
    </div>
  );
};

export default ResultsPortal;
