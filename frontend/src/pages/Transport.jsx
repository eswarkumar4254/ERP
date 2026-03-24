import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Truck, MapPin, Plus, Shield, Users, Zap, 
  Settings, AlertTriangle, Fuel, Gauge, Navigation,
  Clock, Download, Filter, Search, Activity
} from 'lucide-react';

const API = 'http://localhost:8000';

const Card = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</p>
        <h2 style={{ color }}>{value}</h2>
        <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>{subtitle}</p>
      </div>
      <div style={{ background: `${color}15`, padding: '8px', borderRadius: '8px', color }}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const Transport = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet');
  const [fleetStatus, setFleetStatus] = useState([]);
  const [commuters, setCommuters] = useState([]);
  const [driverRankings, setDriverRankings] = useState([]);
  
  const token = localStorage.getItem('token');
  // const role = localStorage.getItem('user_role') || 'student';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [routesRes, fleetRes, commuterRes, driverRes] = await Promise.all([
          axios.get(`${API}/api/v1/tms/routes`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/tms/fleet/status`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/tms/commuters`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/tms/drivers/rankings`, { headers }).catch(() => ({ data: [] }))
        ]);
        setRoutes(routesRes.data);
        setFleetStatus(fleetRes.data);
        setCommuters(commuterRes.data);
        setDriverRankings(driverRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="page-content">Loading Transport Data...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Transport Fleet Matrix (TMS)</h1>
        <p>Real-time vehicular telemetry, GPS tracking, and route optimization engine.</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: '2.5rem' }}>
        <Card title="Active Fleet" value="12 Vehicles" subtitle="98% Operational" icon={Truck} color="#6366f1" />
        <Card title="Fuel Efficiency" value="14.2 km/L" subtitle="Avg across all routes" icon={Fuel} color="#10b981" />
        <Card title="Live Commuters" value="450+" subtitle="Current en-route" icon={Users} color="#f59e0b" />
        <Card title="Maintenance Alerts" value="2 Pending" subtitle="Next 15 days" icon={AlertTriangle} color="#ef4444" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
        <button className={`tab-btn ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}>Fleet Telemetry</button>
        <button className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`} onClick={() => setActiveTab('routes')}>Route Logic</button>
        <button className={`tab-btn ${activeTab === 'commuters' ? 'active' : ''}`} onClick={() => setActiveTab('commuters')}>Commuter List</button>
        <button className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>Driver Scorecard</button>
        <button className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`} onClick={() => setActiveTab('tracking')}>Live GPS</button>
        <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Fuel & Cost</button>
      </div>

      {activeTab === 'fleet' && (
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-color-light)' }}>
                <th style={{ width: '50px', padding: '16px' }}>S.No</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Vehicle ID</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Fuel Level</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Speed</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {fleetStatus.map((v, idx) => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                  <td style={{ padding: '16px' }}><strong>{v.bus_no}</strong><br/><span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{v.route}</span></td>
                  <td style={{ padding: '16px' }}>
                     <span className="badge" style={{ 
                       background: v.status === 'Moving' ? '#d1fae5' : v.status === 'Stopped' ? '#fee2e2' : '#f3f4f6',
                       color: v.status === 'Moving' ? '#065f46' : v.status === 'Stopped' ? '#991b1b' : '#6b7280'
                     }}>{v.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-track" style={{ width: '60px', height: '6px' }}><div className="progress-fill" style={{ width: `${v.fuel}%`, background: v.fuel < 20 ? '#ef4444' : '#10b981' }}></div></div>
                        <span style={{ fontSize: '0.8rem' }}>{v.fuel}%</span>
                     </div>
                  </td>
                  <td style={{ padding: '16px' }}>{v.speed} km/h</td>
                  <td style={{ padding: '16px' }}><button className="btn-ghost" style={{ fontSize: '0.7rem' }}>View Telemetry</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'commuters' && (
        <div className="card">
          <h3>Registered Commuters</h3>
          <table style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ width: '50px', padding: '10px' }}>S.No</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Route</th>
                <th style={{ padding: '10px' }}>Primary Stop</th>
                <th style={{ padding: '10px' }}>Fee Status</th>
              </tr>
            </thead>
            <tbody>
              {commuters.map((c, idx) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{c.name}</td>
                  <td style={{ padding: '10px' }}>{c.route}</td>
                  <td style={{ padding: '10px' }}>{c.stop}</td>
                  <td style={{ padding: '10px' }}><span className="badge" style={{ background: c.fee_status === 'Paid' ? '#d1fae5' : '#fee2e2' }}>{c.fee_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="card">
          <h3>Driver Performance Leaderboard</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {driverRankings.map((d, i) => (
              <div key={i} className="glass-pane" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>{d.name}</h4>
                  <span style={{ color: '#facc15', fontWeight: 'bold' }}>★ {d.rating}</span>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Exp: {d.experience}</p>
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                    <span>Safety Score</span>
                    <span>{d.safety_score}%</span>
                  </div>
                  <div className="progress-track" style={{ height: '5px' }}><div className="progress-fill" style={{ width: `${d.safety_score}%`, background: '#10b981' }}></div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'routes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {routes.map(route => (
            <div key={route.id} className="card-pro">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{route.title}</h3>
                <span className="badge-premium">{route.vehicle_number}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <Navigation size={14} color="var(--primary-color)" />
                  <span>{route.start_point} → {route.end_point}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <Users size={14} color="#6366f1" />
                  <span>Commuters: 42 Registered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                   <Clock size={14} color="#f59e0b" />
                   <span>Avg Trip: 54 min</span>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                <button className="btn" style={{ flex: 1 }}>Optimize Route</button>
                <button className="btn-ghost" style={{ flex: 1 }}>View Stops</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', border: '1px dashed var(--border-color)', position: 'relative' }}>
           <div style={{ textAlign: 'center' }}>
              <Navigation size={48} color="var(--primary-color)" className="animate-pulse" />
              <h3 style={{ marginTop: '1rem' }}>Live GPS Engine Active</h3>
              <p style={{ opacity: 0.7 }}>Simulating real-time fleet movement for 12 active buses.</p>
           </div>
           
           <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="glass-card" style={{ padding: '10px' }}>
                 <p style={{ fontSize: '0.7rem', margin: 0 }}>Bus 042 (Speed)</p>
                 <h4 style={{ margin: 0 }}>64 km/h</h4>
              </div>
              <div className="glass-card" style={{ padding: '10px' }}>
                 <p style={{ fontSize: '0.7rem', margin: 0 }}>Traffic Delay</p>
                 <h4 style={{ margin: 0, color: '#ef4444' }}>+12 min</h4>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'analytics' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            <div className="card">
               <h3>Fuel Consumption vs Expenditure</h3>
               <div style={{ height: '250px', border: '1px dashed #ddd', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                  [ Monthly Fuel Analytics Chart ]
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                  <div className="glass-pane">
                     <p style={{ fontSize: '0.8rem' }}>Total Diesel Cost</p>
                     <h3>₹8.42 Lakhs</h3>
                  </div>
                  <div className="glass-pane">
                     <p style={{ fontSize: '0.8rem' }}>Maintenance Cost</p>
                     <h3>₹1.20 Lakhs</h3>
                  </div>
               </div>
            </div>
            <div className="card">
               <h3>Renewal Alerts</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
                  <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
                     <h4 style={{ margin: 0 }}>Pollution (BUS-04)</h4>
                     <p style={{ fontSize: '0.7rem', color: '#ef4444' }}>Expires in 3 days</p>
                  </div>
                  <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
                     <h4 style={{ margin: 0 }}>Insurance (BUS-12)</h4>
                     <p style={{ fontSize: '0.7rem' }}>Renewed - Valid for 360 days</p>
                  </div>
                  <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                     <h4 style={{ margin: 0 }}>Road Tax (BUS-08)</h4>
                     <p style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Expires in 15 days</p>
                  </div>
               </div>
               <button className="btn-premium" style={{ marginTop: '1.5rem', width: '100%' }}>Download All RC/Permits</button>
            </div>
         </div>
      )}
    </div>
  );
};

export default Transport;
