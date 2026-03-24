import React from 'react';
import { Fingerprint, Wifi, Map, Eye, Power, Thermometer, UserCheck, ShieldAlert, WifiOff, MapPin } from 'lucide-react';

const SmartCampus = () => {
  const devices = [
    { name: 'Gate 1 RFID Scanner', location: 'Main Entrance', status: 'Online', signal: 'Strong', battery: '100%' },
    { name: 'Library Entry Sensor', location: 'Section B', status: 'Online', signal: 'Medium', battery: '82%' },
    { name: 'Hostel A Biometric', location: 'Foyer', status: 'Off-line', signal: 'None', battery: '0%' },
    { name: 'Lab 4 Occupancy', location: 'Science Block', status: 'Online', signal: 'Strong', battery: '95%' },
  ];

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient">Smart Campus (IoT)</h1>
          <p>Real-time institutional connectivity, RFID attendance, and biometric security monitoring.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Map size={18} /> View Campus Map</button>
          <button className="btn-premium">Provision New Edge Node</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="glass-pane" style={{ borderRadius: '24px', padding: '1.5rem' }}>
           <h3 style={{ margin: '0 0 1.5rem' }}>Device Connectivity Mesh</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {devices.map((d, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                         <div style={{ 
                            width: '44px', height: '44px', borderRadius: '12px', 
                            background: d.status === 'Online' ? 'var(--secondary-glow)' : 'var(--primary-glow)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                         }}>
                            {d.status === 'Online' ? <Wifi size={20} color="var(--secondary-color)" /> : <WifiOff size={20} color="var(--error-color)" />}
                         </div>
                         <div>
                            <h4 style={{ margin: 0 }}>{d.name}</h4>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {d.location}</span>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Power size={12} /> {d.battery}</span>
                            </div>
                         </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            color: d.status === 'Online' ? 'var(--secondary-color)' : 'var(--error-color)',
                            background: d.status === 'Online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '4px 10px',
                            borderRadius: '20px'
                         }}>{d.status.toUpperCase()}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)' }}>
              <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><UserCheck size={20} /> Real-time Footfall</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Students on Campus</p>
                    <h2 style={{ margin: '5px 0', fontSize: '2.5rem' }}>2,442</h2>
                    <span style={{ color: 'var(--secondary-color)', fontSize: '0.8rem', fontWeight: 600 }}>↑ 12% vs last hour</span>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                       <Thermometer size={18} color="var(--primary-color)" />
                       <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 700 }}>24°C</p>
                       <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>Library Temp</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                       <Power size={18} color="var(--secondary-color)" />
                       <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 700 }}>882 kWh</p>
                       <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>Campus Usage</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card" style={{ borderLeft: '4px solid var(--error-color)' }}>
              <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={20} color="var(--error-color)" /> Intrusion Alert</h3>
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px' }}>
                 <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>Unverified RFID Access Attempt</p>
                 <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}><b>Device:</b> Server Room Gate<br/><b>Timestamp:</b> 21:14:02</p>
              </div>
              <button className="btn-premium" style={{ width: '100%', marginTop: '1rem', background: 'var(--error-color)', boxShadow: 'none' }}>Dispatch Security</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCampus;
