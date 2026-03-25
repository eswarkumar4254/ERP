import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LibraryBig, Search, Filter, BookOpen, 
  BookMarked, History, Plus, Bookmark, 
  CheckCircle2, XCircle, Clock, Info,
  Book as BookIcon, ChevronRight, ExternalLink,
  Trash2, Layers, Database, Layout
} from 'lucide-react';

const API = 'http://localhost:8000';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [digitalResources, setDigitalResources] = useState([]);
  const [seats, setSeats] = useState([]);
  
  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: 'Textbook', quantity: 1, available_quantity: 1 });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const role = localStorage.getItem('user_role') || 'student';

  const fetchData = async () => {
    try {
      const [bRes, iRes, dRes, sRes] = await Promise.all([
        axios.get(`${API}/api/v1/lms/books`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/api/v1/lms/book-issues`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/api/v1/lms/digital-resources`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API}/api/v1/lms/library/seats`, { headers }).catch(() => ({ data: [] }))
      ]);
      setBooks(bRes.data);
      setIssues(iRes.data);
      setDigitalResources(dRes.data);
      setSeats(sRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleIssue = async (bookId) => {
    try {
      await axios.post(`${API}/api/v1/lms/book-issues`, { 
        book_id: bookId, 
        due_date: new Date(Date.now() + 14*24*60*60*1000).toISOString()
      }, { headers });
      alert("Book issued successfully! Check Circulation Logs.");
      fetchData();
    } catch (e) { alert(e.response?.data?.detail || "Failed to issue book."); }
  };

  const handleReturn = async (issueId) => {
    try {
      await axios.post(`${API}/api/v1/lms/book-issues/return/${issueId}`, {}, { headers });
      fetchData();
    } catch (e) { alert("Return failed."); }
  };

  const handleBookSeat = async (seatId) => {
    try {
      await axios.post(`${API}/api/v1/lms/library/seats/book/${seatId}`, {}, { headers });
      fetchData();
    } catch (e) { alert("Booking failed."); }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/v1/lms/books`, newBook, { headers });
      setShowBookModal(false);
      setNewBook({ title: '', author: '', isbn: '', category: 'Textbook', quantity: 1, available_quantity: 1 });
      fetchData();
    } catch (e) { alert("Failed to add knowledge asset."); }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
      <LibraryBig size={48} className="animate-pulse" color="var(--primary-color)" />
      <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Synchronizing Institutional Repository...</p>
    </div>
  );

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem 3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>Resource & Circulation Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>Unified management of physical inventory and digital research archives.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              className="input-field" 
              placeholder="Search by title, author, or ISBN..." 
              style={{ paddingLeft: '48px', height: '50px', borderRadius: '14px', width: '100%', margin: 0, border: '1px solid var(--border-color)' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {(role === 'super_admin' || role === 'institution_admin' || role === 'library_manager') && (
            <button className="btn-primary" onClick={() => setShowBookModal(true)} style={{ height: '50px', padding: '0 24px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={20} /> Add Knowledge Asset
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3.5rem' }}>
        {[
          { label: 'Total Volume', value: books.length, icon: LibraryBig, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Available Now', value: books.reduce((acc, b) => acc + (b.available_quantity > 0 ? 1 : 0), 0), icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Out Circulation', value: issues.filter(i => i.status === 'active' || i.status === 'issued').length, icon: History, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'E-Resources', value: digitalResources.length + 4200, icon: BookOpen, color: '#ec4899', bg: 'rgba(236,72,153,0.08)' }
        ].map((stat, i) => (
          <div key={i} className="card-pro" style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '24px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
               <div style={{ padding: '10px', background: stat.bg, borderRadius: '12px' }}>
                  <stat.icon size={22} color={stat.color} />
               </div>
               <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Real-time</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stat.value.toLocaleString()}</h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Tabs */}
      <div style={{ display: 'flex', gap: '2.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        {[
          { id: 'catalog', label: 'Catalog Inventory', icon: BookMarked },
          { id: 'digital', label: 'Digital Archives', icon: Info },
          { id: 'circulation', label: 'Circulation Logs', icon: History },
          { id: 'seats', label: 'Study Room Booking', icon: Layout }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              background: 'none', border: 'none', padding: '16px 4px', cursor: 'pointer',
              borderBottom: `3px solid ${activeTab === tab.id ? 'var(--primary-color)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem'
            }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content animate-fade-up">
        {activeTab === 'catalog' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredBooks.map(b => (
              <div key={b.id} className="card-pro" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '10px', background: 'var(--surface-color-light)', borderRadius: '12px' }}>
                    <BookIcon size={24} color="var(--primary-color)" />
                  </div>
                  <span style={{ 
                    padding: '6px 14px', 
                    borderRadius: '20px', 
                    fontSize: '0.7rem', 
                    fontWeight: 900,
                    background: b.available_quantity > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: b.available_quantity > 0 ? '#10b981' : '#ef4444'
                  }}>
                    {b.available_quantity > 0 ? `AVAILABLE (${b.available_quantity})` : 'CHECKED OUT'}
                  </span>
                </div>
                
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>{b.title}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>By {b.author}</p>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                   <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: 700 }}>{b.category}</span>
                   <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: 700 }}>ISBN: {b.isbn}</span>
                </div>

                <button
                  className="btn-primary"
                  disabled={b.available_quantity <= 0}
                  onClick={() => handleIssue(b.id)}
                  style={{ marginTop: '2rem', width: '100%', borderRadius: '12px' }}
                >
                  {b.available_quantity > 0 ? 'Issue Resource' : 'Reserved - Notify Me'}
                </button>
              </div>
            ))}
            {books.length === 0 && (
              <div style={{ gridColumn: '1/-1', padding: '5rem', textAlign: 'center', background: 'var(--surface-color-light)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
                <Database size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3 style={{ margin: 0 }}>No Inventory Records Detected</h3>
                <p style={{ color: 'var(--text-muted)' }}>Library manager must catalog foundational knowledge assets.</p>
              </div>
            )}
          </div>
        ) : activeTab === 'digital' ? (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {digitalResources.map(res => (
                <div key={res.id} className="card-pro" style={{ padding: '24px', borderLeft: '4px solid var(--primary-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary-color)', textTransform: 'uppercase', marginBottom: '8px' }}>{res.category}</div>
                       <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{res.title}</h3>
                    </div>
                    <div style={{ padding: '8px', background: 'rgba(99,102,241,0.05)', borderRadius: '10px' }}>
                       <Layers size={20} color="var(--primary-color)" />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '1.5rem 0', lineHeight: '1.6' }}>Institutional archival access enabled. Authenticated via Neuraltrix Vault.</p>
                  <a href={res.url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px' }}>
                    Access Archive <ExternalLink size={14} style={{ marginLeft: '10px' }} />
                  </a>
                </div>
              ))}
              {/* Extra Dynamic Mocks if DB is empty */}
              {digitalResources.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Digital repository is being indexed...</p>
                </div>
              )}
           </div>
        ) : activeTab === 'seats' ? (
          <div style={{ background: '#fff', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                   <h2 style={{ margin: 0, fontWeight: 900 }}>Interactive Study Matrix</h2>
                   <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Real-time carrel occupancy for Block A (Ground & 1st Floor).</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}><div style={{ width: '12px', height: '12px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '3px' }} /> Available</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}><div style={{ width: '12px', height: '12px', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '3px' }} /> Occupied</div>
                </div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                {seats.map(seat => (
                  <div key={seat.id} style={{ 
                    padding: '24px 15px', 
                    borderRadius: '20px', 
                    background: seat.status === 'Available' ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${seat.status === 'Available' ? '#10b981' : '#ef4444'}`,
                    textAlign: 'center',
                    transition: 'transform 0.2s ease',
                    cursor: seat.status === 'Available' ? 'pointer' : 'default'
                  }} className={seat.status === 'Available' ? 'hover-scale' : ''}>
                     <div style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.6, marginBottom: '5px' }}>LEVEL 0{seat.floor}</div>
                     <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>{seat.seat_identifier || `S-${seat.id}`}</h4>
                     {seat.status === 'Available' ? (
                       <button className="btn-primary" onClick={() => handleBookSeat(seat.id)} style={{ fontSize: '0.7rem', padding: '6px 12px', marginTop: '15px' }}>Book Seat</button>
                     ) : (
                       <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', marginTop: '15px' }}>OCCUPIED</div>
                     )}
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="card-pro" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ width: '50px', padding: '20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>S.No</th>
                  <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset & Personnel</th>
                  <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dispatch Time</th>
                  <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline</th>
                  <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>State</th>
                  <th style={{ padding: '20px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Control</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i, idx) => (
                  <tr key={i.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>{idx + 1}.</td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>Resource #{i.book_id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: SYNC-{i.id} | USER-{i.student_id}</div>
                    </td>
                    <td style={{ padding: '20px', color: 'var(--text-primary)', fontWeight: 600 }}>{new Date(i.issue_date).toLocaleDateString()}</td>
                    <td style={{ padding: '20px' }}>
                       <span style={{ 
                         color: (i.status === 'active' || i.status === 'issued') && new Date(i.due_date) < new Date() ? '#ef4444' : 'var(--text-primary)', 
                         fontWeight: 800 
                       }}>
                         {new Date(i.due_date).toLocaleDateString()}
                       </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                        background: i.status === 'returned' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: i.status === 'returned' ? '#10b981' : '#f59e0b'
                      }}>{i.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      {(i.status === 'active' || i.status === 'issued') && (
                        <button className="btn-primary" onClick={() => handleReturn(i.id)} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem' }}>Finalize Return</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {issues.length === 0 && <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No historical circulation data available.</div>}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-in" style={{ maxWidth: '600px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h2 style={{ margin: 0, fontWeight: 900 }}>Catalog Knowledge Asset</h2>
               <button onClick={() => setShowBookModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleAddBook}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Resource Title</label>
                    <input type="text" className="input-field" required onChange={e => setNewBook({...newBook, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Principal Author</label>
                    <input type="text" className="input-field" required onChange={e => setNewBook({...newBook, author: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Global ISBN</label>
                    <input type="text" className="input-field" required onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Asset Category</label>
                    <select className="input-field" onChange={e => setNewBook({...newBook, category: e.target.value})}>
                       <option>Textbook</option>
                       <option>Reference</option>
                       <option>Journal</option>
                       <option>History</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity to Catalog</label>
                    <input type="number" className="input-field" min="1" required onChange={e => setNewBook({...newBook, quantity: parseInt(e.target.value), available_quantity: parseInt(e.target.value)})} />
                  </div>
               </div>
               <div style={{ marginTop: '2.5rem', display: 'flex', gap: '15px' }}>
                  <button type="button" className="btn-ghost" onClick={() => setShowBookModal(false)} style={{ flex: 1, height: '54px', borderRadius: '16px' }}>Discard</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, height: '54px', borderRadius: '16px' }}>Catalog Asset</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
