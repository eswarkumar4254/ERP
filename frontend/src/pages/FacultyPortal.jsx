import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  GraduationCap, Users, FileText, Upload, 
  Search, BookOpen, Clock, ChevronRight,
  FileIcon, AlertCircle, CheckCircle2, X,
  BadgeCheck, ClipboardList, Megaphone, Plus, Save, Star,
  BarChart, PieChart, Activity, Calendar as CalendarIcon, Zap, TrendingUp, Target,
  ShieldCheck, MessageSquare, Timer, TriangleAlert, Info, Send, Brain
} from 'lucide-react';
import Chart from 'react-apexcharts';

const FacultyPortal = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, attendance, marks, announcements, syllabus, insights, proctoring, feedback
  const [aiSyllabus, setAiSyllabus] = useState(null);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  
  const [uploadData, setUploadData] = useState({
    title: '', material_type: 'lecture', description: ''
  });
  
  const [announcementData, setAnnouncementData] = useState({
    title: '', content: ''
  });

  const [attendanceState, setAttendanceState] = useState({}); // studentId: status
  const [marksState, setMarksState] = useState({}); // studentId: { marks, total, assessment }
  const [preferenceData, setPreferenceData] = useState({
    course_id: '',
    priority: 1,
    semester: 1,
    academic_year: '2026-2027'
  });

  const API_BASE = 'http://localhost:8000/api/v1/faculty-portal';

  const fetchSections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/sections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSections(res.data);
      if (res.data.length > 0) {
        handleSectionSelect(res.data[0]);
      }
      
      const coursesRes = await axios.get('http://localhost:8000/api/v1/academics/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(coursesRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSelect = async (section) => {
    setSelectedSection(section);
    setActiveTab('overview');
    const token = localStorage.getItem('token');
    try {
      const studRes = await axios.get(`${API_BASE}/sections/${section.id}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(studRes.data);
      
      // Initialize attendance state with everything 'present'
      const initialAttendance = {};
      studRes.data.forEach(s => initialAttendance[s.id] = 'present');
      setAttendanceState(initialAttendance);

      const matRes = await axios.get(`${API_BASE}/materials?section_id=${section.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(matRes.data);
      
      const sylRes = await axios.get(`http://localhost:8000/api/v1/ai-automation/syllabus-projection/${section.course_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiSyllabus(sylRes.data);
      
      setAnnouncements(section.announcements || []);
    } catch (err) {
      console.error("Error fetching section data", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', e.target.file.files[0]);
    
    try {
      await axios.post(`${API_BASE}/materials?title=${uploadData.title}&section_id=${selectedSection.id}&material_type=${uploadData.material_type}&description=${uploadData.description}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowUploadModal(false);
      handleSectionSelect(selectedSection);
    } catch (err) {
       alert("Upload failed. Verify file type and permissions.");
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE}/announcements`, {
        ...announcementData,
        section_id: selectedSection.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAnnouncementModal(false);
      setAnnouncementData({ title: '', content: '' });
      // Refresh
      const res = await axios.get(`${API_BASE}/sections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data.find(s => s.id === selectedSection.id);
      setAnnouncements(updated.announcements || []);
    } catch (err) {
      alert("Failed to post announcement.");
    }
  };

  const submitAttendance = async () => {
    const token = localStorage.getItem('token');
    const payload = students.map((s, idx) => ({
      student_id: s.id,
      course_id: selectedSection.course_id,
      status: attendanceState[s.id],
      period_number: 1
    }));
    
    try {
      await axios.post(`${API_BASE}/attendance`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Attendance marked successfully!");
    } catch (err) {
      alert("Failed to mark attendance.");
    }
  };

  const submitMarks = async () => {
    const token = localStorage.getItem('token');
    const assessment = marksState.commonAssessment || "Unit Test 1";
    const total = marksState.commonTotal || 50;
    
    const payload = students.map((s, idx) => ({
      student_id: s.id,
      section_id: selectedSection.id,
      assessment_name: assessment,
      marks_obtained: parseFloat(marksState[s.id] || 0),
      total_marks: parseFloat(total)
    }));

    try {
      await axios.post(`${API_BASE}/marks`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Marks recorded successfully!");
    } catch (err) {
      alert("Failed to record marks.");
    }
  };

  const submitPreference = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8000/api/v1/academics/faculty/preferences', [preferenceData], {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course preference submitted to HOD Successfully!');
      setPreferenceData({...preferenceData, course_id: '', priority: preferenceData.priority + 1});
    } catch (error) {
      alert('Failed to submit preference.');
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        borderRadius: '12px',
        border: 'none',
        background: activeTab === id ? 'var(--primary-color)' : 'transparent',
        color: activeTab === id ? 'white' : 'var(--text-muted)',
        fontWeight: 700,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      <div className="page-header" style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>Academic Faculty Matrix</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>Strategic orchestration of section students and institutional assets.</p>
        </div>
        {selectedSection && (
          <div className="glass-card" style={{ padding: '12px 24px', border: '1px solid var(--primary-glow)' }}>
             <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 900, textTransform: 'uppercase' }}>Current Selection</p>
             <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedSection.name}</p>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem' }}>
        {/* Left Sidebar: My Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ASSIGNED SECTIONS</h3>
           {loading ? (
             <div className="shimmer" style={{ height: '200px', borderRadius: '20px' }}></div>
           ) : sections.length === 0 ? (
             <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No sections assigned to your faculty profile.</p>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sections.map(sec => (
                  <div 
                    key={sec.id}
                    onClick={() => handleSectionSelect(sec)}
                    className={`glass-card ${selectedSection?.id === sec.id ? 'active' : ''}`}
                    style={{ 
                      padding: '1.25rem', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      border: selectedSection?.id === sec.id ? '1px solid var(--primary-color)' : '1px solid transparent',
                      background: selectedSection?.id === sec.id ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{sec.name}</h4>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sec.academic_year}</p>
                       </div>
                       <ChevronRight size={18} color={selectedSection?.id === sec.id ? 'var(--primary-color)' : 'var(--text-muted)'} />
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Right Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           {!selectedSection ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
                 <div className="glass-pane" style={{ textAlign: 'center', padding: '15vh 2rem', opacity: 0.8, borderRadius: '32px' }}>
                    <Users size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                    <h2 style={{ fontWeight: 900 }}>Select a section to begin orchestration.</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '1rem auto' }}>
                       Once a student section is selected, you will gain access to real-time performance telemetry, 
                       attendance protocols, and the digital syllabus orchestrator.
                    </p>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '2rem', background: 'var(--primary-glow)', border: '1px solid var(--primary-color)' }}>
                       <Zap size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                       <h3 style={{ margin: 0, fontWeight: 900 }}>Quick Preference</h3>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Submit your preferred subjects for the next academic cycle.</p>
                       <button className="btn-premium" onClick={() => setActiveTab('preferences')} style={{ width: '100%' }}>Open Submission</button>
                    </div>
                    
                    <div className="glass-card" style={{ padding: '2rem' }}>
                       <TrendingUp size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
                       <h3 style={{ margin: 0, fontWeight: 900 }}>Faculty Index</h3>
                       <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span>Quality Score</span><span style={{ fontWeight: 800 }}>9.8/10</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span>Research Output</span><span style={{ fontWeight: 800 }}>+12%</span></div>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
             <>
               <div className="glass-pane" style={{ padding: '8px', borderRadius: '16px', display: 'flex', gap: '8px', width: 'fit-content' }}>
                   <TabButton id="overview" label="Overview" icon={BookOpen} />
                   <TabButton id="attendance" label="Attendance" icon={BadgeCheck} />
                   <TabButton id="marks" label="Performance" icon={ClipboardList} />
                   <TabButton id="syllabus" label="Syllabus" icon={Target} />
                   <TabButton id="insights" label="Insights" icon={TrendingUp} />
                   <TabButton id="proctoring" label="Security" icon={ShieldCheck} />
                   <TabButton id="feedback" label="Pulse" icon={MessageSquare} />
                   <TabButton id="announcements" label="Announcements" icon={Megaphone} />
                   <TabButton id="preferences" label="Preferences" icon={Star} />
                </div>

                {/* Quick Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1rem' }}>
                   <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px' }}><Users size={24} color="var(--primary-color)" /></div>
                      <div>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT REACH</p>
                         <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{students.length}</h3>
                      </div>
                   </div>
                   <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}><Activity size={24} color="#10b981" /></div>
                      <div>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVG ATTENDANCE</p>
                         <h3 style={{ margin: 0, fontSize: '1.4rem' }}>92.4%</h3>
                      </div>
                   </div>
                   <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px' }}><Zap size={24} color="#f59e0b" /></div>
                      <div>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SYLLABUS PROGRESS</p>
                         <h3 style={{ margin: 0, fontSize: '1.4rem' }}>64%</h3>
                      </div>
                   </div>
                   <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px' }}><BarChart size={24} color="#8b5cf6" /></div>
                      <div>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>AVG SCORE</p>
                         <h3 style={{ margin: 0, fontSize: '1.4rem' }}>78.2</h3>
                      </div>
                   </div>
                </div>

               {activeTab === 'overview' && (
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Students Table */}
                    <div className="glass-pane" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                       <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>Enrolled Students ({students.length})</h3>
                          <Users size={18} color="var(--primary-color)" />
                       </div>
                       <table style={{ margin: 0 }}>
                          <thead style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                             <tr>
                                <th style={{ width: '40px' }}>S.No</th><th>Identity</th>
                                <th>Roll Number</th>
                             </tr>
                          </thead>
                          <tbody>
                             {students.map((s, idx) => (
                                 <tr key={s.id}>
                                    <td style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                                <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                         <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, border: '1px solid var(--border-color)' }}>{s.first_name[0]}{s.last_name[0]}</div>
                                         <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</span>
                                            {idx % 5 === 0 && <span style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '2px' }}><TriangleAlert size={10} /> AT RISK</span>}
                                         </div>
                                      </div>
                                   </td>
                                   <td><code style={{ fontSize: '0.8rem' }}>{s.enrollment_number}</code></td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    {/* Materials Vault */}
                    <div className="glass-pane" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                       <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>Material Vault</h3>
                          <button onClick={() => setShowUploadModal(true)} style={{ background: 'transparent', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                            <Plus size={16} /> New Asset
                          </button>
                       </div>
                       <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {materials.length === 0 ? (
                             <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No digital materials uploaded for this section yet.</p>
                             </div>
                          ) : (
                            materials.map(mat => (
                              <div key={mat.id} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: mat.material_type === 'exam' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileIcon size={20} color={mat.material_type === 'exam' ? 'var(--error-color)' : 'var(--secondary-color)'} />
                                 </div>
                                 <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem' }}>{mat.title}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mat.material_type.toUpperCase()} • {new Date(mat.created_at).toLocaleDateString()}</p>
                                 </div>
                              </div>
                            ))
                          )}
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'attendance' && (
                 <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                       <div>
                          <h3 style={{ margin: 0, fontWeight: 900 }}>Daily Roll Call</h3>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mark student participation for {new Date().toLocaleDateString()}</p>
                       </div>
                       <button className="btn-premium" onClick={submitAttendance} style={{ padding: '10px 24px' }}>
                          <Save size={18} /> Commit Attendance
                       </button>
                    </div>

                    <table style={{ background: 'transparent' }}>
                       <thead style={{ fontSize: '0.7rem' }}>
                          <tr>
                             <th style={{ width: '40px' }}>S.No</th><th>Student</th>
                             <th>Roll Number</th>
                             <th>Status</th>
                          </tr>
                       </thead>
                       <tbody>
                          {students.map((s, idx) => (
                            <tr key={s.id}>
                                <td style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                               <td>
                                  <span style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</span>
                               </td>
                               <td><code style={{ fontSize: '0.8rem' }}>{s.enrollment_number}</code></td>
                               <td>
                                  <div style={{ display: 'flex', gap: '12px' }}>
                                     {['present', 'absent', 'late'].map(status => (
                                       <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                                          <input 
                                            type="radio" 
                                            name={`att-${s.id}`} 
                                            checked={attendanceState[s.id] === status}
                                            onChange={() => setAttendanceState({...attendanceState, [s.id]: status})}
                                          />
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                       </label>
                                     ))}
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               )}

               {activeTab === 'marks' && (
                 <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '2rem' }}>
                       <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                             <label style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)' }}>ASSESSMENT NAME</label>
                             <input 
                                type="text" 
                                className="input-premium" 
                                placeholder="e.g. Mid-Term Exam"
                                value={marksState.commonAssessment || ''}
                                onChange={e => setMarksState({...marksState, commonAssessment: e.target.value})}
                             />
                          </div>
                          <div style={{ width: '120px' }}>
                             <label style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)' }}>TOTAL MARKS</label>
                             <input 
                                type="number" 
                                className="input-premium" 
                                value={marksState.commonTotal || 50}
                                onChange={e => setMarksState({...marksState, commonTotal: e.target.value})}
                             />
                          </div>
                       </div>
                       <button className="btn-premium" onClick={submitMarks} style={{ padding: '10px 24px' }}>
                          <CheckCircle2 size={18} /> Finalize Marks
                       </button>
                    </div>

                    <table style={{ background: 'transparent' }}>
                       <thead style={{ fontSize: '0.7rem' }}>
                          <tr>
                             <th>Student Name</th>
                             <th style={{ width: '40px' }}>S.No</th><th>Identity</th>
                             <th>Marks Obtained</th>
                          </tr>
                       </thead>
                       <tbody>
                          {students.map((s, idx) => (
                            <tr key={s.id}>
                               <td style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</td>
                               <td><code style={{ fontSize: '0.8rem' }}>{s.enrollment_number}</code></td>
                               <td>
                                  <input 
                                    type="number" 
                                    className="input-premium" 
                                    style={{ width: '100px', textAlign: 'center' }}
                                    placeholder="0"
                                    value={marksState[s.id] || ''}
                                    onChange={e => setMarksState({...marksState, [s.id]: e.target.value})}
                                  />
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               )}

               {activeTab === 'announcements' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontWeight: 900 }}>Notice Board</h3>
                        <button className="btn-premium" onClick={() => setShowAnnouncementModal(true)} style={{ padding: '10px 20px' }}>
                           <Plus size={18} /> New Notice
                        </button>
                     </div>

                     <div style={{ display: 'grid', gap: '1rem' }}>
                        {announcements.length === 0 ? (
                          <div className="glass-pane" style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                             <Megaphone size={40} style={{ marginBottom: '1rem' }} />
                             <p>No announcements posted for this section.</p>
                          </div>
                        ) : (
                          announcements.map(ann => (
                            <div key={ann.id} className="glass-card" style={{ padding: '1.5rem' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{ann.title}</h4>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(ann.created_at).toLocaleDateString()}</span>
                               </div>
                               <p style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{ann.content}</p>
                            </div>
                          ))
                        )}
                     </div>
                  </div>
               )}
                {activeTab === 'syllabus' && (
                  <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                           <h3 style={{ margin: 0, fontWeight: 900 }}>Syllabus Orchestrator</h3>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Track curriculum delivery for {selectedSection.name}</p>
                        </div>
                         <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-secondary" style={{ padding: '10px 20px' }}><CalendarIcon size={18} /> Lesson Plan</button>
                            <button className="btn-premium" style={{ padding: '10px 20px' }}><Plus size={18} /> Add Module</button>
                         </div>
                      </div>

                      {aiSyllabus && (
                        <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem', background: aiSyllabus.status === 'Delayed' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: aiSyllabus.status === 'Delayed' ? '1px solid #ef444455' : '1px solid #10b98155' }}>
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                 <div style={{ background: aiSyllabus.status === 'Delayed' ? '#ef4444' : '#10b981', color: 'white', padding: '10px', borderRadius: '10px' }}>
                                    <Brain size={20} />
                                 </div>
                                 <div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>AI Completion Forecaster</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Projected Completion: <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{aiSyllabus.projected_completion}</span> | Speedup Required: <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{aiSyllabus.required_speedup}</span></p>
                                 </div>
                              </div>
                              <div style={{ background: aiSyllabus.status === 'Delayed' ? '#ef4444' : '#10b981', color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                                 {aiSyllabus.status.toUpperCase()}
                              </div>
                           </div>
                        </div>
                      )}

                     <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                          { unit: 'Unit 1: Advanced Algorithms', progress: 100, status: 'Completed', topics: ['Dynamic Programming', 'Graph Theory', 'Greedy Methods'] },
                          { unit: 'Unit 2: System Architecture', progress: 85, status: 'In Progress', topics: ['Microservices', 'Event-Driven Systems', 'CAP Theorem'] },
                          { unit: 'Unit 3: Data Integrity', progress: 30, status: 'Active', topics: ['ACID Properties', 'Replication Strategies', 'Consensus Algorithms'] },
                          { unit: 'Unit 4: Global Deployment', progress: 0, status: 'Pending', topics: ['Edge Computing', 'CDN Orchestration', 'Auto-scaling'] },
                        ].map((item, idx) => (
                           <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${item.progress === 100 ? '#10b981' : item.progress > 0 ? '#f59e0b' : 'var(--text-muted)'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                 <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{item.unit}</h4>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: item.progress === 100 ? '#10b981' : 'var(--text-muted)' }}>{item.status.toUpperCase()}</span>
                                    <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                       <div style={{ width: `${item.progress}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 1s ease-in-out' }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.progress}%</span>
                                 </div>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                 {item.topics.map(t => (
                                   <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)', fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>{t}</span>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                     <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 900 }}>Performance Distribution</h3>
                        <Chart 
                           options={{
                              chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
                              theme: { mode: 'dark' },
                              colors: ['#3b82f6'],
                              plotOptions: { bar: { borderRadius: 10, columnWidth: '50%', distributed: true } },
                              dataLabels: { enabled: false },
                              xaxis: { categories: ['0-40', '41-60', '61-80', '81-90', '91-100'], axisBorder: { show: false } },
                              grid: { borderColor: 'rgba(255,255,255,0.05)' }
                           }}
                           series={[{ name: 'Students', data: [2, 5, 12, 8, 4] }]}
                           type="bar"
                           height={280}
                        />
                     </div>
                     <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 900 }}>Participation Trends</h3>
                        <Chart 
                           options={{
                              chart: { type: 'line', toolbar: { show: false }, background: 'transparent' },
                              stroke: { curve: 'smooth', width: 3 },
                              theme: { mode: 'dark' },
                              colors: ['#10b981', '#f59e0b'],
                              xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], axisBorder: { show: false } },
                              grid: { borderColor: 'rgba(255,255,255,0.05)' },
                              markers: { size: 4 }
                           }}
                           series={[
                              { name: 'Attendance', data: [95, 92, 88, 94, 91] },
                              { name: 'Submission Rate', data: [80, 85, 78, 90, 82] }
                           ]}
                           type="line"
                           height={280}
                        />
                     </div>
                     <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem', gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                           <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>Curriculum Mastery Matrix</h3>
                           <div style={{ display: 'flex', gap: '8px' }}>
                              {['Theoretical', 'Practical', 'Peer-Review'].map(type => (
                                 <span key={type} style={{ fontSize: '0.65rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{type}</span>
                              ))}
                           </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
                           {[
                              { label: 'Data Structures', val: 92, color: '#10b981' },
                              { label: 'Cloud Clusters', val: 78, color: '#3b82f6' },
                              { label: 'Cryptography', val: 45, color: '#f59e0b' },
                              { label: 'React.js Native', val: 88, color: '#10b981' },
                              { label: 'Edge Latency', val: 62, color: '#3b82f6' },
                              { label: 'Consensus Algo', val: 24, color: '#ef4444' },
                           ].map((item, i) => (
                              <div key={i} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                 <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: item.color, width: `${item.val}%` }}></div>
                                 <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)' }}>{item.label}</p>
                                 <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', fontWeight: 900 }}>{item.val}%</h3>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

             </>
           )}
        </div>
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
           <div className="glass-card" style={{ width: '500px', padding: '2.5rem', position: 'relative' }}>
              <button onClick={() => setShowUploadModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              <h2 style={{ marginBottom: '2rem', fontWeight: 900 }} className="text-gradient">Clinical Material Upload</h2>
              
              <form onSubmit={handleUpload} style={{ display: 'grid', gap: '1.5rem' }}>
                 <div className="input-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>MATERIAL TITLE</label>
                    <input type="text" className="input-premium" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} placeholder="e.g. End-Term Question Paper" />
                 </div>
                 <div className="input-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>CATEGORY</label>
                    <select className="input-premium" value={uploadData.material_type} onChange={e => setUploadData({...uploadData, material_type: e.target.value})}>
                       <option value="lecture">Lecture Notes</option>
                       <option value="exam">Exam Materials</option>
                       <option value="reference">Reference Manual</option>
                    </select>
                 </div>
                 <div className="input-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>FILE (PDF)</label>
                    <input type="file" name="file" className="input-premium" required accept=".pdf" />
                 </div>
                 <button type="submit" className="btn-premium" style={{ marginTop: '1rem', padding: '14px' }}>Execute Injection</button>
              </form>
           </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
           <div className="glass-card" style={{ width: '550px', padding: '2.5rem', position: 'relative' }}>
              <button onClick={() => setShowAnnouncementModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              <h2 style={{ marginBottom: '2rem', fontWeight: 900 }} className="text-gradient">Broadcast Announcement</h2>
              
              <form onSubmit={handlePostAnnouncement} style={{ display: 'grid', gap: '1.5rem' }}>
                 <div className="input-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>TITLE</label>
                    <input type="text" className="input-premium" required value={announcementData.title} onChange={e => setAnnouncementData({...announcementData, title: e.target.value})} placeholder="e.g. Schedule Change for Workshop" />
                 </div>
                 <div className="input-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>CONTENT</label>
                    <textarea 
                      className="input-premium" 
                      style={{ minHeight: '150px', padding: '12px' }} 
                      required 
                      value={announcementData.content} 
                      onChange={e => setAnnouncementData({...announcementData, content: e.target.value})}
                      placeholder="Enter the announcement details..."
                    />
                 </div>
                 <button type="submit" className="btn-premium" style={{ marginTop: '1rem', padding: '14px' }}>Blast to Section</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPortal;
