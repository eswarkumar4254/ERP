import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Activity, AlertCircle, FileSpreadsheet, ChevronRight } from 'lucide-react';
import api from '../api';
import './Attendance.css';

const Attendance = () => {
    const [stats, setStats] = useState({ total: '94.5%', threshold: '75%', streak: '12 Days' });

    // Mock attendance data for heatmap (30 days)
    const attendanceData = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        status: Math.random() > 0.1 ? 'present' : 'absent'
    }));

    return (
        <div className="attendance-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>Attendance Registry Intelligence</h1>
                    <p className="subtitle">Real-time heatmap of your institutional presence.</p>
                </div>
                <button className="btn-premium"><FileSpreadsheet size={18} /> Detailed Report</button>
            </header>

            <div className="stats-strip">
                <div className="stat-card card-premium">
                    <div className="stat-header">
                        <Activity size={18} color="var(--primary)" />
                        <span>Cumulative Presence</span>
                    </div>
                    <h2>{stats.total}</h2>
                    <div className={`status-indicator ${parseFloat(stats.total) >= 75 ? 'safe' : 'risk'}`}>
                        {parseFloat(stats.total) >= 75 ? 'Institutional Standing: Safe' : 'Institutional Risk: High'}
                    </div>
                </div>
                <div className="stat-card card-premium">
                    <div className="stat-header">
                        <AlertCircle size={18} color="#ef4444" />
                        <span>Registry Threshold</span>
                    </div>
                    <h2>{stats.threshold}</h2>
                    <p>Minimum required for sessional eligibility.</p>
                </div>
                <div className="stat-card card-premium">
                    <div className="stat-header">
                        <CalendarIcon size={18} color="#7c3aed" />
                        <span>Presence Streak</span>
                    </div>
                    <h2>{stats.streak}</h2>
                    <p>Maintaining high consistency.</p>
                </div>
            </div>

            <div className="heatmap-nexus card-premium">
                <div className="nexus-header">
                    <h3>October Presence Grid</h3>
                    <div className="legend">
                        <div className="l-item"><div className="dot p"></div> Present</div>
                        <div className="l-item"><div className="dot a"></div> Absent</div>
                        <div className="l-item"><div className="dot n"></div> No Class</div>
                    </div>
                </div>
                <div className="heatmap-grid">
                    {attendanceData.map((data) => (
                        <div key={data.day} className={`day-box ${data.status}`} title={`Oct ${data.day}: ${data.status}`}>
                            {data.day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="course-breakdown card-premium">
                <h3>Departmental Breakdown</h3>
                <div className="break-list">
                    <div className="break-item">
                        <div className="b-info">
                            <h4>Cloud Architecture (CS-401)</h4>
                            <div className="p-bar"><div className="p-fill" style={{ width: '96%' }}></div></div>
                        </div>
                        <span className="b-val">96%</span>
                        <ChevronRight className="arrow" size={16} />
                    </div>
                    <div className="break-item">
                        <div className="b-info">
                            <h4>Graph Theory (CS-302)</h4>
                            <div className="p-bar"><div className="p-fill" style={{ width: '88%' }}></div></div>
                        </div>
                        <span className="b-val">88%</span>
                        <ChevronRight className="arrow" size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
