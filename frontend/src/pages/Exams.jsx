import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Clock, CheckCircle2, Plus, Trophy, Hash } from 'lucide-react';

const API = 'http://localhost:8000';
const gradeColor = (g) => {
  if (!g) return 'var(--text-secondary)';
  if (g === 'A+' || g === 'A') return '#10b981';
  if (g === 'B') return '#6366f1';
  if (g === 'C') return '#f59e0b';
  if (g === 'D') return '#f97316';
  return '#ef4444';
};
const statusConfig = { scheduled: { color: '#6366f1', label: 'Scheduled' }, ongoing: { color: '#f59e0b', label: 'Ongoing' }, completed: { color: '#10b981', label: 'Completed' } };

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(null); // exam id
  const [form, setForm] = useState({ title: '', course_id: '', exam_date: '', duration_minutes: '60', total_marks: '100', type: 'internal', status: 'scheduled' });
  const [resultForm, setResultForm] = useState({ student_id: '', marks_obtained: '', remarks: '' });
  const [examResults, setExamResults] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [eRes, cRes, sRes] = await Promise.all([
        axios.get(`${API}/exams/`, { headers }),
        axios.get(`${API}/courses/`, { headers }),
        axios.get(`${API}/students/`, { headers }),
      ]);
      setExams(eRes.data);
      setCourses(cRes.data);
      setStudents(sRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadResults = async (examId) => {
    try {
      const res = await axios.get(`${API}/exams/${examId}/results`, { headers });
      setExamResults(prev => ({ ...prev, [examId]: res.data }));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/exams/`, {
        ...form,
        course_id: parseInt(form.course_id),
        duration_minutes: parseInt(form.duration_minutes),
        total_marks: parseInt(form.total_marks),
      }, { headers });
      setShowForm(false);
      setForm({ title: '', course_id: '', exam_date: '', duration_minutes: '60', total_marks: '100', type: 'internal', status: 'scheduled' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const submitResult = async (examId) => {
    try {
      await axios.post(`${API}/exams/results/`, {
        exam_id: examId,
        student_id: parseInt(resultForm.student_id),
        marks_obtained: parseFloat(resultForm.marks_obtained),
        remarks: resultForm.remarks,
      }, { headers });
      setResultForm({ student_id: '', marks_obtained: '', remarks: '' });
      loadResults(examId);
    } catch (err) { console.error(err); }
  };

  if (loading) return <p>Loading Examination System...</p>;

  const stats = {
    total: exams.length,
    scheduled: exams.filter(e => e.status === 'scheduled').length,
    ongoing: exams.filter(e => e.status === 'ongoing').length,
    completed: exams.filter(e => e.status === 'completed').length,
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Advanced Examination System</h1>
          <p>Exam scheduling, result entry with auto-grading and hall ticket management</p>
        </div>
        <button className="btn" id="add-exam-btn" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Schedule Exam
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Exams', value: stats.total, color: '#6366f1', icon: FileText },
          { label: 'Scheduled', value: stats.scheduled, color: '#38bdf8', icon: Clock },
          { label: 'Ongoing', value: stats.ongoing, color: '#f59e0b', icon: Hash },
          { label: 'Completed', value: stats.completed, color: '#10b981', icon: CheckCircle2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card" style={{ margin: 0, borderTop: `3px solid ${color}`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: `${color}22`, padding: '0.75rem', borderRadius: '12px' }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{label}</p>
              <h2 style={{ margin: 0 }}>{value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-color)' }}>
          <h2 style={{ marginTop: 0 }}>Schedule New Exam</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Exam Title *</label>
                <input className="input-field" id="exam-title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Mid-Semester Examination" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Course *</label>
                <select className="input-field" id="exam-course" required value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Exam Date & Time *</label>
                <input className="input-field" id="exam-date" required type="datetime-local" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Duration (mins)</label>
                <input className="input-field" id="exam-duration" type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Marks</label>
                <input className="input-field" id="exam-marks" type="number" value={form.total_marks} onChange={e => setForm({ ...form, total_marks: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Exam Type</label>
                <select className="input-field" id="exam-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="revaluation">Revaluation</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="submit" id="submit-exam-btn">Schedule Exam</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color-light)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Exam Cards */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {exams.map(exam => {
          const sc = statusConfig[exam.status] || statusConfig.scheduled;
          const results = examResults[exam.id] || [];
          const course = courses.find(c => c.id === exam.course_id);
          return (
            <div key={exam.id} className="card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: `${sc.color}22`, color: sc.color, textTransform: 'uppercase' }}>{sc.label}</span>
                    <span style={{ padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', background: 'var(--surface-color-light)', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{exam.type}</span>
                  </div>
                  <h2 style={{ margin: '4px 0', fontSize: '1.1rem' }}>{exam.title}</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {course?.name || `Course #${exam.course_id}`} &bull; {exam.duration_minutes} mins &bull; {exam.total_marks} marks
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(exam.exam_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(exam.exam_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Result entry & display */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{results.length} Results Entered</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { loadResults(exam.id); setShowResultForm(showResultForm === exam.id ? null : exam.id); }}
                      style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                      {showResultForm === exam.id ? 'Hide' : 'Enter Results'}
                    </button>
                  </div>
                </div>

                {showResultForm === exam.id && (
                  <div style={{ background: 'var(--surface-color-light)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Student</label>
                        <select className="input-field" style={{ marginBottom: 0 }} value={resultForm.student_id} onChange={e => setResultForm({ ...resultForm, student_id: e.target.value })}>
                          <option value="">Select</option>
                          {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Marks ({exam.total_marks})</label>
                        <input className="input-field" style={{ marginBottom: 0 }} type="number" max={exam.total_marks} min="0" value={resultForm.marks_obtained} onChange={e => setResultForm({ ...resultForm, marks_obtained: e.target.value })} placeholder="0" />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Remarks</label>
                        <input className="input-field" style={{ marginBottom: 0 }} value={resultForm.remarks} onChange={e => setResultForm({ ...resultForm, remarks: e.target.value })} placeholder="Optional" />
                      </div>
                      <button className="btn" type="button" onClick={() => submitResult(exam.id)} style={{ height: '42px' }}>Add</button>
                    </div>
                    {results.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <th style={{ padding: '6px', textAlign: 'left', color: 'var(--text-secondary)' }}>Student</th>
                              <th style={{ padding: '6px', textAlign: 'right', color: 'var(--text-secondary)' }}>Marks</th>
                              <th style={{ padding: '6px', textAlign: 'center', color: 'var(--text-secondary)' }}>Grade</th>
                              <th style={{ padding: '6px', textAlign: 'center', color: 'var(--text-secondary)' }}>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map(r => (
                              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '6px' }}>Student #{r.student_id}</td>
                                <td style={{ padding: '6px', textAlign: 'right' }}>{r.marks_obtained}/{exam.total_marks}</td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>
                                  <strong style={{ color: gradeColor(r.grade) }}>{r.grade || '—'}</strong>
                                </td>
                                <td style={{ padding: '6px', textAlign: 'center' }}>
                                  <span style={{ color: r.is_pass ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.75rem' }}>
                                    {r.is_pass ? '✓ PASS' : '✗ FAIL'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {exams.length === 0 && <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>No exams scheduled yet.</div>}
    </div>
  );
};

export default Exams;
