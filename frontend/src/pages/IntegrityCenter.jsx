import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, ShieldCheck, Eye, 
  Search, Filter, ChevronRight, AlertCircle,
  FileSearch, UserX, MonitorOff, Video
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const IntegrityCenter = () => {
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/exams/integrity/flagged`, { headers });
      setFlagged(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '2rem 3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient caps-lock" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Evaluation Integrity Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time proctoring monitoring and suspicious activity auditing for digital examinations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <span className="badge" style={{ background: '#ef444422', color: '#ef4444' }}>AI Proctoring Active</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
         <div className="glass-card" style={{ padding: '1.5rem', borderBottom: '4px solid #ef4444' }}>
            <p className="label">Critical Flags (Last 24h)</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{flagged.length}</h2>
               <ShieldAlert size={32} color="#ef4444" />
            </div>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p className="label">Focus Score (Institutional)</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>98.2%</h2>
               <ShieldCheck size={32} color="#10b981" />
            </div>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p className="label">Active Sessions Proctored</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>452</h2>
               <Video size={32} color="var(--primary-color)" />
            </div>
         </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
         <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSearch size={22} color="var(--primary-color)" /> Suspicious Incident Log
         </h3>

         <div className="table-responsive">
            <table className="custom-table">
               <thead>
                  <tr>
                     <th>EXAM TITLE</th>
                     <th>STUDENT IDENTITY</th>
                     <th>VIOLATION TYPE</th>
                     <th>SEVERITY</th>
                     <th>TIMESTAMP</th>
                     <th>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {flagged.length === 0 ? (
                    <tr>
                       <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                          <ShieldCheck size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                          <p style={{ color: 'var(--text-secondary)' }}>No integrity violations reported in this period.</p>
                       </td>
                    </tr>
                  ) : (
                    flagged.map((item, idx) => (
                      <tr key={idx}>
                         <td style={{ fontWeight: 600 }}>{item[0]}</td>
                         <td>{item[1]}</td>
                         <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                               {item[2] === 'tab_switch' ? <MonitorOff size={16} color="#ef4444" /> : <UserX size={16} color="#ef4444" />}
                               <span>{item[2].replace('_', ' ').toUpperCase()}</span>
                            </div>
                         </td>
                         <td><span className="badge danger">{item[3].toUpperCase()}</span></td>
                         <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(item[4]).toLocaleString()}
                         </td>
                         <td>
                            <button className="icon-btn-glass" title="View Evidence"><Eye size={18} color="var(--primary-color)" /></button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default IntegrityCenter;
