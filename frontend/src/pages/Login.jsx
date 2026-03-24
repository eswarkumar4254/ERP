import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, LogIn, ShieldAlert, ArrowLeft, CheckCircle, Globe, Award } from 'lucide-react';
import './Login.css';

const Login = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('super_admin@test.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Using relative path for better browser compatibility
  const SHOWCASE_IMAGE = '/login_showcase.png';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/api/v1/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('user_role', response.data.role);
      localStorage.setItem('user_name', response.data.full_name);
      onLoginSuccess(token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Identity Verification Failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container fade-in">
      {/* 🔮 Aesthetic Brand Panel (Left) */}
      <aside className="brand-panel">
        <div className="brand-image-overlay" style={{ backgroundImage: `url(${SHOWCASE_IMAGE})` }}></div>
        <div className="brand-gradient"></div>
        <div className="brand-content">
           <div className="brand-logo-wrap pulse-ring">
              <div className="brand-logo-icon">
                 <Globe color="white" size={28} />
              </div>
              <h3 className="brand-logo-text">NexGen Academic OS</h3>
           </div>
           
           <h1 className="brand-headline">Architecting <br/><span style={{ color: '#60a5fa' }}>Institutional Excellence</span></h1>
           
           <div className="brand-features">
              <div className="feature-pill">
                 <Award size={18} color="#f59e0b" />
                 <span>Strategic Resource Planning</span>
              </div>
              <div className="feature-pill">
                 <Lock size={18} color="#10b981" />
                 <span>Zero-Trust Enterprise Security</span>
              </div>
              <div className="feature-pill">
                 <CheckCircle size={18} color="#2563eb" />
                 <span>Adaptive Data Analytics</span>
              </div>
           </div>
        </div>

        <div className="abstract-shape shape-1"></div>
        <div className="abstract-shape shape-2"></div>
      </aside>

      {/* 🔐 High-Fidelity Auth Panel (Right) */}
      <main className="auth-panel">
        <div className="auth-container">
          <header className="auth-header">
            <h2>Authorized Access</h2>
            <p>Welcome back. Secure credentials required.</p>
          </header>

          {error && (
            <div className="auth-error">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-container">
              <label>Authentication Email</label>
              <div className="input-field-wrap">
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  placeholder="name@university.edu"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="input-icon" size={20} />
              </div>
            </div>

            <div className="input-container">
              <label>Access Key</label>
              <div className="input-field-wrap">
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  placeholder="Institutional Security Code"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="input-icon" size={20} />
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>Authenticating Identity...</>
              ) : (
                <>
                  Verify Credentials <LogIn size={18} />
                </>
              )}
            </button>

            {onBack && (
              <button 
                type="button" 
                className="btn-back" 
                onClick={onBack}
              >
                <ArrowLeft size={16} /> Back to Identity Selection
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
