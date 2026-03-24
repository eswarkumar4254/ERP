import React, { useState } from 'react';
import { 
  Award, ClipboardList, Building, Boxes, 
  Sparkles, BookOpen, Truck, Wallet,
  Library, Presentation, LayoutDashboard, Calendar, FileText,
  Quote
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onNavigateToLogin, onNavigateToSignup }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const features = [
    { name: 'Academic Records', icon: FileText, desc: 'Centralized management of transcripts, attendance logs, and examination grading protocols.' },
    { name: 'Admissions Pipeline', icon: ClipboardList, desc: 'Streamlined prospect tracking, online applications, and final enrollment processing.' },
    { name: 'Faculty Management', icon: Presentation, desc: 'Automated staff scheduling, workload distribution, and leave tracking systems.' },
    { name: 'Campus Infrastructure', icon: Building, desc: 'Comprehensive facilities management, room booking, and asset maintenance logs.' },
    { name: 'Financial Administration', icon: Wallet, desc: 'Secure student billing, departmental ledgers, and institutional accounting workflows.' },
    { name: 'Library Sciences', icon: Library, desc: 'Physical and digital collection cataloging, circulation, and reserve management.' }
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header shadow-sm">
        <div className="landing-logo">
          NexGen University
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
          <div className="stat-number">150k+</div>
          <div className="stat-label">Student Records Managed</div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="details-section">
        <div className="details-image-container">
          <div className="details-image">
            <img src="/dashboard_mockup.png" alt="NexGen Command Center Dashboard Mockup" />
          </div>
        </div>
        <div className="details-content">
          <div className="details-subtitle">System Overview</div>
          <h2 className="details-title">Unified. Secure. Scalable.</h2>
          <p className="details-text">
            Replace fragmented software systems with a single, cohesive architecture. NexGen provides administrators with unparalleled visibility and control over every facet of university life, built on a foundation of rigorous data security.
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
            "NexGen has fundamentally transformed how we govern our institution. The clarity it brings to our administrative overhead is simply unprecedented."
          </p>
          <div className="quote-author">Dr. Eleanor Vance &mdash; Provost, Global Institute of Technology</div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="modules-section">
        <div className="section-head">
          <h2 className="section-title">Core Modules</h2>
          <p className="section-subtitle">Comprehensive solutions engineered for modern educational administration.</p>
        </div>
        
        <div className="modules-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className="module-card"
                onClick={() => setShowPremiumModal(true)}
              >
                <div className="module-icon">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="module-title">{f.name}</h3>
                <p className="module-desc">{f.desc}</p>
                <div className="module-link">
                  View Module &rarr;
                </div>
              </div>
            );
          })}
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
            NexGen ERP
          </div>
          <div className="footer-nav">
            <a href="#about">About</a>
            <a href="#compliance">Compliance</a>
            <a href="#security">Security</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Next Generation Education Technologies.</span>
          <span>Terms of Service &middot; Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
