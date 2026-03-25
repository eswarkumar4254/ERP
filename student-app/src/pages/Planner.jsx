import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle2, Circle, Clock, Target, Trash2 } from 'lucide-react';
import api from '../api';
import './Planner.css';

const Planner = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/extra/planner/study-plans');
                setPlans(response.data);
            } catch (err) {
                console.error('Failed to fetch study plans', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <div className="loading">Optimizing your study schedule...</div>;

    return (
        <div className="planner-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>AI Study Planner</h1>
                    <p className="subtitle">Dynamic schedules analyzed from your upcoming deliverables.</p>
                </div>
                <button className="btn-premium">
                    <Plus size={18} /> Generate New Plan
                </button>
            </header>

            <div className="planner-grid">
                {plans.map((plan) => (
                    <div className="planner-card card-premium" key={plan.id}>
                        <div className="plan-meta">
                            <span className="badge-tag">Sessional Week</span>
                            <span className="plan-date"><Calendar size={14} /> {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}</span>
                        </div>
                        <h3>{plan.title}</h3>
                        
                        <div className="task-list">
                            {plan.tasks.map((task, idx) => (
                                <div className={`task-item ${task.done ? 'task-done' : ''}`} key={idx}>
                                    {task.done ? <CheckCircle2 size={18} className="icon-done" /> : <Circle size={18} className="icon-pending" />}
                                    <span>{task.title}</span>
                                    {!task.done && <span className="task-deadline">Due Tomorrow</span>}
                                </div>
                            ))}
                        </div>

                        <div className="plan-footer">
                            <div className="progress-mini">
                                <div className="p-bar">
                                    <div className="p-fill" style={{ width: `${(plan.tasks.filter(t => t.done).length / plan.tasks.length) * 100}%` }}></div>
                                </div>
                                <span>{Math.round((plan.tasks.filter(t => t.done).length / plan.tasks.length) * 100)}% Complete</span>
                            </div>
                            <button className="btn-icon-soft"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}

                <div className="add-plan-card card-premium ghost-card">
                   <Target size={40} strokeWidth={1} />
                   <h4>Analyze Next Milestone</h4>
                   <p>Sync with Exam Cell to generate your next sprint.</p>
                   <button className="btn-ghost">Sync Now</button>
                </div>
            </div>
        </div>
    );
};

export default Planner;
