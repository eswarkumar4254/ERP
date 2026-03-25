import React, { useState, useEffect } from 'react';
import { MessageSquare, LifeBuoy, Send, ShieldAlert, History, Filter, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';
import './Support.css';

const Support = () => {
    const [grievances, setGrievances] = useState([]);
    const [category, setCategory] = useState('academic');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchGrievances = async () => {
        try {
            const response = await api.get('/extra/support/grievances');
            setGrievances(response.data);
        } catch (err) {
            console.error('Failed to fetch grievances', err);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/extra/support/grievances', { category, subject, description });
            setSubject('');
            setDescription('');
            fetchGrievances();
        } catch (err) {
            console.error('Submission failed', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="support-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>Institutional Support Desk</h1>
                    <p className="subtitle">Securely report academic, facility, or technical grievances.</p>
                </div>
                <button className="btn-premium"><LifeBuoy size={18} /> Global Helpdesk</button>
            </header>

            <div className="support-grid">
                <main className="form-base card-premium">
                    <h3>Report New Institutional Grievance</h3>
                    <form className="grievance-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Context Category</label>
                            <div className="category-select">
                                {['academic', 'facility', 'technical', 'finance'].map(cat => (
                                    <button 
                                        type="button" 
                                        key={cat} 
                                        className={`cat-pill ${category === cat ? 'active' : ''}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Subject / Ticket Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Hostels: Washroom maintenance" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Detailed Description</label>
                            <textarea 
                                rows="6" 
                                placeholder="Describe the issue in detail for institutional audit..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button className="btn-action w-full" type="submit" disabled={submitting}>
                            {submitting ? 'Authenticating Submission...' : 'Transmit Grievance Ticket'} <Send size={18} />
                        </button>
                    </form>
                </main>

                <aside className="grievance-history">
                    <div className="section-header-mini">
                        <History size={18} />
                        <h3>Institutional Audit Log</h3>
                    </div>
                    <div className="history-list">
                        {grievances.map((g) => (
                            <div className="history-item card-premium" key={g.id}>
                                <div className="h-head">
                                    <span className={`status-tag ${g.status}`}>{g.status.toUpperCase()}</span>
                                    <span className="priority-tag">{g.priority} PRIORITY</span>
                                </div>
                                <h4>{g.subject}</h4>
                                <p className="h-desc">{g.description.substring(0, 80)}...</p>
                                <div className="h-footer">
                                    <span className="h-date">{new Date(g.created_at).toLocaleDateString()}</span>
                                    {g.status === 'resolved' ? <CheckCircle size={14} color="#22c55e" /> : <ShieldAlert size={14} color="#f59e0b" />}
                                </div>
                            </div>
                        ))}
                        {grievances.length === 0 && <div className="empty-state">No active grievance logs found in the registry.</div>}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Support;
