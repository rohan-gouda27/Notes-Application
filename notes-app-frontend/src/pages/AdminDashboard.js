import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  const fetchAllNotes = async () => {
    try {
      const res = await adminAPI.getAllNotes();
      setNotes(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchNotesByUser = async (userId) => {
    try {
      const res = await adminAPI.getNotesByUser(userId);
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch user notes:', err);
    }
  };

  useEffect(() => {
    fetchAllNotes();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUser === 'all') {
      fetchAllNotes();
    } else {
      fetchNotesByUser(selectedUser);
    }
  }, [selectedUser]);

  const handleEdit = (note) => {
    setEditingNote(note);
    setEditForm({ title: note.title, content: note.content });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateAnyNote(editingNote.id, editForm);
      setEditingNote(null);
      setEditForm({ title: '', content: '' });
      if (selectedUser === 'all') {
        fetchAllNotes();
      } else {
        fetchNotesByUser(selectedUser);
      }
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await adminAPI.deleteAnyNote(id);
      if (selectedUser === 'all') {
        fetchAllNotes();
      } else {
        fetchNotesByUser(selectedUser);
      }
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    (note.author && note.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button 
            className="edit-btn" 
            onClick={() => navigate('/admin/profile')}
            style={{ marginRight: '10px' }}
          >
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-info-box">
        <h3>Admin Control Panel</h3>
        <p>Manage all notes and users in the system</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{notes.length}</div>
          <div className="stat-label">Total Notes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{users.filter(u => u.role === 'admin').length}</div>
          <div className="stat-label">Admin Users</div>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="filter-select"
          value={selectedUser} 
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="all">All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.role})
            </option>
          ))}
        </select>
      </div>

      {editingNote && (
        <div className="editing-note">
          <h3>Editing Note</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="form-row">
              <textarea
                rows="5"
                placeholder="Content"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              />
            </div>
            <div className="note-actions">
              <button type="submit">Update Note</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3>{note.title}</h3>
                <div className="note-content">{note.content}</div>
                <div className="note-meta">
                  <p><strong> Author:</strong> {note.author || 'Unknown'}</p>
                  <p><strong> Last Updated:</strong> {new Date(note.updated_at).toLocaleString()}</p>
                  <p><strong> Created:</strong> {new Date(note.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="note-actions">
                <button className="edit-btn" onClick={() => handleEdit(note)}>Edit</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(note.id)} 
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <h3>No Notes Found</h3>
          <p>No notes match your current search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 