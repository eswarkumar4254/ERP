import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sparkles, TrendingUp, Award, BookOpen, Users,
  BarChart3, ShieldCheck, Target, FileText,
  Briefcase, CheckCircle, AlertCircle, Download,
  GraduationCap, FlaskConical, Building2, Star
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const NAAC_CRITERIA = [
  { id: 1, title: 'Curricular Aspects', weight: 100, score: 84, color: '#6366f1', items: ['Syllabus Revision', 'CBCS Implementation', 'MOOC Courses', 'Interdisciplinary Courses'] },
  { id: 2, title: 'Teaching-Learning & Evaluation', weight: 350, score: 91, color: '#10b981', items: ['Faculty Qualifications', 'Student-Teacher Ratio', 'ICT Usage', 'Mentor System'] },
  { id: 3, title: 'Research, Innovations & Extension', weight: 120, score: 77, color: '#f59e0b', items: ['Publications in SCI Journals', 'Research Grants', 'Patent Filed', 'R&D Centres'] },
  { id: 4, title: 'Infrastructure & Learning Resources', weight: 100, score: 92, color: '#38bdf8', items: ['ICT-Enabled Classrooms', 'Library Resources', 'Sports Facilities', 'Labs'] },
  { id: 5, title: 'Student Support & Progression', weight: 130, score: 88, color: '#ec4899', items: ['Scholarship Amount', 'Placement Rate', 'Alumni Engagement', 'Counseling'] },
  { id: 6, title: 'Governance, Leadership & Management', weight: 100, score: 79, color: '#8b5cf6', items: ['Strategic Plan', 'Academic Audit', 'IQAC Activities', 'eSanad'] },
  { id: 7, title: 'Institutional Values & Best Practices', weight: 100, score: 72, color: '#14b8a6', items: ['Gender Equity', 'Environment Sustainability', 'Best Practices', 'Institutional Distinctiveness'] },
];

