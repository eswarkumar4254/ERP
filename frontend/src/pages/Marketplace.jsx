import React, { useState } from 'react';
import { ShoppingBag, Search, ExternalLink, CheckCircle, Star, Filter, Boxes, LayoutGrid } from 'lucide-react';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('all');

  const apps = [
    { name: 'Zoom Meetings', category: 'Virtual Classroom', price: 'Enterprise Plan', rating: 4.8, reviews: 1240, img: 'https://cdn-icons-png.flaticon.com/512/3670/3670246.png', status: 'Connected' },
    { name: 'Google Workspace', category: 'Collaboration', price: 'Included', rating: 4.9, reviews: 8500, img: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', status: 'Connected' },
    { name: 'Microsoft Teams', category: 'Communication', price: 'Add-on', rating: 4.5, reviews: 2100, img: 'https://cdn-icons-png.flaticon.com/512/732/732245.png', status: 'Connect' },
    { name: 'Turnitin AI', category: 'Academic Integrity', price: 'Subscription', rating: 4.7, reviews: 900, img: 'https://cdn-icons-png.flaticon.com/512/471/471012.png', status: 'Connect' },
    { name: 'Stripe Payments', category: 'Finance', price: 'Usage-based', rating: 5.0, reviews: 500, img: 'https://cdn-icons-png.flaticon.com/512/5968/5968382.png', status: 'Connected' },
    { name: 'Coursera LMS', category: 'Content Provider', price: 'Institutional', rating: 4.6, reviews: 3200, img: 'https://cdn-icons-png.flaticon.com/512/825/825565.png', status: 'Connect' },
  ];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient">Neuraltrix Integration Marketplace</h1>
          <p>Extend your institutional capabilities with premium plugins and third-party integrations.</p>
        </div>
        <button className="btn-premium">Manage Ecosystem</button>
      </div>

      <div className="glass-pane" style={{ borderRadius: '24px', padding: '1rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={20} color="var(--text-muted)" style={{ marginLeft: '1rem' }} />
        <input 
          className="input-premium" 
          placeholder="Search for plugins (LMS, Payment, Communication, AI, etc.)" 
          style={{ border: 'none', background: 'transparent' }}
        />
        <button className="btn-ghost" style={{ display: 'flex', gap: '8px', alignItems: 'center', whiteSpace: 'nowrap' }}><Filter size={18} /> Filters</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['all', 'connected', 'classroom', 'finance', 'collaboration'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'var(--primary-glow)' : 'transparent', 
              border: activeTab === tab ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', 
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {apps.map((app, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <img src={app.img} alt={app.name} style={{ width: '56px', height: '56px', borderRadius: '12px' }} />
               {app.status === 'Connected' && <span className="badge-premium" style={{ color: 'var(--secondary-color)', background: 'var(--secondary-glow)' }}>CONNECTED</span>}
            </div>
            <div>
               <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{app.name}</h3>
               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.category}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
               <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={j < Math.floor(app.rating) ? '#f59e0b' : 'none'} />)}
               </div>
               <span style={{ fontWeight: 700 }}>{app.rating}</span>
               <span style={{ color: 'var(--text-muted)' }}>({app.reviews})</span>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
               <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{app.price}</span>
               <button className={app.status === 'Connected' ? 'btn-ghost' : 'btn-premium'} style={{ padding: '6px 16px', fontSize: '0.75rem' }}>
                 {app.status === 'Connected' ? 'Configure' : 'Connect'}
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginTop: '3rem', background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
         <div style={{ width: '80px', height: '80px', background: 'var(--primary-glow)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={40} color="var(--primary-color)" />
         </div>
         <div>
            <h2 style={{ margin: 0 }}>Missing an Integration?</h2>
            <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Use our Integration SDK to build your own connector or request a new plugin from the developer community.</p>
         </div>
         <button className="btn-premium" style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>Developer SDK</button>
      </div>
    </div>
  );
};

export default Marketplace;
