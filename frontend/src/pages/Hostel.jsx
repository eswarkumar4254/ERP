import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bed, User, MapPin, Plus, ShieldCheck, Activity } from 'lucide-react';

const API = 'http://localhost:8000';

const Hostel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matrix');
  const [residents, setResidents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [messMenu, setMessMenu] = useState(null);
  const [outpassLogs, setOutpassLogs] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role') || 'student';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [roomsRes, residentsRes, maintRes, messRes, outpassRes] = await Promise.all([
          axios.get(`${API}/api/v1/hms/rooms`, { headers }),
          axios.get(`${API}/api/v1/hms/residents`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/hms/maintenance`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/v1/hms/mess/menu`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/api/v1/hms/outpass/logs`, { headers }).catch(() => ({ data: [] }))
        ]);
        setRooms(roomsRes.data);
        setResidents(residentsRes.data);
        setMaintenance(maintRes.data);
        setMessMenu(messRes.data);
        setOutpassLogs(outpassRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Hostel Residency Hub (HMS)</h1>
        <p>Manage room allocations, occupancy, and resident status across all blocks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card">
          <Bed size={24} color="var(--primary-color)" />
          <h3>Total Capacity</h3>
          <h2>{rooms.reduce((acc, r) => acc + r.capacity, 0)} Units</h2>
        </div>
        <div className="glass-card">
          <User size={24} color="#10b981" />
          <h3>Occupied</h3>
          <h2>{rooms.reduce((acc, r) => acc + r.occupied, 0)} Residents</h2>
        </div>
        <div className="glass-card">
          <ShieldCheck size={24} color="#f59e0b" />
          <h3>Safety Status</h3>
          <h2>Secure</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`} onClick={() => setActiveTab('matrix')}>Room Matrix</button>
        <button className={`tab-btn ${activeTab === 'residents' ? 'active' : ''}`} onClick={() => setActiveTab('residents')}>Resident List</button>
        <button className={`tab-btn ${activeTab === 'maint' ? 'active' : ''}`} onClick={() => setActiveTab('maint')}>Maintenance & Safety</button>
        <button className={`tab-btn ${activeTab === 'mess' ? 'active' : ''}`} onClick={() => setActiveTab('mess')}>Mess & Dining</button>
        <button className={`tab-btn ${activeTab === 'outpass' ? 'active' : ''}`} onClick={() => setActiveTab('outpass')}>Outpass Logs</button>
      </div>

      {activeTab === 'matrix' && (
        <div className="glass-pane">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Institutional Grid View</h2>
            {(role === 'super_admin' || role === 'hostel_warden' || role === 'institution_admin') && (
              <button className="btn-premium">
                 Add New Wing
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {rooms.map(room => (
              <div key={room.id} className="card-pro" style={{ 
                borderTop: room.occupied === room.capacity ? '4px solid #ef4444' : '4px solid #10b981',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0 }}>Room {room.room_number}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Floor {room.floor}</p>
                <div style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                   {room.occupied} / {room.capacity}
                </div>
                <div className="progress-track" style={{ height: '4px' }}>
                  <div className="progress-fill" style={{ 
                    width: `${(room.occupied/room.capacity)*100}%`,
                    background: room.occupied === room.capacity ? '#ef4444' : '#10b981'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'residents' && (
        <div className="card">
          <h3>Active Residents</h3>
          <table style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ width: '50px', padding: '10px' }}>S.No</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Room</th>
                <th style={{ padding: '10px' }}>Course</th>
                <th style={{ padding: '10px' }}>Dues</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{r.name}</td>
                  <td style={{ padding: '10px' }}>{r.room}</td>
                  <td style={{ padding: '10px' }}>{r.course}</td>
                  <td style={{ padding: '10px', color: r.balance > 0 ? '#ef4444' : '#10b981' }}>₹{r.balance}</td>
                  <td style={{ padding: '10px' }}><button className="btn-ghost" style={{ fontSize: '0.7rem' }}>View Profile</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'maint' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h3>Active Maintenance Tickets</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {maintenance.map(m => (
                <div key={m.id} className="glass-pane" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>Room {m.room} - {m.issue}</h4>
                    <span className="badge" style={{ background: m.priority === 'High' ? '#fee2e2' : '#f3f4f6', color: m.priority === 'High' ? '#ef4444' : '#6b7280' }}>{m.priority}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Status: <strong>{m.status}</strong></p>
                </div>
              ))}
            </div>
            <button className="btn-premium" style={{ marginTop: '1.5rem', width: '100%' }}>Raise Tech Support Ticket</button>
          </div>
          <div className="card">
             <h3>Safety Checklist</h3>
             <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>✅ CCTV Surveillance: 100% Operational</li>
                <li>✅ Fire Extinguishers: Tested 2 days ago</li>
                <li>✅ Biometric Gate: Functional</li>
                <li>⚠️ Emergency Exit (Block C): Needs inspection</li>
             </ul>
             <button className="btn" style={{ marginTop: '1.5rem', width: '100%' }}>Run Safety Audit</button>
          </div>
        </div>
      )}

      {activeTab === 'mess' && (
        <div className="card">
          <h3>Weekly Mess Menu</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            {messMenu && Object.entries(messMenu).map(([day, meals]) => (
              <div key={day} className="glass-pane" style={{ padding: '1rem' }}>
                <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>{day}</h4>
                <div style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                  <p><strong>Breakfast:</strong> {meals.Breakfast}</p>
                  <p><strong>Lunch:</strong> {meals.Lunch}</p>
                  <p><strong>Dinner:</strong> {meals.Dinner}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
             <button className="btn-premium">Submit Meal Feedback</button>
             <button className="btn-ghost">View Billing Cycle</button>
          </div>
        </div>
      )}

      {activeTab === 'outpass' && (
        <div className="card">
          <h3>Outpass Management</h3>
          <table style={{ width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ width: '50px', padding: '10px' }}>S.No</th>
                <th style={{ padding: '10px' }}>Student</th>
                <th style={{ padding: '10px' }}>Reason</th>
                <th style={{ padding: '10px' }}>Out Time</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {outpassLogs.map((log, idx) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.student}</td>
                  <td style={{ padding: '10px' }}>{log.reason}</td>
                  <td style={{ padding: '10px' }}>{log.out_time}</td>
                  <td style={{ padding: '10px' }}><span className="badge" style={{ background: log.status === 'Approved' ? '#d1fae5' : '#fef3c7' }}>{log.status}</span></td>
                  <td style={{ padding: '10px' }}><button className="btn-ghost" style={{ fontSize: '0.7rem' }}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-premium" style={{ marginTop: '1.5rem' }}>Apply for Outpass</button>
        </div>
      )}
    </div>
  );
};

export default Hostel;
