import React, { useState } from 'react';
import { Fingerprint, ArrowRight, CheckCircle, AlertCircle, User, Lock } from 'lucide-react';
import './Login.css';

import api from '../api';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', userId);
      formData.append('password', password);

      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.data.access_token) {
        localStorage.setItem('student_token', response.data.access_token);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login error', err);
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className="login-stage-v2 fade-up">
      <div className="login-dual-screen">
         {/* 🎨 Branding & Utility Section */}
         <div className="login-showcase">
            <div className="showcase-content">
               <div className="showcase-logo">N</div>
               <h2>Elevating Academic <br/>Digital Experiences.</h2>
               <p>Welcome to the Neuraltrix Student Portal. Your unified gateway to academic excellence and institutional management.</p>
               <div className="showcase-features">
                  <div className="s-feat"><CheckCircle size={16} /> Real-time Course Analytics</div>
                  <div className="s-feat"><CheckCircle size={16} /> Unified Payment Gateway</div>
                  <div className="s-feat"><CheckCircle size={16} /> Global Resource Library</div>
               </div>
            </div>
            <div className="showcase-footer">
               <p>&copy; 2024 NexGen ERP Systems. Secured with Institutional Grade SSL.</p>
            </div>
         </div>

         {/* 🔐 Authentication Section */}
         <div className="login-auth-zone">
            <div className="auth-card">
               <div className="auth-header">
                  <h1>Institutional Access</h1>
                  <p>Authenticating your student identity</p>
               </div>

               <form className="auth-form" onSubmit={handleLogin}>
                  {error && <div className="auth-error-pill"><AlertCircle size={16} /> {error}</div>}
                  
                  <div className="auth-field-group">
                     <label>Student Email / Identity ID</label>
                     <div className="auth-input-wrap">
                        <User size={18} color="var(--text-muted)" />
                        <input 
                           type="text" 
                           placeholder="e.g. sumanth@university.edu" 
                           value={userId}
                           onChange={(e) => setUserId(e.target.value)}
                           required 
                        />
                     </div>
                  </div>

                  <div className="auth-field-group">
                     <label>Institutional Access Pin</label>
                     <div className="auth-input-wrap">
                        <Lock size={18} color="var(--text-muted)" />
                        <input 
                           type="password" 
                           placeholder="••••••••" 
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required 
                        />
                     </div>
                  </div>

                  <div className="auth-utils">
                     <label className="checkbox-wrap">
                        <input type="checkbox" />
                        <span>Stay authenticated for 7 days</span>
                     </label>
                     <button type="button" className="link-action">Forgot Credentials?</button>
                  </div>

                  <button type="submit" className="btn-auth-submit">
                     Enter Portal <ArrowRight size={18} />
                  </button>
               </form>

               <div className="auth-footer-alternate">
                  <p>Prefer faster access?</p>
                  <label className="biometric-trigger">
                     <Fingerprint size={24} />
                     <span>Scan Biometric Identity</span>
                  </label>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
