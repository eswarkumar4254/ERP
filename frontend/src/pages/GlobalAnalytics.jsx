import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3, TrendingUp, Users, Globe, Activity,
  ArrowUpRight, ArrowDownRight, Zap, Database,
  Server, Clock, RefreshCw, Download, Filter,
  Layers, HardDrive, Cpu
} from 'lucide-react';

const GlobalAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/api/v1/saas/analytics/overview?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiData(res.data);
    } catch (e) {
      console.error('Failed to load analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' },
  ];

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Tenants', value: 'tenants' },
    { label: 'Performance', value: 'performance' },
    { label: 'Usage', value: 'usage' },
  ];

  const kpis = apiData?.kpis || [];
  const tenantBreakdown = apiData?.tenant_breakdown || [];
  const barData = apiData?.bar_data || [];
  const monthLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const resourceMetrics = apiData?.resource_metrics || [];

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.6rem', fontWeight: 900 }}>Global Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
            Cross-tenant intelligence, usage patterns, and platform-wide performance metrics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-ghost" onClick={fetchData} style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
          <button className="btn-premium" style={{ padding: '10px 22px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Time Range + Tabs Bar */}
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
          {timeRanges.map(r => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                background: timeRange === r.value ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: timeRange === r.value ? 'var(--primary-color)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      {(activeTab === 'overview' || activeTab === 'usage' || activeTab === 'performance') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {kpis.map((kpi, i) => {
            // Map icons from strings returned by the API
            const iconMap = {
              Users: Users,
              Activity: Activity,
              Clock: Clock,
              Server: Server,
              Database: Database,
              Layers: Layers
            };
            const Icon = typeof kpi.icon === 'string' ? (iconMap[kpi.icon] || Activity) : kpi.icon;
            
            // Filter kpis based on tab
            if (activeTab === 'usage' && !['API Requests / Day', 'Total Active Users'].includes(kpi.label)) return null;
            if (activeTab === 'performance' && !['Avg Response Time', 'Platform Uptime', 'Data Processed'].includes(kpi.label)) return null;

            return (
              <div key={i} className="glass-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={kpi.color} />
                  </div>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: kpi.up ? '#10b981' : '#ef4444',
                    background: kpi.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '4px 10px', borderRadius: '20px'
                  }}>
                    {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {kpi.change}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</p>
                <h2 style={{ margin: '6px 0 4px', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.value}</h2>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{kpi.sub}</p>
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '90px', height: '90px', background: `${kpi.color}06`, borderRadius: '50%', filter: 'blur(24px)' }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: (activeTab === 'performance' || activeTab === 'usage') ? '1fr' : '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Bar Chart - Monthly API Requests */}
        {(activeTab === 'overview' || activeTab === 'usage') && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>API Request Volume</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Monthly across all tenants (in millions)</p>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--secondary-color)', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                ↑ 8.1% avg growth
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '160px' }}>
              {barData.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%', borderRadius: '6px 6px 0 0',
                    height: `${val}%`,
                    background: i === barData.length - 1
                      ? 'linear-gradient(135deg, var(--primary-color), #818cf8)'
                      : 'rgba(99,102,241,0.25)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }} title={`${(val * 0.08).toFixed(1)}M`} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: '28px' }}>{monthLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Utilization */}
        {(activeTab === 'overview' || activeTab === 'performance') && (
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700 }}>Resource Utilization</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {resourceMetrics.map((m, i) => {
                const iconMap = {
                  Cpu: Cpu,
                  HardDrive: HardDrive,
                  Database: Database,
                  Zap: Zap
                };
                const Icon = typeof m.icon === 'string' ? (iconMap[m.icon] || Cpu) : m.icon;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={15} color={m.color} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{m.label}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: m.color }}>{m.value}%</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ width: `${m.value}%`, height: '100%', borderRadius: '99px', background: m.color, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tenant Breakdown Table */}
      {(activeTab === 'overview' || activeTab === 'tenants') && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Tenant Activity Matrix</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Usage breakdown per institution partition</p>
            </div>
            <button className="btn-ghost" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <Filter size={14} /> Filter
            </button>
          </div>
          <div className="glass-pane" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Active Users</th>
                  <th>API Requests</th>
                  <th>License Tier</th>
                  <th>Health Score</th>
                </tr>
              </thead>
              <tbody>
                {tenantBreakdown.map((t, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td style={{ fontWeight: 600 }}>{t.users.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{t.requests}</td>
                    <td>
                      <span className="badge-premium" style={{
                        background: t.plan === 'ENTERPRISE' ? 'rgba(139,92,246,0.12)' : t.plan === 'PREMIUM' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.06)',
                        color: t.plan === 'ENTERPRISE' ? '#c084fc' : t.plan === 'PREMIUM' ? 'var(--primary-color)' : 'var(--text-muted)',
                      }}>
                        {t.plan}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ width: `${t.health}%`, height: '100%', borderRadius: '99px', background: t.health >= 99 ? '#10b981' : '#f59e0b' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: t.health >= 99 ? '#10b981' : '#f59e0b', minWidth: '36px' }}>{t.health}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalAnalytics;
