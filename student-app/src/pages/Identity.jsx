import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, CreditCard, Coffee, Library, MapPin, Share2, Download } from 'lucide-react';
import api from '../api';
import './Identity.css';

const Identity = () => {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/students/me');
                setStudent(response.data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    if (!student) return <div className="loading">Generating secure identity...</div>;

    return (
        <div className="identity-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>Digital Student Multi-pass</h1>
                    <p className="subtitle">Institutional identity with unified campus access control.</p>
                </div>
                <button className="btn-premium"><Download size={18} /> Export Pass</button>
            </header>

            <div className="identity-grid">
                <div className="id-card-visual card-premium">
                    <div className="id-card-header">
                        <div className="univ-logo-s">N</div>
                        <div className="univ-name-s">{student.university_name}</div>
                        <div className="verified-chip"><ShieldCheck size={14} /> Verified</div>
                    </div>
                    
                    <div className="id-card-body">
                        <div className="id-portrait">
                            <div className="portrait-circle">{student.first_name[0]}{student.last_name[0]}</div>
                        </div>
                        <div className="id-info">
                            <h2 className="p-name">{student.first_name} {student.last_name}</h2>
                            <p className="p-role">Authorized Student</p>
                            <div className="id-data-grid">
                                <div className="id-data">
                                    <span className="label">ENROLLMENT</span>
                                    <span className="value">{student.enrollment_number}</span>
                                </div>
                                <div className="id-data">
                                    <span className="label">BRANCH</span>
                                    <span className="value">{student.branch}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="id-card-qr">
                        <div className="qr-box">
                           <QrCode size={120} strokeWidth={1} />
                        </div>
                        <p className="qr-uid">UID: 9482-AD82-XP92</p>
                    </div>
                </div>

                <div className="access-nexus">
                    <h3>Access Nexus Intelligence</h3>
                    <div className="nexus-list">
                        <div className="nexus-item card-premium">
                            <div className="nexus-icon blue"><Library size={20} /></div>
                            <div className="nexus-body">
                                <h4>Library & Archives</h4>
                                <p>Entry Permitted • Check-out Active</p>
                            </div>
                            <div className="status-dot online"></div>
                        </div>
                        <div className="nexus-item card-premium">
                            <div className="nexus-icon green"><Coffee size={20} /></div>
                            <div className="nexus-body">
                                <h4>Cafeteria & Mess</h4>
                                <p>Wallet: ₹{student.wallet_balance.toLocaleString()} • Active</p>
                            </div>
                            <div className="status-dot online"></div>
                        </div>
                        <div className="nexus-item card-premium">
                            <div className="nexus-icon purple"><CreditCard size={20} /></div>
                            <div className="nexus-body">
                                <h4>Fee Clearance</h4>
                                <p>Next Due: 28th Oct • Standing OK</p>
                            </div>
                            <div className="status-dot online"></div>
                        </div>
                        <div className="nexus-item card-premium">
                            <div className="nexus-icon orange"><MapPin size={20} /></div>
                            <div className="nexus-body">
                                <h4>Gate Entry (Main)</h4>
                                <p>Security Scan Required • Access Allowed</p>
                            </div>
                            <div className="status-dot online"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Identity;
