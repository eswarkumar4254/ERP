import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, TrendingUp, CreditCard, PieChart, 
  ArrowUpRight, ArrowDownRight, Plus, Search, 
  Filter, Download, MoreVertical, CheckCircle2,
  Clock, AlertCircle, FileText, Send, Wallet,
  Briefcase, GraduationCap, Microscope, Activity
} from 'lucide-react';

const API = 'http://localhost:8000';

const Finance = () => {
  const [invoices, setInvoices] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('revenue');
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role') || 'student';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, schRes, accRes] = await Promise.all([
          axios.get(`${API}/api/v1/finance-erp/invoices`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/finance-erp/scholarships`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/finance-erp/accounts`, { headers }).catch(() => ({ data: [] }))
        ]);
        setInvoices(invRes.data);
        setScholarships(schRes.data);
        setAccounts(accRes.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const Card = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</p>
          <h2 style={{ color, margin: 0 }}>{value}</h2>
          <p style={{ fontSize: '0.7rem', opacity: 0.7, margin: 0 }}>{subtitle}</p>
        </div>
        <div style={{ background: `${color}15`, padding: '8px', borderRadius: '8px', color }}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Advanced Finance & Enterprise ERP</h1>
        <p>Institutional ledger, scholarship disbursement, payroll automation, and research funding.</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '2.5rem' }}>
        <Card title="Total Liquidity" value="₹12.4 Cr" subtitle="Operational Funds" icon={Wallet} color="#6366f1" />
        <Card title="Fee Collection" value="₹8.2 Cr" subtitle="84% Collection Rate" icon={TrendingUp} color="#10b981" />
        <Card title="Monthly Payroll" value="₹1.4 Cr" subtitle="1,240 Employees" icon={Briefcase} color="#f59e0b" />
        <Card title="Research Grants" value="₹42.8 L" subtitle="Active Expenditure" icon={Microscope} color="#ec4899" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
         <button className={`tab-btn ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => setActiveTab('revenue')}>Revenue & Fees</button>
         <button className={`tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`} onClick={() => setActiveTab('scholarships')}>Scholarship Matrix</button>
         <button className={`tab-btn ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>Payroll Hub</button>
         <button className={`tab-btn ${activeTab === 'expenditure' ? 'active' : ''}`} onClick={() => setActiveTab('expenditure')}>Institutional Audit</button>
      </div>

      {activeTab === 'revenue' && (
        <div className="card" style={{ padding: 0 }}>
           <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
              <h3>Student Fee Ledger</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                 <button className="btn">Post Challan</button>
                 <button className="btn-premium">Bulk Fine Posting</button>
              </div>
           </div>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                 <tr><th>Student ID</th><th>Category</th><th>Amount</th><th>Status</th><th>Challan No</th><th>Action</th></tr>
              </thead>
              <tbody>
                 <tr>
                    <td>2210455</td>
                    <td>Tuition Fee (Sem 5)</td>
                    <td style={{ fontWeight: 800 }}>₹84,000</td>
                    <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>PAID</span></td>
                    <td style={{ fontSize: '0.75rem' }}>VFSTR-2026-0842</td>
                    <td><button className="btn-ghost">View Receipt</button></td>
                 </tr>
                 <tr>
                    <td>2210882</td>
                    <td>Hostel & Mess</td>
                    <td style={{ fontWeight: 800 }}>₹45,000</td>
                    <td><span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>DUE</span></td>
                    <td style={{ fontSize: '0.75rem' }}>VFSTR-2026-0911</td>
                    <td><button className="btn">Notify Parent</button></td>
                 </tr>
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'scholarships' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
           <div className="card">
              <h3>Merit & VSAT Scholarship Matrix</h3>
              <table style={{ marginTop: '1.5rem' }}>
                 <thead>
                    <tr><th>Student</th><th>Grade</th><th>Percentage</th><th>Amt (Saved)</th><th>Status</th></tr>
                 </thead>
                 <tbody>
                    <tr>
                       <td style={{ fontWeight: 'bold' }}>Ananya Sharma</td>
                       <td>VSAT Rank 1-100</td>
                       <td>75% Waiver</td>
                       <td>₹62,000</td>
                       <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>APPLIED</span></td>
                    </tr>
                    <tr>
                       <td style={{ fontWeight: 'bold' }}>Rajat Kumar</td>
                       <td>Merit (Inter 98%)</td>
                       <td>25% Waiver</td>
                       <td>₹21,000</td>
                       <td><span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>VERIFIED</span></td>
                    </tr>
                 </tbody>
              </table>
           </div>
           <div className="card">
              <h3>Fund Source Analysis</h3>
              <div style={{ padding: '2rem', border: '1px dashed #ddd', textAlign: 'center', background: '#f9fafb' }}>
                 [ Scholarship Fund Utilization Pie Chart ]
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <div className="glass-pane" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Govt. Reimbursements</span>
                    <strong>₹2.4 Cr</strong>
                 </div>
                 <div className="glass-pane" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Institutional Corpus</span>
                    <strong>₹1.8 Cr</strong>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'payroll' && (
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
               <div>
                  <h3>Monthly Payroll Engine (March 2026)</h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Automated salary computation for Academic and Administrative staff.</p>
               </div>
               <button className="btn-premium">Process All (₹1.4 Cr)</button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Staff Name</th><th>Designation</th><th>Gross Salary</th><th>Deductions (EPF/Tax)</th><th>Net Payable</th><th>Status</th></tr>
               </thead>
               <tbody>
                  <tr>
                     <td style={{ fontWeight: 'bold' }}>Dr. Amit Mishra</td>
                     <td>Associate Professor</td>
                     <td>₹1,42,000</td>
                     <td>₹12,400</td>
                     <td style={{ fontWeight: 800 }}>₹1,29,600</td>
                     <td><span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>PENDING RELEASE</span></td>
                  </tr>
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'expenditure' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
               <h3>Research & Lab Expenditure</h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                     <tr><th>Project/Grant</th><th>Entity</th><th>Budget</th><th>Utilized</th><th>Alert</th></tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>DST-SERB (AI Study)</td>
                        <td>Dept: CSE</td>
                        <td>₹42.0 L</td>
                        <td>₹12.4 L</td>
                        <td><span style={{ color: '#10b981' }}>✓ Normal</span></td>
                     </tr>
                     <tr>
                        <td>Nanotech Lab Infr.</td>
                        <td>Dept: S&H</td>
                        <td>₹15.0 L</td>
                        <td>₹14.2 L</td>
                        <td><span style={{ color: '#ef4444' }}>⚠ Critical (94%)</span></td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div className="card" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}>
               <h3>Overdue Collection Audit</h3>
               <p style={{ color: '#991b1b', fontSize: '0.85rem' }}>Total of 114 students have dues exceeding 30 days.</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem' }}>
                  <button className="btn" style={{ background: '#f87171', color: '#fff' }}>Lock Attendance (Massive)</button>
                  <button className="btn" style={{ background: '#ef4444', color: '#fff' }}>Generate Final Notice</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Finance;
