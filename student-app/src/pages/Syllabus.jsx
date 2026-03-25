import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, ChevronDown, ListTodo, Trophy, Rocket, Target } from 'lucide-react';
import api from '../api';
import './Syllabus.css';

const Syllabus = () => {
    const [syllabus, setSyllabus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const response = await api.get('/extra/academics/syllabus/1'); // Mocked course_id 1
                setSyllabus(response.data);
            } catch (err) {
                console.error('Failed to fetch syllabus', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSyllabus();
    }, []);

    const completedCount = syllabus.filter(m => m.is_completed).length;
    const totalCount = syllabus.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    if (loading) return <div className="loading">Analyzing curriculum deliverables...</div>;

    return (
        <div className="syllabus-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>Syllabus Progress Tracker</h1>
                    <p className="subtitle">Real-time delivery audit for your Cloud Architecture course.</p>
                </div>
                <div className="progress-badge">
                    <Rocket size={18} />
                    <span>{Math.round(progressPercent)}% Delivered</span>
                </div>
            </header>

            <div className="syllabus-overview">
                <main className="module-list card-premium">
                    <div className="list-header">
                        <h3>Departmental Modules</h3>
                        <span>{completedCount} of {totalCount} units validated</span>
                    </div>
                    
                    <div className="modules-stack">
                        {syllabus.map((item, idx) => (
                            <div className={`module-item ${item.is_completed ? 'completed' : ''}`} key={item.module.id}>
                                <div className="m-num">0{idx + 1}</div>
                                <div className="m-icon">
                                    {item.is_completed ? <CheckCircle size={20} color="#22c55e" /> : <Circle size={20} color="rgba(0,0,0,0.1)" />}
                                </div>
                                <div className="m-info">
                                    <h4>{item.module.name}</h4>
                                    <p>{item.module.description}</p>
                                </div>
                                <div className="m-status">
                                    {item.is_completed ? 'Validated' : 'Pending Delivery'}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="performance-nexus">
                    <div className="nexus-card card-premium">
                        <Target size={24} color="var(--primary)" />
                        <h4>Academic Goal</h4>
                        <p>Complete 12 modules by end of semester to stay in the 98th percentile.</p>
                        <div className="p-bar-large"><div className="p-fill" style={{ width: `${progressPercent}%` }}></div></div>
                    </div>

                    <div className="nexus-card card-premium">
                        <Trophy size={24} color="#f59e0b" />
                        <h4>Institutional Standing</h4>
                        <p>You are ahead of 84% of your peers in Cloud Architecture.</p>
                        <button className="btn-ghost">View Leaderboard</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Syllabus;
