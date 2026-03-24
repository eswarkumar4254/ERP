import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, BookOpen, Wallet, 
  Search, ChevronRight, MessageCircle, AlertTriangle,
  Calendar, Award, Star, Clock
} from 'lucide-react';
import './Home.css';
import api from '../api';

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const fetchProfile = async () => {
      try {
        const response = await api.get('/students/me');
        setStudent(response.data);
      } catch (err) {
        console.error('Home data fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;
  if (!student) return <div className="error">Failed to load student profile. Please login again.</div>;

  return (
    <div className="home-stage fade-up">
      {/* 🚀 Top Row: Strategic Intelligence */}
      <section className="dashboard-grid">
        <div className="main-intel">
          <div className="hero-banner">
            <div className="hero-data">
              <span className="badge-premium">{student.university_name}</span>
              <h1>{greeting}, {student.first_name}</h1>
              <p className="hero-subtitle">Your academic trajectory is currently <span className="highlight-text">top-tier</span>. 4 deliverables pending this week.</p>
              <div className="hero-actions">
                <button className="btn-action">View Full Transcript</button>
                <button className="btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>Download ID</button>
              </div>
            </div>
            <div className="hero-art">
              <div className="abstract-glow"></div>
              <Activity size={120} strokeWidth={1} color="rgba(255,255,255,0.1)" />
            </div>
          </div>

          <div className="stats-row">
            <div className="card-premium stat-boxy">
              <div className="stat-head">
                 <div className="icon-box blue"><TrendingUp size={20} /></div>
                 <span className="trend-up">+0.2 Semester Avg</span>
              </div>
              <h2 className="stat-val">{student.cgpa}</h2>
              <p className="stat-name">Academic GPA</p>
            </div>

            <div className="card-premium stat-boxy">
              <div className="stat-head">
                 <div className="icon-box green"><Activity size={20} /></div>
                 <span className="trend-stable">98% Threshold</span>
              </div>
              <h2 className="stat-val">{student.attendance}</h2>
              <p className="stat-name">Registry Attendance</p>
            </div>

            <div className="card-premium stat-boxy">
              <div className="stat-head">
                 <div className="icon-box purple"><Award size={20} /></div>
                 <span className="trend-success">Rank #12</span>
              </div>
              <h2 className="stat-val">124</h2>
              <p className="stat-name">Earned Credits</p>
            </div>
          </div>

          <div className="notices-section">
             <div className="section-header-v2">
                <h3>Institutional Feed</h3>
                <button className="link-action">Global Records <ChevronRight size={14} /></button>
             </div>
             <div className="feed-list">
                <div className="feed-item card-premium">
                   <div className="feed-icon orange"><AlertTriangle size={18} /></div>
                   <div className="feed-body">
                      <h4>Sessional exams rescheduled</h4>
                      <p>The Department of Examinations has moved the CSE-402 sessional to Monday.</p>
                      <span className="feed-time">2 hours ago • Admin Cell</span>
                   </div>
                   <button className="btn-icon-soft"><ChevronRight size={18} /></button>
                </div>
             </div>
          </div>
        </div>

        <aside className="side-intel">
          <div className="card-premium finance-widget">
             <div className="widget-header">
                <Wallet size={18} />
                <span>Financial Health</span>
             </div>
             <div className="balance-box">
                <p className="balance-label">Institutional Credits</p>
                <h2 className="balance-val">₹{student.wallet_balance.toLocaleString()}</h2>
             </div>
             <div className="warning-box">
                <Clock size={14} />
                <span>Semester Due: 28th Oct</span>
             </div>
             <button className="btn-action w-full" style={{ marginTop: '1rem' }}>Clear Dues</button>
          </div>

          <div className="learning-nexus">
             <div className="section-header-v2">
                <h3>Learning Nexus</h3>
             </div>
             <div className="course-compact-card card-premium">
                <div className="c-head">
                   <span className="c-tag">CSE-402</span>
                   <div className="live-tag"><div className="dot"></div> LIVE</div>
                </div>
                <h4>Data Structures & Algorithms</h4>
                <div className="instructor-row">
                   <div className="mini-avatar">DR</div>
                   <span>Dr. David Richards</span>
                </div>
                <div className="progress-mini">
                   <div className="p-bar"><div className="p-fill" style={{ width: '75%' }}></div></div>
                   <span>75%</span>
                </div>
                <button className="btn-ghost w-full" style={{ marginTop: '1rem' }}>Join Seminar</button>
             </div>
          </div>

          <div className="calendar-brief card-premium">
             <h3>Today's Schedule</h3>
             <div className="schedule-list">
                <div className="schedule-item">
                   <span className="time">10:30</span>
                   <div className="s-info">
                      <p className="s-title">Graph Theory</p>
                      <p className="s-loc">Lab 04</p>
                   </div>
                </div>
                <div className="schedule-item">
                   <span className="time">14:00</span>
                   <div className="s-info">
                      <p className="s-title">Advanced Java</p>
                      <p className="s-loc">Online</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>
      </section>

      {/* 🔍 Universal Search Anchored */}
      <div className="global-search-anchor card-premium">
         <Search size={18} color="var(--text-muted)" />
         <input type="text" placeholder="Search courses, faculty, or documents (⌘K)" />
      </div>
    </div>
  );
};

export default Home;
