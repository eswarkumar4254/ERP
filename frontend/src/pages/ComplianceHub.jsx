import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, ClipboardCheck, History, 
  Search, Filter, Plus, ChevronRight, FileText,
  AlertCircle, Target, Database, Download, Brain
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const ComplianceHub = () => {
  const [compliance, setCompliance] = useState({ overall_health: '0%', pending_reviews: 0, detailed_audits: [] });
  const [aiAuditRisk, setAiAuditRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res, aiRes] = await Promise.all([
        axios.get(`${API}/compliance/strategic/status`, { headers }),
        axios.get(`${API}/ai-automation/compliance-risk`, { headers })
      ]);
      setCompliance(res.data);
      setAiAuditRisk(aiRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startAudit = async () => {
    const name = prompt("Enter Audit Name (e.g. NAAC 2026 Quarter 3):");
    if (!name) return;
    setTriggering(true);
    try {
      await axios.post(`${API}/compliance/strategic/trigger-audit?audit_name=${name}`, {}, { headers });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '2rem 3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient caps-lock" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Strategic Compliance & Audit Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Institutional governance automation for NAAC, NIRF, and regulatory body alignment.
          </p>
        </div>
        <button 
          className="btn-premium" 
          onClick={startAudit}
          disabled={triggering}
           style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> {triggering ? 'Initializing...' : 'Initialize Audit Cycle'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3.5rem' }}>
         <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <p className="label">Overall Governance Health</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{compliance.overall_health}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '0.85rem', marginTop: '4px' }}>
               <ShieldCheck size={14} /> <span>Institution Secure</span>
            </div>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
            <p className="label">Active Review Cycles</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{compliance.pending_reviews}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59e0b', fontSize: '0.85rem', marginTop: '4px' }}>
               <AlertCircle size={14} /> <span>Evidence Collection Phase</span>
            </div>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p className="label">Audit Artifacts Vault</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>11.2 GB</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
               <Database size={14} /> <span>Total Digitized Evidence</span>
            </div>
         </div>
         <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--primary-glow)' }}>
            <p className="label">Next Statutory Deadline</p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', margin: '1rem 0' }}>Dec 15, 2026</h2>
             <span className="badge" style={{ background: '#fef2f2', color: '#991b1b' }}>NIRF 2026 SUBMISSION</span>
         </div>
      </div>

      {aiAuditRisk && (
        <div className="glass-card" style={{ marginBottom: '3.5rem', padding: '1.5rem', background: aiAuditRisk.includes('Elevated') ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: aiAuditRisk.includes('Elevated') ? '1px solid #ef444455' : '1px solid #10b98155' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <div style={{ background: aiAuditRisk.includes('Elevated') ? '#ef4444' : '#10b981', color: 'white', padding: '10px', borderRadius: '10px' }}>
                    <Brain size={20} />
                 </div>
                 <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>AI Audit Risk Forecaster</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Predictive compliance analysis based on current institutional patterns.</p>
                 </div>
              </div>
              <div style={{ background: aiAuditRisk.includes('Elevated') ? '#ef4444' : '#10b981', color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                 {aiAuditRisk}
              </div>
           </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '2.5rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <ClipboardCheck size={24} color="var(--primary-color)" /> Institutional Audit Registry
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <button className="icon-btn-glass"><Filter size={18} /></button>
               <button className="icon-btn-glass"><Download size={18} /></button>
            </div>
         </div>

         <div className="table-responsive">
            <table className="custom-table">
               <thead>
                  <tr>
                     <th>AUDIT NOMENCLATURE</th>
                     <th>TRACKING STATUS</th>
                     <th>COMPLIANCE SCORE</th>
                     <th>LAST SYNC</th>
                     <th>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {compliance.detailed_audits.length === 0 ? (
                    <tr>
                       <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                          <FileText size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                          <p style={{ color: 'var(--text-secondary)' }}>System ready for audit sequence. No historical patterns detected.</p>
                       </td>
                    </tr>
                  ) : (
                    compliance.detailed_audits.map((a, idx) => (
                      <tr key={idx}>
                         <td style={{ fontWeight: 600 }}>{a[0]}</td>
                         <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a[1] === 'review_pending' ? '#f59e0b' : '#10b981' }} />
                               <span>{a[1].replace('_', ' ').toUpperCase()}</span>
                            </div>
                         </td>
                         <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                               <div style={{ width: '100px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${a[2]}%`, height: '100%', background: a[2] > 80 ? '#10b981' : '#f59e0b' }} />
                               </div>
                               <span style={{ fontWeight: 700 }}>{a[2]}%</span>
                            </div>
                         </td>
                         <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(a[3]).toLocaleString()}
                         </td>
                         <td>
                            <button className="icon-btn-glass" title="View Evidence Artifacts"><History size={18} color="var(--primary-color)" /></button>
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

export default ComplianceHub;
