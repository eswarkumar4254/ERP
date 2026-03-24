import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Award, BookOpen, Clock, FileText, Star, TrendingUp, CheckCircle, 
  AlertTriangle, Users, Calendar, Upload, Download, CreditCard, 
  Eye, Lock, Unlock, ArrowLeft, RefreshCw, Plus, UserCheck, ShieldAlert,
  Folder, PlayCircle, MessageSquare, Briefcase
} from 'lucide-react';

const AcademicAAA = () => {
  const role = localStorage.getItem('user_role') || 'student';
  const name = localStorage.getItem('user_name') || 'User';
  
  const [activeTab, setActiveTab] = useState(role === 'hod' ? 'dashboard' : 'attendance');
  const [showRevaluation, setShowRevaluation] = useState(false);
  const [showOnlineExam, setShowOnlineExam] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [researchStats, setResearchStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [academicAnalytics, setAcademicAnalytics] = useState(null);
  const [courseCompletion, setCourseCompletion] = useState([]);

  const token = localStorage.getItem('token');
  const API = 'http://localhost:8000/api/v1/academics';

  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [electiveChoices, setElectiveChoices] = useState([]);
  const [availableElectives, setAvailableElectives] = useState([
    { id: 101, name: "Advanced Machine Learning", code: "CS402" },
    { id: 102, name: "FinTech & Digital Banking", code: "MS301" },
    { id: 103, name: "Organizational Behavior", code: "HS201" }
  ]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (role === 'student') {
        const [attRes, regRes, choiceRes] = await Promise.all([
          axios.get(`${API}/attendance/summary`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/registration/status`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/electives/my-choices`, { headers }).catch(() => ({ data: [] }))
        ]);
        setAttendanceStats(attRes.data);
        setRegistrationStatus(regRes.data);
        setElectiveChoices(choiceRes.data);
      } else if (role === 'faculty' || role === 'hod' || role === 'institution_admin') {
        const [scriptsRes, researchRes, analyticsRes, completionRes] = await Promise.all([
          axios.get(`${API}/evaluation/scripts`, { headers }).catch(() => ({ data: [] })),
          axios.get(`http://localhost:8000/api/v1/research/my-stats`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/metrics/performance`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/course-completion`, { headers }).catch(() => ({ data: [] }))
        ]);
        setScripts(scriptsRes.data);
        setResearchStats(researchRes.data);
        setAcademicAnalytics(analyticsRes.data);
        setCourseCompletion(completionRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSemesterRegistration = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API}/registration/semester?semester=6&academic_year=2026-27`, {}, { headers });
      fetchData();
    } catch (e) { alert("Registration failed."); }
  };

  const handleOptElective = async (courseId, type) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API}/electives/opt?course_id=${courseId}&type=${type}&semester=6`, {}, { headers });
      fetchData();
    } catch (e) { alert("Selection failed."); }
  };
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBulkUpload = async () => {
    if (!selectedFile) return alert("Please select a CSV file.");
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
      const res = await axios.post(`${API}/marks/bulk-upload?exam_id=1`, formData, { headers }); // Exam ID 1 as placeholder
      alert(`Bulk evaluation complete. ${res.data.processed} students processed.`);
      fetchData();
    } catch (e) { alert("Upload failed. Ensure CSV columns are: student_enrollment, marks."); }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  // --- HELPERS ---
  const renderHeader = (title, subtitle) => (
    <div className="page-header">
      <h1>{title}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </div>
  );

  // --- STUDENT VIEWS ---
  if (role === 'student') {
    if (showOnlineExam) {
      return (
        <div className="page-content">
          <button className="btn-ghost" onClick={() => setShowOnlineExam(false)} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Finish Exam
          </button>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2>T2 Online Assessment: Database Systems</h2>
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                Time Left: 44:21
              </div>
            </div>
            <div style={{ padding: '2rem 0' }}>
              <p style={{ fontWeight: 'bold' }}>Question 4: Explain the differences between ACID and BASE properties in distributed systems.</p>
              <textarea placeholder="Type your answer here..." style={{ width: '100%', height: '200px', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '1rem' }}></textarea>
            </div>
            <button className="btn-premium">Submit Answer Sheet</button>
          </div>
        </div>
      );
    }

    return (
      <div className="page-content">
        {renderHeader("Academic Hub (AAA)", "Comprehensive assessment, attendance, and evaluation lifecycle.")}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Attendance & Timetable</button>
          <button className={`tab-btn ${activeTab === 'registration' ? 'active' : ''}`} onClick={() => setActiveTab('registration')}>Semester Registration</button>
          <button className={`tab-btn ${activeTab === 'academic_year' ? 'active' : ''}`} onClick={() => setActiveTab('academic_year')}>Academic Reports</button>
          <button className={`tab-btn ${activeTab === 'lms' ? 'active' : ''}`} onClick={() => setActiveTab('lms')}>LMS & Materials</button>
          <button className={`tab-btn ${activeTab === 'electives' ? 'active' : ''}`} onClick={() => setActiveTab('electives')}>Internship & Feedback</button>
          <button className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`} onClick={() => setActiveTab('exams')}>Exams & Results</button>
          <button className={`tab-btn ${activeTab === 'nodue' ? 'active' : ''}`} onClick={() => setActiveTab('nodue')}>No-Due & Certificates</button>
          <button className={`tab-btn ${activeTab === 'placements' ? 'active' : ''}`} onClick={() => setActiveTab('placements')}>Career & Placements</button>
        </div>

        {activeTab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="stat-grid">
              <div className="glass-card" style={{ borderLeft: attendanceStats?.status === 'Shortage' ? '4px solid #ef4444' : '4px solid #10b981' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Overall Attendance</p>
                <h2 style={{ color: attendanceStats?.status === 'Shortage' ? '#ef4444' : '#10b981' }}>{attendanceStats ? `${attendanceStats.attendance.toFixed(1)}%` : "Loading..."}</h2>
                <div className="progress-track" style={{ marginTop: '10px' }}>
                  <div className="progress-fill" style={{ width: `${attendanceStats?.attendance || 0}%`, background: attendanceStats?.status === 'Shortage' ? '#ef4444' : '#10b981' }}></div>
                </div>
              </div>
              <div className="glass-card" style={{ borderLeft: attendanceStats?.fine_amount > 0 ? '4px solid #ef4444' : '4px solid #10b981' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Fine Notifier</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ color: attendanceStats?.fine_amount > 0 ? '#ef4444' : '#10b981' }}>₹{attendanceStats?.fine_amount || 0}</h2>
                  {attendanceStats?.fine_amount > 0 && <button className="badge" style={{ background: '#fee2e2', color: '#ef4444', border: 'none' }}>Pay Now</button>}
                </div>
                <p style={{ fontSize: '0.7rem', marginTop: '4px' }}>{attendanceStats?.fine_amount > 0 ? "Shortage Fine Active" : "No Pending Fines"}</p>
              </div>
              <div className="glass-card">
                 <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>On-Duty (OD)</p>
                 <button className="btn-premium" style={{ marginTop: '10px', fontSize: '0.8rem' }}>Apply for OD</button>
              </div>
            </div>

            <div className="card">
              <h3>Today's Period-wise Attendance</h3>
              <table style={{ marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>S.No</th>
                    <th>Period</th><th>Subject</th><th>Faculty</th><th>Time</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(attendanceStats?.daily || []).map((a, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 800, color: 'var(--text-muted)' }}>{i + 1}.</td>
                      <td>{a.period}</td>
                      <td>{a.subject}</td>
                      <td>{a.faculty}</td>
                      <td>{a.time}</td>
                      <td>
                        <span className="badge" style={{ background: a.status === 'Present' ? '#d1fae5' : '#fee2e2', color: a.status === 'Present' ? '#065f46' : '#991b1b' }}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'registration' && (
          <div className="card">
            <h3>Enterprise Registration System (2026-27 AY)</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Step-by-step enrollment for Core, Electives, and Honors/Minors.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
               <div className="glass-card" style={{ borderBottom: registrationStatus ? '3px solid #10b981' : '3px solid #6366f1' }}>
                  <p style={{ fontSize: '0.7rem' }}>Step 1</p>
                  <h4>Semester Enrollment</h4>
                  <span className="badge" style={{ background: registrationStatus ? '#dcfce7' : '#f3f4f6', color: registrationStatus ? '#166534' : '#6b7280' }}>
                    {registrationStatus ? 'COMPLETED' : 'PENDING'}
                  </span>
               </div>
               <div className="glass-card" style={{ borderBottom: electiveChoices.length > 0 ? '3px solid #10b981' : '3px solid #f59e0b' }}>
                  <p style={{ fontSize: '0.7rem' }}>Step 2</p>
                  <h4>Elective & Minor</h4>
                  <span className="badge" style={{ background: electiveChoices.length > 0 ? '#dcfce7' : '#fef3c7', color: electiveChoices.length > 0 ? '#166534' : '#92400e' }}>
                    {electiveChoices.length > 0 ? 'COMPLETED' : 'IN PROGRESS'}
                  </span>
               </div>
               <div className="glass-card" style={{ borderBottom: '3px solid #94a3b8' }}>
                  <p style={{ fontSize: '0.7rem' }}>Step 3</p>
                  <h4>Verification</h4>
                  <span className="badge">NOT STARTED</span>
               </div>
            </div>

            {!registrationStatus ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px' }}>
                <h4>You haven't registered for Semester 6 yet.</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Click below to initiate the enrollment process for the 2026-27 Academic Year.</p>
                <button className="btn-premium" onClick={handleSemesterRegistration}>Register for Semester 6</button>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Select Electives / Specializations</h4>
                    <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>REGISTRATION ACTIVE</span>
                 </div>
                 
                 <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {availableElectives.map(e => {
                      const isOpted = electiveChoices.some(ec => ec.course_name.includes(e.name));
                      return (
                        <div key={e.id} className="glass-pane" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                           <div>
                              <p style={{ fontWeight: 600, margin: 0 }}>{e.name}</p>
                              <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>Code: {e.code} | Category: Open Elective</p>
                           </div>
                           {isOpted ? (
                             <CheckCircle size={20} color="#10b981" />
                           ) : (
                             <button className="btn" onClick={() => handleOptElective(e.id, 'open_elective')}>Opt-In</button>
                           )}
                        </div>
                      );
                    })}
                 </div>

                 <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <h4>Honors / Minor Specialization</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                       <button className="glass-card" onClick={() => handleOptElective(999, 'honors')}>
                          <Award size={18} style={{ marginBottom: '8px' }} />
                          <p style={{ fontWeight: 600, margin: 0 }}>AI & Data Science (Honors)</p>
                       </button>
                       <button className="glass-card" onClick={() => handleOptElective(998, 'minor')}>
                          <TrendingUp size={18} style={{ marginBottom: '8px' }} />
                          <p style={{ fontWeight: 600, margin: 0 }}>Cybersecurity (Minor)</p>
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'electives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
               <h3>Summer Semester Application</h3> 
               <p style={{ fontSize: '0.85rem' }}>Apply for fast-track courses or backlog clearance during summer break.</p>
               <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <input type="text" className="input-premium" placeholder="Enter Course Code (e.g. CS201)" style={{ flex: 1 }} />
                  <button className="btn">Check Eligibility</button>
               </div>
            </div>

            <div className="card">
              <h3>IDP / Internship & Feedback</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                 <div className="glass-card">
                    <h4>Internship Documents</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Upload your completion certificates here.</p>
                    <button className="btn-ghost"><Upload size={14} /> Upload PDF</button>
                 </div>
                 <div className="glass-card">
                    <h4>Faculty Feedback</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Submit your feedback for the current semester.</p>
                    <button className="btn"><Star size={14} /> Rate My Faculty</button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
              <h3>Examination Schedules & Hall Tickets</h3>
              <table style={{ marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>S.No</th>
                    <th>Exam Type</th><th>Subject</th><th>Date</th><th>Venue</th><th>Hall Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1.</td>
                    <td>T2 (Mid-Sem)</td>
                    <td>Database Systems</td>
                    <td>Mar 15, 2026</td>
                    <td>Online / Lab 4</td>
                    <td><button className="btn" onClick={() => setShowOnlineExam(true)}>Start Exam</button></td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>Eternal (End-Sem)</td>
                    <td>Algorithms</td>
                    <td>Apr 20, 2026</td>
                    <td>Main Auditorium</td>
                    <td><button className="btn-ghost" style={{ background: '#f3f4f6' }}><Download size={14} /> Download</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3>Results & Revaluation</h3>
              <table style={{ marginTop: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>S.No</th>
                    <th>Subject</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[0].map((_, i) => (
                  <tr key={i}>
                    <td>{i + 1}.</td>
                    <td>Machine Learning</td>
                    <td>45</td>
                    <td>38</td>
                    <td>83</td>
                    <td>A</td>
                    <td><button className="btn-ghost" onClick={() => setShowRevaluation(true)}>Apply Revaluation</button></td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showRevaluation && (
              <div className="card" style={{ border: '2px solid var(--secondary-color)' }}>
                <h3>Revaluation Application: Machine Learning</h3>
                <p>Fee: ₹500. Upon successful payment, you can view your scanned answer sheet.</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                   <button className="btn-premium"><CreditCard size={14} /> Pay & Proceed</button>
                   <button className="btn-ghost" onClick={() => setShowRevaluation(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nodue' && (
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>No-Due Clearance & Memos</h3>
                <button className="btn-premium">Apply for PC (Provisional Certificate)</button>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="glass-card">
                   <h4>Clearance Status</h4>
                   <div style={{ marginTop: '10px' }}>
                      <p>Library: <span style={{ color: '#10b981', fontWeight: 'bold' }}>CLEARED</span></p>
                      <p>Finance: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>PENDING (₹200)</span></p>
                      <p>Hostel: <span style={{ color: '#10b981', fontWeight: 'bold' }}>CLEARED</span></p>
                   </div>
                </div>
                <div className="glass-card">
                   <h4>Downloads</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      <button className="btn-ghost"><Download size={14} /> Semester 1 Marks Memo</button>
                      <button className="btn-ghost"><Download size={14} /> Semester 2 Marks Memo</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'academic_year' && (
           <div className="card">
              <h3>Academic Attendance Report</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                 <select className="input-premium" style={{ width: '200px' }}>
                    <option>Weekly View</option>
                    <option>Monthly View</option>
                    <option>Yearly Summary</option>
                 </select>
              </div>
              <div style={{ height: '300px', background: 'var(--bg-color)', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '20px' }}>
                 <div style={{ height: '80%', background: 'var(--primary-color)', flex: 1, borderRadius: '4px' }}></div>
                 <div style={{ height: '90%', background: 'var(--primary-color)', flex: 1, borderRadius: '4px' }}></div>
                 <div style={{ height: '60%', background: 'var(--primary-color)', flex: 1, borderRadius: '4px' }}></div>
                 <div style={{ height: '95%', background: 'var(--secondary-color)', flex: 1, borderRadius: '4px' }}></div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>Attendance heat-map per month</p>
           </div>
        )}

        {activeTab === 'lms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Learning Management System (LMS)</h3>
                <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Current Semester: Spring 2026</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card" style={{ borderTop: '4px solid #6366f1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>Database Systems</h4>
                    <BookOpen size={18} color="#6366f1" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Prof. Alan Turing</p>
                  <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}><Folder size={14} style={{ marginRight: '8px' }} /> Lecture Notes (Units 1-3)</button>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}><PlayCircle size={14} style={{ marginRight: '8px' }} /> Practical Recordings</button>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}><FileText size={14} style={{ marginRight: '8px' }} /> Assignment 2 (Due in 2 days)</button>
                  </div>
                </div>

                <div className="glass-card" style={{ borderTop: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>Machine Learning</h4>
                    <BookOpen size={18} color="#10b981" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Dr. Geoffrey Hinton</p>
                  <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}><Folder size={14} style={{ marginRight: '8px' }} /> Unit 4 Datasets</button>
                    <button className="btn-ghost" style={{ justifyContent: 'flex-start', border: '1px solid #10b981', color: '#10b981' }}><MessageSquare size={14} style={{ marginRight: '8px' }} /> Join Discussion Forum</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'placements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="stat-grid">
               <div className="glass-card">
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Placement Status</p>
                  <h3 style={{ color: '#f59e0b', margin: '5px 0' }}>Eligible</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CGPA criteria met (&ge; 7.5)</p>
               </div>
               <div className="glass-card">
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Offers Received</p>
                  <h3 style={{ margin: '5px 0' }}>0</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Waiting for results</p>
               </div>
               <div className="glass-card">
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Upcoming Drives</p>
                  <h3 style={{ color: '#6366f1', margin: '5px 0' }}>3</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Next: Microsoft (Mar 25)</p>
               </div>
             </div>

             <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3>Career & Placement Tracker</h3>
                  <button className="btn-premium"><Upload size={16} style={{ marginRight: '8px' }} /> Update Resume (PDF)</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '10px' }}>Company</th>
                      <th style={{ padding: '10px' }}>Role</th>
                      <th style={{ padding: '10px' }}>CTC Range</th>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Status/Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>Google</td>
                      <td style={{ padding: '10px' }}>SDE Intern</td>
                      <td style={{ padding: '10px' }}>1.2L PM</td>
                      <td style={{ padding: '10px' }}>Mar 18, 2026</td>
                      <td style={{ padding: '10px' }}>
                         <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>Aptitude Round Pending</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>Microsoft</td>
                      <td style={{ padding: '10px' }}>Software Engineer</td>
                      <td style={{ padding: '10px' }}>44 LPA</td>
                      <td style={{ padding: '10px' }}>Mar 25, 2026</td>
                      <td style={{ padding: '10px' }}>
                         <button className="btn">Apply Now</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    );
  }

  // --- FACULTY VIEWS ---
  if (role === 'faculty') {
    if (showEvaluation) {
      return (
        <div className="page-content">
           <button className="btn-ghost" onClick={() => setShowEvaluation(false)} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Back to Bundle
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div className="card">
               <h2>Digital Evaluation: {selectedScript.id} ({selectedScript.student})</h2>
               <div style={{ width: '100%', height: '600px', background: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: '#4b5563' }}>[ Digital Scan of Answer Script Page 1 ]</p>
               </div>
            </div>
            <div className="card" style={{ height: 'fit-content' }}>
               <h3>Marks Allotment</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span>Q1 (max 10)</span>
                     <input type="number" className="input-premium" style={{ width: '80px' }} defaultValue={selectedScript.marks > 0 ? 8 : 0} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span>Q2 (max 10)</span>
                     <input type="number" className="input-premium" style={{ width: '80px' }} />
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontWeight: 'bold' }}>Total Marks</span>
                     <span style={{ fontWeight: 'bold' }}>{selectedScript.marks || '0'}</span>
                  </div>
                  <button className="btn-premium">Submit Evaluation</button>
                  <button className="btn-ghost">Add Private Remark</button>
               </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="page-content">
        {renderHeader("Faculty Console", "Manage subjects, digital valuations, and remunerations.")}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>My Attendance Posting</button>
          <button className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`} onClick={() => setActiveTab('evaluation')}>Digital Valuations</button>
          <button className={`tab-btn ${activeTab === 'mentorship' ? 'active' : ''}`} onClick={() => setActiveTab('mentorship')}>Mentorship Dashboard</button>
          <button className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>Research (APR)</button>
          <button className={`tab-btn ${activeTab === 'duties' ? 'active' : ''}`} onClick={() => setActiveTab('duties')}>Invigilation & Remuneration</button>
          <button className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>Student Feedback</button>
        </div>

        {activeTab === 'attendance' && (
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Today's Classes</h3>
                <span className="badge">Spring 2026 Semester</span>
             </div>
             <table style={{ marginTop: '1rem' }}>
                <thead>
                  <tr><th>Period</th><th>Subject</th><th>Type</th><th>Students</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Advanced AI (CSE-A)</td>
                    <td>Regular</td>
                    <td>64</td>
                    <td><span style={{ color: '#10b981', fontWeight: 'bold' }}>POSTED</span></td>
                    <td><button className="btn-ghost">Edit</button></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Machine Learning (Elective)</td>
                    <td>Open Elective</td>
                    <td>42</td>
                    <td><span style={{ color: '#ef4444', fontWeight: 'bold' }}>PENDING</span></td>
                    <td><button className="btn-premium">Mark Attendance</button></td>
                  </tr>
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                   <h3 style={{ margin: 0 }}>Bulk Evaluation (CSV)</h3>
                   <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Upload marks for the entire class at once.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                   <input type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])} />
                   <button className="btn-premium" onClick={handleBulkUpload}>Process Bulk Upload</button>
                </div>
             </div>

             <h3>Bundle Digital Valuation Pool</h3>
             <table style={{ marginTop: '1rem' }}>
                <thead>
                  <tr><th>Script ID</th><th>Subject</th><th>Student</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {scripts.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 'bold' }}>#{s.id}</td>
                      <td>{s.exam_title}</td>
                      <td>{s.student_name}</td>
                      <td>
                        <span className="badge" style={{ 
                          background: s.status === 'completed' ? '#d1fae5' : s.status === 'returned' ? '#fee2e2' : '#f3f4f6' 
                        }}>{s.status.toUpperCase()}</span>
                      </td>
                      <td>
                        <button className="btn" onClick={() => { setSelectedScript(s); setShowEvaluation(true); }}>
                          {s.status === 'returned' ? 'Re-Evaluate' : 'Evaluate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'mentorship' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="stat-grid">
                 <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Total Mentees</p>
                    <h2 style={{ color: '#6366f1' }}>22</h2>
                    <p style={{ fontSize: '0.7rem' }}>B.Tech CSE (Batch 2024)</p>
                 </div>
                 <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>At Risk</p>
                    <h2 style={{ color: '#ef4444' }}>3</h2>
                    <p style={{ fontSize: '0.7rem' }}>Attendance &lt; 75% or Backlogs</p>
                 </div>
                 <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Meetings Done</p>
                    <h2 style={{ color: '#10b981' }}>18</h2>
                    <p style={{ fontSize: '0.7rem' }}>This Semester</p>
                 </div>
              </div>
              
              <div className="card">
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <h3>Mentee Tracking List</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <input type="text" className="input-premium" placeholder="Search mentee..." />
                       <button className="btn-premium">Schedule Group Meeting</button>
                    </div>
                 </div>
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                       <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                          <th style={{ padding: '10px' }}>Reg Number</th>
                          <th style={{ padding: '10px' }}>Student Name</th>
                          <th style={{ padding: '10px' }}>Curr. CGPA</th>
                          <th style={{ padding: '10px' }}>Avg Attendance</th>
                          <th style={{ padding: '10px' }}>Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '10px' }}>24BCE1001</td>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>Alice Johnson</td>
                          <td style={{ padding: '10px' }}>8.9</td>
                          <td style={{ padding: '10px' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>88%</span></td>
                          <td style={{ padding: '10px' }}><button className="btn-ghost" style={{ padding: '6px 12px' }}>Log Meeting</button></td>
                       </tr>
                       <tr style={{ background: '#fee2e2' }}>
                          <td style={{ padding: '10px' }}>24BCE1042</td>
                          <td style={{ padding: '10px', fontWeight: 'bold', color: '#991b1b' }}>Bob Smith</td>
                          <td style={{ padding: '10px', color: '#991b1b' }}>6.2</td>
                          <td style={{ padding: '10px' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>62%</span></td>
                          <td style={{ padding: '10px' }}><button className="btn" style={{ padding: '6px 12px', background: '#ef4444', color: '#fff' }}>Send Warning</button></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'duties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
               <h3>Invigilation Duties</h3>
               <table style={{ marginTop: '1rem' }}>
                  <thead>
                    <tr><th>Date</th><th>Session</th><th>Halls</th><th>Duty Type</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mar 24, 2026</td>
                      <td>Forenoon</td>
                      <td>Room 102, 103</td>
                      <td>Internal Exam</td>
                      <td><span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>ASSIGNED</span></td>
                    </tr>
                  </tbody>
               </table>
            </div>
            <div className="stat-grid">
               <div className="card">
                  <CreditCard size={20} color="#6366f1" />
                  <h4>My Pay Slips</h4>
                  <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>Latest: Feb 2026</p>
                  <button className="btn-ghost" style={{ fontSize: '0.75rem' }}><Download size={12} /> Download PDF</button>
               </div>
               <div className="card">
                  <Calendar size={20} color="#10b981" />
                  <h4>Leave Request</h4>
                  <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>CL Balance: 4.5 Days</p>
                  <button className="btn-premium" style={{ fontSize: '0.75rem' }}>Apply CL/CC</button>
               </div>
               <div className="card">
                  <Award size={20} color="#f59e0b" />
                  <h4>Workshops</h4>
                  <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>Next: AI Ethics (Remote)</p>
                  <button className="btn" style={{ fontSize: '0.75rem' }}>View Status</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
           <div className="card">
              <h3>Student Subject Feedback</h3>
              <div style={{ marginTop: '1rem' }}>
                 <div className="glass-card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ fontWeight: 'bold' }}>Subject: Advanced AI</span>
                       <span style={{ color: '#facc15' }}>★★★★☆ (4.2/5)</span>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '0.85rem' }}>"The course material is excellent but needs more practical labs."</p>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'research' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="stat-grid">
                 <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Publications</p>
                    <h2 style={{ color: '#6366f1' }}>{researchStats?.publications || 0}</h2>
                    <p style={{ fontSize: '0.7rem' }}>Scopus/UGC Indexed</p>
                 </div>
                 <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Grants</p>
                    <h2 style={{ color: '#10b981' }}>{researchStats?.grants || 0}</h2>
                    <p style={{ fontSize: '0.7rem' }}>Total Active Grants</p>
                 </div>
                 <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Patents</p>
                    <h2 style={{ color: '#f59e0b' }}>{researchStats?.patents || 0}</h2>
                    <p style={{ fontSize: '0.7rem' }}>Filed / Published</p>
                 </div>
                 <div className="glass-card" style={{ borderLeft: '4px solid #ec4899' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Total Citations</p>
                    <h2 style={{ color: '#ec4899' }}>{researchStats?.total_citations || 0}</h2>
                    <p style={{ fontSize: '0.7rem' }}>h-index calculation pending</p>
                 </div>
              </div>

              <div className="card">
                 <h3>APR Compliance Status</h3>
                 <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                       <span>Research Paper Target (6)</span>
                       <span style={{ fontWeight: 'bold' }}>{Math.min(((researchStats?.publications || 0) / 6) * 100, 100).toFixed(0)}%</span>
                    </div>
                    <div className="progress-track">
                       <div className="progress-fill" style={{ width: `${Math.min(((researchStats?.publications || 0) / 6) * 100, 100)}%`, background: '#6366f1' }}></div>
                    </div>
                 </div>
                 <button className="btn-premium" style={{ marginTop: '1.5rem' }}>Generate Annual Appraisal PDF</button>
              </div>
           </div>
        )}
      </div>
    );
  }

  // --- SCRUTINIZER VIEW ---
  if (role === 'scrutinizer') {
    return (
      <div className="page-content">
         {renderHeader("Scrutiny Office", "Review final marks, add remarks, and lock/unlock answer scripts.")}
         <div className="card">
            <h3>Digital Evaluation Queue (Review Only)</h3>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Script ID</th><th>Evaluator</th><th>Marks</th><th>Remarks</th><th>Decision</th></tr>
               </thead>
               <tbody>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>SCR-102</td>
                    <td>Dr. Smith</td>
                    <td>85</td>
                    <td><input type="text" className="input-premium" placeholder="Add remark..." /></td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                       <button className="btn" style={{ background: '#10b981' }}><Lock size={14} /> Finalize</button>
                       <button className="btn" style={{ background: '#ef4444' }}><RefreshCw size={14} /> Send Back</button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>SCR-101</td>
                    <td>Prof. Wilson</td>
                    <td>--</td>
                    <td>--</td>
                    <td><button className="btn-ghost" disabled>Wait for Evaluation</button></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    );
  }

  // --- HOD VIEW ---
  if (role === 'hod') {
    return (
      <div className="page-content">
        {renderHeader("HOD Department Matrix", "Schedule management, guest faculty assignment, and oversight.")}
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Analytics Dashboard</button>
          <button className={`tab-btn ${activeTab === 'timetables' ? 'active' : ''}`} onClick={() => setActiveTab('timetables')}>Timetable Management</button>
          <button className={`tab-btn ${activeTab === 'electives' ? 'active' : ''}`} onClick={() => setActiveTab('electives')}>Elective Subjects</button>
          <button className={`tab-btn ${activeTab === 'staff_view' ? 'active' : ''}`} onClick={() => setActiveTab('staff_view')}>Faculty Oversight</button>
          <button className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Resource & Infra</button>
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="stat-grid">
               <div className="glass-card">
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Dept. Pass Rate</p>
                  <h2 style={{ color: '#10b981' }}>88.4%</h2>
               </div>
               <div className="glass-card">
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Avg CGPA</p>
                  <h2 style={{ color: '#6366f1' }}>8.12</h2>
               </div>
               <div className="glass-card">
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Syllabus Coverage</p>
                  <h2 style={{ color: '#f59e0b' }}>74%</h2>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="card">
                <h3>CGPA Distribution</h3>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(academicAnalytics?.cgpa_distribution || []).map((d, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{d.label}</span>
                        <span>{d.value}%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${d.value}%`, background: '#6366f1' }}></div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3>Syllabus Completion Monitor</h3>
                <table style={{ width: '100%', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '8px' }}>Course</th>
                      <th style={{ padding: '8px' }}>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseCompletion.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}>{c.name}</td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="progress-track" style={{ width: '60px' }}>
                              <div className="progress-fill" style={{ width: `${c.completion}%`, background: c.completion < 60 ? '#ef4444' : '#10b981' }}></div>
                            </div>
                            <span>{c.completion}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timetables' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Section Wise Timetable</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-premium"><Plus size={16} /> Create Timetable</button>
                <button className="btn-ghost" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' }}>
                  <Users size={16} /> Assign Guest Faculty
                </button>
              </div>
            </div>
            <div style={{ background: '#f9fafb', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
               <p style={{ color: 'var(--text-muted)' }}>[ Interactive Drag-and-Drop Timetable Matrix ]</p>
            </div>
          </div>
        )}

        {activeTab === 'staff_view' && (
          <div className="card">
            <h3>Faculty Attendance Aggregator</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
               <button className="badge active">Weekly</button>
               <button className="badge">Monthly</button>
               <button className="badge">Academic Year</button>
            </div>
            <table style={{ marginTop: '1rem' }}>
               <thead>
                  <tr><th>Faculty Name</th><th>Emp ID</th><th>Day Avg</th><th>Week %</th><th>Shortage</th><th>Action</th></tr>
               </thead>
               <tbody>
                  <tr>
                    <td>Dr. Rajesh Kumar</td>
                    <td>EMP-042</td>
                    <td>100%</td>
                    <td>94%</td>
                    <td><CheckCircle size={16} color="#10b981" /></td>
                    <td><button className="btn-ghost">View Log</button></td>
                  </tr>
               </tbody>
            </table>
          </div>
        )}

        {activeTab === 'resources' && (
           <div className="card">
              <h3>Department Budget & Infrastructure</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
                 <div className="glass-card" style={{ borderTop: '4px solid #6366f1' }}>
                    <h4>Budget Allocation (2025-26)</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Sanctioned: &rupee; 25,00,000</p>
                    <div style={{ marginTop: '15px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                          <span>Utilized (&rupee; 16,50,000)</span>
                          <span style={{ fontWeight: 'bold' }}>66%</span>
                       </div>
                       <div className="progress-track"><div className="progress-fill" style={{ width: '66%', background: '#6366f1' }}></div></div>
                    </div>
                    <button className="btn-ghost" style={{ marginTop: '15px' }}>Request Additional Funds</button>
                 </div>
                 
                 <div className="glass-card" style={{ borderTop: '4px solid #f59e0b' }}>
                    <h4>Lab Consumables & Requisitions</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending Requests from Staff</p>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', marginTop: '10px', marginBottom: '10px' }}>
                       <li>AWS Credits for AI Lab (Requested by Dr. Smith)</li>
                       <li>Raspberry Pi Kits x20 (Requested by Prof. Wilson)</li>
                    </ul>
                    <button className="btn-premium">Review Requisitions</button>
                 </div>
              </div>
           </div>
        )}
      </div>
    );
  }

  // --- DEO VIEW ---
  if (role === 'academic_deo' || role === 'exam_cell_deo') {
     return (
        <div className="page-content">
           {renderHeader("Operations Console", role === 'academic_deo' ? "Semester promotions, eligibility, and period calculations." : "Invigilation allotment and hall arrangements.")}
           <div className="stat-grid">
              {role === 'academic_deo' ? (
                 <>
                    <div className="glass-card">
                       <TrendingUp size={22} color="#6366f1" />
                       <h3>Semester Promotion</h3>
                       <p>Batch 2024 eligibility calculation pending.</p>
                       <button className="btn" style={{ marginTop: '10px' }}>Run Batch Promotion</button>
                    </div>
                    <div className="glass-card">
                       <ShieldAlert size={22} color="#ef4444" />
                       <h3>Detain List</h3>
                       <p>12 students under attendance shortage.</p>
                       <button className="btn" style={{ background: '#ef4444', color: '#fff', marginTop: '10px' }}>Generate Remove List</button>
                    </div>
                    <div className="glass-card">
                       <Calendar size={22} color="#f59e0b" />
                       <h3>Counting Date</h3>
                       <p>Current: 2026-03-31</p>
                       <button className="btn-ghost" style={{ marginTop: '10px' }}>Update Period Date</button>
                    </div>
                 </>
              ) : (
                 <>
                    <div className="glass-card">
                       <UserCheck size={22} color="#6366f1" />
                       <h3>Hall Seating</h3>
                       <p>Exams starting Mar 15 - Arrange Halls</p>
                       <button className="btn" style={{ marginTop: '10px' }}>Auto Arrange Seating</button>
                    </div>
                    <div className="glass-card">
                       <Plus size={22} color="#10b981" />
                       <h3>Assign Invigilators</h3>
                       <p>12 Slots still unassigned for Phase 1.</p>
                       <button className="btn" style={{ marginTop: '10px' }}>Assign Now</button>
                    </div>
                 </>
              )}
           </div>
        </div>
     );
  }

  // GLOBAL ADMIN FALLBACK
  return (
    <div className="page-content">
      {renderHeader("System Administration (AAA)", "Global oversight for all academic and exam operations.")}
      
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Institutional Stats</button>
        <button className={`tab-btn ${activeTab === 'ops' ? 'active' : ''}`} onClick={() => setActiveTab('ops')}>Operational Control</button>
        <button className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>System Audit Logs</button>
        <button className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')}>AAA Configuration</button>
      </div>

      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="stat-grid">
            <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
              <h2 style={{ fontSize: '2rem', color: '#6366f1' }}>2.4k</h2>
              <p style={{ fontWeight: 'bold' }}>Total Students</p>
              <p style={{ fontSize: '0.7rem' }}>Enrolled across 12 Depts</p>
            </div>
            <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
              <h2 style={{ fontSize: '2rem', color: '#10b981' }}>184</h2>
              <p style={{ fontWeight: 'bold' }}>Active Faculty</p>
              <p style={{ fontSize: '0.7rem' }}>Teaching 342 Courses</p>
            </div>
            <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <h2 style={{ fontSize: '2rem', color: '#f59e0b' }}>92%</h2>
              <p style={{ fontWeight: 'bold' }}>Attendance Avg</p>
              <p style={{ fontSize: '0.7rem' }}>Institution-wide</p>
            </div>
            <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <h2 style={{ fontSize: '2rem', color: '#ef4444' }}>14</h2>
              <p style={{ fontWeight: 'bold' }}>Active Exams</p>
              <p style={{ fontSize: '0.7rem' }}>Evaluations in progress</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div className="card">
              <h3>Departmental Performance Benchmarking</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>Comparing pass rates and attendance across main segments.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { dept: "Computer Science", pass: 94, att: 88, color: "#6366f1" },
                  { dept: "Management Studies", pass: 89, att: 91, color: "#10b981" },
                  { dept: "Commerce & CA", pass: 82, att: 85, color: "#f59e0b" },
                  { dept: "Physical Sciences", pass: 78, att: 94, color: "#ef4444" }
                ].map((d, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{d.dept}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem' }}>Pass Rate: {d.pass}%</span>
                      <div className="progress-track" style={{ height: '6px' }}><div className="progress-fill" style={{ width: `${d.pass}%`, background: d.color }}></div></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem' }}>Attendance: {d.att}%</span>
                      <div className="progress-track" style={{ height: '6px' }}><div className="progress-fill" style={{ width: `${d.att}%`, background: d.color, opacity: 0.6 }}></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>System Health</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass-pane" style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>Attendance Records</p>
                  <h4 style={{ margin: 0 }}>1,244,592</h4>
                  <p style={{ fontSize: '0.65rem', color: '#10b981' }}>All synced to Redis Cache</p>
                </div>
                <div className="glass-pane" style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>PDF Result Memos</p>
                  <h4 style={{ margin: 0 }}>14,203</h4>
                  <p style={{ fontSize: '0.65rem', color: '#6366f1' }}>Stored in Secured Vault</p>
                </div>
                <div className="glass-pane" style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>Identity Sync</p>
                  <h4 style={{ margin: 0 }}>Active</h4>
                  <p style={{ fontSize: '0.65rem' }}>LDAP / SSO Heartbeat: 4ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ops' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="card">
            <Lock size={24} color="#ef4444" />
            <h3 style={{ marginTop: '1rem' }}>Result Publication Lock</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Prevent all HODs/Staff from editing marks for the current cycle.</p>
            <button className="btn" style={{ background: '#ef4444', color: '#fff', width: '100%', marginTop: '1rem' }}>Activate Global Lock</button>
          </div>
          <div className="card">
            <TrendingUp size={24} color="#10b981" />
            <h3 style={{ marginTop: '1rem' }}>Semester Initialization</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Move all students to the next grade and archive current period data.</p>
            <button className="btn-premium" style={{ width: '100%', marginTop: '1rem' }}>Start New Session</button>
          </div>
          <div className="card">
            <AlertTriangle size={24} color="#f59e0b" />
            <h3 style={{ marginTop: '1rem' }}>Emergency Broadcast</h3>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Send instant notification to all Students & Staff portals.</p>
            <button className="btn" style={{ padding: '10px', width: '100%', marginTop: '1rem' }}>Draft Notification</button>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Institutional Audit Logs</h3>
            <button className="btn-ghost"><Download size={16} /> Export CSV</button>
          </div>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>User</th>
                <th style={{ padding: '10px' }}>Role</th>
                <th style={{ padding: '10px' }}>Action</th>
                <th style={{ padding: '10px' }}>Details</th>
                <th style={{ padding: '10px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {[
                { user: "Dr. Rajesh K.", role: "HOD", action: "Leave Approval", details: "Approved 3 faculty leaves", time: "10 mins ago" },
                { user: "Exam Cell BO", role: "DEO", action: "Memo Generation", details: "Generated 450 results for Sem 4", time: "25 mins ago" },
                { user: "Prof. Wilson", role: "Staff", action: "Marks Entry", details: "Published CA-2 marks for CSE-B", time: "1 hour ago" },
                { user: "System", role: "Cron", action: "Cache Refresh", details: "Redis cache invalidated & rebuilt", time: "2 hours ago" },
              ].map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.user}</td>
                  <td style={{ padding: '10px' }}><span className="badge">{log.role}</span></td>
                  <td style={{ padding: '10px' }}>{log.action}</td>
                  <td style={{ padding: '10px' }}>{log.details}</td>
                  <td style={{ padding: '10px', opacity: 0.6 }}>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="card">
          <h3>AAA Domain Configuration</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Define grading scales, attendance thresholds, and exam naming conventions.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '2rem' }}>
            <div className="glass-pane" style={{ padding: '1.5rem' }}>
              <h4>Grade Scale (10 Point)</h4>
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>O (Outstanding)</span><span>9.0 - 10.0</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>A+ (Excellent)</span><span>8.0 - 9.0</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>A (Very Good)</span><span>7.0 - 8.0</span></div>
              </div>
              <button className="btn-ghost" style={{ marginTop: '1.5rem', width: '100%' }}>Edit Scale</button>
            </div>
            <div className="glass-pane" style={{ padding: '1.5rem' }}>
              <h4>System Thresholds</h4>
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Min Attendance</span><span>75%</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Condonation Range</span><span>65% - 75%</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Passing Marks</span><span>40%</span></div>
              </div>
              <button className="btn-ghost" style={{ marginTop: '1.5rem', width: '100%' }}>Change Thresholds</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicAAA;
