import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings as SettingsIcon, Moon, Globe, Database, Bell, Shield, 
  User, Palette, Save, Check, Lock, Building, Mail, CreditCard, 
  Zap, Clock, ShieldCheck, AlertCircle, Trash2, RefreshCcw
} from 'lucide-react';
const Toggle = ({ value, onChange }) => (
  <div onClick={onChange} style={{
    width: '40px', height: '20px', borderRadius: '10px', cursor: 'pointer', position: 'relative',
    background: value ? 'var(--secondary-color)' : '#e5e7eb',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
    <div style={{
      position: 'absolute', top: '2px', left: value ? '22px' : '2px',
      width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }} />
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
      <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--bg-color)', color: 'var(--primary-color)' }}>
        <Icon size={20} />
      </div>
      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>{title}</h2>
    </div>
    {subtitle && <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '44px' }}>{subtitle}</p>}
  </div>
);

const SettingsCard = ({ children }) => (
  <div className="card animate-fade-in" style={{ 
    padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', 
    background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)'
  }}>
    {children}
  </div>
);

const FormField = ({ label, hint, children, horizontal = true }) => (
  <div style={{ 
    display: 'flex', flexDirection: horizontal ? 'row' : 'column', 
    justifyContent: 'space-between', alignItems: horizontal ? 'center' : 'flex-start', 
    padding: '1.25rem 0', borderBottom: '1px solid #f1f5f9', gap: horizontal ? '2rem' : '0.75rem'
  }}>
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{label}</label>
      {hint && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
    <div style={{ flexShrink: 0, width: horizontal ? 'auto' : '100%' }}>{children}</div>
  </div>
);

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(id)}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
      borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, border: 'none',
      background: activeTab === id ? 'var(--primary-color)' : 'transparent',
      color: activeTab === id ? '#fff' : 'var(--text-secondary)',
      cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left', width: '100%'
    }}
  >
    <Icon size={18} />
    {label}
  </button>
);

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');
  const [settings, setSettings] = useState({
    institutionName: '',
    institutionDomain: '',
    accentColor: '#0f172a',
    theme: 'light',
    sidebarCompact: false,
    emailNotifs: true,
    smsNotifs: false,
    pushNotifs: true,
    feeReminderDays: 7,
    sessionTimeoutMins: 60,
    requireMfa: false,
    auditLogs: true,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetentionYears: 7,
    panNumber: '',
    registrationId: '',
    contactEmail: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userInfoRes = await axios.get('http://localhost:8000/api/v1/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const tenantRes = await axios.get('http://localhost:8000/api/v1/tenants/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const myTenant = tenantRes.data;

        setSettings(prev => ({
          ...prev,
          institutionName: myTenant?.name || userInfoRes.data.tenant_name || '',
          institutionDomain: myTenant?.domain || '',
          panNumber: myTenant?.pan_number || '',
          registrationId: myTenant?.registration_id || '',
          contactEmail: myTenant?.contact_email || userInfoRes.data.email,
          accentColor: myTenant?.primary_color || '#0f172a',
        }));
      } catch (err) {
        console.error("Fetch settings error:", err);
      }
    };
    fetchSettings();
  }, [token]);

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/tenants/me`, {
        name: settings.institutionName,
        primary_color: settings.accentColor,
        pan_number: settings.panNumber,
        registration_id: settings.registrationId,
        contact_email: settings.contactEmail
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0 0 8px 0', letterSpacing: '-0.025em' }}>System Settings</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Configure institutional parameters, compliance, and aesthetic frameworks.</p>
        </div>
        <button className="btn" onClick={handleSave} style={{ 
          padding: '12px 24px', borderRadius: '12px', background: 'var(--primary-color)', 
          boxShadow: '0 10px 15px -3px rgba(15,23,42,0.2)', transition: 'all 0.2s ease'
        }}>
          {saved ? <><Check size={18} /> Changes Saved</> : <><Save size={18} /> Update Configuration</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3.5rem' }}>
        {/* Sub-navigation */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <TabButton id="identity" label="Identity & Compliance" icon={Building} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="governance" label="Security & RBAC" icon={Shield} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="aesthetics" label="System Aesthetics" icon={Palette} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="maintenance" label="Data Maintenance" icon={Database} activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Dynamic Content */}
        <main>
          {activeTab === 'identity' && (
            <div className="animate-fade-in">
              <SectionHeader title="Institutional Identity" subtitle="Manage your official university credentials and compliance metadata." icon={Globe} />
              <SettingsCard>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <FormField label="Institution Name" horizontal={false}>
                    <input className="input-premium" value={settings.institutionName} onChange={e => update('institutionName', e.target.value)} placeholder="Full University Name" />
                  </FormField>
                  <FormField label="Institutional Domain" horizontal={false}>
                    <input className="input-premium" value={settings.institutionDomain} onChange={e => update('institutionDomain', e.target.value)} placeholder="university.edu" />
                  </FormField>
                </div>
                <FormField label="Primary Contact Email" hint="Official address for regulatory communication">
                  <input className="input-premium" style={{ width: '320px' }} value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} />
                </FormField>
                
                <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '2px dashed #f1f5f9' }}>
                  <p style={{ margin: '0 0 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Regulatory Information</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <FormField label="PAN Number" hint="Tax Identification Number" horizontal={false}>
                      <input className="input-premium" style={{ letterSpacing: '1px', fontWeight: 600 }} value={settings.panNumber} onChange={e => update('panNumber', e.target.value)} placeholder="ABCDE1234F" />
                    </FormField>
                    <FormField label="Govt Registration ID" hint="University Recognition Number" horizontal={false}>
                      <input className="input-premium" value={settings.registrationId} onChange={e => update('registrationId', e.target.value)} placeholder="REG-2024-XXXX" />
                    </FormField>
                  </div>
                </div>
              </SettingsCard>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="animate-fade-in">
              <SectionHeader title="Governance & Access" subtitle="Control the security envelope of your institutional instance." icon={ShieldCheck} />
              <SettingsCard>
                <FormField label="Role Management Hub" hint="Calibrate custom permissions and module visibility per role.">
                  <button className="btn-ghost" onClick={() => window.location.href='/settings/roles'} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px' }}>
                    <Lock size={16} /> Open RBAC Manager
                  </button>
                </FormField>
                <FormField label="Requirement for Multi-Factor (MFA)" hint="Enforce mandatory 2FA for all administrative accounts.">
                  <Toggle value={settings.requireMfa} onChange={() => update('requireMfa', !settings.requireMfa)} />
                </FormField>
                <FormField label="Real-time Audit Logs" hint="Detailed archival of every system state change.">
                  <Toggle value={settings.auditLogs} onChange={() => update('auditLogs', !settings.auditLogs)} />
                </FormField>
                <FormField label="Session Intelligence" hint="Duration of inactivity before automated logoff.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="number" className="input-premium" style={{ width: '80px', textAlign: 'center' }} value={settings.sessionTimeoutMins} onChange={e => update('sessionTimeoutMins', e.target.value)} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Minutes</span>
                  </div>
                </FormField>
              </SettingsCard>
            </div>
          )}

          {activeTab === 'aesthetics' && (
            <div className="animate-fade-in">
              <SectionHeader title="Visual Framework" subtitle="Customize the interface to match your institutional branding." icon={Palette} />
              <SettingsCard>
                <FormField label="Global Visual Theme" hint="Select the primary UI tone for the campus portal.">
                  <select className="input-premium" style={{ width: '160px' }} value={settings.theme} onChange={e => update('theme', e.target.value)}>
                    <option value="light">University Light (Classic)</option>
                    <option value="dark">Professional Dark (Sleek)</option>
                  </select>
                </FormField>
                <FormField label="Brand Primary Color" hint="Select the signature accent color for your institution.">
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['#0f172a', '#2563eb', '#10b981', '#b91c1c', '#7c3aed', '#f59e0b'].map(c => (
                      <div key={c} onClick={() => update('accentColor', c)} style={{
                        width: '32px', height: '32px', borderRadius: '10px', background: c, cursor: 'pointer',
                        border: settings.accentColor === c ? '3px solid #fff' : 'none',
                        boxShadow: settings.accentColor === c ? `0 0 0 2px ${c}` : '0 1px 2px rgba(0,0,0,0.1)',
                        transform: settings.accentColor === c ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }} />
                    ))}
                  </div>
                </FormField>
                <FormField label="Communication Channels" hint="Enable automated system-to-user reporting systems.">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Toggle value={settings.emailNotifs} onChange={() => update('emailNotifs', !settings.emailNotifs)} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Email Delivery</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Toggle value={settings.smsNotifs} onChange={() => update('smsNotifs', !settings.smsNotifs)} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>SMS Gateway Integration</span>
                    </div>
                  </div>
                </FormField>
              </SettingsCard>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="animate-fade-in">
              <SectionHeader title="Data & Maintenance" subtitle="Configure archival policies and automated backup frameworks." icon={Database} />
              <SettingsCard>
                <FormField label="Cloud Backup Engine" hint="Nightly synchronization of database states to secure off-site clusters.">
                  <Toggle value={settings.autoBackup} onChange={() => update('autoBackup', !settings.autoBackup)} />
                </FormField>
                <FormField label="Compliance Retention" hint="Duration (in years) to maintain legacy student and finance records.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="number" className="input-premium" style={{ width: '80px', textAlign: 'center' }} value={settings.dataRetentionYears} onChange={e => update('dataRetentionYears', e.target.value)} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Academic Years</span>
                  </div>
                </FormField>
                <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <AlertCircle size={20} color="var(--error-color)" />
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--error-color)' }}>Danger Zone</p>
                      <p style={{ margin: '4px 0 16px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>These actions are destructive and cannot be reversed. Exercise extreme caution.</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-ghost" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--error-color)', fontSize: '0.85rem' }}>
                          <RefreshCcw size={14} style={{ marginRight: '6px' }} /> Clear System Cache
                        </button>
                        <button className="btn-ghost" style={{ background: 'var(--error-color)', color: '#fff', border: 'none', fontSize: '0.85rem' }}>
                          <Trash2 size={14} style={{ marginRight: '6px' }} /> Factory Reset Instance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;
