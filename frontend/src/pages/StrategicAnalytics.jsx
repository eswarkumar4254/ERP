import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Brain, TrendingDown, TrendingUp, AlertCircle, 
  CheckCircle, Users, Activity, Target, RefreshCcw,
  Search, Filter, ChevronRight, UserMinus
} from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

const API = 'http://localhost:8000/api/v1';

const StrategicAnalytics = () => {
  const [atRisk, setAtRisk] = useState([]);
  const [stats, setStats] = useState({ critical_count: 0, warning_count: 0, retention_forecast: '0%', intervention_needed: false });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [riskRes, statsRes] = await Promise.all([
        axios.get(`${API}/analytics/strategic/at-risk`, { headers }),
        axios.get(`${API}/analytics/strategic/global-stats`, { headers })
      ]);
      setAtRisk(riskRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await axios.post(`${API}/analytics/strategic/refresh`, {}, { headers });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const chartOptions = {
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%', },
        track: { background: 'var(--surface-color-light)', },
        dataLabels: {
          name: { show: false },
          value: { offsetY: 5, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }
        }
      }
    },
    colors: ['#10b981'],
  };

  return (
    <div className="page-content" style={{ padding: '2rem 3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient caps-lock" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Learning Analytics & Predictions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            AI-powered institutional intervention systems to drive student retention and success.
          </p>
        </div>
        <button 
          className="btn-premium" 
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCcw size={18} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Analyzing...' : 'Refresh Predictions'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
             <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Critical Intervention</p>
             <AlertCircle size={20} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.critical_count}</h2>
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>Immediate action required</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
             <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Warning Zone</p>
             <TrendingDown size={20} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.warning_count}</h2>
          <p style={{ color: '#f59e0b', fontSize: '0.8rem', marginTop: '0.5rem' }}>Trending toward medium-risk</p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
             <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Institu. Retention Forecast</p>
             <CheckCircle size={20} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.retention_forecast}</h2>
             <div style={{ width: '60px', height: '60px' }}>
                <ReactApexChart options={chartOptions} series={[parseInt(stats.retention_forecast)]} type="radialBar" height={100} />
             </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--primary-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
             <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Predicted ROI (Target)</p>
             <TrendingUp size={20} color="var(--primary-color)" />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>+150%</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>3-year strategic goal</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Brain size={24} color="var(--primary-color)" /> Risk Assessment Engine (v1)
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input className="input-premium" style={{ width: '300px', paddingLeft: '36px' }} placeholder="Search student risk profile..." />
                </div>
                <button className="icon-btn-glass"><Filter size={18} /></button>
            </div>
         </div>

         <div className="table-responsive">
            <table className="custom-table">
               <thead>
                  <tr>
                     <th>STUDENT PROFILE</th>
                     <th>CREDIBILITY & RISK</th>
                     <th>PRIMARY REASONS</th>
                     <th>LAST SYNC</th>
                     <th>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {atRisk.length === 0 ? (
                    <tr>
                       <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                          <Users size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                          <p style={{ color: 'var(--text-secondary)' }}>System indicates zero critical risks today. Excellent institutional health.</p>
                       </td>
                    </tr>
                  ) : (
                    atRisk.map(item => (
                      <tr key={item.id}>
                         <td>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="avatar-initial" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>#{item.student_id}</div>
                              <div style={{ fontWeight: 600 }}>Student ID: {item.student_id}</div>
                           </div>
                         </td>
                         <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                               <div style={{ flex: 1, background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ background: item.status === 'critical' ? '#ef4444' : '#f59e0b', width: `${item.risk_score * 100}%`, height: '100%', borderRadius: '4px' }} />
                               </div>
                               <span style={{ fontWeight: 700, color: item.status === 'critical' ? '#ef4444' : '#f59e0b' }}>
                                 {(item.risk_score * 100).toFixed(0)}%
                               </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                               {item.status.toUpperCase()} STATUS
                            </div>
                         </td>
                         <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                               {item.primary_reasons?.map(r => (
                                 <span key={r} className="badge" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
                                   {r.replace('_', ' ').toUpperCase()}
                                 </span>
                               ))}
                            </div>
                         </td>
                         <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(item.last_updated).toLocaleString()}
                         </td>
                         <td>
                            <button className="icon-btn-glass" title="Initiate Intervention"><Target size={18} color="var(--primary-color)" /></button>
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

export default StrategicAnalytics;
