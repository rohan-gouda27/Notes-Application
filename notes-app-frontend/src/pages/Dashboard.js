import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getNotes();
      setNotes(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    try {
      await notesAPI.createNote(newNote);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      alert('Failed to create note');
    }
  };

  const handleEdit = async (note) => {
    setEditingNoteId(note.id);
    setNewNote({ title: note.title, content: note.content });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await notesAPI.updateNote(editingNoteId, newNote);
      setEditingNoteId(null);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await notesAPI.deleteNote(id);
      fetchNotes();
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
    note.updated_at.includes(search)
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>My Notes</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="note-form">
        <h3>{editingNoteId ? ' Edit Note' : ' Create New Note'}</h3>
        <form onSubmit={editingNoteId ? handleUpdate : handleCreate}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
          </div>
          <div className="form-row">
            <textarea
              rows="5"
              placeholder="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
          </div>
          <div className="note-actions">
            <button type="submit">{editingNoteId ? 'Update Note' : 'Add Note'}</button>
            {editingNoteId && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setEditingNoteId(null);
                  setNewNote({ title: '', content: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <div className="note-content">{note.content}</div>
            <div className="note-meta">
              <p><strong> Last Updated:</strong> {new Date(note.updated_at).toLocaleString()}</p>
            </div>
            <div className="note-actions">
              <button className="edit-btn" onClick={() => handleEdit(note)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(note.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <h3> No Notes Found</h3>
          <p>Create your first note to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
