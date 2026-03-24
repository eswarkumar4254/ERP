import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wallet, CreditCard, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, CheckCircle,
  AlertCircle, Download, RefreshCw, Filter,
  DollarSign, Receipt, Calendar, Zap, Globe,
  BarChart3, PieChart, Layers, Clock
} from 'lucide-react';

const SaasBilling = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/api/v1/saas/billing/overview?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiData(res.data);
    } catch (e) {
      console.error('Failed to load billing stats', e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Invoices', value: 'invoices' },
    { label: 'Plans', value: 'plans' },
    { label: 'Revenue', value: 'revenue' },
  ];

  const stats = apiData?.stats || [];
  const invoices = apiData?.invoices || [];

  const plans = apiData?.plans || [];

  const revenueByMonth = apiData?.revenue_trend || [38, 41, 39, 44, 42, 47, 45, 49, 46, 48, 51, 48];
  const monthLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const statusColor = (status) => {
    if (status === 'PAID') return { bg: 'rgba(16,185,129,0.1)', color: '#10b981' };
    if (status === 'PENDING') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  };

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.6rem', fontWeight: 900 }}>SaaS Billing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
            Revenue intelligence, invoice lifecycle, and subscription plan management across all tenants.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={fetchData} style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Sync Billing
          </button>
          <button className="btn-premium" style={{ padding: '10px 22px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Ledger
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              style={{
                padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                background: activeTab === t.value ? 'var(--primary-color)' : 'transparent',
                color: activeTab === t.value ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['monthly', 'quarterly', 'annual'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize',
                background: selectedPeriod === p ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: selectedPeriod === p ? 'var(--primary-color)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      {(activeTab === 'overview' || activeTab === 'revenue' || activeTab === 'invoices') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {stats.map((s, i) => {
            const iconMap = {
              TrendingUp: TrendingUp,
              BarChart3: BarChart3,
              DollarSign: DollarSign,
              TrendingDown: TrendingDown
            };
            const Icon = typeof s.icon === 'string' ? (iconMap[s.icon] || BarChart3) : s.icon;
            
            // Filter stats based on tab if needed, but since we are showing revenue in both, we can show them.
            if (activeTab === 'invoices' && !['Net Revenue (Period)', 'Churn Rate'].includes(s.label)) return null;

            return (
              <div key={i} className="glass-card" style={{ padding: '1.6rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700,
                    color: s.up ? '#10b981' : '#ef4444',
                    background: s.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '3px 9px', borderRadius: '20px',
                  }}>
                    {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {s.change}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <h2 style={{ margin: '6px 0 4px', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</h2>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</p>
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', background: `${s.color}06`, borderRadius: '50%', filter: 'blur(20px)' }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue Chart + Plan Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: (activeTab === 'revenue' || activeTab === 'plans') ? '1fr' : '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Revenue Chart */}
        {(activeTab === 'overview' || activeTab === 'revenue') && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Revenue Trend</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>MRR over last 12 months (₹ Lakhs)</p>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                ↑ 14.3% growth
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '160px' }}>
              {revenueByMonth.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%', borderRadius: '6px 6px 0 0',
                    height: `${((val - 35) / 20) * 100}%`,
                    background: i === revenueByMonth.length - 1
                      ? 'linear-gradient(135deg, #10b981, #34d399)'
                      : 'rgba(16,185,129,0.22)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }} title={`₹${val}L`} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: '28px' }}>{monthLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Distribution */}
        {(activeTab === 'overview' || activeTab === 'plans') && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700 }}>Plan Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {plans.map((p, i) => {
                const total = plans.reduce((s, pl) => s + pl.tenants, 0);
                const pct = Math.round((p.tenants / total) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: p.color }}>{p.name}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.tenants} tenants · {pct}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '99px', background: p.color, transition: 'width 0.6s ease' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Revenue: {p.revenue}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Invoices Table */}
      {(activeTab === 'overview' || activeTab === 'invoices') && (
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Invoice Ledger</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Recent billing transactions across all tenant partitions</p>
            </div>
            <button className="btn-ghost" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <Filter size={14} /> Filter
            </button>
          </div>
          <div className="glass-pane" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Institution</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => {
                  const sc = statusColor(inv.status);
                  return (
                    <tr key={i}>
                      <td><code style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '3px 7px', borderRadius: '5px' }}>{inv.id}</code></td>
                      <td style={{ fontWeight: 600, fontSize: '0.88rem' }}>{inv.tenant}</td>
                      <td>
                        <span className="badge-premium" style={{
                          background: inv.plan === 'ENTERPRISE' ? 'rgba(139,92,246,0.12)' : inv.plan === 'PREMIUM' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.06)',
                          color: inv.plan === 'ENTERPRISE' ? '#c084fc' : inv.plan === 'PREMIUM' ? 'var(--primary-color)' : 'var(--text-muted)',
                        }}>
                          {inv.plan}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.9rem' }}>{inv.amount}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{inv.date}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{inv.due}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: sc.bg, color: sc.color }}>
                          {inv.status === 'PAID' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="icon-btn" style={{ padding: '7px', background: 'rgba(255,255,255,0.03)' }}>
                          <Download size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      {(activeTab === 'overview' || activeTab === 'plans') && (
        <div>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700 }}>Subscription Plans</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {plans.map((p, i) => (
              <div key={i} className="glass-card" style={{
                padding: '2rem',
                border: p.highlight ? `1px solid ${p.color}40` : '1px solid rgba(255,255,255,0.05)',
                position: 'relative', overflow: 'hidden'
              }}>
                {p.highlight && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary-color)', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.name}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '8px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: p.color }}>{p.price}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.period}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
                    {p.tenants} tenants
                  </span>
                  <span style={{ fontSize: '0.78rem', color: p.color, background: `${p.color}10`, padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                    {p.revenue}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} color={p.color} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '100px', height: '100px', background: `${p.color}05`, borderRadius: '50%', filter: 'blur(30px)' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaasBilling;
