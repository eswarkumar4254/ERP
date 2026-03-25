import React, { useState, useEffect } from 'react';
import { 
  Building, Mail, Lock, Globe, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Layers,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import './SignupPage.css';

const SignupPage = ({ onBack, onSignupSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    institution_name: '',
    domain: '',
    admin_email: '',
    admin_password: '',
    plan_name: 'Starter'
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/onboarding/plans');
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlanSelect = (planName) => {
    setFormData({ ...formData, plan_name: planName });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:8000/api/v1/onboarding/signup', formData);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="signup-success-container">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle2 size={64} color="#10b981" />
          </div>
          <h2>Institution Provisioned</h2>
          <p>Your ERP instance for <strong>{formData.institution_name}</strong> has been successfully created.</p>
          <p className="subtext">You can now sign in using your administrator credentials.</p>
          <button className="btn-primary" onClick={onBack}>
            Access Portal Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-sidebar">
        <div className="signup-logo">Neuraltrix ERP</div>
        <div className="signup-benefits">
            <div className="benefit-item">
                <ShieldCheck className="benefit-icon" />
                <div>
                    <h4>Cloud Isolation</h4>
                    <p>Dedicated data silo for your institution with multi-tenant isolation.</p>
                </div>
            </div>
            <div className="benefit-item">
                <Zap className="benefit-icon" />
                <div>
                    <h4>Instant Setup</h4>
                    <p>Zero-configuration deployment. Your services are ready in seconds.</p>
                </div>
            </div>
            <div className="benefit-item">
                <Layers className="benefit-icon" />
                <div>
                    <h4>Service Oriented</h4>
                    <p>Only pay for the services you need. Scale your plan as you grow.</p>
                </div>
            </div>
        </div>
        <div className="signup-footer">
            &copy; 2026 Neuraltrix AI Tech.
        </div>
      </div>

      <div className="signup-main">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="signup-content">
          {step === 1 && (
            <div className="plan-selection animate-fade-in">
              <h1>Select Your Service Tier</h1>
              <p className="subtitle">Choose the plan that best fits your institution's scale and requirements.</p>
              
              <div className="plans-grid">
                {plans.length > 0 ? plans.map((plan) => (
                  <div 
                    key={plan.name} 
                    className={`plan-card ${formData.plan_name === plan.name ? 'active' : ''}`}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.name === 'Professional' && <div className="featured-tag">Most Popular</div>}
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="currency">₹</span>
                      <span className="amount">{plan.price.toLocaleString()}</span>
                      <span className="period">/mo</span>
                    </div>
                    <ul className="plan-features">
                      <li><CheckCircle2 size={16} /> Up to {plan.max_students} students</li>
                      {plan.modules.map(mod => (
                        <li key={mod}><CheckCircle2 size={16} /> {mod} Module Enabled</li>
                      ))}
                    </ul>
                    <button className="plan-btn">
                      Select {plan.name}
                    </button>
                  </div>
                )) : (
                  <div className="loading-placeholder">Loading plans...</div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="account-form animate-fade-in">
              <h1>Create Institutional Account</h1>
              <p className="subtitle">Establish your identity and secure instance for <strong>{formData.plan_name}</strong> Tier.</p>
              
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><Building size={16} /> Institution Name</label>
                  <input 
                    type="text" 
                    name="institution_name"
                    required
                    placeholder="e.g. Stanford University"
                    value={formData.institution_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                    <label><Globe size={16} /> Desired Domain Prefix</label>
                    <div className="domain-input-group">
                        <input 
                            type="text" 
                            name="domain"
                            required
                            placeholder="stanford"
                            value={formData.domain}
                            onChange={handleChange}
                        />
                        <span className="domain-suffix">.neuraltrix.com</span>
                    </div>
                </div>

                <div className="form-divider">Administrative Credentials</div>

                <div className="form-row">
                    <div className="form-group">
                        <label><Mail size={16} /> Admin Email</label>
                        <input 
                            type="email" 
                            name="admin_email"
                            required
                            placeholder="provost@stanford.edu"
                            value={formData.admin_email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input 
                            type="password" 
                            name="admin_password"
                            required
                            placeholder="••••••••"
                            value={formData.admin_password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? 'Provisioning Resources...' : 'Activate Subscription'} 
                  {!loading && <ArrowRight size={18} />}
                </button>
                
                <button type="button" className="btn-text" onClick={() => setStep(1)}>
                  Change selected plan
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
