import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Wallet, AlertCircle, 
  Download, ChevronRight, CheckCircle, Star, Calendar, Clock
} from 'lucide-react';
import './Finance.css';
import api from '../api';

const Finance = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/students/me');
        setStudent(response.data);
      } catch (err) {
        console.error('Finance data fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading Finance...</div>;
  if (!student) return <div className="error">Data not available</div>;

  return (
    <div className="finance-stage fade-up">
      <div className="page-header-v2">
         <h1>Institutional Ledger</h1>
         <p className="text-muted">Manage your tuition cycles, settlement history, and financial aid disbursements.</p>
      </div>

      <div className="finance-grid">
         {/* 💳 Balance Control Central */}
         <div className="card-premium balance-hero">
            <div className="hero-top">
               <div className="hero-label">
                  <CreditCard size={20} color="var(--primary)" />
                  <span>Total Liability</span>
               </div>
               <span className="badge-premium warning">Next Cycle Oct 25</span>
            </div>
            <div className="hero-mid">
               <h2 className="main-total">₹{student.wallet_balance.toLocaleString()}</h2>
               <p className="sub-label">Academic Year 2024-25 • Semester-{student.current_semester}</p>
            </div>
            <div className="hero-actions">
               <button className="btn-action">Authorize Payment</button>
               <button className="btn-ghost">Partial Settlement</button>
            </div>
         </div>

         {/* 📊 Settlement Snapshot */}
         <div className="card-premium settlement-nexus">
            <h3>Settlement Analysis</h3>
            <div className="analyser-stats">
               <div className="a-stat">
                  <div className="a-icon green"><CheckCircle size={18} /></div>
                  <div className="a-info">
                     <p>Settled to Date</p>
                     <h4>₹45,000</h4>
                  </div>
               </div>
               <div className="a-stat">
                  <div className="a-icon orange"><AlertCircle size={18} /></div>
                  <div className="a-info">
                     <p>Pending Review</p>
                     <h4>₹2,450</h4>
                  </div>
               </div>
            </div>
            <div className="aid-banner">
               <Star size={18} color="#f59e0b" />
               <p>Institutional Merit Scholarship Applied: <strong>25% Waiver</strong></p>
            </div>
         </div>
      </div>

      <div className="ledger-sections">
         {/* 📑 Detailed Invoices */}
         <section className="billing-section">
            <div className="section-header-v2">
               <h3>Outstanding Bills</h3>
            </div>
            <div className="billing-grid">
               <div className="billing-card card-premium">
                  <div className="b-head">
                     <span className="b-id">#INV-20412</span>
                     <span className="status-pill warning">DUE SOON</span>
                  </div>
                  <h4>Tuition Fees - Term II</h4>
                  <h3 className="b-val">₹10,000.00</h3>
                  <div className="b-meta">
                     <Calendar size={14} /> <span>Due: 25 Oct 2024</span>
                  </div>
                  <button className="btn-action sm w-full" style={{ marginTop: '1rem' }}>Settle Invoice</button>
               </div>
               <div className="billing-card card-premium">
                  <div className="b-head">
                     <span className="b-id">#INV-20455</span>
                     <span className="status-pill warning">DUE SOON</span>
                  </div>
                  <h4>Exam Registration</h4>
                  <h3 className="b-val">₹2,450.00</h3>
                  <div className="b-meta">
                     <Calendar size={14} /> <span>Due: 30 Oct 2024</span>
                  </div>
                  <button className="btn-action sm w-full" style={{ marginTop: '1rem' }}>Settle Invoice</button>
               </div>
            </div>
         </section>

         {/* 📉 Transaction Repository */}
         <section className="repo-section">
            <div className="section-header-v2">
               <h3>Transaction Repository</h3>
               <button className="link-action">Full Audit Trail <ChevronRight size={14} /></button>
            </div>
            <div className="card-premium repo-table-wrap">
               <table className="repo-table">
                  <thead>
                     <tr>
                        <th>Context</th>
                        <th>Reference</th>
                        <th>Amount</th>
                        <th>Validation</th>
                        <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td>
                           <div className="h-id">
                              <h4>Term I - Base Tuition</h4>
                              <p>Settled Oct 01, 2024</p>
                           </div>
                        </td>
                        <td><span className="ref-code">RC-998</span></td>
                        <td><span className="h-val success">₹25,000.00</span></td>
                        <td><span className="status-pill success">Verified</span></td>
                        <td><button className="btn-ghost sm"><Download size={14} /> Receipt</button></td>
                     </tr>
                     <tr>
                        <td>
                           <div className="h-id">
                              <h4>Admission Fee Deposit</h4>
                              <p>Settled Aug 15, 2024</p>
                           </div>
                        </td>
                        <td><span className="ref-code">RC-101</span></td>
                        <td><span className="h-val success">₹5,000.00</span></td>
                        <td><span className="status-pill success">Verified</span></td>
                        <td><button className="btn-ghost sm"><Download size={14} /> Receipt</button></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>
      </div>
    </div>
  );
};

export default Finance;
