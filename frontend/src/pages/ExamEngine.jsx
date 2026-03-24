import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Clock, AlertTriangle, CheckCircle2, 
  ChevronRight, ChevronLeft, HelpCircle, Save, Send
} from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

const ExamEngine = () => {
  const [exams, setExams] = useState([]);
  const [activeExam, setActiveExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examStatus, setExamStatus] = useState('list'); // list, taking, finished
  const [finalScore, setFinalScore] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API}/exams/`, { headers });
      setExams(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const startExam = async (exam) => {
    try {
      // 1. Fetch questions
      const qRes = await axios.get(`${API}/exams/${exam.id}/questions`, { headers });
      if (qRes.data.length === 0) {
        alert("This exam has no questions yet.");
        return;
      }
      setQuestions(qRes.data);
      
      // 2. Create attempt (assuming student_id=1 for demo or from token)
      const attemptRes = await axios.post(`${API}/exams/attempts`, { 
        exam_id: exam.id, 
        student_id: 1 // In real app, get from auth context
      }, { headers });
      
      setAttemptId(attemptRes.data.id);
      setActiveExam(exam);
      setExamStatus('taking');
      setCurrentIndex(0);
      setAnswers({});
    } catch (e) {
      console.error(e);
      alert("Failed to start exam.");
    }
  };

  const submitAnswer = async (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    try {
      await axios.post(`${API}/exams/attempts/answers`, {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option: option
      }, { headers });
    } catch (e) { console.error("Auto-save failed", e); }
  };

  const finishExam = async () => {
    if (!window.confirm("Are you sure you want to submit your answers?")) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API}/exams/attempts/${attemptId}/finish`, {}, { headers });
      setFinalScore(res.data.score);
      setExamStatus('finished');
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (examStatus === 'list') {
    return (
      <div>
        <div className="page-header">
          <h1>Digital Examination Hall</h1>
          <p>Access your scheduled internal and external online examinations.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {exams.map(ex => (
            <div key={ex.id} className="card lms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge" style={{ background: '#6366f122', color: '#6366f1' }}>{ex.type}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Clock size={14} /> 60 Mins
                  </div>
                </div>
                <h3 style={{ margin: '0 0 0.5rem' }}>{ex.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {ex.subject} — Scheduled for {new Date(ex.date).toLocaleDateString()}
                </p>
                <div style={{ padding: '0.75rem', background: 'var(--surface-color-light)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={16} color="#f59e0b" />
                  Read all instructions before starting. No tabs switch allowed.
                </div>
              </div>
              <button 
                className="btn" 
                onClick={() => startExam(ex)}
                style={{ marginTop: '1.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Enter Exam Hall <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (examStatus === 'taking') {
    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>{activeExam.title}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 'bold' }}>
              <Clock size={18} /> 45:12 Remaining
            </div>
          </div>
        </div>

        <div className="progress-track" style={{ marginBottom: '2rem' }}>
          <div className="progress-fill" style={{ width: `${progress}%`, background: '#6366f1' }} />
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2rem' }}>{q.question_text}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['a', 'b', 'c', 'd'].map(opt => {
              const optText = q[`option_${opt}`];
              if (!optText) return null;
              const isSelected = answers[q.id] === opt;
              return (
                <div 
                  key={opt}
                  onClick={() => submitAnswer(q.id, opt)}
                  style={{ 
                    padding: '1.25rem', border: `1px solid ${isSelected ? '#6366f1' : 'var(--border-color)'}`,
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem',
                    background: isSelected ? '#6366f111' : 'transparent', transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', border: '2px solid',
                    borderColor: isSelected ? '#6366f1' : 'var(--border-color)',
                    background: isSelected ? '#6366f1' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 'bold'
                  }}>
                    {opt.toUpperCase()}
                  </div>
                  <span>{optText}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn" 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            style={{ padding: '10px 24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <ChevronLeft size={18} /> Previous
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button className="btn" onClick={finishExam} style={{ padding: '10px 32px', background: '#ef4444' }}>
              Submit Exam <Send size={16} />
            </button>
          ) : (
            <button className="btn" onClick={() => setCurrentIndex(currentIndex + 1)} style={{ padding: '10px 32px' }}>
              Next Question <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (examStatus === 'finished') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ padding: '2rem', background: '#10b98122', borderRadius: '50%', marginBottom: '2rem' }}>
          <CheckCircle2 size={64} color="#10b981" />
        </div>
        <h1 style={{ margin: '0 0 1rem' }}>Exam Submitted Successfully!</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
          Great job! Your responses have been recorded and graded automatically. You can view the final result below.
        </p>
        <div className="card" style={{ minWidth: '300px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem' }}>Score Obtained</p>
          <h2 style={{ fontSize: '3.5rem', margin: 0, color: '#10b981' }}>{finalScore}</h2>
          <p style={{ margin: '0.5rem 0 0', fontWeight: 600 }}>Total Marks</p>
        </div>
        <button className="btn" onClick={() => setExamStatus('list')} style={{ marginTop: '2.5rem' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return null;
};

export default ExamEngine;
