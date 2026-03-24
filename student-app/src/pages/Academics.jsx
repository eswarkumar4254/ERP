import React, { useState, useEffect } from 'react';
import { 
  Award, Search, ChevronRight, FileText, CheckCircle 
} from 'lucide-react';
import './Academics.css';
import api from '../api';

const Academics = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/students/me');
        setStudent(response.data);
      } catch (err) {
        console.error('Academics data fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading Academics...</div>;
  if (!student) return <div className="error">Data not available</div>;

  return (
    <div className="academics-stage fade-up">
      <div className="page-header-v2">
         <h1>Academic Records</h1>
         <p className="text-muted">Explore your semester timeline, performance metrics, and registered course material.</p>
      </div>

      <div className="academics-grid">
         {/* 📊 Grade Analytics Widget */}
         <div className="card-premium gpa-analyser">
            <div className="analyser-header">
               <div className="analyser-title">
                  <Award size={24} color="var(--primary)" />
                  <h3>Cumulative GPA Analysis</h3>
               </div>
               <span className="badge-premium">Semester-{student.current_semester} Active</span>
            </div>
            <div className="analyser-body">
               <div className="gpa-metric">
                  <h2 className="big-val">{student.cgpa}</h2>
                  <p>Current CGPA</p>
               </div>
               <div className="gpa-benchmarks">
                  <div className="bench-item">
                     <span>Credits Earned</span>
                     <p>124 Units</p>
                  </div>
                  <div className="bench-item">
                     <span>Program Rank</span>
                     <p>Top 5%</p>
                  </div>
               </div>
            </div>
         </div>

         {/* 📅 Semester Timeline (Horizontal) */}
         <div className="card-premium timeline-nexus">
            <h3>Academic Journey Timeline</h3>
            <div className="nexus-track">
               <div className="track-point done">
                  <div className="p-dot"><CheckCircle size={14} /></div>
                  <div className="p-info">
                     <p className="p-title">Mid-Term Eval</p>
                     <p className="p-date">Oct 15, 2024</p>
                  </div>
               </div>
               <div className="track-point current">
                  <div className="p-dot"></div>
                  <div className="p-info">
                     <p className="p-title">Project Delta</p>
                     <p className="p-date">Due: Nov 02</p>
                  </div>
               </div>
               <div className="track-point future">
                  <div className="p-dot"></div>
                  <div className="p-info">
                     <p className="p-title">Final Finals</p>
                     <p className="p-date">Starts Dec 10</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 📚 Course Roster Table */}
      <section className="course-roster-section">
         <div className="section-header-v2">
            <h3>Registered Course Roster</h3>
            <div className="search-mini">
               <Search size={14} />
               <input type="text" placeholder="Filter courses..." />
            </div>
         </div>
         <div className="card-premium table-view-wrap">
            <table className="roster-table">
               <thead>
                  <tr>
                     <th>Course Identity</th>
                     <th>Faculty Lead</th>
                     <th>Type</th>
                     <th>Attendance</th>
                     <th>Material</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>
                        <div className="c-id">
                           <span className="c-code">CSE-402</span>
                           <span className="c-name">Data Structures</span>
                        </div>
                     </td>
                     <td>Prof. Richards</td>
                     <td><span className="status-pill warning">Core</span></td>
                     <td>88%</td>
                     <td><button className="link-action"><FileText size={14} /> 12 resources</button></td>
                     <td><button className="btn-ghost sm">View Portal</button></td>
                  </tr>
                  <tr>
                     <td>
                        <div className="c-id">
                           <span className="c-code">CSE-405</span>
                           <span className="c-name">Graph Theory</span>
                        </div>
                     </td>
                     <td>Dr. Sarah J.</td>
                     <td><span className="status-pill success">Elective</span></td>
                     <td>94%</td>
                     <td><button className="link-action"><FileText size={14} /> 08 resources</button></td>
                     <td><button className="btn-ghost sm">View Portal</button></td>
                  </tr>
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};

export default Academics;
