import React, { useState } from 'react';
import axios from 'axios';
import { 
  Send, User, Mail, Phone, Book, 
  MapPin, Calendar, ShieldCheck, GraduationCap 
} from 'lucide-react';

const API = 'http://localhost:8000';

const ApplyNow = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    program: 'Computer Science',
    previous_score: '',
    address: ''
  });

  const programs = [
    "Computer Science", "Information Technology", 
    "Mechanical Engineering", "Civil Engineering", 
    "Business Administration", "Commerce"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create student entry directly for demo (status=admission_pending)
      await axios.post(`${API}/admissions/`, {
        student_name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        phone: formData.phone,
        status: 'pending',
        scholarship_amount: 0
      });
      setSubmitted(true);
    } catch (e) {
      alert("Submission failed. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ padding: '2rem', background: '#6366f122', borderRadius: '50%', marginBottom: '2rem' }}>
          <ShieldCheck size={64} color="#6366f1" />
        </div>
        <h1 style={{ margin: '0 0 1rem' }}>Application Received!</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', marginBottom: '2rem' }}>
          Thank you for applying to Neuraltrix AI University. Your registration #NTX-{Math.floor(Math.random()*9000)+1000} has been created. We will contact you shortly for the entrance interview.
        </p>
        <button className="btn" onClick={() => setSubmitted(false)}>
          Back to Website
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <GraduationCap size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
        <h1>Student Admission Portal</h1>
        <p>Phase 2: Online Registration — Apply for the 2024-25 Academic Session.</p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <User size={14} /> First Name
              </label>
              <input 
                className="input-field" 
                required 
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <User size={14} /> Last Name
              </label>
              <input 
                className="input-field" 
                required 
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <Mail size={14} /> Email Address
              </label>
              <input 
                className="input-field" 
                type="email"
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <Phone size={14} /> Contact Phone
              </label>
              <input 
                className="input-field" 
                required 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <Book size={14} /> Program of Interest
              </label>
              <select 
                className="input-field"
                value={formData.program}
                onChange={e => setFormData({...formData, program: e.target.value})}
              >
                {programs.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <Calendar size={14} /> Previous Board Score (%)
              </label>
              <input 
                className="input-field" 
                type="number"
                step="0.01"
                required 
                value={formData.previous_score}
                onChange={e => setFormData({...formData, previous_score: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <MapPin size={14} /> residential Address
            </label>
            <textarea 
              className="input-field" 
              rows="3"
              style={{ resize: 'none' }}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              className="btn" 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? 'Processing...' : <><Send size={18} /> Submit Application</>}
            </button>
          </div>
        </form>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2rem' }}>
        By submitting, you agree to our Terms of Service and Privacy Policy. All applications are subject to document verification.
      </p>
    </div>
  );
};

export default ApplyNow;
