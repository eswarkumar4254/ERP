import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building, LayoutGrid, CheckCircle, Clock, AlertTriangle, 
  Search, ShieldCheck, PenTool, Plus, Download, Filter,
  Layers, Package, Wrench, Warehouse, QrCode, ClipboardCheck,
  ShieldAlert, FileText, Activity
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const ComplianceRegistry = () => {
  const [activeTab, setActiveTab] = useState('no_due');
  const [tasks, setTasks] = useState([]);
  const [qualityReports, setQualityReports] = useState([]);
  const [noDues, setNoDues] = useState([]);
  const [pendingClearances, setPendingClearances] = useState([]);
  const [filings, setFilings] = useState([]);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [taskRes, qualityRes, noDueRes, pendingRes, filingRes, riskRes] = await Promise.all([
        axios.get(`${API}/compliance/tasks`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/compliance/quality-reports`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/compliance/nodue-requests`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/compliance/pending-clearances`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/compliance/filings`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/compliance/risks`, { headers }).catch(() => ({ data: [] }))
      ]);
      setTasks(taskRes.data);
      setQualityReports(qualityRes.data);
      setNoDues(noDueRes.data);
      setPendingClearances(pendingRes.data);
      setFilings(filingRes.data);
      setRisks(riskRes.data);
    } catch (e) {
      console.error("Compliance Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const signClearance = async (id) => {
    try {
      await axios.post(`${API}/compliance/clearance-sign?clearance_id=${id}`, {}, { headers });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const requestNoDue = async () => {
    try {
      await axios.post(`${API}/compliance/nodue-requests`, { purpose: 'Graduation', student_id: 1 }, { headers });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const activeNoDue = noDues.length > 0 ? noDues[noDues.length - 1] : null;

  if (loading) return <div className="page-content">Loading Compliance Data...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="text-gradient">Institutional Workflow & Compliance</h1>
        <p>Managing Digital No-Dues, Accreditation Reporting, and Statutory Filings.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'no_due' ? 'active' : ''}`} onClick={() => setActiveTab('no_due')}>Digital No-Due</button>
        <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Institutional Tasks</button>
        <button className={`tab-btn ${activeTab === 'statutory' ? 'active' : ''}`} onClick={() => setActiveTab('statutory')}>Statutory & Filings</button>
        <button className={`tab-btn ${activeTab === 'naac' ? 'active' : ''}`} onClick={() => setActiveTab('naac')}>Accreditation Hub</button>
      </div>

      {activeTab === 'no_due' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>My No-Due Progression</h3>
                {!activeNoDue && <button className="btn-premium" onClick={requestNoDue}>Initiate No-Due Workflow</button>}
             </div>
             <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Automated approval tracking across 6 core departments. Clearance required for certificate download.</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeNoDue ? activeNoDue.clearances.map((item, i) => (
                   <div key={i} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: item.status === 'cleared' ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                      <div>
                         <h4 style={{ margin: 0 }}>{item.department}</h4>
                         <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.status === 'cleared' ? `Approved on ${new Date(item.clearance_date).toLocaleDateString()}` : 'Waiting for desk review'}</p>
                      </div>
                      {item.status === 'cleared' ? <CheckCircle size={20} color="#10b981" /> : <Clock size={20} color="#f59e0b" />}
                   </div>
                )) : (
                   <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #ddd', borderRadius: '12px' }}>
                      <p style={{ opacity: 0.7 }}>No active no-due request found.</p>
                   </div>
                )}
             </div>
          </div>
          <div className="card">
             <h3>Department Action Center</h3>
             <p style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>HOD/Admin: Review and sign pending student clearances.</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingClearances.map(pc => (
                  <div key={pc.id} className="glass-pane" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: 600, margin: 0 }}>Student ID #{pc.student_id}</p>
                        <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>Dept: {pc.department} | {pc.purpose}</p>
                      </div>
                      <button className="btn" onClick={() => signClearance(pc.id)} style={{ padding: '5px 10px', fontSize: '0.7rem' }}>Sign</button>
                    </div>
                  </div>
                ))}
                {pendingClearances.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.5 }}>
                    <ShieldCheck size={32} style={{ marginBottom: '10px' }} />
                    <p style={{ fontSize: '0.8rem' }}>No pending clearance signatures.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'statutory' && (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3>Statutory & Regulatory Filings</h3>
                  <button className="btn-premium"><Plus size={16} /> New Filing</button>
               </div>
               <table>
                  <thead>
                     <tr><th>Agency</th><th>Category</th><th>Period</th><th>Submitted On</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                     {filings.map((f, i) => (
                        <tr key={i}>
                           <td style={{ fontWeight: 'bold' }}>{f.body}</td>
                           <td>{f.category}</td>
                           <td>{f.fiscal_year}</td>
                           <td>{f.date}</td>
                           <td><span className={`badge ${f.status}`}>{f.status.replace('_', ' ').toUpperCase()}</span></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert color="#ef4444" size={20} /> Institutional Risk Register
               </h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                     <tr><th>Risk Factor</th><th>Impact</th><th>Owner</th><th>Mitigation Strategy</th></tr>
                  </thead>
                  <tbody>
                     {risks.map((r, i) => (
                        <tr key={i}>
                           <td style={{ fontWeight: 'bold' }}>{r.risk}</td>
                           <td><span className="badge" style={{ background: r.impact === 'High' ? '#fee2e2' : '#fef3c7', color: r.impact === 'High' ? '#dc2626' : '#92400e' }}>{r.impact}</span></td>
                           <td>{r.owner}</td>
                           <td style={{ fontSize: '0.85rem' }}>{r.mitigation}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeTab === 'tasks' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <h3>Institutional Task Board</h3>
               <button className="btn-premium"><Plus size={16} /> Create Task</button>
            </div>
            <table>
               <thead>
                  <tr><th>Task Title</th><th>Assignee</th><th>Due Date</th><th>Priority</th><th>Status</th></tr>
               </thead>
               <tbody>
                  {tasks.length > 0 ? tasks.map(t => (
                    <tr key={t.id}>
                       <td style={{ fontWeight: 'bold' }}>{t.title}</td>
                       <td>{t.assigned_to_id}</td>
                       <td>{new Date(t.due_date).toLocaleDateString()}</td>
                       <td><span className="badge">NORMAL</span></td>
                       <td><span className="badge">{t.status.toUpperCase()}</span></td>
                    </tr>
                  )) : (
                    <tr>
                       <td style={{ fontWeight: 'bold' }}>Pre-Inspection Audit (NAAC)</td>
                       <td>Dean IQAC</td>
                       <td>Mar 25, 2026</td>
                       <td><span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>CRITICAL</span></td>
                       <td><span className="badge">IN PROGRESS</span></td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'naac' && (
         <div className="card">
            <h3>Accreditation Readiness (NIRF/NAAC Self-Study)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
               {qualityReports.length > 0 ? qualityReports.map(q => (
                 <div key={q.id} className="glass-card">
                    <h4>{q.framework}: {q.metric_name}</h4>
                    <p style={{ fontSize: '0.85rem' }}>Current: {q.value.current} (Target: {q.value.target})</p>
                    <div className="progress-track" style={{ marginTop: '10px' }}>
                       <div className="progress-fill" style={{ width: `${(q.value.current / q.value.target) * 100}%`, background: q.value.current >= q.value.target ? '#10b981' : '#ef4444' }}></div>
                    </div>
                 </div>
               )) : (
                 <>
                   <div className="glass-card">
                      <h4>Criterion 4.4: Infrastructure</h4>
                      <p style={{ fontSize: '0.85rem' }}>Student-Computer Ratio: 1:4 (Required: 1:3)</p>
                      <div className="progress-track" style={{ marginTop: '10px' }}><div className="progress-fill" style={{ width: '75%', background: '#ef4444' }}></div></div>
                   </div>
                   <div className="glass-card">
                      <h4>Criterion 3.2: Research</h4>
                      <p style={{ fontSize: '0.85rem' }}>Total Publications (2025-26): 842 / 1000</p>
                      <div className="progress-track" style={{ marginTop: '10px' }}><div className="progress-fill" style={{ width: '84.2%', background: '#10b981' }}></div></div>
                   </div>
                 </>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default ComplianceRegistry;
