import React from 'react';
import { 
  HeartPulse, Cpu, Database, Network, 
  HardDrive, BarChart3, Activity, ShieldCheck, 
  RefreshCw, AlertTriangle, Clock, Zap,
  Server, Shield
} from 'lucide-react';

const SystemHealth = () => {
  const services = [
    { name: 'Identity Provider (JWT)', status: 'Operational', latency: '4ms', load: '12%', up: '99.99%', color: 'var(--secondary-color)' },
    { name: 'Core API Engine', status: 'Operational', latency: '18ms', load: '24%', up: '99.98%', color: 'var(--secondary-color)' },
    { name: 'Redis Cache Layer', status: 'Operational', latency: '0.8ms', load: '8%', up: '100%', color: 'var(--secondary-color)' },
    { name: 'PostgreSQL Database', status: 'Operational', latency: '32ms', load: '45%', up: '99.95%', color: 'var(--secondary-color)' },
    { name: 'Celery Task Worker', status: 'In Stress', latency: '850ms', load: '88%', up: '98.50%', color: 'var(--accent-color)' },
    { name: 'Storage Gateway', status: 'Operational', latency: '12ms', load: '15%', up: '99.99%', color: 'var(--secondary-color)' },
  ];

  return (
    <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900 }}>System Observability</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>Real-time institutional infrastructure monitoring and performance telemetry.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="glass-pane" style={{ padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)' }}>
               <Activity size={14} /> LIVE REPLICAS OK
            </div>
            <button className="btn-ghost" style={{ padding: '10px', borderRadius: '50%' }}><RefreshCw size={20} /></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Cloud CPU Cluster', value: '32%', icon: Cpu, color: 'var(--primary-color)' },
          { label: 'Storage Mesh', value: '18%', icon: HardDrive, color: 'var(--secondary-color)' },
          { label: 'Network Latency', value: '42ms', icon: zapIcon, color: 'var(--accent-color)' },
          { label: 'Auth Integrity', value: '100%', icon: ShieldCheck, color: '#ec4899' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {stat.icon === zapIcon ? <Zap size={20} color={stat.color} /> : <stat.icon size={20} color={stat.color} />}
                </div>
                <div style={{ height: '8px', width: '8px', borderRadius: '50%', background: stat.color, boxShadow: `0 0 10px ${stat.color}` }} />
             </div>
             <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</p>
             <h2 style={{ margin: '4px 0 0', fontSize: '1.8rem' }}>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="glass-pane" style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <table style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Strategic Service</th>
              <th>Status</th>
              <th>Metric Latency</th>
              <th>Resource Saturation</th>
              <th>Uptime SLA (30d)</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                    <span style={{ fontWeight: 700 }}>{s.name}</span>
                  </div>
                </td>
                <td><span className="badge-premium" style={{ background: `${s.color}15`, color: s.color }}>{s.status.toUpperCase()}</span></td>
                <td><code style={{ fontSize: '0.85rem' }}>{s.latency}</code></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="progress-track" style={{ width: '100px' }}>
                      <div className="progress-fill" style={{ width: s.load, background: s.color }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{s.load}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{s.up}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--error-color)', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}><AlertTriangle size={24} color="var(--error-color)" /> Critical Incidents (1)</h3>
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
             <Clock size={20} color="var(--error-color)" style={{ marginTop: '4px' }} />
             <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Regional Congestion: Node-LDN-1</p>
                <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                   Worker clusters in the London region are experiencing high saturation during bulk report generation. Automated scaling initiated.
                </p>
             </div>
          </div>
          <button className="btn-premium" style={{ width: '100%', marginTop: '2rem', background: 'var(--error-color)', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)' }}>Scale Cluster Manually</button>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem' }}><ShieldCheck size={24} color="var(--secondary-color)" /> Security Compliance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             {[
                { label: 'SSL Protocol', val: 'Active (v1.3)', icon: Shield },
                { label: 'MFA Coverage', val: '98.4%', icon: Server },
                { label: 'Threats Blocked', val: '142 IP/Day', icon: AlertTriangle },
                { label: 'Firewall Rule', val: 'Cloud-WAF Active', icon: ShieldCheck },
             ].map((sec, idx) => (
                <div key={idx} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>{sec.label}</p>
                   <p style={{ margin: '8px 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{sec.val}</p>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const zapIcon = {};

export default SystemHealth;
