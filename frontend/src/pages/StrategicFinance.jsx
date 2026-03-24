import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle, FileText, PieChart, RefreshCw,
  Search, Filter, Download, Zap, Brain
} from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

const API = 'http://localhost:8000/api/v1';

const StrategicFinance = () => {
  const [defaulters, setDefaulters] = useState([]);
  const [roi, setRoi] = useState({ collection_rate: '0%', strategic_target: '95.0%', arrears_recovery_potential: '₹0' });
  const [aiForecast, setAiForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [defRes, roiRes, aiRes] = await Promise.all([
        axios.get(`${API}/finance/strategic/defaulters`, { headers }),
        axios.get(`${API}/finance/strategic/global-roi`, { headers }),
        axios.get(`${API}/ai-automation/financial-forecast`, { headers })
      ]);
      setDefaulters(defRes.data);
      setRoi(roiRes.data);
      setAiForecast(aiRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setRefreshing(true);
    try {
      await axios.post(`${API}/finance/strategic/refresh-status`, {}, { headers });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const collectionOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 10 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Current Collection %', 'Strategic Target'] },
    fill: { opacity: 1 },
    colors: ['var(--primary-color)', '#10b981'],
    tooltip: { y: { formatter: (val) => val + "%" } }
  };

  return (
    <div className="page-content" style={{ padding: '2rem 3rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient caps-lock" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Strategic Fee Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Optimizing institutional liquidity through dynamic recovery workflows and target-driven collections.
          </p>
        </div>
        <button 
          className="btn-premium" 
          onClick={handleSync}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing AR...' : 'Analyze Delinquency'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
           <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Real-Time Collection Rate</p>
           <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{roi.collection_rate}</h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontSize: '0.85rem' }}>
              <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> 
              <span>{(95 - parseFloat(roi.collection_rate)).toFixed(1)}% below target</span>
           </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', background: 'var(--primary-glow)' }}>
           <p style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>Arrears Recovery Potential</p>
           <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{roi.arrears_recovery_potential}</h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--primary-color)', fontSize: '0.85rem' }}>
              <Zap size={14} /> 
              <span>Ready for collection workflow</span>
           </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
           <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Strategic ROI Target</p>
           <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{roi.strategic_target}</h2>
           <p className="badge" style={{ background: '#10b98122', color: '#10b981' }}>Month 12 Objective</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
         <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <AlertTriangle size={24} color="#ef4444" /> Fee Defaulters List
            </h3>
            <div className="table-responsive">
               <table className="custom-table">
                  <thead>
                    <tr>
                       <th>STUDENT ID</th>
                       <th>DUE AMOUNT</th>
                       <th>LAST PAYMENT</th>
                       <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaulters.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No active defaulters matching criteria.</td>
                      </tr>
                    ) : (
                      defaulters.map(d => (
                        <tr key={d.id}>
                           <td style={{ fontWeight: 600 }}>#ST-{d.student_id}</td>
                           <td style={{ color: '#ef4444', fontWeight: 700 }}>₹{d.total_due.toLocaleString()}</td>
                           <td style={{ fontSize: '0.85rem' }}>{d.last_payment_date ? new Date(d.last_payment_date).toLocaleDateString() : 'N/A'}</td>
                           <td><span className="badge danger">DELINQUENT</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '2rem' }}>Strategic Comparison</h3>
            <ReactApexChart 
               options={collectionOptions} 
               series={[{ name: 'Rate', data: [parseFloat(roi.collection_rate), 95] }]} 
               type="bar" 
               height={300} 
            />
         </div>
      </div>

      {aiForecast && (
        <div className="glass-card" style={{ marginTop: '2rem', padding: '2.5rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
             <div style={{ padding: '12px', background: 'var(--primary-color)', borderRadius: '12px', color: 'white' }}>
                <Brain size={24} />
             </div>
             <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Financial Autopilot</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Predictive revenue modeling and automated liquidity risk assessment.</p>
             </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
             <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Projected Revenue (Q4)</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>₹{aiForecast.predicted_revenue.toLocaleString()}</p>
             </div>
             <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Growth Trajectory</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>{aiForecast.growth_projection}</p>
             </div>
             <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Risk Index (Churn)</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: aiForecast.risk_index > 0.05 ? '#f59e0b' : '#10b981' }}>{aiForecast.risk_index}</p>
             </div>
             <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Collection Eficacy</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>{aiForecast.collection_efficiency}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicFinance;
