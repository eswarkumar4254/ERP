import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, ChevronRight, Download, Calendar, ArrowUpRight, TrendingDown } from 'lucide-react';
import api from '../api';
import './Finance.css';

const Finance = () => {
    const [invoices, setInvoices] = useState([]);
    const [stats, setStats] = useState({ balance: 12500, pending: 45000 });

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/extra/finance/my-invoices');
                setInvoices(response.data);
            } catch (err) {
                console.error('Failed to fetch invoices', err);
            }
        };
        fetchInvoices();
    }, []);

    return (
        <div className="finance-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>Institutional Financial Center</h1>
                    <p className="subtitle">Unified gateway for sessional dues and scholarship records.</p>
                </div>
                <button className="btn-premium"><Wallet size={18} /> Top-up Wallet</button>
            </header>

            <div className="finance-summary">
                <div className="card-premium main-wallet">
                    <div className="wallet-header">
                        <TrendingDown size={20} color="var(--primary)" />
                        <span>Institutional Credits</span>
                    </div>
                    <h2>₹{stats.balance.toLocaleString()}</h2>
                    <p>Verified balance for campus cafeteria and library services.</p>
                </div>
                <div className="card-premium pending-dues">
                    <div className="wallet-header">
                        <Calendar size={20} color="#ef4444" />
                        <span>Total Outsanding Dues</span>
                    </div>
                    <h2>₹{stats.pending.toLocaleString()}</h2>
                    <p>Next payment deadline: Oct 28th, 2024</p>
                    <button className="btn-action-small">Clear Dues <ArrowUpRight size={14} /></button>
                </div>
            </div>

            <div className="billing-list card-premium">
                <div className="billing-header">
                    <h3>Recent Institutional Billing</h3>
                    <div className="filter-shelf-mini">
                        <button className="pill active">Current Term</button>
                        <button className="pill">Previous Terms</button>
                    </div>
                </div>
                <div className="transaction-grid">
                    {invoices.map((inv) => (
                        <div className="inv-row" key={inv.id}>
                            <div className="inv-icon"><CreditCard size={18} /></div>
                            <div className="inv-info">
                                <h4>{inv.title}</h4>
                                <span className="inv-date">Issued: {new Date(inv.issue_date || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="inv-amount">₹{inv.amount.toLocaleString()}</div>
                            <div className={`inv-status ${inv.status}`}>{inv.status.toUpperCase()}</div>
                            <button className="btn-icon-soft"><Download size={16} /></button>
                            <ChevronRight size={16} className="arrow" />
                        </div>
                    ))}
                    {invoices.length === 0 && <div className="empty-state">No active invoices found for this term.</div>}
                </div>
            </div>
        </div>
    );
};

export default Finance;
