import React, { useState } from 'react';
import { 
  Code2, Key, Globe, BookOpen, 
  Terminal, Copy, Check, ShieldCheck, 
  Zap, Activity, ChevronRight, Share2,
  Lock, Cpu, ExternalLink, Plus
} from 'lucide-react';

const DeveloperPortal = () => {
  const [copied, setCopied] = useState(false);
  const apiKey = 'erp_live_ak_7729x_bk992_q001_nextgen';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoints = [
    { method: 'GET', path: '/api/v1/students', desc: 'Retrieve paginated student records', auth: 'Bearer' },
    { method: 'POST', path: '/api/v1/admissions', desc: 'Submit new application payload', auth: 'Bearer' },
    { method: 'GET', path: '/api/v1/finance/reports', desc: 'Institutional financial ledger export', auth: 'Admin Only' },
    { method: 'PUT', path: '/api/v1/workflows/{id}', desc: 'Update approval workflow definition', auth: 'Bearer' },
    { method: 'DELETE', path: '/api/v1/documents/{id}', desc: 'Secure document removal from vault', auth: 'Admin Only' },
  ];

  const methodColors = {
    GET: 'var(--secondary-color)',
    POST: 'var(--primary-color)',
    PUT: 'var(--accent-color)',
    DELETE: 'var(--error-color)',
  };

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0 }}>Developer Platform</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
            Build custom integrations and extend the ERP ecosystem with our enterprise-grade REST APIs and webhooks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} /> Documentation
          </button>
          <button className="btn-premium" style={{ padding: '10px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Generate API Key
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Active API Keys', value: '1 / 10', icon: Key, color: 'var(--primary-color)' },
          { label: 'Monthly Requests', value: '142.5K', icon: Activity, color: 'var(--secondary-color)' },
          { label: 'Webhook Nodes', value: '4 Active', icon: Terminal, color: 'var(--accent-color)' },
          { label: 'Avg Latency', value: '42ms', icon: Zap, color: '#ec4899' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', background: `${stat.color}15`, borderRadius: '12px' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>METERED</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* API Key Block */}
      <div className="glass-pane" style={{ borderRadius: '24px', padding: '2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'var(--primary-glow)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.1 }} />
        <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
          <Lock size={22} color="var(--primary-color)" /> Primary Production Gateway
        </h3>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ margin: '0 0 10px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>LIVE PRODUCTION KEY</p>
            <code style={{ fontSize: '1.3rem', color: 'var(--primary-color)', fontWeight: 900, letterSpacing: '0.03em' }}>{apiKey}</code>
          </div>
          <button className="btn-premium" onClick={copyToClipboard} style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: '160px', justifyContent: 'center', padding: '12px 24px' }}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'KEY COPIED' : 'COPY KEY'}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="var(--secondary-color)" />
          Full Read/Write access across all 24 institutional nodes. Rotate every 90 days for security compliance.
        </p>
      </div>

      {/* API Reference + Sandbox */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem' }}>
        <div className="glass-pane" style={{ borderRadius: '24px', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
            <Globe size={20} /> REST API Reference
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {endpoints.map((ep, i) => (
              <div key={i} style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 900, padding: '3px 10px', borderRadius: '6px',
                    background: `${methodColors[ep.method]}20`,
                    color: methodColors[ep.method],
                    minWidth: '56px', textAlign: 'center', letterSpacing: '0.05em'
                  }}>{ep.method}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700 }}>{ep.path}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.73rem', color: 'var(--text-muted)' }}>{ep.desc}</p>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
          <button className="btn-ghost" style={{ width: '100%', marginTop: '1.5rem', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            View Full API Blueprint <ExternalLink size={14} />
          </button>
        </div>

        {/* Sandbox */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)', padding: '2.5rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Cpu size={28} color="var(--primary-color)" />
          </div>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.4rem', fontWeight: 800 }}>Developer Sandbox</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem' }}>
            Experiment with the institutional mesh in a risk-free isolated environment. Dedicated staging containers provisioned per-tenant for seamless integration testing.
          </p>
          <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <span style={{ color: 'var(--primary-color)' }}>curl</span>{' '}
            -X GET <span style={{ color: 'var(--secondary-color)' }}>"/v1/health"</span> \<br />
            &nbsp;&nbsp;-H <span style={{ color: 'var(--accent-color)' }}>"X-API-KEY: {apiKey[0]}...{apiKey.slice(-4)}"</span><br />
            <br />
            <span style={{ color: 'var(--secondary-color)', fontWeight: 800 }}>// Response: 200 OK</span><br />
            <span style={{ color: 'var(--text-muted)' }}>{'{'} "status": "operational", "nodes": 24 {'}'}</span>
          </div>
          <button className="btn-premium" style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '14px' }}>
            Launch Sandbox Console
          </button>
          <button className="btn-ghost" style={{ width: '100%', padding: '12px', borderRadius: '14px', marginTop: '12px' }}>
            <BookOpen size={16} style={{ marginRight: '8px' }} /> Read SDK Docs
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
