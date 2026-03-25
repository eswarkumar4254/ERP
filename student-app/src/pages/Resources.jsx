import React, { useState, useEffect } from 'react';
import { Search, Filter, Book, FileText, Download, Star, ExternalLink, ChevronRight, Bookmark } from 'lucide-react';
import api from '../api';
import './Resources.css';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/vault/public');
                setResources(response.data);
            } catch (err) {
                console.error('Failed to fetch resources', err);
            }
        };
        fetchResources();
    }, []);

    const filteredResources = resources.filter(res => 
        (res.title.toLowerCase().includes(search.toLowerCase()) || 
         res.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))) &&
        (category === 'All' || res.file_type === category)
    );

    return (
        <div className="resources-stage fade-up">
            <header className="page-header">
                <div>
                    <h1>Institutional Knowledge Repository</h1>
                    <p className="subtitle">Securely curated academic assets for your curriculum.</p>
                </div>
                <div className="search-bar">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by title, course code, or topic..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="filter-shelf">
                {['All', 'PDF', 'DOCX', 'PPTX', 'Video'].map(cat => (
                    <button 
                        key={cat} 
                        className={`filter-pill ${category === cat ? 'active' : ''}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <main className="resources-grid">
                {filteredResources.map((res) => (
                    <div className="resource-card card-premium" key={res.id}>
                        <div className="res-icon">
                            {res.file_type === 'PDF' ? <FileText size={40} strokeWidth={1.5} color="#ef4444" /> : <Book size={40} color="var(--primary)" />}
                        </div>
                        <div className="res-body">
                            <div className="res-meta">
                                <span className="cat-tag">{res.file_type}</span>
                                <span className="size-tag">4.2 MB</span>
                            </div>
                            <h3>{res.title}</h3>
                            <div className="tag-cloud">
                                {res.tags.map((tag, idx) => (
                                    <span key={idx} className="tag-pill">{tag}</span>
                                ))}
                            </div>
                            <div className="res-uploader">
                                <div className="avatar-micro" style={{ background: '#7c3aed' }}>DR</div>
                                <span>Dr. David Richards</span>
                            </div>
                        </div>
                        <div className="res-actions">
                            <button className="btn-icon-soft"><Bookmark size={18} /></button>
                            <button className="btn-action">
                                <Download size={16} /> <span>Get Archive</span>
                            </button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Resources;
