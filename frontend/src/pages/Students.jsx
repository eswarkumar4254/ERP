import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Search, Filter, Plus, 
  MapPin, Mail, GraduationCap, 
  MoreVertical, Download, X,
  CheckCircle2, AlertCircle
} from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: '', last_name: '', enrollment_number: '',
    grade_level: 'Undergraduate', branch: 'CSE', admission_year: 2024,
    contact_email: ''
  });

  const branches = ['All', 'CSE', 'EEE', 'Mechanical', 'MBA', 'Civil'];
  const years = ['All', 2021, 2022, 2023, 2024];

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = 'http://localhost:8000/api/v1/students/?limit=200';
      if (selectedBranch !== 'All') url += `&branch=${selectedBranch}`;
      if (selectedYear !== 'All') url += `&admission_year=${selectedYear}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/v1/students/', newStudent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      fetchStudents();
    } catch (error) {
      alert("Error adding student. Please check permissions.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedBranch, selectedYear]);

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>Enterprise Student Registry</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>Unified institutional directory across all academic branches and cycles.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px' }}><Download size={18} /> Export</button>
            <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px' }} onClick={() => setShowAddModal(true)}><Plus size={18} /> New Admission</button>
          </div>
        </div>
      </div>

      {/* Modern Control Filter Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', width: '100%' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Search by identity or enrollment code..." 
            className="clean-input"
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginLeft: '12px' }}>BRANCH</span>
            <select 
              className="glass-pane" 
              style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {branches.map(b => <option key={b} value={b} style={{background: '#1a1a1a'}}>{b}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginLeft: '12px' }}>ACADEMIC YEAR</span>
             <select 
              className="glass-pane" 
              style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(y => <option key={y} value={y} style={{background: '#1a1a1a'}}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10vh' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
          <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>Syncing Global Registry...</p>
        </div>
      ) : (
        <div className="glass-pane" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <table style={{ margin: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ width: '60px' }}>S.No</th>
                <th>Student Profile</th>
                <th>Enrollment ID</th>
                <th>Branch & Track</th>
                <th>Year / Sem</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                   <td colSpan="6" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                      <AlertCircle size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p>No records found in the current institutional buffer.</p>
                   </td>
                </tr>
              ) : (
                students.filter(s => 
                  `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((s, idx) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{idx + 1}.</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                          {s.first_name[0]}{s.last_name[0]}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800 }}>{s.first_name} {s.last_name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.contact_email}</p>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: '0.85rem', color: 'var(--primary-color)', background: 'rgba(59, 130, 246, 0.05)', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>{s.enrollment_number}</code></td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} color="var(--secondary-color)" />
                          {s.branch || 'General'}
                       </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700 }}>Year {s.current_year}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sem {s.current_semester}</span>
                      </div>
                    </td>
                    <td><span className="badge-premium" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', fontSize: '0.7rem' }}>ACTIVE</span></td>
                    <td style={{ textAlign: 'center' }}>
                       <button className="icon-btn" style={{ padding: '8px', opacity: 0.6 }}><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '500px', padding: '2.5rem', position: 'relative' }}>
             <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
             <h2 style={{ marginBottom: '2rem', fontWeight: 900 }} className="text-gradient">Structured Admission</h2>
             
             <form onSubmit={handleAddStudent} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>FIRST NAME</label>
                      <input type="text" className="input-premium" required value={newStudent.first_name} onChange={e => setNewStudent({...newStudent, first_name: e.target.value})} />
                   </div>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>LAST NAME</label>
                      <input type="text" className="input-premium" required value={newStudent.last_name} onChange={e => setNewStudent({...newStudent, last_name: e.target.value})} />
                   </div>
                </div>

                <div className="input-group">
                   <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>ENROLLMENT NUMBER / ID</label>
                   <input type="text" className="input-premium" required value={newStudent.enrollment_number} onChange={e => setNewStudent({...newStudent, enrollment_number: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>BRANCH</label>
                      <select className="input-premium" value={newStudent.branch} onChange={e => setNewStudent({...newStudent, branch: e.target.value})}>
                         {branches.filter(b => b !== 'All').map(b => <option key={b} value={b} style={{background: '#1a1a1a'}}>{b}</option>)}
                      </select>
                   </div>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>ADMISSION YEAR</label>
                      <input type="number" className="input-premium" required value={newStudent.admission_year} onChange={e => setNewStudent({...newStudent, admission_year: parseInt(e.target.value)})} />
                   </div>
                </div>

                <div className="input-group">
                   <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>CONTACT EMAIL</label>
                   <input type="email" className="input-premium" required value={newStudent.contact_email} onChange={e => setNewStudent({...newStudent, contact_email: e.target.value})} />
                </div>

                <button type="submit" className="btn-premium" style={{ marginTop: '1rem', padding: '14px' }}>Confirm Enrollment</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
