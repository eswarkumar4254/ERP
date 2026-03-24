import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, Globe, FileText, CreditCard, ShieldCheck, 
  Mail, Calendar, Fingerprint, ExternalLink, Award,
  Zap, Clock, CheckCircle2, AlertCircle, Users, MapPin
} from 'lucide-react';

const InstitutionProfile = () => {
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/tenants/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data) {
                    setTenant({ 
                        ...res.data, 
                        fullPlan: res.data.plan || { modules: [], name: 'Standard Institutional Instance', price: 0 }
                    });
                }
            } catch (err) {
                console.error("Institutional Identity Retrieval Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    if (loading) return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }} />
        <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>SYNCHRONIZING INSTITUTIONAL RECORDS...</p>
      </div>
    );

    if (!tenant) return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '4rem' }}>
        <AlertCircle size={48} color="var(--error-color)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Identity Retrieval Failure</h2>
        <p style={{ color: 'var(--text-secondary)' }}>We were unable to locate an active institutional context for your current session.</p>
        <button className="btn" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>Re-authenticate Session</button>
      </div>
    );

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="card animate-fade-in" style={{ 
          padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
          borderRadius: '20px', background: '#fff', border: '1px solid #f1f5f9',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.005)'
        }}>
            <div style={{ padding: '12px', borderRadius: '14px', background: `${color}10`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-color)' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="page-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 5rem' }}>
            {/* Header / Identity Section */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <div style={{ 
                        width: '120px', height: '120px', borderRadius: '32px', 
                        background: 'linear-gradient(135deg, var(--primary-color), #334155)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        boxShadow: '0 25px 50px -12px rgba(15,23,42,0.25)'
                    }}>
                        <Building2 size={56} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.025em', color: 'var(--primary-color)' }}>{tenant.name}</h1>
                            <div style={{ 
                                padding: '6px 14px', borderRadius: '30px', background: 'rgba(16,185,129,0.1)', 
                                color: '#059669', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                Authorized Instance
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 600 }}>
                            <Globe size={18} /> {tenant.domain}
                          </span>
                          <span style={{ color: '#e2e8f0', fontSize: '1.2rem' }}>|</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 600 }}>
                            <MapPin size={18} /> ASIA-SOUTH-1 (ID: #{tenant.id})
                          </span>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right', padding: '1rem', background: 'var(--bg-color)', borderRadius: '16px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Instance Created</p>
                    <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0 }}>{new Date(tenant.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </header>

            {/* Core Metrics Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <StatCard icon={Award} label="Current Subscription" value={tenant.plan?.name || "Enterprise Tier"} color="#6366f1" />
                <StatCard icon={Users} label="Institutional Capacity" value={`${tenant.plan?.max_students?.toLocaleString() || 'Unlimited'}`} color="#10b981" />
                <StatCard icon={Zap} label="Gateway Resolution" value="Standard" color="#f59e0b" />
                <StatCard icon={ShieldCheck} label="Identity Status" value="Verified" color="#3b82f6" />
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Left: Detailed Identity */}
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  <div className="card" style={{ padding: '3rem', borderRadius: '24px', background: '#fff', border: '1px solid #f1f5f9' }}>
                      <header style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--primary-color)' }}>
                            <FileText size={24} /> Legal & Operational Identity
                        </h3>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Official identifiers used for compliance and data sovereignty.</p>
                      </header>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                          <div className="profile-group">
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAN / Tax Identifier</label>
                              <div style={{ fontSize: '1.15rem', fontWeight: 700, padding: '16px', background: 'var(--bg-color)', borderRadius: '16px', color: 'var(--primary-color)', border: '1px solid #f1f5f9', letterSpacing: '1px' }}>
                                  {tenant.pan_number || "NOT_PROVIDED"}
                              </div>
                          </div>
                          <div className="profile-group">
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institution Registration ID</label>
                              <div style={{ fontSize: '1.15rem', fontWeight: 700, padding: '16px', background: 'var(--bg-color)', borderRadius: '16px', color: 'var(--primary-color)', border: '1px solid #f1f5f9' }}>
                                  {tenant.registration_id || "REG-BASE-001"}
                              </div>
                          </div>
                          <div className="profile-group">
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrative Email</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.1rem' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={18} />
                                  </div>
                                  {tenant.contact_email || "admin@nextgen.edu"}
                              </div>
                          </div>
                      </div>

                      <div style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '2px solid #f8fafc' }}>
                          <h4 style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Deployed Service Modules</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                              {(tenant.fullPlan?.modules || []).map(mod => (
                                  <div key={mod.name || mod} className="animate-fade-in" style={{ 
                                      padding: '16px 20px', borderRadius: '16px', border: '1px solid #f1f5f9',
                                      display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 700,
                                      background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                  }}>
                                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                      {mod.full_name || mod.name || mod}
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                </div>

                {/* Right Column: Billing & Policy */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className="card" style={{ padding: '3rem', borderRadius: '24px', background: 'var(--primary-color)', color: '#fff' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Instance Billing</h3>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <p style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.025em' }}>₹{tenant.plan?.price?.toLocaleString() || '0'}<span style={{ fontSize: '1.1rem', opacity: 0.6 }}>/mo</span></p>
                            <p style={{ fontWeight: 700, opacity: 0.8, marginTop: '8px' }}>Standard Platform Fee</p>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
                                <span style={{ opacity: 0.6 }}>Current Status</span>
                                <span style={{ fontWeight: 800, color: '#10b981' }}>COMPLIANT</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.95rem' }}>
                                <span style={{ opacity: 0.6 }}>Next Cycle</span>
                                <span style={{ fontWeight: 700 }}>May 18, 2026</span>
                            </div>
                            <button className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '14px' }}>
                                <CreditCard size={18} style={{ marginRight: '10px' }} /> Platform Billing Portal
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '2rem', borderRadius: '24px', border: '2px dashed #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <AlertCircle color="#f59e0b" size={24} />
                            <div>
                                <p style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: 'var(--primary-color)' }}>Institutional Sovereignty</p>
                                <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Certain institutional identifiers are locked to prevent accidental state mismatch. Significant modifications require high-level clearance.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default InstitutionProfile;
;
