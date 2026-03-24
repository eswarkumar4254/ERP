import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileUp, FileText, CheckCircle2, AlertCircle, 
  Trash2, Play, Settings, Database, Cpu, Search, Filter
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const ExamCell = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ title: '', course_id: 1, duration_minutes: 60 });
  const [file, setFile] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API}/exams`, { headers });
      setExams(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch exams list.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a PDF file.");
    
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title);
    formData.append('course_id', form.course_id);
    formData.append('duration_minutes', form.duration_minutes);

    try {
      const res = await axios.post(`${API}/exams/upload-pdf`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(`${res.data.message} (${res.data.questions_count} questions extracted)`);
      setForm({ title: '', course_id: 1, duration_minutes: 60 });
      setFile(null);
      fetchExams();
    } catch (e) {
      setError(e.response?.data?.detail || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: '2rem 3rem' }}>
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>Exam Cell Control</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Automated PDF-to-Web Exam Provisioning System.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 2fr', gap: '2.5rem' }}>
        {/* Upload Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileUp size={20} color="var(--primary-color)" /> Provision New Exam
            </h3>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="stat-label">Exam Title</label>
                <input 
                  className="input-premium" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Mathematics T1 Mid-Sem"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="stat-label">Course ID</label>
                  <input 
                    type="number"
                    className="input-premium" 
                    value={form.course_id}
                    onChange={e => setForm({...form, course_id: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="stat-label">Duration (Mins)</label>
                  <input 
                    type="number"
                    className="input-premium" 
                    value={form.duration_minutes}
                    onChange={e => setForm({...form, duration_minutes: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div 
                style={{ 
                  border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '2rem', 
                  textAlign: 'center', background: 'rgba(255,255,255,0.02)', cursor: 'pointer',
                  borderColor: file ? 'var(--primary-color)' : 'var(--border-color)'
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input 
                  id="fileInput" 
                  type="file" 
                  hidden 
                  accept=".pdf"
                  onChange={e => setFile(e.target.files[0])}
                />
                {file ? (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                     <FileText size={32} color="var(--primary-color)" />
                     <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{file.name}</span>
                   </div>
                ) : (
                   <div style={{ color: 'var(--text-secondary)' }}>
                     <FileUp size={32} style={{ opacity: 0.3, marginBottom: '10px' }} />
                     <p style={{ margin: 0, fontSize: '0.9rem' }}>Click to upload Question Paper PDF</p>
                   </div>
                )}
              </div>

              {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> {error}</div>}
              {success && <div style={{ color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} /> {success}</div>}

              <button 
                className="btn-premium" 
                type="submit" 
                disabled={uploading}
                style={{ marginTop: '1rem', height: '48px' }}
              >
                {uploading ? "Extracting Questions..." : "provision_exam_tower"}
              </button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
             <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>System Health</p>
             <div style={{ display: 'flex', gap: '1rem' }}>
               <div className="glass-pane" style={{ padding: '10px', flex: 1, textAlign: 'center' }}>
                 <Cpu size={16} color="var(--primary-color)" style={{ marginBottom: '5px' }} />
                 <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>OCR Processor</div>
                 <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 900 }}>READY</div>
               </div>
               <div className="glass-pane" style={{ padding: '10px', flex: 1, textAlign: 'center' }}>
                 <Database size={16} color="var(--secondary-color)" style={{ marginBottom: '5px' }} />
                 <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>Cluster Sync</div>
                 <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 900 }}>OK</div>
               </div>
             </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="glass-pane" style={{ borderRadius: '24px', padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0 }}>Provisioned Examinations</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="icon-btn-glass"><Search size={18} /></button>
              <button className="icon-btn-glass"><Filter size={18} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {exams.length === 0 ? (
               <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 No exams provisioned yet.
               </div>
            ) : (
              exams.map(exam => (
                <div key={exam.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{exam.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>CID: {exam.course_id}</span>
                        <span>•</span>
                        <span>{exam.duration_minutes} Mins</span>
                        <span>•</span>
                        <span>Marks: {exam.total_marks}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="icon-btn-glass" title="Settings"><Settings size={18} /></button>
                    <button className="icon-btn-glass" style={{ color: '#ef4444' }} title="Revoke"><Trash2 size={18} /></button>
                    <button className="btn-ghost" title="Live Preview" style={{ border: '1px solid var(--secondary-color)', color: 'var(--secondary-color)', padding: '6px 14px' }}>
                      <Play size={16} /> LIVE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCell;
