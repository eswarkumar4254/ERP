import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Bell, Moon, 
  HelpCircle, LogOut, ChevronRight, Activity 
} from 'lucide-react';
import './Settings.css';
import api from '../api';

const Settings = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/students/me');
        setStudent(response.data);
      } catch (err) {
        console.error('Settings data fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading Settings...</div>;
  if (!student) return <div className="error">Profile not found</div>;

  return (
    <div className="settings-stage fade-up">
      <div className="page-header-v2">
         <h1>Institutional Account</h1>
         <p className="text-muted">Manage your digital identity, security protocols, and system preferences.</p>
      </div>

      <div className="settings-grid">
         {/* 👤 Identity Hub */}
         <div className="card-premium identity-hub">
            <div className="hub-top">
               <div className="hub-avatar">{student.first_name[0]}{student.last_name[0]}</div>
               <div className="hub-info">
                  <h2>{student.first_name} {student.last_name}</h2>
                  <span className="badge-premium">{student.enrollment_number}</span>
               </div>
            </div>
            <div className="hub-meta">
               <div className="meta-pair">
                  <span className="m-label">Program</span>
                  <p className="m-val">{student.program_name || 'B.Tech CS'}</p>
               </div>
               <div className="meta-pair">
                  <span className="m-label">Active Since</span>
                  <p className="m-val">Aug 2024</p>
               </div>
            </div>
            <button className="btn-action w-full" style={{ marginTop: '1.5rem' }}>Update Academic Profile</button>
         </div>

         {/* 🛠️ Preference Center */}
         <div className="preference-sections">
            <div className="card-premium sett-item">
               <div className="sett-icon blue"><Shield size={20} /></div>
               <div className="sett-body">
                  <h3>Security & Access</h3>
                  <p>MFA, Password cycles, and Active sessions</p>
               </div>
               <ChevronRight size={18} className="sett-arrow" />
            </div>

            <div className="card-premium sett-item">
               <div className="sett-icon purple"><Bell size={20} /></div>
               <div className="sett-body">
                  <h3>Intelligence Feed</h3>
                  <p>Broadcasts, SMS alerts, and App notifications</p>
               </div>
               <ChevronRight size={18} className="sett-arrow" />
            </div>

            <div className="card-premium sett-item toggle">
               <div className="sett-icon orange"><Moon size={20} /></div>
               <div className="sett-body">
                  <h3>Appearance Mode</h3>
                  <p>Dark environment for long study sessions</p>
               </div>
               <div className="sett-toggle active"><div className="t-dot"></div></div>
            </div>

            <div className="card-premium sett-item">
               <div className="sett-icon green"><Activity size={20} /></div>
               <div className="sett-body">
                  <h3>Usage Analytics</h3>
                  <p>Track your system activity and portal engagement</p>
               </div>
               <ChevronRight size={18} className="sett-arrow" />
            </div>

            <div className="card-premium sett-item logout" onClick={() => {
               localStorage.clear();
               window.location.href = '/login';
            }}>
               <div className="sett-icon red"><LogOut size={20} /></div>
               <div className="sett-body">
                  <h3>Terminate Session</h3>
                  <p>Perform a secure logout from the institutional portal</p>
               </div>
               <ChevronRight size={18} className="sett-arrow" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
