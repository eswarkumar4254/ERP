import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, FileText, Video, Link, Plus, BookOpen, 
  Clock, PlayCircle, Download, ExternalLink,
  Layers, Search, Filter, MoreVertical,
  ChevronRight, Bookmark, BookMarked
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const LMS = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', course_id: '', file_url: '', type: 'pdf' });
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [matRes, courseRes, bookRes, quizRes, attRes] = await Promise.all([
        axios.get(`${API}/lms/books`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/courses/`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/lms/my-books`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/lms/quizzes`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/lms/course-attendance`, { headers }).catch(() => ({ data: [] }))
      ]);
      setMaterials(matRes.data);
      setCourses(courseRes.data);
      setMyBooks(bookRes.data);
      setQuizzes(quizRes.data);
      setAttendance(attRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleLibrarySync = async () => {
    setLoading(true);
    await fetchData();
    alert("Library circulation status synchronized with LMS.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/lms/books`, { ...form, course_id: parseInt(form.course_id), category: form.type }, { headers });
      setForm({ title: '', description: '', course_id: '', file_url: '', type: 'pdf' });
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle size={20} color="#6366f1" />;
      case 'pdf': return <FileText size={20} color="#ef4444" />;
      case 'link': return <ExternalLink size={20} color="#10b981" />;
      default: return <Layers size={20} color="#f59e0b" />;
    }
  };

  const filteredMaterials = activeTab === 'all' 
    ? materials 
    : materials.filter(m => m.type === activeTab || m.category === activeTab);

  if (loading) return <p>Deploying Learning Infrastructure...</p>;

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Learning Experience (LX) Hub</h1>
          <p>Central repository for course content, digital lectures, and collaborative study resources.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" onClick={handleLibrarySync} style={{ background: 'var(--surface-color-light)', color: 'var(--text-primary)' }}>
             <BookMarked size={18} style={{ marginRight: '8px' }} /> Library Sync
          </button>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Upload Content
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #6366f1' }}>
          <p className="stat-label">Total Resources</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">{materials.length}</h2>
             <Layers size={20} color="#6366f1" />
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <p className="stat-label">Issued Books</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">{myBooks.length}</h2>
             <BookOpen size={20} color="#f59e0b" />
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #10b981' }}>
          <p className="stat-label">Active Courses</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">{courses.length}</h2>
             <Bookmark size={20} color="#10b981" />
          </div>
        </div>
        <div className="card dashboard-stat-card" style={{ borderTop: '3px solid #ec4899' }}>
          <p className="stat-label">Cloud Storage</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <h2 className="stat-value">64%</h2>
             <Upload size={20} color="#ec4899" />
          </div>
        </div>
      </div>

      {myBooks.length > 0 && (
        <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '4px solid #f59e0b' }}>
           <h3 style={{ marginBottom: '1rem' }}>Physical Library Assets (Issued)</h3>
           <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {myBooks.map(book => (
                <div key={book.id} className="glass-pane" style={{ minWidth: '250px', padding: '1rem' }}>
                   <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{book.title}</p>
                   <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>By {book.author}</p>
                   <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge" style={{ background: book.days_left < 3 ? '#ef444422' : '#f59e0b22', color: book.days_left < 3 ? '#ef4444' : '#f59e0b', fontSize: '0.65rem' }}>
                         DUE IN {book.days_left} DAYS
                      </span>
                      <span style={{ fontSize: '0.7rem' }}>{new Date(book.due_date).toLocaleDateString()}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Publish Study Material</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div>
                <label className="stat-label">Material Title</label>
                <input className="input-field" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Intro to Quantum Computing" />
              </div>
              <div>
                <label className="stat-label">Course Association</label>
                <select className="input-field" required value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="stat-label">Content Type</label>
                <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="pdf">PDF / Document</option>
                  <option value="video">Video Recording</option>
                  <option value="link">Web Resource / URL</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <label className="stat-label">Target Resource URL</label>
              <input className="input-field" required value={form.file_url} onChange={e => setForm({...form, file_url: e.target.value})} placeholder="https://cdn.university.edu/resources/file.pdf" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn" type="submit">Publish Resource</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color-light)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="tab-group">
          {['all', 'pdf', 'video', 'link', 'quizzes', 'analytics'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'quizzes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {quizzes.map(q => (
            <div key={q.id} className="card-pro" style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
              <h4 style={{ margin: 0 }}>{q.title}</h4>
              <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '10px 0' }}>Course: {q.course} | {q.questions} Questions</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: q.due === 'No Deadline' ? '#10b981' : '#f59e0b' }}>{q.due}</span>
                 <button className="btn-premium" style={{ padding: '6px 15px' }}>Start Quiz</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="card">
           <h3>Course Attendance Benchmarking</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              {attendance.map((att, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 80px', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontWeight: 'bold' }}>{att.course}</span>
                   <div style={{ position: 'relative', height: '10px', background: '#f3f4f6', borderRadius: '5px' }}>
                      <div style={{ 
                        position: 'absolute', height: '100%', background: att.percentage > 75 ? '#10b981' : '#ef4444', 
                        width: `${att.percentage}%`, borderRadius: '5px' 
                      }} />
                   </div>
                   <span style={{ fontWeight: 'bold', textAlign: 'right' }}>{att.percentage}%</span>
                </div>
              ))}
           </div>
           <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.7 }}>Tip: Maintain above 75% to avoid condonation penalties.</p>
        </div>
      )}

      {(activeTab !== 'quizzes' && activeTab !== 'analytics') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredMaterials.map(m => (
          <div key={m.id} className="card lms-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', background: 'var(--surface-color-light)', borderRadius: '12px' }}>
                  {getIcon(m.type || m.category)}
                </div>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{m.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{m.description || 'No description available for this resource.'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ background: '#6366f115', color: '#6366f1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    Resource ID: #{m.id}
                 </div>
              </div>
            </div>
            <a href={m.file_url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '1rem', borderTop: '1px solid var(--border-color)', borderRadius: 0
            }}>
              Access Resource <ChevronRight size={16} />
            </a>
          </div>
        ))}
        {filteredMaterials.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem' }}>
             <Layers size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
             <p style={{ color: 'var(--text-secondary)' }}>No cloud materials found.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default LMS;
