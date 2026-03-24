import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, PieChart, FileText, Download, 
  MapPin, ShieldCheck, Database, Award, Briefcase, 
  Search, Users, Star, Filter, Calendar, Zap
} from 'lucide-react';

const ReportsRegistry = () => {
  const [activeTab, setActiveTab] = useState('academic');

  const reportGroups = [
    { title: 'Academic Reports', category: 'academic', items: [
      { name: 'Semester-wise Pass/Fail Analytics', desc: 'Comparative analysis of results across departments.', code: 'AC-001' },
      { name: 'Attendance Range Report (<75%)', desc: 'Identifies students at risk of condonation.', code: 'AC-002' },
      { name: 'Elective Selection Matrix', desc: 'Count of students in each open elective/minor.', code: 'AC-003' },
      { name: 'Detention List (Finalized)', desc: 'Official list of students barred from exams.', code: 'AC-008' }
    ]},
    { title: 'Finance & Accounts', category: 'finance', items: [
      { name: 'Daily Fee Collection Ledger', desc: 'Real-time revenue tracking from all sources.', code: 'FN-101' },
      { name: 'Scholarship Disbursement Status', desc: 'Tracking of VSAT/Merit scholarship payments.', code: 'FN-104' },
      { name: 'Fine Collection Summary', desc: 'Revenue from attendance and disciplinary fines.', code: 'FN-106' },
      { name: 'Research Expenditure Log', desc: 'Grants vs Spent per project/faculty.', code: 'FN-112' }
    ]},
    { title: 'Placement & Career', category: 'placement', items: [
      { name: 'Placement vs CGPA Correlation', desc: 'Statistical view of job success vs. academics.', code: 'PL-501' },
      { name: 'Unplaced Student Segmentations', desc: 'Profiling students for remedial training.', code: 'PL-504' },
      { name: 'Package Distribution (LPA)', desc: 'Bell curve of salary packages offered.', code: 'PL-508' },
      { name: 'Internship to PPO Conversion', desc: 'Success rate of conversion programs.', code: 'PL-512' }
    ]},
    { title: 'Accreditation (NAAC/NBA)', category: 'accreditation', items: [
      { name: 'Student-Computer Ratio', desc: 'Required for NAAC Criterion 4.', code: 'AQ-901' },
      { name: 'Research Paper Impact (Scopus/WOS)', desc: 'Departmental h-index and citations.', code: 'AQ-905' },
      { name: 'ICT Enabled Classrooms %', desc: 'Infrastructure metrics for NBA audit.', code: 'AQ-910' }
    ]}
  ];

  const currentReports = reportGroups.find(g => g.category === activeTab).items;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Enterprise Reporting Engine</h1>
        <p>Access 200+ detailed reports across 24 modules for institutional compliance and audits.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
         <button className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>Academic</button>
         <button className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>Finance</button>
         <button className={`tab-btn ${activeTab === 'placement' ? 'active' : ''}`} onClick={() => setActiveTab('placement')}>Placement</button>
         <button className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>Research</button>
         <button className={`tab-btn ${activeTab === 'accreditation' ? 'active' : ''}`} onClick={() => setActiveTab('accreditation')}>NAAC/NBA</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
         {currentReports.map((report, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                     <span style={{ fontSize: '0.65rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{report.code}</span>
                     <h4 style={{ margin: 0 }}>{report.name}</h4>
                  </div>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8, maxWidth: '400px' }}>{report.desc}</p>
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-ghost" style={{ padding: '8px' }} title="Preview"><Search size={16} /></button>
                  <button className="btn-premium" style={{ padding: '8px' }} title="Download Excel"><Download size={16} /></button>
               </div>
            </div>
         ))}
      </div>

      <div className="card" style={{ marginTop: '2.5rem', borderTop: '4px solid #6366f1' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <h3>Custom Query Engine</h3>
               <p style={{ fontSize: '0.85rem' }}>Generate ad-hoc reports by selecting specific parameters and filters.</p>
            </div>
            <button className="btn-premium">Open BI Designer</button>
         </div>
      </div>
    </div>
  );
};

export default ReportsRegistry;
