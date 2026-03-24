import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, Brain, Compass, Target, GraduationCap, 
  Briefcase, ChevronRight, Zap, TrendingUp, 
  BarChart3, BookOpen, Award, Star, Activity, Globe
} from 'lucide-react';

const AIAdvisor = () => {
  const [activeTab, setActiveTab] = useState('paths');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch recommendations and risk for Student ID 1
        const [riskRes, recsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/analytics/predict/dropout/1', config),
          axios.get('http://localhost:8000/api/v1/analytics/recommendations/1', config)
        ]);

        setAnalyticsData({
          risk: riskRes.data,
          recommendations: recsRes.data
        });
      } catch (err) {
        console.error("AI Analysis Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recommendations = {
    paths: [
      { title: 'Full-Stack Engineering', confidence: 94, reason: 'Strong performance in Data Structures & Web Tech', salary: '$85k–$120k', trend: '+18% YoY', color: 'var(--primary-color)' },
      { title: 'AI & Data Science', confidence: 88, reason: 'Top 5% in Mathematics and Python results', salary: '$95k–$140k', trend: '+32% YoY', color: '#a855f7' },
    ],
    electives: analyticsData?.recommendations?.recommended_electives.map((name, i) => ({
      name, code: `EL${100+i}`, match: '90%', level: 'Recommended', seats: 15
    })) || [
      { code: 'CS402', name: 'Neural Networks & Deep Learning', match: '96%', level: 'Advanced', seats: 42 },
    ],
    internships: [
      { company: 'Google DeepMind', role: 'AI Research Intern', match: '93%', stipend: '$8,500/mo', deadline: 'Mar 28', location: 'London' },
      { company: 'Stripe', role: 'Platform Engineering Intern', match: '87%', stipend: '$7,200/mo', deadline: 'Apr 10', location: 'Remote' },
      { company: 'NVIDIA', role: 'CUDA Systems Intern', match: '81%', stipend: '$6,800/mo', deadline: 'Apr 20', location: 'Singapore' },
    ]
  };

  const skills = [
    { name: 'Python & ML Frameworks', val: 88 },
    { name: 'System Design', val: 74 },
    { name: 'Data Structures', val: 92 },
    { name: 'Cloud Platforms', val: 66 },
    { name: 'Communication', val: 79 },
  ];

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0 }}>AI Academic Advisor</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
            Intelligent career pathing and academic recommendations powered by institutional performance data.
          </p>
        </div>
        <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} /> Re-Run AI Analysis
        </button>
      </div>

      {/* Profile Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Cognitive Profile', val: 'Analytical', sub: 'Based on 42 data points', icon: Brain, color: 'var(--primary-color)' },
          { label: 'Market Readiness', val: '84%', sub: 'Fortune 500 alignment', icon: Target, color: 'var(--secondary-color)' },
          { label: 'Career Matches', val: '12 Paths', sub: 'AI-curated for your profile', icon: Compass, color: '#a855f7' },
          { label: 'Skills Gap Score', val: '74/100', sub: '3 areas need improvement', icon: Activity, color: 'var(--accent-color)' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ padding: '10px', background: `${s.color}15`, borderRadius: '12px' }}>
                <s.icon size={20} color={s.color} />
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>AI-SCORED</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</p>
            <h2 style={{ margin: '4px 0 2px', fontSize: '1.6rem', fontWeight: 900 }}>{s.val}</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Main Tab Area */}
        <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            {['paths', 'electives', 'internships'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none', border: 'none',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                  textTransform: 'capitalize', position: 'relative', padding: '0 0 4px',
                }}
              >
                {tab === 'paths' ? 'Career Paths' : tab === 'electives' ? 'Recommended Electives' : 'Internship Matches'}
                {activeTab === tab && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary-color)', borderRadius: '2px' }} />}
              </button>
            ))}
          </div>

          {activeTab === 'paths' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {recommendations.paths.map((p, i) => (
                <div key={i} className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: '1.75rem' }}>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '4px 12px', background: `${p.color}20`, borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900, color: p.color }}>
                    {p.confidence}% MATCH
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <TrendingUp size={22} color={p.color} />
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>{p.title}</h3>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{p.reason}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salary Range</p>
                      <p style={{ margin: '2px 0 0', fontWeight: 800, color: 'var(--secondary-color)', fontSize: '0.9rem' }}>{p.salary}</p>
                    </div>
                    <button className="btn-ghost" style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Roadmap <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'electives' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendations.electives.map((c, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={20} color="var(--primary-color)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800 }}>{c.name}</span>
                      <code style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{c.code}</code>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className="progress-track" style={{ width: '60px' }}><div className="progress-fill" style={{ width: c.match, background: 'var(--primary-color)' }} /></div>
                        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{c.match}</span>
                      </div>
                      <span className="badge-premium" style={{ fontSize: '0.65rem' }}>{c.level}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{c.seats} seats left</span>
                    </div>
                  </div>
                  <button className="btn-premium" style={{ padding: '8px 20px', fontSize: '0.8rem', borderRadius: '10px', whiteSpace: 'nowrap' }}>Pre-Enroll</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'internships' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recommendations.internships.map((intern, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                      {intern.company[0]}
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{intern.company}</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{intern.role} · {intern.location}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--secondary-color)' }}>{intern.stipend}</p>
                    <p style={{ margin: '4px 0 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deadline: {intern.deadline}</p>
                    <span className="badge-premium" style={{ background: 'var(--primary-glow)', color: 'var(--primary-color)' }}>{intern.match} AI Match</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skill Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 800 }}>Skill Heatmap</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {skills.map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontWeight: 800 }}>{s.val}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${s.val}%`, background: s.val > 85 ? 'var(--secondary-color)' : s.val > 70 ? 'var(--primary-color)' : 'var(--accent-color)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Card */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1))', padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-color), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>
              SJ
            </div>
            <h4 style={{ margin: '0 0 6px', fontWeight: 800 }}>Dr. Sarah Jenkins</h4>
            <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI & ML Department · London Node</p>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
              {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" color="#f59e0b" />)}
            </div>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Available today at 3:00 PM for a career pathing session.
            </p>
            <button className="btn-premium" style={{ width: '100%', padding: '10px' }}>Schedule Meeting</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