const IQACMetrics = () => {
  const [activeTab, setActiveTab] = useState('naac');
  const [researchStats, setResearchStats] = useState(null);
  const [placements, setPlacements] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rRes, pRes] = await Promise.all([
          axios.get(`${API}/research/my-stats`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/placements/analytics`, { headers }).catch(() => ({ data: null })),
        ]);
        setResearchStats(rRes.data);
        setPlacements(pRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const totalNAAC = NAAC_CRITERIA.reduce((sum, c) => sum + (c.score * c.weight / 100), 0) / NAAC_CRITERIA.reduce((s, c) => s + c.weight, 0) * 100;
  const grade = totalNAAC >= 90 ? 'A++' : totalNAAC >= 80 ? 'A+' : totalNAAC >= 70 ? 'A' : 'B++';

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-gradient">Quality Assurance (IQAC)</h1>
          <p>NAAC/NBA Framework, Accreditation Tracking & Institutional KPI Dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export AQAR
          </button>
          <button className="btn-premium">Generate SSR Report</button>
        </div>
      </div>

      {/* Overall NAAC Score Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #6366f1 100%)',
        color: '#fff', border: 'none', marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>NAAC Accreditation Status</p>
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>Nimmi University — Science & Technology</h2>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              <div><p style={{ margin: 0, opacity: 0.7, fontSize: '0.75rem' }}>NAAC CGPA</p><h3 style={{ margin: '4px 0', color: '#a5f3fc' }}>{(totalNAAC / 10).toFixed(2)}</h3></div>
              <div><p style={{ margin: 0, opacity: 0.7, fontSize: '0.75rem' }}>Grade</p><h3 style={{ margin: '4px 0', color: '#86efac' }}>{grade}</h3></div>
              <div><p style={{ margin: 0, opacity: 0.7, fontSize: '0.75rem' }}>Last Accredited</p><h3 style={{ margin: '4px 0' }}>2022</h3></div>
              <div><p style={{ margin: 0, opacity: 0.7, fontSize: '0.75rem' }}>Next Cycle</p><h3 style={{ margin: '4px 0', color: '#fde68a' }}>2027</h3></div>
            </div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{grade}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>NAAC Grade</div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {[
          { key: 'naac', label: '🏛 NAAC Criteria' },
          { key: 'targets', label: '🔬 R&D Targets' },
          { key: 'kpi', label: '📊 Institutional KPIs' },
          { key: 'payroll', label: '👩‍🏫 Staff Oversight' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem',
              background: activeTab === tab.key ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ===== NAAC Criteria Tab ===== */}
      {activeTab === 'naac' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {NAAC_CRITERIA.map(c => (
            <div key={c.id} className="card" style={{ borderLeft: `4px solid ${c.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: c.color + '22', color: c.color, padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>C-{c.id}</span>
                    {c.title}
                  </h3>
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Weightage: {c.weight} marks</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: c.color }}>{c.score}%</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{Math.round(c.score * c.weight / 100)} / {c.weight} marks</p>
                </div>
              </div>
              <div className="progress-track" style={{ height: '8px', marginBottom: '1rem' }}>
                <div className="progress-fill" style={{ width: `${c.score}%`, background: c.color, height: '100%' }}></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {c.items.map((item, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                    background: c.color + '15', color: c.color, border: `1px solid ${c.color}40`
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
          <div className="card" style={{ background: 'var(--surface-color-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Composite NAAC Score</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>Weighted average across all 7 criteria</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: 0, fontSize: '2rem', color: '#6366f1' }}>{totalNAAC.toFixed(1)}%</h2>
              <span style={{ background: '#ddd6fe', color: '#7c3aed', padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>Grade: {grade}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== R&D Targets Tab ===== */}
      {activeTab === 'targets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="stat-grid">
            <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>Research Target (Papers)</p>
              <h2 style={{ color: '#6366f1', margin: '0.5rem 0' }}>1,200</h2>
              <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>Academic Year 2026</p>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>Published / Achieved</p>
              <h2 style={{ color: '#10b981', margin: '0.5rem 0' }}>
                {researchStats?.total_publications ?? 842}
              </h2>
              <div className="progress-track" style={{ marginTop: '10px' }}>
                <div className="progress-fill" style={{ width: `${(researchStats?.total_publications ?? 842) / 12}%`, background: '#10b981' }}></div>
              </div>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>H-Index (Avg)</p>
              <h2 style={{ color: '#f59e0b', margin: '0.5rem 0' }}>14.2</h2>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>Active Research Projects</p>
              <h2 style={{ color: '#8b5cf6', margin: '0.5rem 0' }}>{researchStats?.total_grants ?? 47}</h2>
            </div>
          </div>

          <div className="glass-pane" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Target Papers</th>
                  <th>Achieved</th>
                  <th>Active Projects</th>
                  <th>H-Index</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: 'Computer Science', target: 400, achieved: 310, projects: 12, hindex: 18 },
                  { dept: 'Electronics', target: 300, achieved: 185, projects: 8, hindex: 12 },
                  { dept: 'Mechanical', target: 250, achieved: 142, projects: 5, hindex: 9 },
                  { dept: 'Civil', target: 150, achieved: 109, projects: 6, hindex: 7 },
                  { dept: 'Management', target: 100, achieved: 96, projects: 3, hindex: 11 },
                ].map(row => (
                  <tr key={row.dept}>
                    <td style={{ fontWeight: 600 }}>{row.dept}</td>
                    <td>{row.target}</td>
                    <td style={{ color: row.achieved >= row.target ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{row.achieved}</td>
                    <td>{row.projects}</td>
                    <td>{row.hindex}</td>
                    <td style={{ minWidth: '120px' }}>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${Math.min(row.achieved / row.target * 100, 100)}%`, background: row.achieved >= row.target ? '#10b981' : '#6366f1' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Math.round(row.achieved / row.target * 100)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Institutional KPIs ===== */}
      {activeTab === 'kpi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { icon: Users, label: 'Total Enrollment', value: '18,420', change: '+4.2%', color: '#6366f1' },
              { icon: GraduationCap, label: 'Pass Rate', value: '94.7%', change: '+1.1%', color: '#10b981' },
              { icon: Briefcase, label: 'Placement Rate', value: `${placements?.placement_percentage ?? 92.5}%`, change: '+2.3%', color: '#f59e0b' },
              { icon: FlaskConical, label: 'R&D Expenditure', value: '₹4.8 Cr', change: '+18%', color: '#8b5cf6' },
              { icon: Star, label: 'Student Satisfaction', value: '4.4 / 5', change: '+0.2', color: '#ec4899' },
              { icon: Award, label: 'Faculty with PhD', value: '76%', change: '+3%', color: '#38bdf8' },
              { icon: Building2, label: 'NBA Accredited Programs', value: '18 / 24', change: '+3', color: '#14b8a6' },
              { icon: BookOpen, label: 'Library e-Resources', value: '12,400', change: '+800', color: '#f97316' },
            ].map(({ icon: Icon, label, value, change, color }, i) => (
              <div key={i} className="card dashboard-stat-card" style={{ margin: 0, borderTop: `3px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <p className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</p>
                    <h2 className="stat-value">{value}</h2>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{change} YoY</span>
                  </div>
                  <div style={{ background: `${color}15`, padding: '0.6rem', borderRadius: '10px', alignSelf: 'center', color }}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>5-Year Institutional Performance Trend</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
              {[
                { year: '2021-22', pass: 91, attend: 88, placed: 85 },
                { year: '2022-23', pass: 92, attend: 89, placed: 87 },
                { year: '2023-24', pass: 93, attend: 91, placed: 89 },
                { year: '2024-25', pass: 94, attend: 92, placed: 91 },
                { year: '2025-26', pass: 95, attend: 94, placed: 93 },
              ].map(y => (
                <div key={y.year} style={{ background: 'var(--surface-color-light)', padding: '1.25rem', borderRadius: '16px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{y.year}</p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>Pass</span><span style={{ color: '#10b981', fontWeight: 700 }}>{y.pass}%</span></div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>Attend</span><span style={{ color: '#6366f1', fontWeight: 700 }}>{y.attend}%</span></div>
                    <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>Placed</span><span style={{ color: '#f59e0b', fontWeight: 700 }}>{y.placed}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Staff Oversight Tab ===== */}
      {activeTab === 'payroll' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Professional Lifecycle Oversight</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registrar view for IQAC monitoring</span>
            </div>
            <div className="glass-pane" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Promotion Due</th>
                    <th>Salary Band</th>
                    <th>Appraisal Score</th>
                    <th>PhD</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Dr. Amit Mishra', desig: 'Associate Prof.', dept: 'CSE', due: 'Jun 2026', band: 'B-10 (L14)', score: 9.4, phd: true },
                    { name: 'Prof. Meena Rao', desig: 'Assistant Prof.', dept: 'ECE', due: 'Dec 2026', band: 'A-8 (L12)', score: 8.8, phd: false },
                    { name: 'Dr. Priya Nair', desig: 'Professor', dept: 'Management', due: 'N/A', band: 'C-14 (L15)', score: 9.7, phd: true },
                    { name: 'Dr. K. Saravanan', desig: 'Associate Prof.', dept: 'Mechanical', due: 'Mar 2027', band: 'B-10 (L14)', score: 8.4, phd: true },
                  ].map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>{s.name}</td>
                      <td>{s.desig}</td>
                      <td>{s.dept}</td>
                      <td>
                        <span className="badge" style={{
                          background: s.due === 'N/A' ? '#dcfce7' : '#fef3c7',
                          color: s.due === 'N/A' ? '#166534' : '#92400e'
                        }}>
                          {s.due === 'N/A' ? 'At Top Grade' : `Due: ${s.due}`}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{s.band}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: s.score >= 9 ? '#10b981' : '#f59e0b' }}>{s.score} / 10</span>
                      </td>
                      <td>
                        {s.phd
                          ? <CheckCircle size={18} color="#10b981" />
                          : <AlertCircle size={18} color="#f59e0b" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="stat-grid">
            <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faculty with PhD</p><h2 style={{ color: '#6366f1' }}>76%</h2><p style={{ fontSize: '0.75rem', margin: 0 }}>Target: 80%</p></div>
            <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg. Appraisal</p><h2 style={{ color: '#10b981' }}>8.9 / 10</h2></div>
            <div className="glass-card"><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Promotion Due (6 mo)</p><h2 style={{ color: '#f59e0b' }}>14</h2></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IQACMetrics;
