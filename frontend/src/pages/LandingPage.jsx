import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Award, ClipboardList, Building, Boxes, 
  Sparkles, BookOpen, Truck, Wallet,
  Library, Presentation, LayoutDashboard, Calendar, FileText,
  Quote, Globe, ChevronRight, CheckCircle2, Bed, GraduationCap, Users
} from 'lucide-react';
import './LandingPage.css';

const IconMap = {
  'LMS': BookOpen,
  'HMS': Bed,
  'TMS': Truck,
  'FMS': Wallet,
  'SMS': GraduationCap,
  'RMS': Sparkles,
  'IMS': Boxes,
  'CRM': Users
};

const LandingPage = ({ onNavigateToLogin, onNavigateToSignup }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, uniRes] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/onboarding/modules'),
          axios.get('http://localhost:8000/api/v1/onboarding/active-universities')
        ]);
        setModules(modRes.data);
        setUniversities(uniRes.data);
      } catch (err) {
        console.error("Failed to fetch dynamic data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header shadow-sm">
        <div className="landing-logo">
          Neuraltrix AI
        </div>
        <nav className="landing-nav">
          <button onClick={onNavigateToLogin}>
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge animate-fade-up">Institutional Administration</div>
        <h1 className="hero-title animate-fade-up delay-100">
          The standard for <span>academic</span> excellence.
        </h1>
        <p className="hero-subtitle animate-fade-up delay-200">
          A definitive administrative platform designed for higher education. Streamline departmental operations, secure academic records, and elevate your institutional management with rigorous precision.
        </p>
        <div className="hero-cta animate-fade-up delay-300">
          <button className="btn-primary" onClick={onNavigateToSignup}>
            Get Started &mdash; Deploy Services
          </button>
          <button className="btn-secondary" onClick={onNavigateToLogin}>
            Sign In to Instance
          </button>
        </div>
      </section>

      {/* Dynamic Universities Ticker/Grid */}
      <section className="institutions-section animate-fade-in">
         <div className="section-head">
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Powering Leading Institutions</h2>
            <p className="section-subtitle">Only showing universities with active Neuraltrix subscriptions.</p>
         </div>
         <div className="uni-grid">
            {universities.map(uni => (
               <div key={uni.id} className="uni-pill" onClick={onNavigateToLogin}>
                  <Globe size={16} />
                  <span>{uni.name}</span>
                  <ChevronRight size={14} className="chevron" />
               </div>
            ))}
            {universities.length === 0 && !loading && (
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active institutions provisioned yet.</p>
            )}
         </div>
      </section>

      {/* Statistics Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">System Uptime Guarantee</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">AES-256</div>
          <div className="stat-label">Military Grade Encryption</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{universities.length * 50}+</div>
          <div className="stat-label">Institutional Nodes Active</div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="details-section">
        <div className="details-image-container">
          <div className="details-image">
            <img src="/dashboard_mockup.png" alt="Neuraltrix Command Center Dashboard Mockup" />
          </div>
        </div>
        <div className="details-content">
          <div className="details-subtitle">System Overview</div>
          <h2 className="details-title">Unified. Secure. Scalable.</h2>
          <p className="details-text">
            Replace fragmented software systems with a single, cohesive architecture. Neuraltrix provides administrators with unparalleled visibility and control over every facet of university life, built on a foundation of rigorous data security.
          </p>
          <ul className="details-list">
            <li><LayoutDashboard size={22} strokeWidth={1.5} /> Centralized administrative dashboards</li>
            <li><Calendar size={22} strokeWidth={1.5} /> Institutional master calendaring</li>
            <li><Sparkles size={22} strokeWidth={1.5} /> Automated compliance reporting</li>
            <li><Boxes size={22} strokeWidth={1.5} /> Robust permissions and role-based access</li>
          </ul>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="quote-content">
          <Quote size={48} className="quote-icon" strokeWidth={1} />
          <p className="quote-text">
            "Neuraltrix has fundamentally transformed how we govern our institution. The clarity it brings to our administrative overhead is simply unprecedented."
          </p>
          <div className="quote-author">Dr. Eleanor Vance &mdash; Provost, Global Institute of Technology</div>
        </div>
      </section>

      {/* Modules Grid (Dynamic) */}
      <section className="modules-section">
        <div className="section-head">
          <h2 className="section-title">Institutional Modules</h2>
          <p className="section-subtitle">Real-time components provisioned from the Neuraltrix Core.</p>
        </div>
        
        <div className="modules-grid">
          {modules.map((m) => {
            const Icon = IconMap[m.name] || FileText;
            return (
              <div 
                key={m.id} 
                className="module-card"
                onClick={() => setShowPremiumModal(true)}
              >
                <div className="module-icon">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="module-title">{m.full_name}</h3>
                <p className="module-desc">{m.description}</p>
                <div className="module-link">
                  Request Activation &rarr;
                </div>
              </div>
            );
          })}
          {modules.length === 0 && !loading && (
             <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)' }}>No modules found in the ecosystem.</p>
          )}
        </div>
      </section>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-wrapper">
              <Award size={40} color="#1a252f" strokeWidth={1.2} />
            </div>
            <h2 className="modal-title">Restricted Access</h2>
            <p className="modal-text">
              This module requires verified administrative credentials. Please authenticate your session to view sensitive institutional data.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-btn-cancel"
                onClick={() => setShowPremiumModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn-submit"
                onClick={() => { setShowPremiumModal(false); onNavigateToLogin(); }}>
                Authenticate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            Neuraltrix ERP
          </div>
          <div className="footer-nav">
            <a href="#about">About</a>
            <a href="#compliance">Compliance</a>
            <a href="#security">Security</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Neuraltrix AI Technologies.</span>
          <span>Terms of Service &middot; Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
