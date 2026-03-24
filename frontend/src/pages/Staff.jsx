import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Search, Filter, Plus, 
  MapPin, Mail, Briefcase, 
  Heart, MoreVertical, X,
  Download, Award, ShieldCheck
} from 'lucide-react';


const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Registration Modal State
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '', 
    employee_id: '', department_id: '', designation: '', role: ''
  });

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/v1/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const [deptRes, roleRes] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/academics/departments', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/v1/rbac/roles', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setDepartments(deptRes.data);
      setRoles(roleRes.data);
    } catch (e) { console.error('Error fetching form options:', e); }
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/v1/academics/staff', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Staff user created successfully!');
      setShowModal(false);
      setFormData({first_name: '', last_name: '', email: '', password: '', employee_id: '', department_id: '', designation: '', role: ''});
      fetchStaff();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create staff');
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchFormOptions();
  }, []);

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>Global Human Capital</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>Institutional faculty & administrative directory Across 24 Global Branches.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px' }}><Download size={18} /> Workforce Export</button>
            <button className="btn-premium" onClick={() => setShowModal(true)} style={{ padding: '10px 24px', borderRadius: '12px' }}><Plus size={18} /> Hire Talent</button>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, department, or Employee ID..." 
            className="input-premium"
            style={{ paddingLeft: '44px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Filter size={16} /> All Regions
          </div>
          <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Award size={16} /> Faculty Only
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10vh' }}>
          <Activity className="spin" size={40} color="var(--primary-color)" />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Syncing Workforce Data...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {staff.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No personnel records identified in this institutional bracket.</p>
            </div>
          ) : (
            staff.filter(s => 
              `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.department.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((s) => (
              <div key={s.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                   <button className="icon-btn" style={{ padding: '4px' }}><MoreVertical size={18} color="var(--text-muted)" /></button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--secondary-color), #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 900 }}>
                      {s.first_name[0]}{s.last_name[0]}
                   </div>
                   <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{s.first_name} {s.last_name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                         <ShieldCheck size={12} color="var(--secondary-color)" /> VERIFIED FACULTY
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                   <div style={{ display: 'flex', gap: '10px' }}><Briefcase size={14} color="var(--primary-color)" /> <b>{s.designation}</b></div>
                   <div style={{ display: 'flex', gap: '10px' }}><Heart size={14} color="var(--error-color)" /> <b>{s.department}</b></div>
                   <div style={{ display: 'flex', gap: '10px' }}><MapPin size={14} color="var(--primary-color)" /> London Graduate School</div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ID: {s.employee_id}</span>
                   <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}>View Profile</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Registration Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
           <div className="glass-card" style={{ width: '600px', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              <h2 style={{ marginBottom: '2rem', fontWeight: 900 }} className="text-gradient">Register New Personnel</h2>
              
              <form onSubmit={handleHireSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>FIRST NAME</label>
                      <input type="text" className="input-premium" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} placeholder="e.g. John" />
                   </div>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>LAST NAME</label>
                      <input type="text" className="input-premium" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} placeholder="e.g. Doe" />
                   </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>EMAIL ADRESS</label>
                      <input type="email" className="input-premium" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="name@university.edu" />
                   </div>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>PASSWORD</label>
                      <input type="password" className="input-premium" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Minimum 8 characters" />
                   </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>EMPLOYEE ID</label>
                      <input type="text" className="input-premium" required value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} placeholder="e.g. EMP-2026" />
                   </div>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>ROLE SYSTEM ACCESS</label>
                      <select className="input-premium" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required>
                         <option value="">Select Platform Role...</option>
                         {roles.map(r => (
                           <option key={r.id} value={r.name}>
                             {r.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} 
                             {r.tenant_id ? ' (Institutional)' : ' (Global)'}
                           </option>
                         ))}
                      </select>
                   </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>DESIGNATION TITLE</label>
                      <select className="input-premium" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required>
                         <option value="">Select Designation...</option>
                         <option value="Dean">Dean</option>
                         <option value="HOD">Head of Department</option>
                         <option value="Professor">Professor</option>
                         <option value="Assistant Professor">Assistant Professor</option>
                         <option value="Academic DEO">Academic DEO</option>
                      </select>
                   </div>
                   <div className="input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>ASSIGNED DEPARTMENT</label>
                      <select className="input-premium" value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})} required>
                         <option value="">Select Department...</option>
                         {departments.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
                      </select>
                   </div>
                 </div>

                 <button type="submit" className="btn-premium" style={{ marginTop: '1rem', padding: '14px' }}>Authorize & Create Profile</button>
              </form>
           </div>
        </div>
      )}
    </div>

  );
};

// Activity Proxy
const Activity = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export default Staff;
