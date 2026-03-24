import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, BarChart2, ThumbsUp, ThumbsDown, MessageSquare, Plus } from 'lucide-react';

const API = 'http://localhost:8000';

const ratingColor = (r) => r >= 4 ? '#10b981' : r === 3 ? '#f59e0b' : '#ef4444';
const ratingLabel = (r) => r >= 4 ? 'Excellent' : r === 3 ? 'Good' : 'Poor';

const FacultyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [staff, setStaff] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staff_id: '', student_id: '', course_id: '', rating: '5', comments: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [fbRes, aRes, stRes, sRes, cRes] = await Promise.all([
        axios.get(`${API}/feedback/`, { headers }),
        axios.get(`${API}/feedback/analytics`, { headers }),
        axios.get(`${API}/staff/`, { headers }),
        axios.get(`${API}/students/`, { headers }),
        axios.get(`${API}/courses/`, { headers }),
      ]);
      setFeedbacks(fbRes.data);
      setAnalytics(aRes.data);
      setStaff(stRes.data);
      setStudents(sRes.data);
      setCourses(cRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/feedback/`, { ...form, staff_id: parseInt(form.staff_id), student_id: parseInt(form.student_id), course_id: parseInt(form.course_id), rating: parseInt(form.rating) }, { headers });
      setShowForm(false);
      setForm({ staff_id: '', student_id: '', course_id: '', rating: '5', comments: '' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p>Loading Feedback Module...</p>;

  const ratingPct = analytics && analytics.total_reviews > 0
    ? { excellent: (analytics.excellent / analytics.total_reviews * 100).toFixed(0), good: (analytics.good / analytics.total_reviews * 100).toFixed(0), poor: (analytics.poor / analytics.total_reviews * 100).toFixed(0) }
    : { excellent: 0, good: 0, poor: 0 };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Faculty Feedback & Quality Monitoring</h1>
          <p>Subject-wise ratings, analytics and department performance dashboards</p>
        </div>
        <button className="btn" id="add-feedback-btn" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Submit Feedback
        </button>
      </div>

      {/* Analytics */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', borderTop: '3px solid var(--primary-color)' }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {analytics.average_rating}
            </div>
            <div style={{ display: 'flex', gap: '4px', margin: '0.5rem 0' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= Math.round(analytics.average_rating) ? '#f59e0b' : 'none'} color="#f59e0b" />)}
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overall Rating</p>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{analytics.total_reviews} total reviews</p>
          </div>

          <div className="card" style={{ margin: 0 }}>
            <h3 style={{ marginTop: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Satisfaction Breakdown</h3>
            {[
              { label: 'Excellent (4-5★)', value: analytics.excellent, pct: ratingPct.excellent, color: '#10b981' },
              { label: 'Good (3★)', value: analytics.good, pct: ratingPct.good, color: '#f59e0b' },
              { label: 'Poor (1-2★)', value: analytics.poor, pct: ratingPct.poor, color: '#ef4444' },
            ].map(({ label, value, pct, color }) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.9rem' }}>{label}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{value} ({pct}%)</span>
                </div>
                <div style={{ height: '8px', background: 'var(--surface-color-light)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-color)' }}>
          <h2 style={{ marginTop: 0 }}>Submit Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Faculty *</label>
                <select className="input-field" id="fb-staff" required value={form.staff_id} onChange={e => setForm({ ...form, staff_id: e.target.value })}>
                  <option value="">Select Faculty</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} — {s.department}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Student *</label>
                <select className="input-field" id="fb-student" required value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Course *</label>
                <select className="input-field" id="fb-course" required value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rating: {form.rating} / 5 ★</label>
                <input id="fb-rating" type="range" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}
                  style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Poor</span><span>Excellent</span>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Comments</label>
                <textarea className="input-field" id="fb-comments" rows="3" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} placeholder="Optional comments..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="submit" id="submit-feedback-btn">Submit Feedback</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color-light)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {feedbacks.map(f => (
          <div key={f.id} className="card" style={{ margin: 0, borderLeft: `4px solid ${ratingColor(f.rating)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>Faculty #{f.staff_id}</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Course #{f.course_id} | Student #{f.student_id}</p>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${ratingColor(f.rating)}22`, color: ratingColor(f.rating) }}>
                {ratingLabel(f.rating)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= f.rating ? '#f59e0b' : 'none'} color="#f59e0b" />)}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{f.rating}/5</span>
            </div>
            {f.comments && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>"{f.comments}"</p>}
          </div>
        ))}
      </div>
      {feedbacks.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>No feedback submitted yet.</div>}
    </div>
  );
};

export default FacultyFeedback;
