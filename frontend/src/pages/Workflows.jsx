import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle, Clock, XCircle, AlertTriangle, Library,
  Home, Bus, DollarSign, Briefcase, GraduationCap,
  Building2, ChevronRight, Workflow, Play, Pause, Settings2, Users, Plus
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

// Department icon map
const DEPT_ICONS = {
  Library: Library,
  Hostel: Home,
  Transport: Bus,
  Finance: DollarSign,
  TPO: Briefcase,
  Department: GraduationCap,
};

const statusStyle = (status) => {
  if (!status || status === 'pending') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
  if (status.startsWith('approved')) return { color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
  if (status.startsWith('blocked')) return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
  return { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
};

const statusLabel = (status) => {
  if (!status || status === 'pending') return 'Pending';
  if (status.startsWith('approved')) return 'Cleared ✓';
  if (status.startsWith('blocked')) return 'Blocked ✗';
  return status;
};

const Workflows = () => {
  const [activeTab, setActiveTab] = useState('no-due');
  const [noDueStatus, setNoDueStatus] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem('user_role') || 'student';

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchNoDueStatus = async () => {
    try {
      const res = await axios.get(`${API}/no-due/status`, { headers });
      setNoDueStatus(res.data);
    } catch (e) {
      if (e.response?.status === 404) setNoDueStatus(null);
    }
  };

  const fetchPendingList = async () => {
    try {
      const res = await axios.get(`${API}/no-due/pending-list`, { headers });
      setPendingList(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (role === 'student') {
      fetchNoDueStatus();
    } else {
      fetchPendingList();
    }
  }, [role]);

  const initiateNoDue = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/no-due/initiate`, {}, { headers });
      fetchNoDueStatus();
    } catch (e) {
      alert('Failed to initiate No-Due.');
    } finally {
      setLoading(false);
    }
  };

  const approveNoDue = async (formId, dept) => {
    try {
      await axios.post(`${API}/no-due/approve/${formId}?department=${dept}&remarks=Cleared+by+admin`, {}, { headers });
      fetchPendingList();
    } catch (e) {
      alert('Approval failed. Check permissions.');
    }
  };

  // ----- STATIC Workflow Engine Chains ------
  const chains = [
    { id: 'WF-001', name: 'Graduation No-Due Clearance', stages: 6, status: 'Active', creator: 'Academic Office', lastTriggered: '2h ago' },
    { id: 'WF-002', name: 'Faculty Leave Request', stages: 3, status: 'Active', creator: 'HR Admin', lastTriggered: '14m ago' },
    { id: 'WF-003', name: 'Student OD (On Duty) Approval', stages: 2, status: 'Paused', creator: 'Academic Office', lastTriggered: '1d ago' },
    { id: 'WF-004', name: 'Research Grant Validation', stages: 5, status: 'Active', creator: 'R&D Cell', lastTriggered: '5h ago' },
    { id: 'WF-005', name: 'Exam Hall Ticket Issuance', stages: 3, status: 'Active', creator: 'Exam Branch', lastTriggered: '30m ago' },
    { id: 'WF-006', name: 'Hostel Room Allotment', stages: 4, status: 'Active', creator: 'Hostel Admin', lastTriggered: '12h ago' },
  ];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient">Workflow Automation Engine</h1>
          <p>Configurable approval chains, No-Due clearance, and automated institutional business processes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost"><Plus size={16} /> New Workflow</button>
          <button className="btn-premium">Live Dashboard</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {['no-due', 'chains', 'pending'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem',
              background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'no-due' ? '🎓 No-Due Clearance' : tab === 'chains' ? '⚙️ Approval Chains' : '🔔 Pending Actions'}
          </button>
        ))}
      </div>

      {/* ===== NO-DUE WORKFLOW ===== */}
      {activeTab === 'no-due' && (
        <div>
          {role === 'student' ? (
            <div>
              {!noDueStatus || noDueStatus.status === 'not_initiated' ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <GraduationCap size={60} style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }} />
                  <h2>Apply for No-Due Clearance</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                    Apply for graduation clearance. Your request will be routed through Library, Hostel, Transport, Finance, TPO, and your Department for approval.
                  </p>
                  <button className="btn-premium" onClick={initiateNoDue} disabled={loading} style={{ padding: '12px 32px', fontSize: '1rem' }}>
                    {loading ? 'Initiating...' : 'Initiate No-Due Process'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Overall Status Banner */}
                  <div className="card" style={{
                    background: noDueStatus.final_status === 'approved'
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : noDueStatus.final_status === 'blocked'
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, var(--primary-color), #7c3aed)',
                    color: '#fff',
                    border: 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem' }}>No-Due Form #{noDueStatus.form_id}</p>
                        <h2 style={{ margin: '0.5rem 0' }}>
                          {noDueStatus.final_status === 'approved' ? '🎉 Fully Cleared!' :
                           noDueStatus.final_status === 'blocked' ? '❌ Blocked by Department' :
                           '⏳ Clearance In Progress'}
                        </h2>
                        <p style={{ margin: 0, opacity: 0.8 }}>
                          {noDueStatus.approved_count} of {noDueStatus.approved_count + noDueStatus.pending_count} departments cleared
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900 }}>
                          {Math.round((noDueStatus.approved_count / Math.max(noDueStatus.approved_count + noDueStatus.pending_count, 1)) * 100)}%
                        </div>
                        <div className="progress-track" style={{ width: '120px', height: '8px', marginTop: '8px' }}>
                          <div className="progress-fill" style={{
                            width: `${(noDueStatus.approved_count / Math.max(noDueStatus.approved_count + noDueStatus.pending_count, 1)) * 100}%`,
                            background: '#ffffff'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Status Grid */}
                  <div className="stat-grid">
                    {Object.entries(noDueStatus.departments || {}).map(([dept, status]) => {
                      const Icon = DEPT_ICONS[dept] || Building2;
                      const style = statusStyle(status);
                      return (
                        <div key={dept} className="glass-card" style={{ borderLeft: `4px solid ${style.color}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', background: style.bg }}>
                              <Icon size={20} color={style.color} />
                            </div>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px',
                              borderRadius: '20px', background: style.bg, color: style.color
                            }}>
                              {statusLabel(status)}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{dept}</p>
                          {status.startsWith('blocked') && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#ef4444' }}>
                              Reason: {status.replace('blocked: ', '')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Admin / Department View
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="stat-grid">
                <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pending</p><h2 style={{ color: '#f59e0b' }}>{pendingList.length}</h2></div>
                <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cleared Today</p><h2 style={{ color: '#10b981' }}>12</h2></div>
                <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Blocked</p><h2 style={{ color: '#ef4444' }}>3</h2></div>
              </div>

              {pendingList.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <CheckCircle size={50} color="#10b981" style={{ marginBottom: '1rem' }} />
                  <h3>All Clear! No Pending No-Due Requests</h3>
                </div>
              ) : (
                pendingList.map(item => (
                  <div key={item.form_id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <h3 style={{ margin: 0 }}>{item.student_name}</h3>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          Enrollment: {item.enrollment} &nbsp;|&nbsp; Status: <span style={{ color: item.final_status === 'blocked' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>{item.final_status.toUpperCase()}</span>
                        </p>
                      </div>
                      <span style={{ background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {item.pending_depts?.length} Pending
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      {Object.entries(item.departments || {}).map(([dept, status]) => {
                        const style = statusStyle(status);
                        const isPending = status === 'pending';
                        return (
                          <div key={dept} style={{
                            padding: '1rem', borderRadius: '12px', border: `1px solid ${style.color}30`,
                            background: style.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{dept}</p>
                              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: style.color, fontWeight: 600 }}>{statusLabel(status)}</p>
                            </div>
                            {isPending && (
                              <button
                                onClick={() => approveNoDue(item.form_id, dept)}
                                className="btn-premium"
                                style={{ fontSize: '0.7rem', padding: '5px 10px' }}
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== WORKFLOW CHAINS ===== */}
      {activeTab === 'chains' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          <div className="glass-pane" style={{ borderRadius: '24px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Enterprise Approval Chains</h3>
              <span className="badge-premium">LIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chains.map(chain => (
                <div key={chain.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Workflow size={20} color={chain.status === 'Active' ? 'var(--primary-color)' : 'var(--text-muted)'} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0 }}>{chain.name}</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {chain.creator} • {chain.stages} Levels</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{chain.lastTriggered}</span>
                      <button className="btn-ghost" style={{ padding: '8px', borderRadius: '8px' }}><Settings2 size={16} /></button>
                      <button className="btn-premium" style={{
                        padding: '8px', borderRadius: '8px',
                        background: chain.status === 'Active' ? 'rgba(239,68,68,0.15)' : '#10b981',
                        color: chain.status === 'Active' ? '#ef4444' : '#fff', boxShadow: 'none'
                      }}>
                        {chain.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="stat-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Chains</p><h2 style={{ margin: '0.5rem 0' }}>24</h2><div style={{ color: 'var(--secondary-color)', fontSize: '0.85rem' }}>+3 this month</div></div>
              <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg. Turnaround</p><h2 style={{ margin: '0.5rem 0' }}>6.2 hrs</h2><div style={{ color: 'var(--secondary-color)', fontSize: '0.85rem' }}>-12% from Q3</div></div>
              <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Automated Actions</p><h2 style={{ margin: '0.5rem 0' }}>1,240</h2><div style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>142 today</div></div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PENDING APPROVALS ===== */}
      {activeTab === 'pending' && (
        <div>
          {[
            { request: 'MacBook Pro M3 Purchase', reqId: 'REQ-992', stage: 'Dean Approval', priority: 'High', time: '4h overdue', type: 'procurement' },
            { request: 'International Conference Leave - Dr. Sharma', reqId: 'LV-441', stage: 'HOD Review', priority: 'Medium', time: '1h remaining', type: 'leave' },
            { request: 'Lab Equipment Budget Increase', reqId: 'BUD-201', stage: 'Finance Review', priority: 'High', time: '2h overdue', type: 'finance' },
            { request: 'Guest Lecture OD Form - 45 Students', reqId: 'OD-112', stage: 'Class Teacher', priority: 'Low', time: '3d remaining', type: 'od' },
          ].map((task, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem', borderLeft: `4px solid ${task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', background: 'var(--surface-color-light)', padding: '3px 8px', borderRadius: '5px' }}>{task.reqId}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: task.priority === 'High' ? '#ef4444' : '#f59e0b', background: task.priority === 'High' ? '#fee2e2' : '#fef3c7', padding: '3px 8px', borderRadius: '5px' }}>{task.priority}</span>
                  </div>
                  <h3 style={{ margin: '0 0 6px' }}>{task.request}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Users size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    Current Stage: <strong>{task.stage}</strong>
                    &nbsp;•&nbsp;<Clock size={13} style={{ verticalAlign: 'middle' }} /> {task.time}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-premium" style={{ padding: '10px 20px' }}>Approve</button>
                  <button className="btn-ghost" style={{ padding: '10px 20px', color: '#ef4444' }}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workflows;
