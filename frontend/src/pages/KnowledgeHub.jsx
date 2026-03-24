import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    BookOpen, 
    Plus, 
    ChevronRight, 
    Layers, 
    FileText, 
    Database, 
    Info, 
    Settings as ConfigIcon,
    Trash2,
    CheckCircle2
} from 'lucide-react';

const KnowledgeHub = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showProgModal, setShowProgModal] = useState(false);
    const [showDeptModal, setShowDeptModal] = useState(false);
    const [showCurrModal, setShowCurrModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [expandedDept, setExpandedDept] = useState(null);

    const [newProg, setNewProg] = useState({ name: '', code: '', description: '' });
    const [newDept, setNewDept] = useState({ name: '', code: '', program_id: null });
    const [newCurr, setNewCurr] = useState({ 
        name: '', 
        code: '', 
        total_credits_required: 0, 
        structure: { semesters: [] },
        program_id: null 
    });

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${apiBase}/bulk-upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Catalogs synthesized successfully! Refreshing database...");
            fetchPrograms();
        } catch (err) {
            alert(err.response?.data?.detail || "Synthesis failed. Ensure PDF follows 'Program: ...' format.");
        } finally {
            setUploading(false);
        }
    };

    const token = localStorage.getItem('token');
    const apiBase = 'http://localhost:8000/api/v1/knowledge-hub';

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await axios.get(`${apiBase}/programs`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setPrograms(res.data);
            if (res.data.length > 0 && !selectedProgram) {
                handleSelectProgram(res.data[0]);
            }
        } catch (err) {
            console.error("Error fetching programs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProgram = async (prog) => {
        setSelectedProgram(prog);
        setLoading(true);
        try {
            const [deptRes, currRes] = await Promise.all([
                axios.get(`${apiBase}/departments/${prog.id}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${apiBase}/curriculum/${prog.id}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setDepartments(deptRes.data);
            setCurriculums(currRes.data);
        } catch (err) {
            console.error("Error fetching details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiBase}/programs`, newProg, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setShowProgModal(false);
            setNewProg({ name: '', code: '', description: '' });
            fetchPrograms();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create program");
        }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiBase}/departments`, { ...newDept, program_id: selectedProgram.id }, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setShowDeptModal(false);
            setNewDept({ name: '', code: '', program_id: null });
            handleSelectProgram(selectedProgram);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create department");
        }
    };

    const handleDeleteProgram = async (progId) => {
        try {
            await axios.delete(`${apiBase}/programs/${progId}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (selectedProgram?.id === progId) setSelectedProgram(null);
            fetchPrograms();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to delete program");
        }
    };

    const handleCreateCurriculum = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiBase}/curriculum`, { ...newCurr, program_id: selectedProgram.id }, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setShowCurrModal(false);
            setNewCurr({ name: '', code: '', total_credits_required: 0, structure: { semesters: [] }, program_id: null });
            handleSelectProgram(selectedProgram);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create curriculum");
        }
    };

    if (loading && programs.length === 0) return <div className="loading-state">Syncing University Knowledge Base...</div>;

    return (
        <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.6rem', fontWeight: 900 }}>Knowledge Hub</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px', maxWidth: '600px' }}>
                        The centralized repository for institutional courses, departmental structures, and academic syllabi.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="btn-ghost" 
                        onClick={() => setShowHelpModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', color: 'var(--text-muted)' }}
                    >
                        <Info size={18} /> Format Guide
                    </button>
                    <input 
                        type="file" 
                        id="catalog-upload" 
                        hidden 
                        accept=".pdf" 
                        onChange={handleFileUpload} 
                    />
                    <button 
                        className="btn-ghost" 
                        onClick={() => document.getElementById('catalog-upload').click()}
                        disabled={uploading}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}
                    >
                        {uploading ? "Synthesizing..." : <><Database size={20} /> Bulk Upload Catalogs</>}
                    </button>
                    <button 
                        className="btn-primary" 
                        onClick={() => setShowProgModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px' }}
                    >
                        <Plus size={20} /> Register New Course
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
                {/* Sidebar: Programs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '10px' }}>
                        Offered Courses
                    </div>
                    {programs.map(prog => (
                        <div 
                            key={prog.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                background: selectedProgram?.id === prog.id ? 'var(--primary-color)' : 'var(--surface-color-light)',
                                color: selectedProgram?.id === prog.id ? '#fff' : 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: selectedProgram?.id === prog.id ? '0 10px 20px -5px rgba(99,102,241,0.4)' : 'none'
                            }}
                        >
                            <div onClick={() => handleSelectProgram(prog)} style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{prog.name}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>{prog.code}</div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(window.confirm(`Delete ${prog.name}? All departments and subjects will be removed.`)) {
                                        handleDeleteProgram(prog.id);
                                    }
                                }}
                                style={{ background: 'none', border: 'none', color: 'inherit', opacity: 0.4, cursor: 'pointer', padding: '5px' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {programs.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', background: 'var(--surface-color-light)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                            No courses registered.
                        </div>
                    )}
                </div>

                {/* Main Content: Depts & Syllabus */}
                <div>
                    {selectedProgram ? (
                        <div className="animate-fade-up">
                            <div style={{ marginBottom: '2.5rem', background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                                    <BookOpen className="text-primary" size={28} />
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{selectedProgram.name}</h2>
                                </div>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>{selectedProgram.description || "Foundational academic program structure defining the professional core of this course."}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Departments Section */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Layers className="text-primary" size={20} />
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Associated Departments</h3>
                                        </div>
                                        <button onClick={() => setShowDeptModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '0.9rem' }}>
                                            <Plus size={16} /> Add Dept
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {departments && departments.length > 0 ? (
                                            departments.map(d => {
                                                const isExpanded = expandedDept === d.id;
                                                // Grouping logic
                                                const years = [...new Set(d.subjects?.map(s => s.year) || [])].sort();
                                                
                                                return (
                                                    <div key={d.id} style={{ padding: '0px', background: '#fff', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: isExpanded ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}>
                                                        <div 
                                                            onClick={() => setExpandedDept(isExpanded ? null : d.id)}
                                                            style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'rgba(99,102,241,0.02)' : 'transparent' }}
                                                        >
                                                            <div>
                                                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{d.name}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Branch Code: {d.code}</div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', background: 'rgba(99,102,241,0.1)', padding: '6px 14px', borderRadius: '10px' }}>
                                                                    {d.subjects?.length || 0} Subjects
                                                                </div>
                                                                <ChevronRight size={20} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s', color: 'var(--text-muted)' }} />
                                                            </div>
                                                        </div>

                                                        {isExpanded && (
                                                            <div className="animate-fade-in" style={{ padding: '0 25px 25px 25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                                {years.length > 0 ? years.map(year => (
                                                                    <div key={year}>
                                                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                            <ConfigIcon size={14} /> Year {year}
                                                                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                                                                        </div>
                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                                            {[1, 2].map(semOffset => {
                                                                                const absSem = (year - 1) * 2 + semOffset;
                                                                                const semSubjects = d.subjects.filter(s => s.semester === absSem);
                                                                                if (semSubjects.length === 0) return null;
                                                                                
                                                                                return (
                                                                                    <div key={absSem} style={{ background: '#f8fafc', padding: '15px', borderRadius: '14px', border: '1px solid #edf2f7' }}>
                                                                                        <div style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '10px', color: 'var(--primary-color)' }}>SEM {absSem}</div>
                                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                            {semSubjects.map((sub, sIdx) => (
                                                                                                <div key={sub.id} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                                                                                    <span>
                                                                                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '8px' }}>{sIdx + 1}.</span>
                                                                                                        <span style={{ fontWeight: 500 }}>{sub.name}</span>
                                                                                                    </span>
                                                                                                    <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>{sub.credits} Cr</span>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )) : (
                                                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                                        No year-wise structure detected. Using baseline curriculum.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: '24px' }}>
                                                Select a course program to view and manage departmental syllabus.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Curriculums / Syllabus Section */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <FileText className="text-primary" size={20} />
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Academic Curriculums</h3>
                                        </div>
                                        <button onClick={() => setShowCurrModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '0.9rem' }}>
                                            <Plus size={16} /> New Syllabus
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {curriculums.map(curr => (
                                            <div key={curr.id} style={{ padding: '15px 20px', background: '#fff', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{curr.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Credits: {curr.total_credits_required}</div>
                                                </div>
                                                <div style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.05)', color: 'var(--primary-color)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>{curr.code}</div>
                                            </div>
                                        ))}
                                        {curriculums.length === 0 && (
                                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                                                No syllabus structures defined.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-color-light)', borderRadius: '32px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
                            <Database size={48} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Select a course to view architecture</h3>
                            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Manage departmental associations and syllabus requirements.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals (Omitted for brevity in thought, but I'll write them in the file content) */}
            {showProgModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-scale-in" style={{ maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Register Program</h2>
                        <form onSubmit={handleCreateProgram}>
                            <div className="form-group"><label>Course Title</label><input type="text" className="input-field" placeholder="e.g. Bachelor of Technology" required onChange={e => setNewProg({...newProg, name: e.target.value})} /></div>
                            <div className="form-group"><label>Academic Code</label><input type="text" className="input-field" placeholder="e.g. BTECH" required onChange={e => setNewProg({...newProg, code: e.target.value})} /></div>
                            <div className="form-group"><label>Vision/Description</label><textarea className="input-field" rows="3" onChange={e => setNewProg({...newProg, description: e.target.value})} /></div>
                            <div className="modal-actions"><button type="button" className="modal-btn-cancel" onClick={() => setShowProgModal(false)}>Discard</button><button type="submit" className="modal-btn-submit">Register Course</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showDeptModal && selectedProgram && (
                <div className="modal-overlay">
                    <div className="modal-content animate-scale-in" style={{ maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Attach Department</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Mapping a department to <strong>{selectedProgram?.name}</strong>.</p>
                        <form onSubmit={handleCreateDepartment}>
                            <div className="form-group"><label>Department Name</label><input type="text" className="input-field" placeholder="e.g. Computer Science & Engineering" required onChange={e => setNewDept({...newDept, name: e.target.value})} /></div>
                            <div className="form-group"><label>Dept Mnemonic</label><input type="text" className="input-field" placeholder="e.g. CSE" required onChange={e => setNewDept({...newDept, code: e.target.value})} /></div>
                            <div className="modal-actions"><button type="button" className="modal-btn-cancel" onClick={() => setShowDeptModal(false)}>Discard</button><button type="submit" className="modal-btn-submit">Assign Department</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showCurrModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-scale-in" style={{ maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Define Curriculum</h2>
                        <form onSubmit={handleCreateCurriculum}>
                            <div className="form-group"><label>Regulation Name</label><input type="text" className="input-field" placeholder="e.g. R24 Regulations" required onChange={e => setNewCurr({...newCurr, name: e.target.value})} /></div>
                            <div className="form-group"><label>Syllabus Code</label><input type="text" className="input-field" placeholder="e.g. SYL-R24-BTECH" required onChange={e => setNewCurr({...newCurr, code: e.target.value})} /></div>
                            <div className="form-group"><label>Total Credit Hours</label><input type="number" className="input-field" required onChange={e => setNewCurr({...newCurr, total_credits_required: e.target.value})} /></div>
                            <div className="modal-actions"><button type="button" className="modal-btn-cancel" onClick={() => setShowCurrModal(false)}>Discard</button><button type="submit" className="modal-btn-submit">Publish Syllabus</button></div>
                        </form>
                    </div>
                </div>
            )}
            {showHelpModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-scale-in" style={{ maxWidth: '600px', background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'rgba(99,102,241,0.1)', padding: '12px', borderRadius: '12px' }}>
                                <Database style={{ color: 'var(--primary-color)' }} size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontWeight: 900 }}>Synthesis Format Guide</h2>
                        </div>
                        
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            For successful AI synthesis, ensure your PDF follows these structural conventions:
                        </p>

                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', color: '#1e293b' }}>
Program: Bachelor of Technology (BTECH)<br/>
Department: Computer Science & Engineering (CSE)<br/>
Subject: Data Structures (CS101) - 4<br/>
Subject: Operating Systems (CS102) - 3<br/>
<br/>
Program: Master of Business Administration (MBA)<br/>
Department: Marketing Management (MKT)<br/>
Subject: Digital Strategy (MKT501) - 4
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '15px', background: 'rgba(99,102,241,0.03)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary-color)', marginBottom: '4px' }}>STRUCTURE</div>
                                <div style={{ fontSize: '0.85rem' }}>Hierarchy: Program &gt; Dept &gt; Subject.</div>
                            </div>
                            <div style={{ padding: '15px', background: 'rgba(99,102,241,0.03)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--primary-color)', marginBottom: '4px' }}>CREDITS</div>
                                <div style={{ fontSize: '0.85rem' }}>Use <strong>- 4</strong> at end of subject line.</div>
                            </div>
                        </div>

                        <button 
                           onClick={() => setShowHelpModal(false)}
                           style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                        >
                            Understood, Let's Proceed
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeHub;
