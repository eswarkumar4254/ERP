import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Plus, Trash2, CheckCircle2, Lock, Info, Settings as ConfigIcon } from 'lucide-react';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        module_ids: [],
        permission_ids: []
    });


    const token = localStorage.getItem('token');
    const apiBase = 'http://localhost:8000/api/v1/rbac';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rolesRes, modulesRes, permsRes] = await Promise.all([
                axios.get(`${apiBase}/roles`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${apiBase}/modules`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${apiBase}/permissions`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setRoles(rolesRes.data);
            setModules(modulesRes.data);
            setPermissions(permsRes.data);
        } catch (err) {
            console.error("Error fetching RBAC data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            // Include pending tempUser if it's partially filled (optional, but let's be strict and use the button)
            await axios.post(`${apiBase}/roles`, newRole, { headers: { Authorization: `Bearer ${token}` } });
            setShowCreateModal(false);
            setNewRole({ name: '', description: '', module_ids: [], permission_ids: [] });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create role");
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm("Are you sure you want to delete this role? Access for all users in this role will be revoked.")) return;
        try {
            await axios.delete(`${apiBase}/roles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to delete role");
        }
    };

    const toggleModule = (id) => {
        setNewRole(prev => ({
            ...prev,
            module_ids: prev.module_ids.includes(id) 
                ? prev.module_ids.filter(mid => mid !== id) 
                : [...prev.module_ids, id]
        }));
    };

    if (loading) return <div className="loading-state">Initializing Role Engine...</div>;

    return (
        <div className="page-content" style={{ padding: '2.5rem 3.5rem' }}>
            {/* Header omitted for brevity in thought, but I'll write the whole file content in the tool call */}
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.6rem', fontWeight: 900 }}>Role Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px', maxWidth: '600px' }}>
                        Architect your institution's governance by defining custom roles and mapping them to specific service modules.
                    </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowCreateModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px' }}
                >
                    <Plus size={20} /> New Institutional Role
                </button>
            </div>

            {/* Role Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.8rem' }}>
                {roles.map((role, idx) => (
                    <div 
                      key={role.id} 
                      className="card animate-fade-up" 
                      style={{ 
                        animationDelay: `${idx * 0.05}s`,
                        position: 'relative',
                        border: role.is_system ? '1px solid rgba(99,102,241,0.2)' : '1px solid var(--border-color)',
                        padding: '2rem'
                      }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                  padding: '10px', 
                                  borderRadius: '12px', 
                                  background: role.is_system ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', 
                                  color: role.is_system ? 'var(--primary-color)' : '#10b981' 
                                }}>
                                    <Shield size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{role.name}</h3>
                                    {role.is_system ? (
                                        <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Global System Role</span>
                                    ) : (
                                        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Custom Institutional Role</span>
                                    )}
                                </div>
                            </div>
                            {!role.is_system && (
                                <button 
                                  onClick={() => handleDeleteRole(role.id)}
                                  className="btn-icon"
                                  style={{ color: '#ef4444', background: 'rgba(239,68,68,0.05)' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', minHeight: '45px' }}>
                            {role.description || "Baseline administrative privileges tailored for institutional operations."}
                        </p>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Module Access</span>
                                <ConfigIcon size={14} style={{ opacity: 0.3 }} />
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {role.modules && role.modules.map(mod => (
                                    <span key={mod} style={{ 
                                      fontSize: '0.75rem', 
                                      background: 'var(--surface-color-light)', 
                                      padding: '5px 12px', 
                                      borderRadius: '8px',
                                      border: '1px solid var(--border-color)',
                                      color: 'var(--text-secondary)',
                                      fontWeight: 500
                                    }}>
                                        {mod}
                                    </span>
                                ))}
                                {(!role.modules || role.modules.length === 0) && (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', opacity: 0.6 }}>Universal platform access</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="modal-overlay" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-content animate-scale-in" style={{ maxWidth: '850px', width: '95%', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create New Role</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Define granular access boundaries and provision initial credentials.</p>
                        </div>
                        
                        <form onSubmit={handleCreateRole}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Role Identifier</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="e.g. Senior Faculty"
                                        required
                                        value={newRole.name}
                                        onChange={e => setNewRole({...newRole, name: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Brief Description</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="Core responsibilities..."
                                        value={newRole.description}
                                        onChange={e => setNewRole({...newRole, description: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: 700, fontSize: '1rem' }}>Authorized Modules</label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                                        Active Plan Restricted
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                                    {modules.map(mod => (
                                        <div 
                                            key={mod.id} 
                                            onClick={() => toggleModule(mod.id)}
                                            style={{
                                                padding: '14px',
                                                borderRadius: '12px',
                                                border: newRole.module_ids.includes(mod.id) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                background: newRole.module_ids.includes(mod.id) ? 'rgba(99,102,241,0.04)' : 'transparent',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            <div style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                borderRadius: '6px', 
                                                border: '2px solid',
                                                borderColor: newRole.module_ids.includes(mod.id) ? 'var(--primary-color)' : 'var(--border-color)',
                                                background: newRole.module_ids.includes(mod.id) ? 'var(--primary-color)' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff'
                                            }}>
                                                {newRole.module_ids.includes(mod.id) && <CheckCircle2 size={14} strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{mod.name}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{mod.full_name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="modal-actions" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                                <button type="button" className="modal-btn-cancel" onClick={() => setShowCreateModal(false)}>Discard</button>
                                <button type="submit" className="modal-btn-submit" style={{ padding: '12px 32px' }}>Complete Calibration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;
