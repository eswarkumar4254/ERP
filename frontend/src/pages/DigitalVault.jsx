import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, FileText, Search, Upload, Clock, 
  Fingerprint, Download, Lock, MoreHorizontal, 
  History, QrCode, Award, CheckCircle, Smartphone,
  ShieldCheck, FileSignature, Briefcase, GraduationCap
} from 'lucide-react';

const DigitalVault = () => {
  const [activeTab, setActiveTab] = useState('certificates');
  
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';

  const certificates = [
    { name: 'Semester 5 Hall Ticket', type: 'Exam Gatepass', date: 'Mar 12, 2026', status: 'Ready', id: 'HT-2026-8821' },
    { name: 'Bonafide Certificate', type: 'Administrative', date: 'Feb 10, 2026', status: 'Verified', id: 'BC-2026-0422' },
    { name: 'Internship Completion (Microsoft)', type: 'Industry', date: 'Jan 20, 2026', status: 'Verified', id: 'IC-7721' },
    { name: 'Provisional Certificate', type: 'Graduation', date: '--', status: 'Pending No-Due', id: 'PC-PENDING' },
    { name: 'Degree Certificate (B.Tech)', type: 'Graduation', date: '--', status: 'Locked', id: 'DC-LOCKED' },
  ];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Institutional Digital Vault & Wallet</h1>
          <p>Secure repository for QR-verified certificates, credentials, and digital academic transcripts.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
           <button className="btn-ghost"><Smartphone size={16} /> Link Digital Locker</button>
           <button className="btn-premium"><ShieldCheck size={16} /> Verify All Signatures</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
         <button className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>My Certificates</button>
         <button className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>Academic Transcripts</button>
         <button className={`tab-btn ${activeTab === 'secure' ? 'active' : ''}`} onClick={() => setActiveTab('secure')}>Secure Storage</button>
      </div>

      {activeTab === 'certificates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
           {certificates.map((cert, i) => (
              <div key={i} className="card" style={{ borderLeft: cert.status === 'Ready' || cert.status === 'Verified' ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '8px' }}>
                       {cert.type === 'Graduation' ? <GraduationCap size={24} color="#6366f1" /> : <Award size={24} color="#10b981" />}
                    </div>
                    <div style={{ background: '#fff', padding: '3px', borderRadius: '4px', border: '1px solid #ddd' }}>
                       <QrCode size={40} />
                    </div>
                 </div>
                 <h3 style={{ margin: '0 0 5px' }}>{cert.name}</h3>
                 <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>Type: {cert.type} • ID: {cert.id}</p>
                 <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge" style={{ background: cert.status === 'Verified' || cert.status === 'Ready' ? '#dcfce7' : '#fef3c7', color: cert.status === 'Verified' || cert.status === 'Ready' ? '#166534' : '#92400e' }}>
                       {cert.status.toUpperCase()}
                    </span>
                    {(cert.status === 'Ready' || cert.status === 'Verified') ? (
                       <button className="btn-premium" style={{ padding: '6px 12px', fontSize: '0.75rem' }}><Download size={14} /> Download</button>
                    ) : (
                       <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }} disabled>Blocked</button>
                    )}
                 </div>
              </div>
           ))}
        </div>
      )}

      {activeTab === 'academic' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h3>Verifiable Academic Transcripts</h3>
               <button className="btn-premium">Generate Official Transcript</button>
            </div>
            <div className="glass-pane" style={{ borderLeft: '4px solid #6366f1' }}>
               <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <FileText size={32} color="#6366f1" />
                  <div style={{ flex: 1 }}>
                     <h4 style={{ margin: 0 }}>Consolidated Marks Memo (2022-26)</h4>
                     <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Contains all 8 semesters with official V-Signatures.</p>
                  </div>
                  <button className="btn">View</button>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'secure' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            <div className="card">
               <h3>Identity & Personal Vault</h3>
               <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Upload and store external certifications, resumes, or ID proofs.</p>
               <div style={{ border: '2px dashed #ddd', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: '#fafafa', flexDirection: 'column' }}>
                  <Upload size={32} color="#94a3b8" />
                  <p style={{ marginTop: '10px' }}>Drag & drop sensitive files to encrypt.</p>
               </div>
               <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="glass-card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <FileText size={18} />
                     <span style={{ fontSize: '0.8rem' }}>Aadhar_Card.pdf</span>
                  </div>
                  <div className="glass-card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <FileText size={18} />
                     <span style={{ fontSize: '0.8rem' }}>Tenth_Memo.jpg</span>
                  </div>
               </div>
            </div>
            <div className="card" style={{ background: '#f8fafc' }}>
               <h3>Vault Security Audit</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
                  <div className="glass-pane">
                     <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Encryption Standard</p>
                     <h4 style={{ margin: '5px 0 0' }}>AES-256 Multi-layer</h4>
                  </div>
                  <div className="glass-pane">
                     <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Last Audit</p>
                     <h4 style={{ margin: '5px 0 0' }}>Mar 10, 2026 (Passed)</h4>
                  </div>
                  <div className="glass-pane">
                     <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Access Log</p>
                     <h4 style={{ margin: '5px 0 0' }}>2 IP Addresses Detected</h4>
                  </div>
               </div>
               <button className="btn-premium" style={{ width: '100%', marginTop: '2rem' }}>Rotate Access Keys</button>
            </div>
         </div>
      )}
    </div>
  );
};

export default DigitalVault;
