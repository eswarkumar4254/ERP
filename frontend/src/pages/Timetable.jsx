import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEntry, setNewEntry] = useState({
    course_id: '',
    staff_id: '',
    room: '',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00'
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [ttRes, coursesRes, staffRes] = await Promise.all([
        axios.get('http://localhost:8000/timetables', { headers }),
        axios.get('http://localhost:8000/courses', { headers }),
        axios.get('http://localhost:8000/staff', { headers })
      ]);

      setTimetables(ttRes.data);
      setCourses(coursesRes.data);
      setStaff(staffRes.data);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { ...newEntry, course_id: parseInt(newEntry.course_id), staff_id: parseInt(newEntry.staff_id) };
      await axios.post('http://localhost:8000/timetables/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error adding timetable entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/timetables/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
    }
  };

  const getCourseName = (id) => courses.find(c => c.id === id)?.name || 'Unknown Course';
  const getStaffName = (id) => {
      const s = staff.find(s => s.id === id);
      return s ? `${s.last_name}, ${s.first_name}` : 'Unknown Staff';
  };

  return (
    <div>
      <div className="page-header">
        <h1>Master Timetable & Scheduling</h1>
        <p>Assign professors, courses, and time slots to classrooms</p>
      </div>

      <div className="card">
        <h2>Schedule New Class</h2>
        <form onSubmit={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <select
              className="input-field"
              value={newEntry.course_id}
              onChange={(e) => setNewEntry({ ...newEntry, course_id: e.target.value })}
              required
            >
              <option value="" disabled>Select Course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
            </select>
            
            <select
              className="input-field"
              value={newEntry.staff_id}
              onChange={(e) => setNewEntry({ ...newEntry, staff_id: e.target.value })}
              required
            >
              <option value="" disabled>Assign Professor...</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.employee_id} - {s.last_name}</option>)}
            </select>

            <input
              className="input-field"
              type="text"
              placeholder="Room (e.g., Room 101)"
              value={newEntry.room}
              onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <select
              className="input-field"
              value={newEntry.day_of_week}
              onChange={(e) => setNewEntry({ ...newEntry, day_of_week: e.target.value })}
            >
              {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <input
              className="input-field"
              type="time"
              title="Start Time"
              value={newEntry.start_time}
              onChange={(e) => setNewEntry({ ...newEntry, start_time: e.target.value })}
              required
            />
            
            <input
              className="input-field"
              type="time"
              title="End Time"
              value={newEntry.end_time}
              onChange={(e) => setNewEntry({ ...newEntry, end_time: e.target.value })}
              required
            />
          </div>

          <button className="btn" type="submit" style={{ marginTop: '1rem' }}>Schedule Class</button>
        </form>
      </div>

      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {daysOfWeek.map(day => {
            const dayClasses = timetables.filter(t => t.day_of_week === day).sort((a,b) => a.start_time.localeCompare(b.start_time));
            if (dayClasses.length === 0) return null;

            return (
              <div key={day} className="card" style={{ marginBottom: '1.5rem', background: 'transparent', padding: 0, border: 'none' }}>
                <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{day}</h3>
                <div className="product-grid">
                  {dayClasses.map(t => (
                    <div key={t.id} className="card" style={{ margin: 0, borderLeft: '4px solid var(--primary-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <h4 style={{ margin: '0 0 5px 0' }}>{getCourseName(t.course_id)}</h4>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.start_time} - {t.end_time}</span>
                      </div>
                      <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Prof. {getStaffName(t.staff_id)}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                          <span style={{ 
                                backgroundColor: 'rgba(124, 58, 237, 0.15)', 
                                color: 'var(--primary-color)', 
                                padding: '4px 8px', 
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                          }}>
                              {t.room}
                          </span>
                          <button 
                            onClick={() => handleDelete(t.id)} 
                            style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                          >
                            Remove
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {timetables.length === 0 && <p>No classes scheduled yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Timetable;
