import React, { useState } from 'react';
import { Database, TrendingUp, BarChart3, Layers, Download, Filter, RefreshCw, Zap, Activity, Globe, AlertCircle } from 'lucide-react';

const BIWarehouse = () => {

  const deptData = [
    { dept: 'Engineering', val: 92 },
    { dept: 'Business', val: 78 },
    { dept: 'Sciences', val: 85 },
    { dept: 'Arts', val: 61 },
    { dept: 'Medicine', val: 95 },
    { dept: 'Law', val: 73 },
    { dept: 'IT', val: 88 },
    { dept: 'Finance', val: 70 },
  ];

  const pipelines = [
    { name: 'Student Performance ETL', status: 'Synced', pct: 100, color: 'var(--secondary-color)' },
    { name: 'Finance Ledger Export', status: '12 Queued', pct: 60, color: 'var(--primary-color)' },
    { name: 'HR Payroll Reconciliation', status: 'Synced', pct: 100, color: 'var(--secondary-color)' },
    { name: 'Cross-Branch Attendance Feed', status: 'Running', pct: 74, color: 'var(--accent-color)' },
  ];

  const aiAlerts = [
    { severity: 'warning', title: 'Library Usage Anomaly', desc: 'Dept 4 library usage ↓42% vs Q3 historical. Linked to low semester-end activity.', time: '2h ago' },
    { severity: 'info', title: 'Enrollment Surge Predicted', desc: 'AI model projects 18% YoY enrollment growth for Engineering branch – London Node.', time: '6h ago' },
  ];

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0 }}>Data Intelligence Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
            Cross-institutional big data warehouse, BI pipeline orchestration and predictive analytics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Export Data Lake
          </button>
          <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} /> Connect Metabase
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Data Points', value: '4.2M+', icon: Database, color: 'var(--primary-color)' },
          { label: 'Ingestion Rate', value: '1.2k/min', icon: RefreshCw, color: 'var(--secondary-color)' },
          { label: 'Active BI Pipelines', value: '12', icon: Layers, color: 'var(--accent-color)' },
          { label: 'Cross-Branch Nodes', value: '24', icon: Globe, color: '#ec4899' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', background: `${stat.color}15`, borderRadius: '12px' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'var(--secondary-color)', boxShadow: '0 0 8px var(--secondary-color)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart + Pipelines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Bar Chart */}
        <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Cross-Departmental Performance Warehouse</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Normalized scores across all branches — FY 2025-26</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="icon-btn" style={{ padding: '8px' }}><Filter size={16} /></button>
              <button className="icon-btn" style={{ padding: '8px' }}><Activity size={16} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '220px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', paddingBottom: '30px' }}>
              {[100, 75, 50, 25].map((v, i) => (
                <div key={i} style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', width: '100%' }} />
              ))}
            </div>
            {deptData.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '10%' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>{d.val}%</span>
                <div style={{
                  width: '100%',
                  height: `${d.val * 1.8}px`,
                  background: i % 2 === 0
                    ? 'linear-gradient(to top, var(--primary-color), rgba(99,102,241,0.3))'
                    : 'linear-gradient(to top, var(--secondary-color), rgba(16,185,129,0.3))',
                  borderRadius: '8px 8px 0 0',
                }} />
                <p style={{ margin: 0, fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '50px' }}>
                  {d.dept}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipelines + Anomalies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 800 }}>Pipeline Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pipelines.map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{p.name}</span>
                    <span style={{ color: p.color, fontWeight: 800 }}>{p.status}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {aiAlerts.map((alert, i) => (
            <div key={i} className="glass-pane" style={{
              borderRadius: '16px',
              padding: '1.5rem',
              borderLeft: `4px solid ${alert.severity === 'warning' ? 'var(--accent-color)' : 'var(--primary-color)'}`,
              background: alert.severity === 'warning' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(99,102,241,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertCircle size={16} color={alert.severity === 'warning' ? 'var(--accent-color)' : 'var(--primary-color)'} />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{alert.title}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{alert.desc}</p>
              <p style={{ margin: '8px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{alert.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Heatmap */}
      <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Branch Enrollment Heatmap — Global Network</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Q1–Q4 quarterly intensity by department</p>
          </div>
          <button className="btn-ghost" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} /> Table View
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
          {deptData.flatMap((d, di) =>
            [0.4, 0.6, 0.8, 1.0].map((mul, mi) => {
              const intensity = Math.round(d.val * mul);
              const alpha = (intensity / 100) * 0.85;
              return (
                <div key={`${di}-${mi}`}
                  title={`${d.dept} Q${mi + 1}: ${intensity}%`}
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    background: `rgba(99, 102, 241, ${alpha})`,
                    border: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: alpha > 0.4 ? '#fff' : 'var(--text-muted)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {intensity}%
                </div>
              );
            })
          )}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
          {deptData.map((d, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(99,102,241,0.8)' }} />
              {d.dept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BIWarehouse;
