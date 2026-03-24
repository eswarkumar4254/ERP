import React from 'react';

const Placeholder = ({ title, description }) => {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
      
      <div className="card" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '1px dashed var(--border-color)', background: 'transparent' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Module in Development 🚧</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '1rem auto' }}>
            This capability ({title}) is scheduled for development in the upcoming phases of the ERP rollout plan.
          </p>
          <button className="btn">Set up Email Alert</button>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
