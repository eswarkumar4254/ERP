import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, CheckCircle, AlertTriangle, Save, 
  Send, Search, Filter, ShieldCheck, ArrowLeft 
} from 'lucide-react';

const DigitalEvaluation = () => {
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const API = 'http://localhost:8000/api/v1/academics';

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // This endpoint needs implementation in academics.py if not present
      const res = await axios.get(`${API}/evaluation/scripts`, { headers });
      setScripts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectScript = (script) => {
    setSelectedScript(script);
    setMarks(script.question_wise_marks || { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Q5: 0 });
  };

  const handleMarkChange = (q, val) => {
    setMarks({ ...marks, [q]: parseFloat(val) || 0 });
  };

  const submitEvaluation = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API}/evaluation/submit`, {
        script_id: selectedScript.id,
        marks: marks
      }, { headers });
      setSelectedScript(null);
      fetchScripts();
      alert("Evaluation submitted to Scrutinizer.");
    } catch (e) {
      console.error(e);
    }
  };

  if (selectedScript) {
    const totalMarks = Object.values(marks).reduce((a, b) => a + b, 0);
    return (
      <div className="page-content">
        <button className="btn-ghost" onClick={() => setSelectedScript(null)} style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to List
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Evaluating: {selectedScript.student_name}</h3>
                <span className="badge">Ref ID: #{selectedScript.id}</span>
             </div>
             <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <FileText size={48} color="var(--primary-color)" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Digital Answer Booklet Attached</p>
                <button className="btn-ghost">View Full script.pdf</button>
             </div>

             <div className="marks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                {Object.keys(marks).map(q => (
                  <div key={q} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '5px', fontWeight: 'bold' }}>{q}</p>
                    <input 
                      type="number" 
                      className="input-premium" 
                      style={{ textAlign: 'center' }} 
                      value={marks[q]} 
                      onChange={(e) => handleMarkChange(q, e.target.value)}
                    />
                  </div>
                ))}
             </div>
          </div>

          <div className="card">
             <h3>Evaluation Summary</h3>
             <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'var(--primary-glow)', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, opacity: 0.7 }}>Total Marks Awarded</p>
                <h2 style={{ fontSize: '3rem', margin: 0 }}>{totalMarks}</h2>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', display: 'flex', gap: '10px' }}>
                   <AlertTriangle size={18} color="#d97706" />
                   <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e' }}>Ensure question-wise marking matches the totals on the digital OMR header.</p>
                </div>
                <button className="btn-premium" style={{ width: '100%' }} onClick={submitEvaluation}>
                   <Send size={16} /> Submit & Lock Evaluation
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Digital Evaluation Desk</h1>
        <p>Faculty portal for question-level marking and scrutiny review.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: '#f3f4f6', padding: '0 15px', borderRadius: '10px', width: '300px' }}>
                 <Search size={18} />
                 <input 
                   type="text" 
                   style={{ border: 'none', background: 'transparent', padding: '12px', outline: 'none' }} 
                   placeholder="Search Student ID..." 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
              </div>
           </div>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-ghost"><Filter size={16} /> All Batches</button>
              <button className="btn-ghost"><History size={16} /> Recent Logs</button>
           </div>
        </div>

        <table>
           <thead>
              <tr>
                 <th>Student</th>
                 <th>Exam Name</th>
                 <th>Course Code</th>
                 <th>Received Date</th>
                 <th>Status</th>
                 <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
           </thead>
           <tbody>
              {scripts.length > 0 ? scripts.map((s, i) => (
                <tr key={i}>
                   <td style={{ fontWeight: 'bold' }}>{s.student_name}</td>
                   <td>{s.exam_title}</td>
                   <td><code style={{ background: '#eee', padding: '3px 6px', borderRadius: '4px' }}>{s.course_code}</code></td>
                   <td>{new Date(s.received_at).toLocaleDateString()}</td>
                   <td>
                      <span className="badge" style={{ 
                        background: s.status === 'completed' ? '#d1fae5' : '#fee2e2',
                        color: s.status === 'completed' ? '#065f46' : '#991b1b'
                      }}>
                        {s.status.toUpperCase()}
                      </span>
                   </td>
                   <td style={{ textAlign: 'center' }}>
                      <button className="btn" onClick={() => selectScript(s)}>Evaluate</button>
                   </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No pending answer scripts assigned to your desk.</td>
                </tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default DigitalEvaluation;
