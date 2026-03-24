import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, FileText, CheckCircle2, GraduationCap, 
  DollarSign, User, Shield, BookOpen, 
  ChevronRight, Calendar, Star, Clock,
  MessageSquare, Layout, Award
} from 'lucide-react';

const API = 'http://localhost:8000';

const Portals = () => {
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [wards, setWards] = useState([]);
  const [activeWardId, setActiveWardId] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem('user_role') || 'student';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      if (role === 'parent') {
        const wardsRes = await axios.get(`${API}/api/v1/parent/my-wards`, { headers });
        setWards(wardsRes.data);
        if (wardsRes.data.length > 0) {
          const wardId = activeWardId || wardsRes.data[0].id;
          if (!activeWardId) setActiveWardId(wardId);
          
          const [attRes, invRes] = await Promise.all([
            axios.get(`${API}/api/v1/parent/ward/${wardId}/attendance-mini`, { headers }),
            axios.get(`${API}/api/v1/parent/ward/${wardId}/invoices`, { headers })
          ]);
          setAttendance(attRes.data);
          setInvoices(invRes.data);
        }
      } else {
        const STUDENT_ID = 1;
        const [notifRes, assignRes, gradesRes, attRes, invRes] = await Promise.all([
          axios.get(`${API}/notifications/${STUDENT_ID}`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/assignments`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/students/${STUDENT_ID}/grades`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/students/${STUDENT_ID}/attendance`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/students/${STUDENT_ID}/invoices`, { headers }).catch(() => ({ data: [] }))
        ]);
        setNotifications(notifRes.data);
        setAssignments(assignRes.data);
        setGrades(gradesRes.data);
        setAttendance(attRes.data);
        setInvoices(invRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, activeWardId]);

  if (loading) return <p>Syncing Student 360 data...</p>;

  return (
    <div>
      {role === 'parent' ? (
        <div className="page-content">
          <div className="page-header" style={{ marginBottom: '2rem' }}>
            <h1>Parent/Guardian Console</h1>
            <p>Monitoring academic progress and financial standing for your wards.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card">
                   <h3>Wards Overview</h3>
                   <div style={{ marginTop: '1rem' }}>
                      {wards.map(w => (
                         <div 
                           key={w.id} 
                           onClick={() => setActiveWardId(w.id)}
                           className="nav-item" 
                           style={{ 
                             padding: '1rem', 
                             cursor: 'pointer', 
                             background: activeWardId === w.id ? 'var(--primary-color)22' : 'transparent',
                             border: activeWardId === w.id ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                             marginBottom: '0.5rem',
                             borderRadius: '12px'
                           }}
                         >
                            <p style={{ margin: 0, fontWeight: 700 }}>{w.first_name} {w.last_name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {w.enrollment_number}</p>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="card">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                      <Star size={20} color="#f59e0b" />
                      <h3 style={{ margin: 0 }}>Attendance Alert</h3>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '2.5rem', color: (attendance?.percentage < 75) ? '#ef4444' : '#10b981', margin: '0.5rem 0' }}>
                        {attendance ? `${attendance.percentage}%` : "Calculating..."}
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Status: <span style={{ fontWeight: 800, color: (attendance?.percentage < 75) ? '#ef4444' : '#10b981' }}>{attendance?.status}</span>
                      </p>
                      {attendance?.percentage < 75 && (
                        <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', marginTop: '1rem' }}>
                           <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                           Attendance shortage detected. Please contact the HOD.
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                   <h3 style={{ margin: 0 }}>Fee Statements & Payments</h3>
                   <button className="btn-premium">View Full Ledger</button>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                   {invoices.map(inv => (
                      <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                         <div>
                            <p style={{ margin: 0, fontWeight: 700 }}>{inv.title}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Challan: {inv.challan_number}</p>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontWeight: 800 }}>₹{inv.amount}</p>
                            {inv.status === 'pending' ? (
                              <button className="btn" style={{ fontSize: '0.75rem', padding: '5px 12px', background: 'var(--primary-color)', color: '#fff', marginTop: '5px' }}>Quick Pay</button>
                            ) : (
                              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>PAID</span>
                            )}
                         </div>
                      </div>
                   ))}
                   {invoices.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No pending dues for this ward.</p>}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="page-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Student 360 Dashboard</h1>
              <p>Consolidated view of your academic progress, financial status, and institutional updates.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
               <div className="stat-icon-wrapper" style={{ background: 'var(--surface-color-light)', cursor: 'pointer' }}>
                  <Bell size={20} />
               </div>
               <div className="stat-icon-wrapper" style={{ background: 'var(--surface-color-light)', cursor: 'pointer' }}>
                  <User size={20} />
               </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', color: '#fff', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                  {localStorage.getItem('user_name')?.[0] || 'S'}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>Welcome back, {localStorage.getItem('user_name') || 'Student'}!</h2>
                  <p style={{ margin: '5px 0 0', opacity: 0.8 }}>CSE Student • 6th Semester</p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} /> ID: 21102001</span>
                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={14} /> GPA: 3.82</span>
                  </div>
                </div>
              </div>
              <button className="btn" style={{ background: '#fff', color: 'var(--primary-color)', fontWeight: 700 }}>
                Personal Profile
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            
            {/* Left Column: Academic & Communication */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={20} color="var(--primary-color)" /> Activity & Announcements
                  </h3>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Mark all read</button>
                </div>
                <div style={{ padding: '1rem' }}>
                  {notifications.map(n => (
                    <div key={n.id} className="nav-item" style={{ padding: '1rem', marginBottom: '0.5rem', borderRadius: '12px', background: 'var(--surface-color-light)', border: 'none', display: 'flex', gap: '1rem' }}>
                      <div style={{ minWidth: '40px', height: '40px', background: '#6366f122', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                        <MessageSquare size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{n.title}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent activity.</p>}
                </div>
              </div>

              <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={20} color="#10b981" /> Active Assignments
                  </h3>
                  <button style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>View LMS</button>
                </div>
                <div style={{ padding: '1rem' }}>
                  {assignments.map(a => (
                    <div key={a.id} className="nav-item" style={{ padding: '1.25rem', marginBottom: '0.75rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0' }}>{a.title}</h4>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Due: {new Date(a.due_date).toLocaleDateString()}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layout size={14} /> Course: {a.course_id}</span>
                        </div>
                      </div>
                      <button className="btn" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' }}>Submit</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Key Stats & Finance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Star size={20} color="#f59e0b" /> Academic Standing
                  </h3>
                </div>
                <div style={{ padding: '1.5rem' }}>
                   <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Attendance</p>
                      <h2 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#10b981' }}>94%</h2>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '94%', background: '#10b981' }} />
                      </div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: 'var(--surface-color-light)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Credits</p>
                        <h4 style={{ margin: 0 }}>42 / 80</h4>
                      </div>
                      <div style={{ background: 'var(--surface-color-light)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rank</p>
                        <h4 style={{ margin: 0 }}>12th</h4>
                      </div>
                   </div>
                </div>
              </div>

              <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DollarSign size={20} color="#ec4899" /> Financial Summary
                  </h3>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  {invoices.length > 0 ? invoices.map(i => (
                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i.id !== invoices[invoices.length-1].id ? '1px solid var(--border-color)' : 'none' }}>
                      <div>
                        <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{i.title}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Issued: {new Date(i.due_date).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>₹{i.amount}</p>
                        <span className="badge" style={{ 
                          background: i.status === 'paid' ? '#10b98122' : '#f59e0b22', 
                          color: i.status === 'paid' ? '#10b981' : '#f59e0b' 
                        }}>
                          {i.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No current bills.</p>}
                  <button className="btn" style={{ width: '100%', marginTop: '0.5rem', background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>Fee Payment Portal</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Portals;
